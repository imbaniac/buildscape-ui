/**
 * Performance monitor to track what's consuming resources
 */
export class PerformanceMonitor {
  private rafCount = 0;
  private intervalCount = 0;
  private originalRAF: typeof window.requestAnimationFrame | null = null;
  private originalSetInterval: typeof window.setInterval | null = null;
  private activeIntervals = new Set<any>();
  private rafCallbacks = new Map<number, string>();

  constructor() {
    // Only initialize if in browser
    if (typeof window !== "undefined") {
      this.originalRAF = window.requestAnimationFrame.bind(window);
      this.originalSetInterval = window.setInterval.bind(window);
    }
  }

  /**
   * Start monitoring - patches global functions to track usage
   */
  start(): void {
    // Only run in browser
    if (
      typeof window === "undefined" ||
      !this.originalRAF ||
      !this.originalSetInterval
    ) {
      console.warn("[PerfMonitor] Cannot start - not in browser environment");
      return;
    }

    // Monitor requestAnimationFrame
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      this.rafCount++;
      const stack = new Error().stack || "";
      const id = this.originalRAF!((time) => {
        this.rafCount--;
        this.rafCallbacks.delete(id);
        callback(time);
      });
      this.rafCallbacks.set(id, stack);
      return id;
    };

    // Monitor setInterval
    window.setInterval = ((
      handler: TimerHandler,
      timeout?: number,
      ...args: any[]
    ) => {
      this.intervalCount++;
      const stack = new Error().stack || "";
      const id = this.originalSetInterval!(handler, timeout, ...args);
      this.activeIntervals.add(id);
      console.log(`[PerfMonitor] New interval created (ID: ${id}):`, {
        timeout,
        stack,
      });
      return id;
    }) as any;

    // Override clearInterval to track cleanup
    const originalClearInterval = window.clearInterval.bind(window);
    window.clearInterval = ((id: any): void => {
      if (id !== undefined && this.activeIntervals.has(id)) {
        this.intervalCount--;
        this.activeIntervals.delete(id);
        console.log(`[PerfMonitor] Interval cleared (ID: ${id})`);
      }
      if (id !== undefined) {
        originalClearInterval(id);
      }
    }) as any;
  }

  /**
   * Get current metrics
   */
  getMetrics(): {
    rafCount: number;
    intervalCount: number;
    activeIntervals: any[];
    rafStacks: string[];
  } {
    return {
      rafCount: this.rafCount,
      intervalCount: this.intervalCount,
      activeIntervals: Array.from(this.activeIntervals),
      rafStacks: Array.from(this.rafCallbacks.values()).slice(0, 5), // First 5 stacks
    };
  }

  /**
   * Log current state
   */
  logState(): void {
    const metrics = this.getMetrics();
    console.log("[PerfMonitor] Current state:", {
      activeRAFs: metrics.rafCount,
      activeIntervals: metrics.intervalCount,
      intervalIDs: metrics.activeIntervals,
    });

    if (metrics.rafCount > 0) {
      // Parse stack traces to find the actual source
      const sources = metrics.rafStacks.map((stack) => {
        const lines = stack.split("\n");
        // Look for the first non-PerformanceMonitor line
        const sourceLine = lines.find(
          (line) =>
            !line.includes("PerformanceMonitor") &&
            !line.includes("window.requestAnimationFrame") &&
            line.includes("at "),
        );
        return sourceLine ? sourceLine.trim() : "Unknown source";
      });
      console.log("[PerfMonitor] RAF sources:", sources);
    }
  }

  /**
   * Stop monitoring and restore original functions
   */
  stop(): void {
    if (
      typeof window !== "undefined" &&
      this.originalRAF &&
      this.originalSetInterval
    ) {
      window.requestAnimationFrame = this.originalRAF;
      window.setInterval = this.originalSetInterval;
    }
  }
}

// Global instance - only create in browser
export const perfMonitor =
  typeof window !== "undefined" ? new PerformanceMonitor() : null;
