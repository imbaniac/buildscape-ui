import {
  Container,
  Graphics,
  Sprite,
  Texture,
  RenderTexture,
  BitmapFont,
  BitmapText,
  Assets,
  type Renderer,
} from "pixi.js";
import { SeededRandom } from "../shared/SeededRandom";
import { assetUrls, assetRaw } from "../shared/assets";
import type { Island } from "$lib/types/island";

interface Tile {
  x: number;
  y: number;
  terrainType: TerrainType;
  elevation: number;
}

interface Decoration {
  x: number;
  y: number;
  type: "tree" | "palm";
  variant: number;
}

interface IslandTerrain {
  tiles: Tile[];
  decorations: Decoration[];
  size: number;
}

enum TerrainType {
  WATER = 0,
  BEACH = 1,
  DESERT_LIGHT = 2,
  DESERT_DARK = 3,
  DRY_GRASS = 4,
  GRASS_LIGHT = 5,
  GRASS_MEDIUM = 6,
  GRASS_DARK = 7,
}

export default class PixiIslandRenderer {
  private readonly TILE_WIDTH = 72;
  private readonly TILE_HEIGHT = 36;

  // Terrain colors
  private readonly terrainColors: Record<TerrainType, number> = {
    [TerrainType.WATER]: 0xffffff, // Not used but needed for completeness
    [TerrainType.BEACH]: 0xf4e4bc,
    [TerrainType.DESERT_LIGHT]: 0xe4c49a,
    [TerrainType.DESERT_DARK]: 0xd4a574,
    [TerrainType.DRY_GRASS]: 0xb8a068,
    [TerrainType.GRASS_LIGHT]: 0x7fa05c,
    [TerrainType.GRASS_MEDIUM]: 0x6b8e4e,
    [TerrainType.GRASS_DARK]: 0x5a7a3f,
  };

  // Cache for pre-rendered island textures and their bounds
  private islandTextureCache: Map<string, Texture> = new Map();
  private islandBoundsCache: Map<string, { width: number; height: number }> =
    new Map();
  private renderer: Renderer | null = null;

  // Shield and banner assets
  private shieldTextures: Map<string, Texture> = new Map();
  private bannerTexture: Texture | null = null;
  private logoTextures: Map<string, Texture | null> = new Map();
  private assetsLoaded: boolean = false;
  // Track assets loaded via Assets system for proper cleanup
  private loadedAssetUrls: Set<string> = new Set();

  constructor() {
    this.loadAssets();
  }

  setRenderer(renderer: Renderer): void {
    this.renderer = renderer;
    // Create bitmap font after renderer is set
    this.createBitmapFont();
  }

  /**
   * Preload all logo assets before creating islands
   */
  async preloadLogos(logoUrls: string[]): Promise<void> {
    // Filter out undefined/null URLs and get unique ones
    const uniqueUrls = [...new Set(logoUrls.filter((url) => url))];

    if (uniqueUrls.length === 0) {
      return;
    }

    try {
      // Load all logos at once
      await Assets.load(uniqueUrls);
      // Track loaded URLs for cleanup
      uniqueUrls.forEach((url) => this.loadedAssetUrls.add(url));
    } catch (error) {
      console.error("[PixiIslandRenderer] Error preloading logos:", error);
    }
  }

