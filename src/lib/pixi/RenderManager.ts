import type { Application } from "pixi.js";
import type { Viewport } from "pixi-viewport";

/**
 * Manages render-on-demand for Pixi applications to reduce CPU/GPU usage
 * Only renders when something has changed (dirty flag system)
 */
export default class RenderManager {
  private app: Application;
  private viewport: Viewport | null = null;
  private isDirty: boolean = true;
  private isAnimating: boolean = false;

  // Performance tracking
  private totalRenderCount: number = 0;
  private lastRenderTimestamp: number = 0;

  // Ticker management
  private tickerRunning: boolean = false;
  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly IDLE_DELAY = 100; // ms before stopping ticker when idle

  // Debug mode
  private debugMode: boolean = false;
  private debugInterval: ReturnType<typeof setInterval> | null = null;

  constructor(app: Application, debugMode: boolean = false) {
    this.app = app;
    this.debugMode = debugMode;

    // Only enable debug logging if explicitly requested via URL param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debug") === "render") {
      this.startDebugLogging();
    }
  }

  /**
   * Set the viewport for manual updates
   */
  setViewport(viewport: Viewport): void {
    this.viewport = viewport;
  }

  /**
   * Mark the scene as dirty, requiring a render on next frame
   */
  markDirty(): void {
    this.isDirty = true;
    this.startTicker();
  }

  /**
   * Set animation state (for smooth animations like viewport deceleration)
   */
  setAnimating(animating: boolean): void {
    this.isAnimating = animating;
    if (animating) {
      this.isDirty = true;
      this.startTicker();
    } else {
      // Schedule idle check when animation ends
      this.scheduleIdleCheck();
    }
  }

  /**
   * Check if a render is needed
   */
  shouldRender(): boolean {
    // Check if viewport is still decelerating
    const viewportMoving = this.viewport?.moving || false;
    return this.isDirty || this.isAnimating || viewportMoving;
  }

  /**
   * Perform render if needed and clear dirty flag
   */
  private renderDepth = 0; // Track recursive calls
  render(): void {
    // Detect recursive rendering
    this.renderDepth++;
    if (this.renderDepth > 1) {
      console.error(
        "[RenderManager] Recursive render detected! Depth:",
        this.renderDepth,
      );
      this.renderDepth--;
      return;
    }

    if (this.shouldRender()) {
      // Update viewport manually since we disabled its internal ticker
      if (this.viewport) {
        this.viewport.update(this.app.ticker.elapsedMS);
      }

      this.app.renderer.render(this.app.stage);
      this.isDirty = false;

      this.totalRenderCount++;
      this.lastRenderTimestamp = Date.now();
    }

    // Check if we should stop the ticker
    if (!this.shouldRender()) {
      this.scheduleIdleCheck();
    }

    this.renderDepth--;
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
   * Start the ticker if not already running
   */
  private startTicker(): void {
    // Cancel any pending idle timeout
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }

    // Start ticker if not already running
    if (!this.tickerRunning) {
      this.tickerRunning = true;
      this.app.ticker.start();
    }
  }

  /**
   * Stop the ticker to save CPU/GPU when idle
   */
  private stopTicker(): void {
    if (this.tickerRunning) {
      this.tickerRunning = false;
      this.app.ticker.stop();
    }
  }

  /**
   * Schedule a check to stop ticker if still idle
   */
  private scheduleIdleCheck(): void {
    // Don't schedule if already scheduled
    if (this.idleTimeout) {
      return;
    }

    // Schedule new check
    this.idleTimeout = setTimeout(() => {
      this.idleTimeout = null;

      // Double-check we're really idle
      if (!this.shouldRender() && this.tickerRunning) {
        console.log("[RenderManager] Stopping ticker - truly idle");
        this.stopTicker();
      }
    }, this.IDLE_DELAY);
  }

  /**
   * Handle document visibility changes
   */
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      // Tab is hidden, stop ticker to save resources
      this.stopTicker();
    } else {
      // Tab is visible again, mark dirty to refresh
      this.markDirty();
    }
  };

  /**
   * Setup the render loop with conditional rendering
   */
  setupRenderLoop(): void {
    // Create render callback
    const renderCallback = () => {
      this.render();
    };

    // Add render callback (but don't start ticker yet)
    this.app.ticker.add(renderCallback);

    // Ensure ticker is stopped initially
    this.app.ticker.stop();
    this.tickerRunning = false;

    // Listen for visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Start debug logging
   */
  private startDebugLogging(): void {
    // Log every second
    this.debugInterval = setInterval(() => {
      const metrics = this.getMetrics();
      const tickerInfo = {
        appTickerStarted: this.app.ticker.started,
        appTickerFPS: this.app.ticker.FPS,
        appTickerSpeed: this.app.ticker.speed,
        renderManagerTickerRunning: this.tickerRunning,
        isDirty: this.isDirty,
        isAnimating: this.isAnimating,
        viewportMoving: this.viewport?.moving || false,
        shouldRender: this.shouldRender(),
        renderCount: metrics.renderCount,
        timeSinceLastRender: Date.now() - this.lastRenderTimestamp,
      };

      console.log("[RenderManager Debug]", tickerInfo);

      // Check what's keeping the ticker alive
      if (this.tickerRunning && !this.shouldRender()) {
        console.warn("[RenderManager] Ticker running but nothing to render!");
      }
    }, 1000);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
      this.debugInterval = null;
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
    this.stopTicker();
  }
}
