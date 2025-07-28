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
      this.renderInteraction();
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
        width / 2, 0, 0,
        width / 2, height / 2, Math.max(width, height)
      );
      
      this.oceanGradient.addColorStop(0, "#87ceeb");
      this.oceanGradient.addColorStop(0.3, "#6bb6d8");
      this.oceanGradient.addColorStop(0.6, "#5ca9ce");
      this.oceanGradient.addColorStop(1, "#4d9bc3");
    }
    
    this.backgroundCtx.fillStyle = this.oceanGradient;
    this.backgroundCtx.fillRect(0, 0, width, height);
  }
  
  // Draw isometric grid pattern
  private drawIsometricGrid(): void {
    const bounds = this.viewportManager.getViewBounds();
    const scale = this.viewportManager.getScale();
    
    // Grid dimensions
    const gridWidth = 500;
    const gridHeight = 289;
    
    // Calculate grid start position (aligned to grid)
    const startX = Math.floor(bounds.left / gridWidth) * gridWidth;
    const startY = Math.floor(bounds.top / gridHeight) * gridHeight;
    const endX = Math.ceil(bounds.right / gridWidth) * gridWidth;
    const endY = Math.ceil(bounds.bottom / gridHeight) * gridHeight;
    
    this.backgroundCtx.save();
    
    // Set grid style
    this.backgroundCtx.strokeStyle = "#7fc3e6";
    this.backgroundCtx.lineWidth = 1 / scale;
    this.backgroundCtx.globalAlpha = 0.15;
    
    // Draw grid cells
    for (let y = startY; y <= endY; y += gridHeight) {
      for (let x = startX; x <= endX; x += gridWidth) {
        const screenPos = this.viewportManager.worldToScreen(x, y);
        const screenWidth = gridWidth * scale;
        const screenHeight = gridHeight * scale;
        
        this.backgroundCtx.beginPath();
        // Draw diamond shape
        this.backgroundCtx.moveTo(screenPos.x + screenWidth / 2, screenPos.y);
        this.backgroundCtx.lineTo(screenPos.x + screenWidth, screenPos.y + screenHeight / 2);
        this.backgroundCtx.lineTo(screenPos.x + screenWidth / 2, screenPos.y + screenHeight);
        this.backgroundCtx.lineTo(screenPos.x, screenPos.y + screenHeight / 2);
        this.backgroundCtx.closePath();
        this.backgroundCtx.stroke();
      }
    }
    
    this.backgroundCtx.restore();
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
    this.backgroundCtx.fillStyle = "#3a7fa3";
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
  private renderInteraction(): void {
    const canvas = this.interactionCtx.canvas;
    
    // Clear canvas
    this.interactionCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    // TODO: In Milestone 3, we'll render hover effects and highlights here
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