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
  private readonly SHIELD_OFFSET_X = -445;
  private readonly SHIELD_OFFSET_Y = -200;
  private readonly BANNER_OFFSET_X = -707;
  private readonly BANNER_OFFSET_Y = 400;
  private readonly LOGO_OFFSET_X = 445;
  private readonly LOGO_OFFSET_Y = 400;
  private readonly LOGO_SIZE = 350;

  // TPS color thresholds
  private readonly TPS_COLORS = {
    desert: { min: 0, max: 1, color: "#8B7355" },
    semiArid: { min: 1, max: 10, color: "#7A7A4A" },
    grassland: { min: 10, max: 50, color: "#6A8B5A" },
    lush: { min: 50, max: Infinity, color: "#4A7C59" },
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
    // Generate color variants by replacing the fill color
    for (const [key, config] of Object.entries(this.TPS_COLORS)) {
      const coloredSvg = svgText
        .replace(/#1C8CC9/g, config.color)
        .replace(/#12AAFF/g, this.lightenColor(config.color));

      const img = await this.svgToImage(coloredSvg);
      this.assetCache.islands.set(key, img);
    }
  }

  private lightenColor(color: string): string {
    // Simple color lightening for the top surface
    const hex = color.substring(1);
    const num = parseInt(hex, 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + 40);
    const g = Math.min(255, ((num >> 8) & 0xff) + 40);
    const b = Math.min(255, (num & 0xff) + 40);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
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

    // 2. Draw shield (fixed size, not scaling with island)
    const shield = this.assetCache.shields.get(`shield_${island.chainId}`);
    if (!shield) {
      // Create shield asynchronously but don't block rendering
      this.getOrCreateShield(island.chainId, island.brandColor);
    }
    if (shield) {
      // Unscale to get fixed size shield
      ctx.save();
      ctx.scale(1 / island.scale, 1 / island.scale);

      const shieldScale = 0.35; // Fixed scale in world units
      const shieldWidth = this.SHIELD_WIDTH * shieldScale;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;

      // Center horizontally and position above island
      const shieldX = -shieldWidth / 2;
      const shieldY = -500; // Position well above island

      ctx.drawImage(shield, shieldX, shieldY, shieldWidth, shieldHeight);

      ctx.restore();
    }

    // 3. Draw banner (positioned at bottom of shield)
    if (this.assetCache.banner && shield) {
      // Unscale to get fixed size banner
      ctx.save();
      ctx.scale(1 / island.scale, 1 / island.scale);

      const shieldScale = 0.35;
      const shieldWidth = this.SHIELD_WIDTH * shieldScale;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;
      const bannerWidth = this.BANNER_WIDTH * shieldScale;
      const bannerHeight = this.BANNER_HEIGHT * shieldScale;

      // Center horizontally on shield, position at bottom of shield
      const shieldX = -shieldWidth / 2;
      const shieldY = -500;
      const bannerX = -bannerWidth / 2;
      const bannerY = shieldY + shieldHeight - bannerHeight * 0.7; // Overlap slightly with shield bottom

      ctx.drawImage(
        this.assetCache.banner,
        bannerX,
        bannerY,
        bannerWidth,
        bannerHeight,
      );

      ctx.restore();
    }

    // 4. Draw logo
    const logo = this.assetCache.logos.get(`logo_${island.chainId}`);
    if (!logo && island.logoUrl) {
      // Load logo asynchronously but don't block rendering
      this.getOrLoadLogo(island.chainId, island.logoUrl);
    }
    if (logo && shield) {
      // Unscale to get fixed size logo
      ctx.save();
      ctx.scale(1 / island.scale, 1 / island.scale);

      const shieldScale = 0.35;
      const shieldWidth = this.SHIELD_WIDTH * shieldScale;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;
      const logoSize = this.LOGO_SIZE * shieldScale * 1.2; // Make logo larger and more prominent

      // Center logo on shield (horizontally and vertically)
      const shieldY = -500;
      const logoX = -logoSize / 2;
      const logoY = shieldY + (shieldHeight * 0.4) - logoSize / 2; // Center in upper portion of shield

      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

      ctx.restore();
    }

    // 5. Draw chain name on banner
    if (this.assetCache.banner && shield) {
      // Unscale to get fixed size text
      ctx.save();
      ctx.scale(1 / island.scale, 1 / island.scale);

      const shieldScale = 0.35;
      const shieldHeight = this.SHIELD_HEIGHT * shieldScale;
      const bannerWidth = this.BANNER_WIDTH * shieldScale;
      const bannerHeight = this.BANNER_HEIGHT * shieldScale;

      // Calculate banner position
      const shieldY = -500;
      const bannerY = shieldY + shieldHeight - bannerHeight * 0.7;

      // Text settings - scale font size appropriately
      const fontSize = 110 * shieldScale; // Slightly smaller to better fit multi-line text
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.fillStyle = "#4B2F00";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Position text in center of banner
      const textX = 0;
      
      // Get wrapped text lines
      const maxWidth = bannerWidth * 0.8; // 80% of banner width for padding
      const lines = this.wrapText(ctx, island.name.toUpperCase(), maxWidth);
      
      // Calculate line height
      const lineHeight = fontSize * 1.2;
      
      // Calculate starting Y position to center all lines
      const totalTextHeight = lines.length * lineHeight;
      const startY = bannerY + (bannerHeight - totalTextHeight) / 2 + lineHeight / 2;
      
      // Draw each line
      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, textX, y);
      });

      ctx.restore();
    }

    ctx.restore();
  }

  // Check if loading is complete
  isReady(): boolean {
    return !this.isLoading;
  }
  
  // Wrap text to fit within a maximum width
  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
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
      currentLine = '';
      
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
      const combinedText = lines.join(' ');
      lines.length = 0;
      
      // Try to fit in 2 lines with ellipsis
      const halfLength = Math.floor(combinedText.length / 2);
      let line1 = combinedText.substring(0, halfLength);
      let line2 = combinedText.substring(halfLength);
      
      // Adjust to not break words
      const lastSpaceInLine1 = line1.lastIndexOf(' ');
      if (lastSpaceInLine1 > 0 && halfLength - lastSpaceInLine1 < 10) {
        line2 = combinedText.substring(lastSpaceInLine1 + 1);
        line1 = combinedText.substring(0, lastSpaceInLine1);
      }
      
      // Add ellipsis if needed
      if (ctx.measureText(line2).width > maxWidth) {
        while (line2.length > 3 && ctx.measureText(line2 + '...').width > maxWidth) {
          line2 = line2.substring(0, line2.length - 1);
        }
        line2 = line2 + '...';
      }
      
      lines.push(line1);
      lines.push(line2);
    }
    
    return lines;
  }
}
