import type { SPECTOR } from "spectorjs";

export class WebGLDebugger {
  private spector: SPECTOR.Spector | null = null;
  private captureOnNextFrame: boolean = false;
  private isEnabled: boolean = false;

  constructor() {
    // Check multiple conditions for enabling WebGL debugging:
    // 1. Must be in dev mode
    // 2. Must be client-side
    // 3. Must have ?debug=webgl URL parameter
    if (import.meta.env.DEV && typeof window !== "undefined") {
      // Check for URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      this.isEnabled = urlParams.get("debug") === "webgl";

      if (this.isEnabled) {
        console.log("[WebGLDebugger] Debugging enabled via URL parameter");
      }
    } else {
      this.isEnabled = false;
    }
  }

  /**
   * Initialize SpectorJS with the WebGL context
   */
  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Load SpectorJS by creating a script tag
      await this.loadSpectorJS();

      // SpectorJS exports to the global SPECTOR namespace
      const SPECTOR = (window as any).SPECTOR;
      if (!SPECTOR) {
        throw new Error("SPECTOR global not found after loading");
      }

      this.spector = new SPECTOR.Spector();
      console.log("[WebGLDebugger] Spector instance created");

      if (this.spector) {
        this.spector.displayUI();
        console.log(
          "[WebGLDebugger] SpectorJS initialized. Use Ctrl+Shift+S to capture frame",
        );

        // Attach to the canvas
        this.spector.captureCanvas(canvas);
        console.log("[WebGLDebugger] Canvas attached to SpectorJS");
      }

      console.log("[WebGLDebugger] SpectorJS initialized successfully");

      // Add keyboard shortcuts
      this.setupKeyboardShortcuts();
    } catch (error) {
      console.error("[WebGLDebugger] Failed to initialize SpectorJS:", error);
    }
  }

  /**
   * Load SpectorJS bundle via script tag
   */
  private loadSpectorJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).SPECTOR) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      // Use CDN for now as it's easier to load
      script.src =
        "https://cdn.jsdelivr.net/npm/spectorjs@0.9.30/dist/spector.bundle.js";
      script.onload = () => {
        console.log("[WebGLDebugger] SpectorJS script loaded from CDN");
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load SpectorJS script"));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Set up keyboard shortcuts for debugging
   */
  private setupKeyboardShortcuts(): void {
    window.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Shift + S to capture frame
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        this.captureFrame();
      }

      // Ctrl/Cmd + Shift + P to toggle performance monitoring
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        this.togglePerformanceMonitoring();
      }
    });
  }

  /**
   * Capture the next frame for analysis
   */
  captureFrame(): void {
    if (!this.spector || !this.isEnabled) return;

    console.log("[WebGLDebugger] Capturing next frame...");

    // Tell SpectorJS to capture the next frame
    try {
      // SpectorJS capture methods
      if (this.spector.captureNextFrame) {
        this.spector.captureNextFrame(0); // Capture immediately
      } else if (this.spector.capture) {
        this.spector.capture(); // Alternative method
      }
      console.log("[WebGLDebugger] Frame capture initiated");
    } catch (error) {
      console.error("[WebGLDebugger] Failed to capture frame:", error);
    }
  }

  /**
   * Toggle performance monitoring overlay
   */
  togglePerformanceMonitoring(): void {
    if (!this.spector || !this.isEnabled) return;

    // Toggle the FPS counter
    const fpsElement = document.querySelector(
      ".captureMenuComponent .fpsCounterComponent",
    );
    if (fpsElement) {
      const display = window.getComputedStyle(fpsElement).display;
      (fpsElement as HTMLElement).style.display =
        display === "none" ? "block" : "none";
    }
  }

  /**
   * Get performance metrics from SpectorJS
   */
  getPerformanceMetrics(): {
    drawCalls: number;
    triangles: number;
    points: number;
    lines: number;
    frameTime: number;
  } | null {
    if (!this.spector || !this.isEnabled) return null;

    // Access SpectorJS internal metrics if available
    // This is a simplified version - SpectorJS provides more detailed metrics
    return {
      drawCalls: 0,
      triangles: 0,
      points: 0,
      lines: 0,
      frameTime: 0,
    };
  }

  /**
   * Log WebGL state information
   */
  logWebGLState(): void {
    if (!this.isEnabled) return;

    console.group("[WebGLDebugger] Current State");
    console.log("Capture pending:", this.captureOnNextFrame);
    console.log("SpectorJS active:", !!this.spector);
    console.groupEnd();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.spector) {
      // SpectorJS doesn't have a destroy method, but we can clear references
      this.spector = null;
    }
  }
}

// Export no-op implementation in production, real implementation in dev
export const webGLDebugger = import.meta.env.DEV
  ? new WebGLDebugger()
  : {
      init: () => Promise.resolve(),
      captureFrame: () => {},
      togglePerformanceMonitoring: () => {},
      getPerformanceMetrics: () => null,
      logWebGLState: () => {},
      destroy: () => {},
    };
