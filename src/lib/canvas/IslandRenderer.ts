import type ViewportManager from "./ViewportManager";
import { assetUrls, assetRaw } from "./assets";
import { SeededRandom } from "./SeededRandom";

interface Island {
  chainId: number;
  name: string;
  slug: string;
  x: number;
  y: number;
  scale: number;
  tps: number;
  brandColor: string;
  logoUrl?: string;
}

interface AssetCache {
  islands: Map<string, HTMLImageElement>;
  shields: Map<string, HTMLImageElement>;
  banner: HTMLImageElement | null;
  logos: Map<string, HTMLImageElement>;
}

// Terrain types for tiles
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

// Tile data structure
interface Tile {
  x: number;
  y: number;
  terrainType: TerrainType;
  elevation: number;
}

// Decoration data
interface Decoration {
  x: number;
  y: number;
  type: "tree" | "palm";
  variant: number;
}

// Cached island terrain data
interface IslandTerrain {
  tiles: Tile[];
  decorations: Decoration[];
  size: number;
}

export default class IslandRenderer {
  private viewportManager: ViewportManager;
  private assetCache: AssetCache;
  private isLoading: boolean = true;
  private onAssetsLoaded?: () => void;

  // Asset dimensions
  private readonly ISLAND_WIDTH = 1862;
  private readonly ISLAND_HEIGHT = 1075;
  private readonly SHIELD_WIDTH = 890;
  private readonly SHIELD_HEIGHT = 1115;
  private readonly BANNER_WIDTH = 1415;
  private readonly BANNER_HEIGHT = 475;

  // Composition offsets (relative to island center)
  private readonly LOGO_SIZE = 350;

  // Tile dimensions (balanced for visibility)
  private readonly TILE_WIDTH = 72;
  private readonly TILE_HEIGHT = 36;

  // Dynamic tile size based on island scale
  private getTileSize(scale: number): { width: number; height: number } {
    // Keep all tiles close to the same size for better visibility
    // Only minor adjustments to maintain visual consistency
    let factor = 1.0;
    if (scale < 0.3) {
      factor = 3;
    } else if (scale < 0.6) {
      factor = 2;
    }
    // Medium and large islands use standard tile size (factor = 1.0)

    return {
      width: this.TILE_WIDTH * factor,
      height: this.TILE_HEIGHT * factor,
    };
  }

  // Terrain colors
  private readonly terrainColors: Record<TerrainType, string> = {
    [TerrainType.WATER]: "#ffffff", // Not used, but needed for type completeness
    [TerrainType.BEACH]: "#f4e4bc",
    [TerrainType.DESERT_LIGHT]: "#E4C49A", // Sandy
    [TerrainType.DESERT_DARK]: "#D4A574", // Light brown
    [TerrainType.DRY_GRASS]: "#B8A068", // Dry yellow grass
    [TerrainType.GRASS_LIGHT]: "#7FA05C", // Yellow-green
    [TerrainType.GRASS_MEDIUM]: "#6B8E4E", // Grass green
    [TerrainType.GRASS_DARK]: "#5A7A3F", // Lush green
  };

  // Cached terrain data for each island
  private terrainCache: Map<number, IslandTerrain> = new Map();

  constructor(viewportManager: ViewportManager, onAssetsLoaded?: () => void) {
    this.viewportManager = viewportManager;
    this.onAssetsLoaded = onAssetsLoaded;
    this.assetCache = {
      islands: new Map(),
      shields: new Map(),
      banner: null,
      logos: new Map(),
    };

    // Start loading assets
    this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    try {
      // Use pre-imported assets
      const shieldSvg = assetRaw.shield;

      // Load banner image
      const bannerImage = await this.loadImage(assetUrls.banner);

      // Store banner
      this.assetCache.banner = bannerImage;

      // Store base shield SVG for later coloring
      this.baseShieldSvg = shieldSvg;

      this.isLoading = false;

      // Notify that assets are loaded
      if (this.onAssetsLoaded) {
        this.onAssetsLoaded();
      }
    } catch (error) {
      console.error("Failed to load assets:", error);
      this.isLoading = false;
    }
  }

  private baseShieldSvg: string = "";

  // Generate or get cached terrain for an island
  private getIslandTerrain(island: Island): IslandTerrain {
    // Check cache first
    if (this.terrainCache.has(island.chainId)) {
      return this.terrainCache.get(island.chainId)!;
    }

    // Generate new terrain
    const terrain = this.generateIslandTerrain(island);
    this.terrainCache.set(island.chainId, terrain);
    return terrain;
  }

