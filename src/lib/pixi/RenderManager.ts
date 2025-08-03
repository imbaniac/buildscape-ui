import type { Application } from "pixi.js";

/**
 * Manages render-on-demand for Pixi applications to reduce CPU/GPU usage
 * Only renders when something has changed (dirty flag system)
 */
export default class RenderManager {
  private app: Application;
  private isDirty: boolean = true;
  private isAnimating: boolean = false;

  // Performance tracking
  private totalRenderCount: number = 0;
  private lastRenderTimestamp: number = 0;

  constructor(app: Application, debugMode: boolean = false) {
    this.app = app;
  }

  /**
   * Mark the scene as dirty, requiring a render on next frame
   */
  markDirty(): void {
    this.isDirty = true;
  }

  /**
   * Set animation state (for smooth animations like viewport deceleration)
   */
  setAnimating(animating: boolean): void {
    this.isAnimating = animating;
    if (animating) {
      this.isDirty = true;
    }
  }

  /**
   * Check if a render is needed
   */
  shouldRender(): boolean {
    return this.isDirty || this.isAnimating;
  }

  /**
   * Perform render if needed and clear dirty flag
   */
  render(): void {
    if (this.shouldRender()) {
      this.app.renderer.render(this.app.stage);
      this.isDirty = false;

      this.totalRenderCount++;
      this.lastRenderTimestamp = Date.now();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): { fps: number; renderCount: number; isAnimating: boolean } {
    // Use PIXI's ticker FPS which shows actual performance capability
    const tickerFPS = this.app.ticker.FPS;

    // Check if we've rendered recently (within last 100ms)
    const timeSinceLastRender = Date.now() - this.lastRenderTimestamp;
    const isActivelyRendering = timeSinceLastRender < 100;

    // Show ticker FPS when actively rendering, 0 when truly idle
    // This gives accurate performance metrics during interaction
    const displayFPS = isActivelyRendering || this.isAnimating ? tickerFPS : 0;

    return {
      fps: displayFPS,
      renderCount: this.totalRenderCount,
      isAnimating: this.isAnimating,
    };
  }

  /**
   * Setup the render loop with conditional rendering
   */
  setupRenderLoop(): void {
    // Keep ticker running continuously for smooth performance
    // The shouldRender() check ensures we only render when needed

    // Add render callback
    this.app.ticker.add(() => {
      this.render();
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // No cleanup needed currently
  }
}