  private createBitmapFont(): void {
    try {
      // Create a bitmap font from the system font
      BitmapFont.install({
        name: "IslandName",
        style: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 120,
          fontWeight: "bold",
          fill: 0x4b2f00,
        },
      });
    } catch (error) {
      // Font might already exist, which is fine
      console.debug("[PixiIslandRenderer] BitmapFont already installed", error);
    }
  }

  private async loadAssets(): Promise<void> {
    // Check if already loaded
    if (this.assetsLoaded || this.bannerTexture) {
      return;
    }

    try {
      // Add banner to Assets system if not already added
      const bannerKey = "island-banner";
      if (!Assets.cache.has(bannerKey)) {
        Assets.add({ alias: bannerKey, src: assetUrls.banner });
      }

      // Load banner texture via Assets system
      this.bannerTexture = await Assets.load(bannerKey);
      this.loadedAssetUrls.add(bannerKey);
      this.assetsLoaded = true;
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
  }

  async createIsland(island: Island): Promise<Container> {
    const container = new Container();

    const { texture } = await this.getOrCreateIslandTexture(island);

    // Create sprite from texture
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);

    container.addChild(sprite);

    return container;
  }

  private async getOrCreateIslandTexture(
    island: Island,
  ): Promise<{ texture: Texture; bounds: { width: number; height: number } }> {
    // Create cache key based on island properties that affect appearance
    const tpsBucket = Math.floor(island.tps / 10);
    const scaleBucket = Math.round(island.scale * 10);
    // Include assets loaded state in cache key to handle texture updates
    const cacheKey = `${island.chainId}_${scaleBucket}_${tpsBucket}_${this.assetsLoaded ? "full" : "base"}`;

    // Check cache
    if (this.islandTextureCache.has(cacheKey)) {
      return {
        texture: this.islandTextureCache.get(cacheKey)!,
        bounds: this.islandBoundsCache.get(cacheKey)!,
      };
    }

    // Create new texture and bounds
    const { texture, bounds } = await this.renderIslandToTexture(island);
    this.islandTextureCache.set(cacheKey, texture);
    this.islandBoundsCache.set(cacheKey, bounds);

    return { texture, bounds };
  }

  private async renderIslandToTexture(
    island: Island,
  ): Promise<{ texture: Texture; bounds: { width: number; height: number } }> {
    if (!this.renderer) {
      throw new Error("Renderer not set");
    }

    const tempContainer = new Container();
    const graphics = new Graphics();

    const terrain = this.generateIslandTerrain(island);

    const bounds = this.calculateIslandBounds(terrain.tiles);

    // Draw tiles efficiently using a single Graphics object
    this.drawIslandTiles(graphics, terrain);

    tempContainer.addChild(graphics);

    // Add shield and banner directly to the render texture
    // This way everything is baked into a single texture
    if (this.assetsLoaded) {
      await this.addShieldAndBannerToContainer(tempContainer, island, bounds);
    }

    // Calculate extra height needed for shield and banner
    let extraHeight = 0;
    let extraTopPadding = 0;

    if (this.assetsLoaded) {
      // Shield dimensions
      const shieldScale = 0.35;
      const shieldHeight = 1115 * shieldScale;

      // Calculate how much the shield extends above the island
      let shieldY: number;
      if (island.scale > 1.5) {
        shieldY = -bounds.height / 4;
      } else if (island.scale > 0.8) {
        shieldY = -bounds.height / 2.5;
      } else {
        shieldY = -bounds.height / 2 - 50;
      }

      // Shield extends from its center point, so top edge is at shieldY - shieldHeight/2
      const shieldTop = shieldY - shieldHeight / 2;
      // The island top is at -bounds.height/2
      const islandTop = -bounds.height / 2;

      // If shield extends above island, we need extra space
      if (shieldTop < islandTop) {
        extraTopPadding = Math.abs(shieldTop - islandTop) + 50;
        extraHeight = extraTopPadding;
      }
    }

    const renderTexture = RenderTexture.create({
      width: bounds.width,
      height: bounds.height + extraHeight,
    });

    // Adjust container position to account for extra top padding
    tempContainer.x = bounds.width / 2;
    tempContainer.y = bounds.height / 2 + extraTopPadding;

    // Render to texture
    this.renderer.render({ container: tempContainer, target: renderTexture });

    // Clean up temporary objects
    tempContainer.destroy({ children: true });

    return {
      texture: renderTexture,
      bounds: { width: bounds.width, height: bounds.height + extraHeight },
    };
  }

  private generateIslandTerrain(island: Island): IslandTerrain {
    const tiles: Tile[] = [];
    const decorations: Decoration[] = [];
    const rng = new SeededRandom(island.chainId);

    // Calculate island size based on TVL (scale)
    const baseSize = 15;
    const size = Math.max(8, Math.min(80, Math.floor(baseSize * island.scale)));

    const center = size / 2;

    // Generate elevation map
    const elevationMap: number[][] = [];
    for (let y = 0; y < size; y++) {
      elevationMap[y] = [];
      for (let x = 0; x < size; x++) {
        const dx = (x - center) / center;
        const dy = (y - center) / center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create varied shapes based on chainId
        const angle = Math.atan2(dy, dx);
        const noiseFreq1 = 3 + (island.chainId % 7);
        const noiseFreq2 = 5 + (island.chainId % 5);
        const noiseAmp1 = 0.08 + (island.chainId % 3) * 0.02;
        const noiseAmp2 = 0.05 + (island.chainId % 4) * 0.015;

        const noise =
          Math.sin(angle * noiseFreq1 + island.chainId * 0.1) * noiseAmp1 +
          Math.cos(angle * noiseFreq2 - island.chainId * 0.2) * noiseAmp2;

        const adjustedDistance = distance + noise;
        let elevation = Math.max(0, 1 - adjustedDistance);

        // Make elevation curve more dramatic
        elevation = Math.pow(elevation, 0.7);
        elevationMap[y][x] = elevation;
      }
    }

    // Generate tiles based on elevation
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const elevation = elevationMap[y][x];

        if (elevation > 0.05) {
          // Determine terrain type based on elevation and TPS
          let terrainType: TerrainType;

          if (elevation <= 0.2) {
            terrainType = TerrainType.BEACH;
          } else {
            // Use TPS to determine terrain type - from desert to lush
            if (island.tps < 0.5) {
              terrainType = rng.chance(0.7)
                ? TerrainType.DESERT_LIGHT
                : TerrainType.DESERT_DARK;
            } else if (island.tps < 1) {
              const rand = rng.next();
              if (rand < 0.5) {
                terrainType = TerrainType.DESERT_LIGHT;
              } else if (rand < 0.8) {
                terrainType = TerrainType.DESERT_DARK;
              } else {
                terrainType = TerrainType.DRY_GRASS;
              }
            } else if (island.tps < 10) {
              const rand = rng.next();
              if (rand < 0.4) {
                terrainType = TerrainType.DRY_GRASS;
              } else if (rand < 0.8) {
                terrainType = TerrainType.GRASS_LIGHT;
              } else {
                terrainType = TerrainType.GRASS_MEDIUM;
              }
            } else if (island.tps < 50) {
              terrainType = rng.chance(0.6)
                ? TerrainType.GRASS_MEDIUM
                : TerrainType.GRASS_DARK;
            } else {
              terrainType = rng.chance(0.3)
                ? TerrainType.GRASS_MEDIUM
                : TerrainType.GRASS_DARK;
            }
          }

          tiles.push({
            x: x - center,
            y: y - center,
            terrainType,
            elevation,
          });
        }
      }
    }

    // Add decorations based on TPS
    for (let y = 2; y < size - 2; y++) {
      for (let x = 2; x < size - 2; x++) {
        const elevation = elevationMap[y][x];

        if (elevation > 0.2) {
          // Tree spawn chance based on TPS
          let treeChance = 0;
          if (island.tps > 50) {
            treeChance = 0.08; // Lush
          } else if (island.tps > 10) {
            treeChance = 0.04; // Medium
          } else if (island.tps > 1) {
            treeChance = 0.02; // Sparse
          } else if (island.tps > 0.5) {
            treeChance = 0.005; // Very sparse for dry areas
          }
          // No trees in full desert (TPS < 0.5)

          if (rng.chance(treeChance)) {
            const isBeach = elevation <= 0.3;
            decorations.push({
              x: x - center,
              y: y - center,
              type: isBeach ? "palm" : "tree",
              variant: rng.intBetween(0, 2),
            });
          }
        }
      }
    }

    return { tiles, decorations, size };
  }

  private calculateIslandBounds(tiles: Tile[]): {
    width: number;
    height: number;
  } {
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    const tileWidth = this.TILE_WIDTH;
    const tileHeight = this.TILE_HEIGHT;

    tiles.forEach((tile) => {
      const iso = this.gridToIso(tile.x, tile.y, tileWidth, tileHeight);
      const screenX = iso.x;
      const screenY = iso.y - tile.elevation * 45;

      // Account for tile dimensions
      minX = Math.min(minX, screenX - tileWidth / 2);
      maxX = Math.max(maxX, screenX + tileWidth / 2);
      minY = Math.min(minY, screenY);
      maxY = Math.max(maxY, screenY + tileHeight + tile.elevation * 45);
    });

    // Add padding
    const padding = 100;
    return {
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  }

  private drawIslandTiles(graphics: Graphics, terrain: IslandTerrain): void {
    const tiles = terrain.tiles;

    // Sort tiles for proper rendering order (back to front)
    tiles.sort((a, b) => {
      return a.y + a.x - (b.y + b.x);
    });

    // Use consistent tile size for all islands
    const tileWidth = this.TILE_WIDTH;
    const tileHeight = this.TILE_HEIGHT;

    // Draw all tiles in a single batch
    tiles.forEach((tile) => {
      const iso = this.gridToIso(tile.x, tile.y, tileWidth, tileHeight);
      const screenX = iso.x;
      const screenY = iso.y - tile.elevation * 45;

      // Get color with variation
      const baseColor = this.terrainColors[tile.terrainType];
      const colorVariation = ((tile.x * 7 + tile.y * 13) % 10) / 100 - 0.05;
      const adjustedColor = this.adjustBrightness(
        baseColor,
        1 + colorVariation,
      );

      // Draw tile top (diamond shape) - centered at position
      graphics.beginPath();
      graphics.moveTo(screenX, screenY);
      graphics.lineTo(screenX + tileWidth / 2, screenY + tileHeight / 2);
      graphics.lineTo(screenX, screenY + tileHeight);
      graphics.lineTo(screenX - tileWidth / 2, screenY + tileHeight / 2);
      graphics.closePath();
      graphics.fill({ color: adjustedColor });

      // Draw tile edges for elevation
      if (tile.elevation > 0.05) {
        const edgeHeight = tile.elevation * 45;

        // Right edge (darker)
        graphics.beginPath();
        graphics.moveTo(screenX, screenY + tileHeight);
        graphics.lineTo(screenX + tileWidth / 2, screenY + tileHeight / 2);
        graphics.lineTo(
          screenX + tileWidth / 2,
          screenY + tileHeight / 2 + edgeHeight,
        );
        graphics.lineTo(screenX, screenY + tileHeight + edgeHeight);
        graphics.closePath();
        graphics.fill({ color: this.adjustBrightness(adjustedColor, 0.65) });

        // Left edge (darkest)
        graphics.beginPath();
        graphics.moveTo(screenX, screenY + tileHeight);
        graphics.lineTo(screenX - tileWidth / 2, screenY + tileHeight / 2);
        graphics.lineTo(
          screenX - tileWidth / 2,
          screenY + tileHeight / 2 + edgeHeight,
        );
        graphics.lineTo(screenX, screenY + tileHeight + edgeHeight);
        graphics.closePath();
        graphics.fill({ color: this.adjustBrightness(adjustedColor, 0.45) });
      }
    });

    // Draw decorations (trees and palms)
    terrain.decorations.forEach((decoration) => {
      // Find tile elevation at decoration position
      const tile = tiles.find(
        (t) => t.x === decoration.x && t.y === decoration.y,
      );
      if (!tile) return;

      const iso = this.gridToIso(
        decoration.x,
        decoration.y,
        tileWidth,
        tileHeight,
      );
      const decorX = iso.x;
      const decorY = iso.y - tile.elevation * 45;

      if (decoration.type === "tree") {
        // Tree shadow
        graphics.beginPath();
        graphics.ellipse(decorX, decorY + tileHeight / 2 + 5, 12, 6);
        graphics.fill({ color: 0x000000, alpha: 0.15 });

        // Tree trunk
        graphics.beginPath();
        graphics.rect(decorX - 2, decorY + tileHeight / 2 - 13, 4, 18);
        graphics.fill({ color: 0x4a3829 });

        // Tree crown
        const crownColors = [0x2d5016, 0x3a6218, 0x4a7c1f];
        const crownColor = crownColors[decoration.variant % crownColors.length];

        graphics.beginPath();
        graphics.circle(decorX, decorY + tileHeight / 2 - 17, 10);
        graphics.fill({ color: crownColor });

        graphics.beginPath();
        graphics.circle(decorX - 5, decorY + tileHeight / 2 - 13, 8);
        graphics.fill({ color: crownColor });

        graphics.beginPath();
        graphics.circle(decorX + 5, decorY + tileHeight / 2 - 13, 8);
        graphics.fill({ color: crownColor });
      } else if (decoration.type === "palm") {
        // Palm shadow
        graphics.beginPath();
        graphics.ellipse(decorX, decorY + tileHeight / 2 + 5, 10, 5);
        graphics.fill({ color: 0x000000, alpha: 0.15 });

        // Palm trunk - simple straight line for now
        graphics.beginPath();
        graphics.moveTo(decorX, decorY + tileHeight / 2 + 5);
        graphics.lineTo(decorX + 2, decorY + tileHeight / 2 - 20);
        graphics.stroke({ width: 3, color: 0x8b6239 });

        // Palm fronds
        const frondAngles = [0, 60, 120, 180, 240, 300];
        frondAngles.forEach((angle) => {
          const rad = (angle * Math.PI) / 180;
          graphics.beginPath();
          graphics.moveTo(decorX + 2, decorY + tileHeight / 2 - 20);
          const endX = decorX + 2 + Math.cos(rad) * 15;
          const endY = decorY + tileHeight / 2 - 20 + Math.sin(rad) * 8;
          graphics.lineTo(endX, endY);
          graphics.stroke({ width: 2, color: 0x228b22 });
        });
      }
    });
  }

  private adjustBrightness(color: number, factor: number): number {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const newR = Math.max(0, Math.min(255, Math.floor(r * factor)));
    const newG = Math.max(0, Math.min(255, Math.floor(g * factor)));
    const newB = Math.max(0, Math.min(255, Math.floor(b * factor)));

    return (newR << 16) | (newG << 8) | newB;
  }

  // Convert grid coordinates to isometric screen coordinates
  private gridToIso(
    gridX: number,
    gridY: number,
    tileWidth: number = this.TILE_WIDTH,
    tileHeight: number = this.TILE_HEIGHT,
  ): { x: number; y: number } {
    const isoX = (gridX - gridY) * (tileWidth / 2);
    const isoY = (gridX + gridY) * (tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  private async getOrCreateShieldTexture(
    chainId: number,
    brandColor: string,
  ): Promise<Texture | null> {
    const cacheKey = `shield_${chainId}`;

    if (this.shieldTextures.has(cacheKey)) {
      return this.shieldTextures.get(cacheKey)!;
    }

    try {
      // Create colored shield SVG
      const coloredSvg = assetRaw.shield.replace(/#95060D/g, brandColor);
      const blob = new Blob([coloredSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      // Create texture from blob URL using Image element
      const texture = await new Promise<Texture>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const texture = Texture.from(img);
          URL.revokeObjectURL(url);
          resolve(texture);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load shield image"));
        };
        img.src = url;
      });

      this.shieldTextures.set(cacheKey, texture);
      return texture;
    } catch (error) {
      console.error("Failed to create shield texture:", error);
      return null;
    }
  }

  private async loadLogo(
    chainId: number,
    logoUrl: string,
  ): Promise<Texture | null> {
    const cacheKey = `logo_${chainId}`;

    // Check cache first
    if (this.logoTextures.has(cacheKey)) {
      return this.logoTextures.get(cacheKey)!;
    }

    try {
      // Since logos are pre-loaded, we can directly get the texture
      const texture = Texture.from(logoUrl);
      this.logoTextures.set(cacheKey, texture);
      return texture;
    } catch (error) {
      console.error(`Failed to get texture for chain ${chainId}:`, error);
      return null;
    }
  }

  private async addShieldAndBannerToContainer(
    container: Container,
    island: Island,
    bounds: { width: number; height: number },
  ): Promise<void> {
    // Shield and banner configuration
    const shieldScale = 0.35;
    const shieldWidth = 890 * shieldScale;
    const shieldHeight = 1115 * shieldScale;
    const bannerWidth = 1415 * shieldScale;
    const bannerHeight = 475 * shieldScale;
    const logoSize = 350 * shieldScale * 1.2;

    // Create a container for shield elements that scales independently
    const shieldContainer = new Container();

    // Calculate shield position based on island scale
    // Large islands: shield closer to center
    // Small islands: shield above island to avoid covering it
    let shieldY: number;
    if (island.scale > 1.5) {
      // Large islands (Ethereum, BNB, etc) - shield slightly above center
      shieldY = -bounds.height / 4;
    } else if (island.scale > 0.8) {
      // Medium islands - shield more above
      shieldY = -bounds.height / 2.5;
    } else {
      // Small islands - shield well above to not cover the island
      shieldY = -bounds.height / 2 - 50;
    }

    // Add shield
    const shieldTexture = await this.getOrCreateShieldTexture(
      island.chainId,
      island.brandColor,
    );
    if (shieldTexture) {
      const shield = new Sprite(shieldTexture);
      shield.anchor.set(0.5);
      shield.width = shieldWidth;
      shield.height = shieldHeight;
      shield.y = shieldY;
      shieldContainer.addChild(shield);
    }

    // Add banner
    if (this.bannerTexture) {
      const banner = new Sprite(this.bannerTexture);
      banner.anchor.set(0.5);
      banner.width = bannerWidth;
      banner.height = bannerHeight;
      banner.y = shieldY + (shieldHeight - bannerHeight * 1.2);
      shieldContainer.addChild(banner);

      // Add chain name text using BitmapText
      const fontSize = 120 * shieldScale;
      const text = new BitmapText({
        text: island.name.toUpperCase(),
        style: {
          fontFamily: "IslandName",
          fontSize: fontSize,
        },
      });

      text.anchor.set(0.5);
      text.y = banner.y;
      // BitmapText doesn't have maxWidth, rely on font size scaling
      shieldContainer.addChild(text);
    }

    // Add logo
    if (island.logoUrl) {
      const logoTexture = await this.loadLogo(island.chainId, island.logoUrl);
      if (logoTexture) {
        const logo = new Sprite(logoTexture);
        logo.anchor.set(0.5);
        const logoScale =
          logoSize / Math.max(logoTexture.width, logoTexture.height);
        logo.scale.set(logoScale);
        // Center logo in the shield - visual center is at 40% down from top of shield
        logo.y = shieldY * 1.05;
        logo.x = 0;
        shieldContainer.addChild(logo);
      }
    }

    container.addChild(shieldContainer);
  }

  /**
   * Clean up all cached textures and resources
   */
  destroy(): void {
    // Unload assets loaded via Assets system
    if (this.loadedAssetUrls.size > 0) {
      const urlsToUnload = Array.from(this.loadedAssetUrls);
      Assets.unload(urlsToUnload);
      this.loadedAssetUrls.clear();
    }

    // Clear logo texture cache (textures are handled by Assets.unload)
    this.logoTextures.clear();

    // Destroy all cached island textures (these are RenderTextures we created)
    this.islandTextureCache.forEach((texture) => {
      texture.destroy(true);
    });
    this.islandTextureCache.clear();
    this.islandBoundsCache.clear();

    // Destroy all shield textures (created from blob URLs)
    this.shieldTextures.forEach((texture) => {
      texture.destroy(true);
    });
    this.shieldTextures.clear();

    // Banner texture is now handled by Assets.unload above
    this.bannerTexture = null;

    // Try to uninstall the bitmap font
    try {
      BitmapFont.uninstall("IslandName");
    } catch (error) {
      // Ignore errors during font cleanup - font might not exist
      console.debug("[PixiIslandRenderer] BitmapFont cleanup skipped", error);
    }
  }
}
