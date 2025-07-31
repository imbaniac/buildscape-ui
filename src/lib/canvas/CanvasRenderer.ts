import type ViewportManager from "./ViewportManager";
import IslandRenderer from "./IslandRenderer";
import PerformanceProfiler from "./PerformanceProfiler";

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

export default class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private viewportManager: ViewportManager;
  private islandRenderer: IslandRenderer;
  private profiler: PerformanceProfiler | null = null;

  // Rendering flags - now we need to render everything in one frame
  private needsRender: boolean = true;

  // Ocean gradient cache
  private oceanGradient: CanvasGradient | null = null;
  
  // Background cache for static elements
  private backgroundCache: HTMLCanvasElement | null = null;
  private backgroundCacheValid: boolean = false;

  // Islands data
  private islands: Island[] = [];

  // Hover state
  private hoveredIsland: Island | null = null;

  // Search highlighting
  private searchResults: Set<string> = new Set();
  private currentSearchResult: string | null = null;

  // Animation - removed for performance

  constructor(canvas: HTMLCanvasElement, viewportManager: ViewportManager) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }

    this.canvas = canvas;
    this.ctx = ctx;
    this.viewportManager = viewportManager;

    // Create island renderer with callback to re-render when assets are loaded
    this.islandRenderer = new IslandRenderer(viewportManager, () => {
      this.invalidate();
    });

    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  // Set performance profiler
  setProfiler(profiler: PerformanceProfiler): void {
    this.profiler = profiler;
    // Don't instrument canvas contexts with proxy - it breaks canvas API
    // Instead, we'll count operations manually in the profiler
    this.islandRenderer.setProfiler(profiler);
  }

  // Main render loop method
  async renderFrame(): Promise<void> {
    // Always track frame timing for accurate FPS
    this.profiler?.startFrame();
    
    if (!this.needsRender) {
      this.profiler?.endFrame();
      return;
    }
    
    const startTime = performance.now();
    
    // Clear entire canvas once
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.ctx.clearRect(0, 0, width, height);
    
    // Render all layers in order
    this.profiler?.startMeasure('background');
    this.renderBackground();
    this.profiler?.endMeasure('background');
    
    this.profiler?.startMeasure('islands');
    await this.renderIslands();
    this.profiler?.endMeasure('islands');
    
    this.profiler?.startMeasure('interaction');
    await this.renderInteraction();
    this.profiler?.endMeasure('interaction');
    
    // Record total render time
    this.profiler?.recordLayerTime('total', performance.now() - startTime);
    
    this.needsRender = false;
    this.profiler?.endFrame();
  }

  // Force render all layers
  async renderAll(): Promise<void> {
    this.needsRender = true;
    await this.renderFrame();
  }

  // Mark for re-render
  invalidate(): void {
    this.needsRender = true;
  }
  
  // Legacy methods for compatibility
  invalidateBackground(): void {
    this.invalidate();
  }

  invalidateIslands(): void {
    this.invalidate();
  }

  invalidateInteraction(): void {
    this.invalidate();
  }

  // Render the background layer (ocean gradient + grid)
  private renderBackground(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create background cache if needed
    if (!this.backgroundCache || !this.backgroundCacheValid) {
      this.createBackgroundCache();
    }

    // Just draw the cached background
    if (this.backgroundCache) {
      this.ctx.drawImage(this.backgroundCache, 0, 0);
      this.profiler?.countOperation('drawImage');
    }

    // Only draw dynamic "EVM SEA" label (position changes with viewport)
    this.drawOceanLabel();
  }

  // Create cached background with static elements
  private createBackgroundCache(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create cache canvas if not exists
    if (!this.backgroundCache) {
      this.backgroundCache = document.createElement('canvas');
    }
    
    // Resize cache canvas to match main canvas
    this.backgroundCache.width = width;
    this.backgroundCache.height = height;
    
    const cacheCtx = this.backgroundCache.getContext('2d');
    if (!cacheCtx) return;

    // Draw static elements to cache
    // Draw ocean gradient
    this.drawOceanGradientToContext(cacheCtx, width, height);

    // Draw isometric grid (currently removed for performance)
    // this.drawIsometricGridToContext(cacheCtx);

    this.backgroundCacheValid = true;
  }

  // Invalidate background cache when canvas size changes
  invalidateBackgroundCache(): void {
    this.backgroundCacheValid = false;
  }

  // Draw ocean gradient background (legacy method - now uses cache)
  private drawOceanGradient(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.drawOceanGradientToContext(this.ctx, width, height);
  }

  // Draw ocean gradient to any context
  private drawOceanGradientToContext(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Create gradient
    const gradient = ctx.createRadialGradient(
      width / 2,
      -height * 0.2,
      0,
      width / 2,
      height * 0.8,
      Math.max(width, height) * 1.2,
    );

    // Lighter ocean colors
    gradient.addColorStop(0, "#4da3c9");
    gradient.addColorStop(0.2, "#4599bf");
    gradient.addColorStop(0.4, "#3d8fb5");
    gradient.addColorStop(0.6, "#3585ab");
    gradient.addColorStop(0.8, "#2d7ba1");
    gradient.addColorStop(1, "#267398");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Manually track operations for profiler
    this.profiler?.countOperation('fillRect');
  }

  // Draw static water pattern (no animation)
  private drawIsometricGrid(): void {
    // Removed for performance - background is now just the gradient
  }

  // Draw "EVM SEA" ocean label at world position
  private drawOceanLabel(): void {
    const labelWorldPos = { x: 0, y: 2500 };
    const screenPos = this.viewportManager.worldToScreen(
      labelWorldPos.x,
      labelWorldPos.y,
    );
    const scale = this.viewportManager.getScale();

    // Only draw if in viewport
    if (
      !this.viewportManager.isInViewport(labelWorldPos.x, labelWorldPos.y, 1000)
    ) {
      return;
    }

    this.ctx.save();

    // Set up text properties
    const fontSize = 450 * scale;
    this.ctx.font = `700 ${fontSize}px 'Lato', 'Inter', 'Helvetica Neue', sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Apply isometric transform
    this.ctx.translate(screenPos.x, screenPos.y);
    this.ctx.scale(1, 0.866); // Isometric Y scale

    // Draw white outline
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 4 * scale;
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeText("EVM SEA", 0, 0);
    this.profiler?.countOperation('stroke');

    // Draw main text
    this.ctx.fillStyle = "#1e6084";
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillText("EVM SEA", 0, 0);
    this.profiler?.countOperation('fillText');

    this.ctx.restore();
  }

  // Render the islands layer
  private async renderIslands(): Promise<void> {
    // Only render if island renderer is ready
    if (!this.islandRenderer.isReady()) {
      return;
    }

    // Render all islands
    await this.islandRenderer.renderIslands(this.ctx, this.islands);
    
    // Visibility metrics are now tracked in IslandRenderer
  }

  // Set islands data
  setIslands(islands: Island[]): void {
    this.islands = islands;
    this.invalidateIslands();
  }

  // Render the interaction layer
  private async renderInteraction(): Promise<void> {
    // No need to clear - already cleared in renderFrame
    
    // Render search highlights first (underneath hover)
    await this.renderSearchHighlights();

    // Render hover effect if an island is hovered
    if (this.hoveredIsland) {
      await this.renderHoverEffect(this.hoveredIsland);
    }
  }

  // Render hover effect for an island
  private async renderHoverEffect(island: Island): Promise<void> {
    // Render the island with brightness effect
    await this.islandRenderer.renderIslandWithBrightness(
      this.ctx,
      island,
      1.15, // Same brightness as SVG hover
    );
  }

  // Set hovered island
  setHoveredIsland(island: Island | null): void {
    if (this.hoveredIsland !== island) {
      this.hoveredIsland = island;
      this.invalidateInteraction();
    }
  }

  // Render search highlights
  private async renderSearchHighlights(): Promise<void> {
    for (const island of this.islands) {
      const isSearchMatch = this.searchResults.has(island.slug);
      const isCurrentResult = this.currentSearchResult === island.slug;

      if (isSearchMatch || isCurrentResult) {
        await this.renderSearchHighlight(island, isCurrentResult);
      }
    }
  }

  // Render search highlight for a single island
  private async renderSearchHighlight(
    island: Island,
    isCurrent: boolean,
  ): Promise<void> {
    // Simply render the island with increased brightness - no glow/shadow
    await this.islandRenderer.renderIslandWithBrightness(
      this.ctx,
      island,
      isCurrent ? 1.25 : 1.15,
    );
  }

  // Set search results
  setSearchResults(results: string[]): void {
    this.searchResults = new Set(results);
    this.invalidateInteraction();
  }

  // Set current search result
  setCurrentSearchResult(slug: string | null): void {
    if (this.currentSearchResult !== slug) {
      this.currentSearchResult = slug;
      this.invalidateInteraction();
    }
  }

  // Called when viewport changes (pan/zoom)
  onViewportChange(): void {
    // Background needs re-render for EVM SEA label position
    this.invalidateBackground();
    // Islands need re-render for new positions
    this.invalidateIslands();
    // Interaction might need update too
    this.invalidateInteraction();
  }
}
