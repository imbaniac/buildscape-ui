import type ViewportManager from "./ViewportManager";
import { assetUrls, assetRaw } from "./assets";

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

  // TPS color thresholds - clearer progression from barren to lush
  private readonly TPS_COLORS = {
    desert: { min: 0, max: 1, color: "#8B7B6B" }, // Light sandy brown
    semiArid: { min: 1, max: 10, color: "#7A8B6B" }, // Brown-green transition
    grassland: { min: 10, max: 50, color: "#6B8B6B" }, // Balanced green
    lush: { min: 50, max: Infinity, color: "#5A8B5A" }, // Vibrant green
  };

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
      const islandSvg = assetRaw.island;
      const shieldSvg = assetRaw.shield;

      // Load banner image
      const bannerImage = await this.loadImage(assetUrls.banner);

      // Store banner
      this.assetCache.banner = bannerImage;

      // Pre-generate island color variants
      await this.generateIslandVariants(islandSvg);

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

  private async generateIslandVariants(svgText: string): Promise<void> {
    // Generate gradient-based color variants
    for (const [key, config] of Object.entries(this.TPS_COLORS)) {
      // Create SVG with radial gradient for each TPS category
      const gradientId = `islandGradient${key}`;
      const coloredSvg = this.createIslandSvgWithGradient(
        svgText,
        gradientId,
        config.color,
      );

      const img = await this.svgToImage(coloredSvg);
      this.assetCache.islands.set(key, img);
    }
  }

  private createIslandSvgWithGradient(
    svgText: string,
    gradientId: string,
    baseColor: string,
  ): string {
    // Parse the color to create gradient stops for a subtle 3D effect
    const accentColor = this.lightenColor(baseColor, 0.12); // Slightly brighter highlight
    const mainColor = baseColor;
    const darkColor = this.darkenColor(baseColor, 0.2); // Less dark edges
    const edgeColor = this.darkenColor(baseColor, 0.1); // Very subtle edge color

    // Create a radial gradient with subtle center highlight
    const gradientDef = `
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="1" />
          <stop offset="40%" stop-color="${mainColor}" stop-opacity="1" />
          <stop offset="100%" stop-color="${darkColor}" stop-opacity="1" />
        </radialGradient>
      </defs>
    `;

    // Insert the gradient definition
    let modifiedSvg = svgText.replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`);

    // Replace the bright border colors with very subtle versions
    // Add opacity to make edges blend better
    modifiedSvg = modifiedSvg.replace(
      /fill="#1C8CC9"/g,
      `fill="${edgeColor}" fill-opacity="0.6"`,
    ); // Semi-transparent edges
    modifiedSvg = modifiedSvg.replace(/#12AAFF/g, `url(#${gradientId})`); // Main island fill

    return modifiedSvg;
  }

  private lightenColor(color: string, amount: number = 0.15): string {
    // Lighten color by the specified amount (0-1)
    const hex = color.substring(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;

    // Lighten by moving towards white
    const newR = Math.min(255, Math.round(r + (255 - r) * amount));
    const newG = Math.min(255, Math.round(g + (255 - g) * amount));
    const newB = Math.min(255, Math.round(b + (255 - b) * amount));

    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`;
  }

  private darkenColor(color: string, amount: number = 0.15): string {
    // Darken color by the specified amount (0-1)
    const hex = color.substring(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;

    // Darken by moving towards black
    const newR = Math.max(0, Math.round(r * (1 - amount)));
    const newG = Math.max(0, Math.round(g * (1 - amount)));
    const newB = Math.max(0, Math.round(b * (1 - amount)));

    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`;
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

  // Get TPS category for island coloring
  private getTPSCategory(tps: number): string {
    if (tps < 1) return "desert";
    if (tps < 10) return "semiArid";
    if (tps < 50) return "grassland";
    return "lush";
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
    ctx.scale(screenScale, screenScale);

    // 1. Draw island base
    const tpsCategory = this.getTPSCategory(island.tps);
    const islandImage = this.assetCache.islands.get(tpsCategory);
    if (islandImage) {
      ctx.drawImage(
        islandImage,
        -this.ISLAND_WIDTH / 2,
        -this.ISLAND_HEIGHT / 2,
        this.ISLAND_WIDTH,
        this.ISLAND_HEIGHT,
      );
    }

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
      
      // Common positions
      const shieldX = -shieldWidth / 2;
      const shieldY = -500;
      const bannerX = -bannerWidth / 2;
      const bannerY = shieldY + shieldHeight - bannerHeight * 0.7;
      
      // Apply single transform for all fixed-size elements
      ctx.save();
      ctx.scale(unscaleRatio, unscaleRatio);
      
      // 2. Draw shield
      ctx.drawImage(shield, shieldX, shieldY, shieldWidth, shieldHeight);
      
      // 3. Draw banner
      if (this.assetCache.banner) {
        ctx.drawImage(this.assetCache.banner, bannerX, bannerY, bannerWidth, bannerHeight);
        
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
        const startY = bannerY + (bannerHeight - totalTextHeight) / 2 + lineHeight / 2 - 10;
        
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

    ctx.save();

    // Apply brightness filter using globalCompositeOperation
    ctx.filter = `brightness(${brightness}) saturate(1.2)`;

    // Render the island
    await this.renderIsland(ctx, island);

    ctx.restore();
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
