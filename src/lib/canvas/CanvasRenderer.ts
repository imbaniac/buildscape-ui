import type ViewportManager from "./ViewportManager";
import IslandRenderer from "./IslandRenderer";

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
  private backgroundCtx: CanvasRenderingContext2D;
  private islandsCtx: CanvasRenderingContext2D;
  private interactionCtx: CanvasRenderingContext2D;

  private viewportManager: ViewportManager;
  private islandRenderer: IslandRenderer;

  // Rendering flags
  private needsBackgroundRender: boolean = true;
  private needsIslandsRender: boolean = true;
  private needsInteractionRender: boolean = false;

  // Ocean gradient cache
  private oceanGradient: CanvasGradient | null = null;

  // Islands data
  private islands: Island[] = [];

  // Hover state
  private hoveredIsland: Island | null = null;

  // Search highlighting
  private searchResults: Set<string> = new Set();
  private currentSearchResult: string | null = null;

  // Animation - removed for performance

  constructor(
    backgroundCanvas: HTMLCanvasElement,
    islandsCanvas: HTMLCanvasElement,
    interactionCanvas: HTMLCanvasElement,
    viewportManager: ViewportManager,
  ) {
    const bgCtx = backgroundCanvas.getContext("2d");
    const islandsCtx = islandsCanvas.getContext("2d");
    const interactionCtx = interactionCanvas.getContext("2d");

    if (!bgCtx || !islandsCtx || !interactionCtx) {
      throw new Error("Failed to get 2D context from canvas");
    }

    this.backgroundCtx = bgCtx;
    this.islandsCtx = islandsCtx;
    this.interactionCtx = interactionCtx;
    this.viewportManager = viewportManager;

    // Create island renderer with callback to re-render when assets are loaded
    this.islandRenderer = new IslandRenderer(viewportManager, () => {
      this.invalidateIslands();
    });

    // Enable image smoothing for better quality
    [this.backgroundCtx, this.islandsCtx, this.interactionCtx].forEach(
      (ctx) => {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      },
    );
  }

  // Main render loop method
  async renderFrame(): Promise<void> {
    // Only render layers that need updates
    if (this.needsBackgroundRender) {
      this.renderBackground();
      this.needsBackgroundRender = false;
    }

    if (this.needsIslandsRender) {
      await this.renderIslands();
      this.needsIslandsRender = false;
    }

    if (this.needsInteractionRender) {
      await this.renderInteraction();
      this.needsInteractionRender = false;
    }
  }

  // Force render all layers
  async renderAll(): Promise<void> {
    this.needsBackgroundRender = true;
    this.needsIslandsRender = true;
    this.needsInteractionRender = true;
    await this.renderFrame();
  }

  // Mark layers for re-render
  invalidateBackground(): void {
    this.needsBackgroundRender = true;
  }

  invalidateIslands(): void {
    this.needsIslandsRender = true;
  }

  invalidateInteraction(): void {
    this.needsInteractionRender = true;
  }

  // Render the background layer (ocean gradient + grid)
  private renderBackground(): void {
    const canvas = this.backgroundCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    this.backgroundCtx.clearRect(0, 0, width, height);

    // Draw ocean gradient
    this.drawOceanGradient();

    // Draw isometric grid
    this.drawIsometricGrid();

    // Draw "EVM SEA" label
    this.drawOceanLabel();
  }

  // Draw ocean gradient background
  private drawOceanGradient(): void {
    const canvas = this.backgroundCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Create gradient if not cached
    if (!this.oceanGradient) {
      this.oceanGradient = this.backgroundCtx.createRadialGradient(
        width / 2,
        -height * 0.2,
        0,
        width / 2,
        height * 0.8,
        Math.max(width, height) * 1.2,
      );

      // Lighter ocean colors
      this.oceanGradient.addColorStop(0, "#4da3c9");
      this.oceanGradient.addColorStop(0.2, "#4599bf");
      this.oceanGradient.addColorStop(0.4, "#3d8fb5");
      this.oceanGradient.addColorStop(0.6, "#3585ab");
      this.oceanGradient.addColorStop(0.8, "#2d7ba1");
      this.oceanGradient.addColorStop(1, "#267398");
    }

    this.backgroundCtx.fillStyle = this.oceanGradient;
    this.backgroundCtx.fillRect(0, 0, width, height);
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

    this.backgroundCtx.save();

    // Set up text properties
    const fontSize = 450 * scale;
    this.backgroundCtx.font = `700 ${fontSize}px 'Lato', 'Inter', 'Helvetica Neue', sans-serif`;
    this.backgroundCtx.textAlign = "center";
    this.backgroundCtx.textBaseline = "middle";

    // Apply isometric transform
    this.backgroundCtx.translate(screenPos.x, screenPos.y);
    this.backgroundCtx.scale(1, 0.866); // Isometric Y scale

    // Draw white outline
    this.backgroundCtx.strokeStyle = "#ffffff";
    this.backgroundCtx.lineWidth = 4 * scale;
    this.backgroundCtx.globalAlpha = 0.6;
    this.backgroundCtx.strokeText("EVM SEA", 0, 0);

    // Draw main text
    this.backgroundCtx.fillStyle = "#1e6084";
    this.backgroundCtx.globalAlpha = 0.7;
    this.backgroundCtx.fillText("EVM SEA", 0, 0);

    this.backgroundCtx.restore();
  }

  // Render the islands layer
  private async renderIslands(): Promise<void> {
    // Only render if island renderer is ready
    if (!this.islandRenderer.isReady()) {
      return;
    }

    // Render all islands
    await this.islandRenderer.renderIslands(this.islandsCtx, this.islands);
  }

  // Set islands data
  setIslands(islands: Island[]): void {
    this.islands = islands;
    this.invalidateIslands();
  }

  // Render the interaction layer
  private async renderInteraction(): Promise<void> {
    const canvas = this.interactionCtx.canvas;

    // Clear canvas
    this.interactionCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Render search highlights first (underneath hover)
    await this.renderSearchHighlights();

    // Render hover effect if an island is hovered
    if (this.hoveredIsland) {
      await this.renderHoverEffect(this.hoveredIsland);
    }
  }

  // Render hover effect for an island
  private async renderHoverEffect(island: Island): Promise<void> {
    // Render the island with brightness effect on the interaction layer
    await this.islandRenderer.renderIslandWithBrightness(
      this.interactionCtx,
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
      this.interactionCtx,
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
