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
  
  // Animation
  private animationFrameId: number | null = null;
  private lastAnimationTime: number = 0;
  
  constructor(
    backgroundCanvas: HTMLCanvasElement,
    islandsCanvas: HTMLCanvasElement,
    interactionCanvas: HTMLCanvasElement,
    viewportManager: ViewportManager
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
    [this.backgroundCtx, this.islandsCtx, this.interactionCtx].forEach(ctx => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    });
    
    // Start water animation
    this.startWaterAnimation();
  }
  
  // Start the water animation loop
  private startWaterAnimation(): void {
    const animate = (currentTime: number) => {
      // Update background every 50ms for smooth water animation
      if (currentTime - this.lastAnimationTime > 50) {
        this.needsBackgroundRender = true;
        this.lastAnimationTime = currentTime;
      }
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  // Stop the water animation
  public stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
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
        width / 2, -height * 0.2, 0,
        width / 2, height * 0.8, Math.max(width, height) * 1.2
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
  
  // Draw water wave patterns
  private drawIsometricGrid(): void {
    const bounds = this.viewportManager.getViewBounds();
    const scale = this.viewportManager.getScale();
    
    // Wave parameters
    const waveSpacing = 300;
    const time = Date.now() * 0.0001;
    
    // Calculate wave start position
    const startY = Math.floor(bounds.top / waveSpacing) * waveSpacing;
    const endY = Math.ceil(bounds.bottom / waveSpacing) * waveSpacing;
    
    this.backgroundCtx.save();
    
    // Draw multiple wave layers for depth
    for (let layer = 0; layer < 3; layer++) {
      const layerOffset = layer * 100;
      const opacity = 0.08 - layer * 0.02;
      
      // Set wave style with lighter ocean foam colors
      this.backgroundCtx.strokeStyle = layer === 0 ? "#5ca9ce" : "#54a3c8";
      this.backgroundCtx.lineWidth = (2 - layer * 0.5) / scale;
      this.backgroundCtx.globalAlpha = opacity;
      
      // Draw horizontal waves
      for (let y = startY; y <= endY; y += waveSpacing) {
        this.backgroundCtx.beginPath();
        
        for (let x = bounds.left - 200; x <= bounds.right + 200; x += 20) {
          const screenPos = this.viewportManager.worldToScreen(x, y + layerOffset);
          
          // Create wave pattern with sine waves
          const waveHeight = Math.sin((x * 0.01) + time + layer) * 30;
          const waveHeight2 = Math.sin((x * 0.02) - time * 1.5 + layer * 2) * 15;
          const totalHeight = waveHeight + waveHeight2;
          
          if (x === bounds.left - 200) {
            this.backgroundCtx.moveTo(screenPos.x, screenPos.y + totalHeight * scale);
          } else {
            this.backgroundCtx.lineTo(screenPos.x, screenPos.y + totalHeight * scale);
          }
        }
        
        this.backgroundCtx.stroke();
      }
    }
    
    // Add subtle ripple effects
    this.drawRipples(bounds, scale);
    
    this.backgroundCtx.restore();
  }
  
  // Draw subtle ripple effects
  private drawRipples(bounds: any, scale: number): void {
    const time = Date.now() * 0.001;
    
    // Create a few random ripples
    for (let i = 0; i < 5; i++) {
      const rippleX = bounds.left + (bounds.right - bounds.left) * ((i * 0.23 + 0.1) % 1);
      const rippleY = bounds.top + (bounds.bottom - bounds.top) * ((i * 0.37 + 0.2) % 1);
      
      const screenPos = this.viewportManager.worldToScreen(rippleX, rippleY);
      
      // Draw expanding circles
      for (let ring = 0; ring < 3; ring++) {
        const radius = ((time + i * 2 + ring) % 10) * 50 * scale;
        const opacity = Math.max(0, 0.05 - (radius / (500 * scale)) * 0.05);
        
        this.backgroundCtx.strokeStyle = "#6bb6d8";
        this.backgroundCtx.lineWidth = 1.5 / scale;
        this.backgroundCtx.globalAlpha = opacity;
        
        this.backgroundCtx.beginPath();
        this.backgroundCtx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.backgroundCtx.stroke();
      }
    }
  }
  
  // Draw "EVM SEA" ocean label
  private drawOceanLabel(): void {
    const labelWorldPos = { x: 0, y: 2500 };
    const screenPos = this.viewportManager.worldToScreen(labelWorldPos.x, labelWorldPos.y);
    const scale = this.viewportManager.getScale();
    
    // Only draw if in viewport
    if (!this.viewportManager.isInViewport(labelWorldPos.x, labelWorldPos.y, 1000)) {
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
      1.15 // Same brightness as SVG hover
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
  private async renderSearchHighlight(island: Island, isCurrent: boolean): Promise<void> {
    // Simply render the island with increased brightness - no glow/shadow
    await this.islandRenderer.renderIslandWithBrightness(
      this.interactionCtx,
      island,
      isCurrent ? 1.25 : 1.15
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
    // Background needs re-render for grid alignment
    this.invalidateBackground();
    // Islands need re-render for new positions
    this.invalidateIslands();
    // Interaction might need update too
    this.invalidateInteraction();
  }
}