  // Generate island terrain based on TVL and TPS
  private generateIslandTerrain(island: Island): IslandTerrain {
    // Use chainId as seed for consistent generation
    const rng = new SeededRandom(island.chainId);

    // Calculate island size based on TVL (scale)
    // Direct linear scaling for clear size differences
    const baseSize = 35;
    const size = Math.max(8, Math.min(30, Math.floor(baseSize * island.scale)));

    const tiles: Tile[] = [];
    const decorations: Decoration[] = [];
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

        // Use chainId to create unique noise patterns
        const noiseFreq1 = 3 + (island.chainId % 7);
        const noiseFreq2 = 5 + (island.chainId % 5);
        const noiseAmp1 = 0.08 + (island.chainId % 3) * 0.02;
        const noiseAmp2 = 0.05 + (island.chainId % 4) * 0.015;

        const noise =
          Math.sin(angle * noiseFreq1 + island.chainId * 0.1) * noiseAmp1 +
          Math.cos(angle * noiseFreq2 - island.chainId * 0.2) * noiseAmp2;

        // More dramatic elevation curve for volume
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
              // Very low TPS - full desert
              terrainType = rng.chance(0.7)
                ? TerrainType.DESERT_LIGHT
                : TerrainType.DESERT_DARK;
            } else if (island.tps < 1) {
              // Low TPS - mostly desert with some dry grass
              const rand = rng.next();
              if (rand < 0.5) {
                terrainType = TerrainType.DESERT_LIGHT;
              } else if (rand < 0.8) {
                terrainType = TerrainType.DESERT_DARK;
              } else {
                terrainType = TerrainType.DRY_GRASS;
              }
            } else if (island.tps < 10) {
              // Medium-low TPS - dry grass and some light greens
              const rand = rng.next();
              if (rand < 0.4) {
                terrainType = TerrainType.DRY_GRASS;
              } else if (rand < 0.8) {
                terrainType = TerrainType.GRASS_LIGHT;
              } else {
                terrainType = TerrainType.GRASS_MEDIUM;
              }
            } else if (island.tps < 50) {
              // Medium TPS - mix of grass types
              terrainType = rng.chance(0.6)
                ? TerrainType.GRASS_MEDIUM
                : TerrainType.GRASS_DARK;
            } else {
              // High TPS - lush green
              terrainType = rng.chance(0.3)
                ? TerrainType.GRASS_MEDIUM
                : TerrainType.GRASS_DARK;
            }
          }

          tiles.push({
            x,
            y,
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
              x,
              y,
              type: isBeach ? "palm" : "tree",
              variant: rng.intBetween(0, 2),
            });
          }
        }
      }
    }

    return { tiles, decorations, size };
  }

  // Adjust color brightness
  private adjustBrightness(color: string, factor: number): string {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const newR = Math.max(0, Math.min(255, r * factor));
      const newG = Math.max(0, Math.min(255, g * factor));
      const newB = Math.max(0, Math.min(255, b * factor));

      return `#${Math.floor(newR).toString(16).padStart(2, "0")}${Math.floor(newG).toString(16).padStart(2, "0")}${Math.floor(newB).toString(16).padStart(2, "0")}`;
    }
    return color;
  }

  private async svgToImage(svgText: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG"));
      };

      img.src = url;
    });
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Get or create colored shield for a chain
  private async getOrCreateShield(
    chainId: number,
    brandColor: string,
  ): Promise<HTMLImageElement> {
    const cacheKey = `shield_${chainId}`;

    if (this.assetCache.shields.has(cacheKey)) {
      return this.assetCache.shields.get(cacheKey)!;
    }

    // Create colored shield
    const coloredSvg = this.baseShieldSvg.replace(/#95060D/g, brandColor);
    const img = await this.svgToImage(coloredSvg);
    this.assetCache.shields.set(cacheKey, img);

    // Trigger re-render when shield is loaded
    if (this.onAssetsLoaded) {
      this.onAssetsLoaded();
    }

    return img;
  }

  // Get or load chain logo
  private async getOrLoadLogo(
    chainId: number,
    logoUrl?: string,
  ): Promise<HTMLImageElement | null> {
    if (!logoUrl) return null;

    const cacheKey = `logo_${chainId}`;

    if (this.assetCache.logos.has(cacheKey)) {
      return this.assetCache.logos.get(cacheKey)!;
    }

    try {
      const img = await this.loadImage(logoUrl);
      this.assetCache.logos.set(cacheKey, img);

      // Trigger re-render when logo is loaded
      if (this.onAssetsLoaded) {
        this.onAssetsLoaded();
      }

      return img;
    } catch (error) {
      console.error(`Failed to load logo for chain ${chainId}:`, error);
      return null;
    }
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

  // Draw a single isometric tile
  private drawTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    terrainType: TerrainType,
    elevation: number,
    tileScale: number,
    tileWidth: number = this.TILE_WIDTH,
    tileHeight: number = this.TILE_HEIGHT,
  ): void {
    const iso = this.gridToIso(x, y, tileWidth, tileHeight);
    const tileX = iso.x;
    const tileY = iso.y - elevation * 45; // Adjusted for tile size

    ctx.save();
    ctx.translate(tileX, tileY);
    ctx.scale(tileScale, tileScale);

    // Get base color for terrain type
    const baseColor = this.terrainColors[terrainType];

    // Add subtle variation based on position
    const colorVariation = ((x * 7 + y * 13) % 10) / 100 - 0.05;
    const adjustedColor = this.adjustBrightness(baseColor, 1 + colorVariation);

    // Draw tile top
    ctx.fillStyle = adjustedColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tileWidth / 2, tileHeight / 2);
    ctx.lineTo(0, tileHeight);
    ctx.lineTo(-tileWidth / 2, tileHeight / 2);
    ctx.closePath();
    ctx.fill();

    // Draw tile edges for elevation
    if (elevation > 0.05) {
      const edgeHeight = elevation * 45; // Match the tile elevation offset

      // Right edge
      ctx.fillStyle = this.adjustBrightness(adjustedColor, 0.65);
      ctx.beginPath();
      ctx.moveTo(0, tileHeight);
      ctx.lineTo(tileWidth / 2, tileHeight / 2);
      ctx.lineTo(tileWidth / 2, tileHeight / 2 + edgeHeight);
      ctx.lineTo(0, tileHeight + edgeHeight);
      ctx.closePath();
      ctx.fill();

      // Left edge
      ctx.fillStyle = this.adjustBrightness(adjustedColor, 0.45);
      ctx.beginPath();
      ctx.moveTo(0, tileHeight);
      ctx.lineTo(-tileWidth / 2, tileHeight / 2);
      ctx.lineTo(-tileWidth / 2, tileHeight / 2 + edgeHeight);
      ctx.lineTo(0, tileHeight + edgeHeight);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw decoration (tree or palm)
  private drawDecoration(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: "tree" | "palm",
    variant: number,
    elevation: number,
    decorScale: number,
    tileWidth: number = this.TILE_WIDTH,
    tileHeight: number = this.TILE_HEIGHT,
  ): void {
    const iso = this.gridToIso(x, y, tileWidth, tileHeight);
    const decorX = iso.x;
    const decorY = iso.y - elevation * 45; // Match the tile elevation offset

    ctx.save();
    ctx.translate(decorX, decorY);
    ctx.scale(decorScale, decorScale);

    if (type === "tree") {
      // Draw tree shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.beginPath();
      ctx.ellipse(0, tileHeight / 2, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw tree trunk
      ctx.fillStyle = "#4a3829";
      ctx.fillRect(-2, -8, 4, 18);

      // Draw tree crown
      const crownColors = ["#2d5016", "#3a6218", "#4a7c1f"];
      ctx.fillStyle = crownColors[variant % crownColors.length];

      ctx.beginPath();
      ctx.arc(0, -12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-5, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, -8, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "palm") {
      // Draw palm tree
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.beginPath();
      ctx.ellipse(0, tileHeight / 2, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Palm trunk
      ctx.strokeStyle = "#8b6239";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.quadraticCurveTo(3, -5, 2, -15);
      ctx.stroke();

      // Palm fronds
      ctx.strokeStyle = "#228b22";
      ctx.lineWidth = 2;
      const frondAngles = [0, 60, 120, 180, 240, 300];
      frondAngles.forEach((angle) => {
        ctx.save();
        ctx.translate(2, -15);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(10, 3, 15, 8);
        ctx.stroke();
        ctx.restore();
      });
    }

    ctx.restore();
  }

  // Render all islands
  async renderIslands(
    ctx: CanvasRenderingContext2D,
    islands: Island[],
  ): Promise<void> {
    if (this.isLoading) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Filter and sort islands by distance from center for proper layering
    const visibleIslands = islands
      .filter((island) =>
        this.viewportManager.isRectInViewport(
          island.x - (this.ISLAND_WIDTH * island.scale) / 2,
          island.y - (this.ISLAND_HEIGHT * island.scale) / 2,
          this.ISLAND_WIDTH * island.scale,
          this.ISLAND_HEIGHT * island.scale,
        ),
      )
      .sort((a, b) => {
        // Sort by Y position for isometric layering (back to front)
        return a.y - b.y;
      });

    // Render each visible island
    for (const island of visibleIslands) {
      await this.renderIsland(ctx, island);
    }
  }

  // Render a single island
  private async renderIsland(
    ctx: CanvasRenderingContext2D,
    island: Island,
  ): Promise<void> {
    const screenPos = this.viewportManager.worldToScreen(island.x, island.y);
    const screenScale = island.scale * this.viewportManager.getScale();

    ctx.save();

    // Translate to island position
    ctx.translate(screenPos.x, screenPos.y);

    // 1. Draw island tiles
    const terrain = this.getIslandTerrain(island);

    // Sort tiles for proper depth rendering
    const sortedTiles = [...terrain.tiles].sort(
      (a, b) => a.y + a.x - (b.y + b.x),
    );

    // Draw all tiles
    ctx.save();
    ctx.scale(screenScale, screenScale);

    // Get dynamic tile size based on island scale
    const tileSize = this.getTileSize(island.scale);

    // Center the tile grid for isometric projection
    // Account for the diamond shape - tiles extend diagonally
    // The center tile should be at (size/2, size/2) in grid coordinates
    const centerTile = terrain.size / 2;
    const centerIso = this.gridToIso(
      centerTile,
      centerTile,
      tileSize.width,
      tileSize.height,
    );
    ctx.translate(-centerIso.x, -centerIso.y);

    for (const tile of sortedTiles) {
      this.drawTile(
        ctx,
        tile.x,
        tile.y,
        tile.terrainType,
        tile.elevation,
        1,
        tileSize.width,
        tileSize.height,
      );
    }

    // Draw decorations
    for (const decoration of terrain.decorations) {
      // Find tile elevation at decoration position
      const tile = sortedTiles.find(
        (t) => t.x === decoration.x && t.y === decoration.y,
      );
      if (tile) {
        this.drawDecoration(
          ctx,
          decoration.x,
          decoration.y,
          decoration.type,
          decoration.variant,
          tile.elevation,
          1,
          tileSize.width,
          tileSize.height,
        );
      }
    }

    ctx.restore();

    // Draw shield/banner/logo at fixed size (not affected by island scale)
    ctx.save();
    ctx.scale(screenScale, screenScale);

    // Get shield for subsequent renders
    const shield = this.assetCache.shields.get(`shield_${island.chainId}`);
    if (!shield) {
      // Create shield asynchronously but don't block rendering
      this.getOrCreateShield(island.chainId, island.brandColor);
    }

    // Draw all shield-related elements with a single transform
    if (shield) {
      // Calculate unscaled dimensions once
      const unscaleRatio = 1 / island.scale;
      const shieldScale = 0.35;
      const shieldWidth = this.SHIELD_WIDTH * shieldScale;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;
      const bannerWidth = this.BANNER_WIDTH * shieldScale;
      const bannerHeight = this.BANNER_HEIGHT * shieldScale;
      const logoSize = this.LOGO_SIZE * shieldScale * 1.2;

      // Common positions - position shield above center of tiles
      const shieldX = -shieldWidth / 2;
      const shieldY = -500; // Positioned above the island
      const bannerX = -bannerWidth / 2;
      const bannerY = shieldY + shieldHeight - bannerHeight * 0.7;

      // Apply single transform for all fixed-size elements
      ctx.save();
      ctx.scale(unscaleRatio, unscaleRatio);

      // 2. Draw shield
      ctx.drawImage(shield, shieldX, shieldY, shieldWidth, shieldHeight);

      // 3. Draw banner
      if (this.assetCache.banner) {
        ctx.drawImage(
          this.assetCache.banner,
          bannerX,
          bannerY,
          bannerWidth,
          bannerHeight,
        );

        // 5. Draw chain name on banner
        const fontSize = 120 * shieldScale;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.fillStyle = "#4B2F00";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const maxWidth = bannerWidth * 0.7;
        const lines = this.wrapText(ctx, island.name.toUpperCase(), maxWidth);
        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        const startY =
          bannerY + (bannerHeight - totalTextHeight) / 2 + lineHeight / 2 - 10;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.fillText(line, 0, y);
        });
      }

      // 4. Draw logo
      const logo = this.assetCache.logos.get(`logo_${island.chainId}`);
      if (!logo && island.logoUrl) {
        this.getOrLoadLogo(island.chainId, island.logoUrl);
      }
      if (logo) {
        const logoX = -logoSize / 2;
        const logoY = shieldY + shieldHeight * 0.4 - logoSize / 2;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      }

      ctx.restore(); // Restore from unscale
    }

    ctx.restore(); // Restore from screenScale

    ctx.restore(); // Restore from main transform
  }

  // Check if loading is complete
  isReady(): boolean {
    return !this.isLoading;
  }

  // Render a single island with brightness effect for hover
  async renderIslandWithBrightness(
    ctx: CanvasRenderingContext2D,
    island: Island,
    brightness: number = 1.15,
  ): Promise<void> {
    if (this.isLoading) {
      return;
    }

    // For tile-based rendering, we'll adjust colors directly
    const screenPos = this.viewportManager.worldToScreen(island.x, island.y);
    const screenScale = island.scale * this.viewportManager.getScale();

    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);

    // Draw island tiles with brightness adjustment
    const terrain = this.getIslandTerrain(island);
    const sortedTiles = [...terrain.tiles].sort(
      (a, b) => a.y + a.x - (b.y + b.x),
    );

    ctx.save();
    ctx.scale(screenScale, screenScale);

    // Get dynamic tile size based on island scale
    const tileSize = this.getTileSize(island.scale);

    // Center the tile grid for isometric projection
    // Account for the diamond shape - tiles extend diagonally
    // The center tile should be at (size/2, size/2) in grid coordinates
    const centerTile = terrain.size / 2;
    const centerIso = this.gridToIso(
      centerTile,
      centerTile,
      tileSize.width,
      tileSize.height,
    );
    ctx.translate(-centerIso.x, -centerIso.y);

    // Draw tiles with brightened colors
    for (const tile of sortedTiles) {
      const iso = this.gridToIso(
        tile.x,
        tile.y,
        tileSize.width,
        tileSize.height,
      );
      const tileY = iso.y - tile.elevation * 45; // Match the tile elevation offset

      ctx.save();
      ctx.translate(iso.x, tileY);

      // Get brightened color
      const baseColor = this.terrainColors[tile.terrainType];
      const colorVariation = ((tile.x * 7 + tile.y * 13) % 10) / 100 - 0.05;
      const adjustedColor = this.adjustBrightness(
        baseColor,
        (1 + colorVariation) * brightness,
      );

      // Draw tile top
      ctx.fillStyle = adjustedColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tileSize.width / 2, tileSize.height / 2);
      ctx.lineTo(0, tileSize.height);
      ctx.lineTo(-tileSize.width / 2, tileSize.height / 2);
      ctx.closePath();
      ctx.fill();

      // Draw edges with brightness
      if (tile.elevation > 0.05) {
        const edgeHeight = tile.elevation * 45; // Match the tile elevation offset

        ctx.fillStyle = this.adjustBrightness(adjustedColor, 0.65);
        ctx.beginPath();
        ctx.moveTo(0, tileSize.height);
        ctx.lineTo(tileSize.width / 2, tileSize.height / 2);
        ctx.lineTo(tileSize.width / 2, tileSize.height / 2 + edgeHeight);
        ctx.lineTo(0, tileSize.height + edgeHeight);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.adjustBrightness(adjustedColor, 0.45);
        ctx.beginPath();
        ctx.moveTo(0, tileSize.height);
        ctx.lineTo(-tileSize.width / 2, tileSize.height / 2);
        ctx.lineTo(-tileSize.width / 2, tileSize.height / 2 + edgeHeight);
        ctx.lineTo(0, tileSize.height + edgeHeight);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // Draw decorations with brightness
    ctx.filter = `brightness(${brightness}) saturate(1.2)`;
    for (const decoration of terrain.decorations) {
      const tile = sortedTiles.find(
        (t) => t.x === decoration.x && t.y === decoration.y,
      );
      if (tile) {
        this.drawDecoration(
          ctx,
          decoration.x,
          decoration.y,
          decoration.type,
          decoration.variant,
          tile.elevation,
          1,
          tileSize.width,
          tileSize.height,
        );
      }
    }
    ctx.filter = "none";

    ctx.restore();

    // Draw shield/banner/logo normally (not affected by hover)
    ctx.save();
    ctx.scale(screenScale, screenScale);

    const shield = this.assetCache.shields.get(`shield_${island.chainId}`);
    if (!shield) {
      this.getOrCreateShield(island.chainId, island.brandColor);
    }

    if (shield) {
      const unscaleRatio = 1 / island.scale;
      const shieldScale = 0.35;
      const shieldWidth = this.SHIELD_WIDTH * shieldScale;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;
      const bannerWidth = this.BANNER_WIDTH * shieldScale;
      const bannerHeight = this.BANNER_HEIGHT * shieldScale;
      const logoSize = this.LOGO_SIZE * shieldScale * 1.2;

      const shieldX = -shieldWidth / 2;
      const shieldY = -500; // Positioned above the island
      const bannerX = -bannerWidth / 2;
      const bannerY = shieldY + shieldHeight - bannerHeight * 0.7;

      ctx.save();
      ctx.scale(unscaleRatio, unscaleRatio);

      ctx.drawImage(shield, shieldX, shieldY, shieldWidth, shieldHeight);

      if (this.assetCache.banner) {
        ctx.drawImage(
          this.assetCache.banner,
          bannerX,
          bannerY,
          bannerWidth,
          bannerHeight,
        );

        const fontSize = 120 * shieldScale;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.fillStyle = "#4B2F00";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const maxWidth = bannerWidth * 0.7;
        const lines = this.wrapText(ctx, island.name.toUpperCase(), maxWidth);
        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        const startY =
          bannerY + (bannerHeight - totalTextHeight) / 2 + lineHeight / 2 - 10;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.fillText(line, 0, y);
        });
      }

      const logo = this.assetCache.logos.get(`logo_${island.chainId}`);
      if (!logo && island.logoUrl) {
        this.getOrLoadLogo(island.chainId, island.logoUrl);
      }
      if (logo) {
        const logoX = -logoSize / 2;
        const logoY = shieldY + shieldHeight * 0.4 - logoSize / 2;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      }

      ctx.restore();
    }

    ctx.restore(); // Restore from screenScale

    ctx.restore(); // Restore from main transform
  }

  // Wrap text to fit within a maximum width
  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        // Current line is too long, push it and start a new line
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word fits on current line
        currentLine = testLine;
      }
    }

    // Push the last line
    if (currentLine) {
      lines.push(currentLine);
    }

    // If we still have only one line that's too long, try to break it by characters
    if (lines.length === 1 && ctx.measureText(lines[0]).width > maxWidth) {
      const singleLine = lines[0];
      lines.length = 0; // Clear array
      currentLine = "";

      for (let i = 0; i < singleLine.length; i++) {
        const char = singleLine[i];
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }

    // Limit to 2 lines maximum to fit on banner
    if (lines.length > 2) {
      // Combine all lines and truncate with ellipsis
      const combinedText = lines.join(" ");
      lines.length = 0;

      // Try to fit in 2 lines with ellipsis
      const halfLength = Math.floor(combinedText.length / 2);
      let line1 = combinedText.substring(0, halfLength);
      let line2 = combinedText.substring(halfLength);

      // Adjust to not break words
      const lastSpaceInLine1 = line1.lastIndexOf(" ");
      if (lastSpaceInLine1 > 0 && halfLength - lastSpaceInLine1 < 10) {
        line2 = combinedText.substring(lastSpaceInLine1 + 1);
        line1 = combinedText.substring(0, lastSpaceInLine1);
      }

      // Add ellipsis if needed
      if (ctx.measureText(line2).width > maxWidth) {
        while (
          line2.length > 3 &&
          ctx.measureText(line2 + "...").width > maxWidth
        ) {
          line2 = line2.substring(0, line2.length - 1);
        }
        line2 = line2 + "...";
      }

      lines.push(line1);
      lines.push(line2);
    }

    return lines;
  }
}
