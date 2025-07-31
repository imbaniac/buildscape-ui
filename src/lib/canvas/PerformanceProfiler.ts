interface TimingMetrics {
  name: string;
  duration: number;
  timestamp: number;
  extraData?: Record<string, any>;
}

interface PerformanceStats {
  fps: number;
  frameTime: number;
  renderTime: number;
  drawCalls: number;
  visibleIslands: number;
  totalIslands: number;
  canvasOperations: {
    fillRect: number;
    drawImage: number;
    fillText: number;
    stroke: number;
    fill: number;
  };
  layerMetrics: {
    background: number;
    islands: number;
    interaction: number;
    total?: number;
  };
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export default class PerformanceProfiler {
  private metrics: Map<string, TimingMetrics[]> = new Map();
  private frameStartTime: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  
  // Canvas operation counters
  private drawCalls: number = 0;
  private canvasOps = {
    fillRect: 0,
    drawImage: 0,
    fillText: 0,
    stroke: 0,
    fill: 0,
  };
  
  // Visibility metrics
  private visibleIslands: number = 0;
  private totalIslands: number = 0;
  
  // Layer timing
  private layerMetrics = {
    background: 0,
    islands: 0,
    interaction: 0,
    total: 0,
  };
  
  // Performance marks for detailed profiling
  private readonly MARK_PREFIX = "buildscape-";
  
  constructor() {
    // Initialize performance observer if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name.startsWith(this.MARK_PREFIX)) {
              this.recordObservedMetric(entry);
            }
          }
        });
        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported:', e);
      }
    }
  }
  
  startFrame(): void {
    this.frameStartTime = performance.now();
    this.resetFrameCounters();
  }
  
  endFrame(): void {
    const now = performance.now();
    const frameTime = now - this.frameStartTime;
    
    // Update FPS
    this.frameCount++;
    if (now - this.lastFpsUpdate > 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
    
    this.lastFrameTime = frameTime;
  }
  
  startMeasure(name: string): void {
    performance.mark(`${this.MARK_PREFIX}${name}-start`);
  }
  
  endMeasure(name: string, extraData?: Record<string, any>): void {
    const endMark = `${this.MARK_PREFIX}${name}-end`;
    const startMark = `${this.MARK_PREFIX}${name}-start`;
    
    performance.mark(endMark);
    
    try {
      performance.measure(
        `${this.MARK_PREFIX}${name}`,
        startMark,
        endMark
      );
      
      const measure = performance.getEntriesByName(`${this.MARK_PREFIX}${name}`).pop();
      if (measure) {
        this.recordMetric(name, measure.duration, extraData);
      }
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e);
    }
    
    // Clean up marks
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
  }
  
  // Count canvas operations manually (proxy approach breaks canvas API)
  countOperation(operation: 'fillRect' | 'drawImage' | 'fillText' | 'stroke' | 'fill'): void {
    switch (operation) {
      case 'fillRect':
        this.canvasOps.fillRect++;
        this.drawCalls++;
        break;
      case 'drawImage':
        this.canvasOps.drawImage++;
        this.drawCalls++;
        break;
      case 'fillText':
        this.canvasOps.fillText++;
        this.drawCalls++;
        break;
      case 'stroke':
        this.canvasOps.stroke++;
        this.drawCalls++;
        break;
      case 'fill':
        this.canvasOps.fill++;
        this.drawCalls++;
        break;
    }
  }
  
  recordLayerTime(layer: 'background' | 'islands' | 'interaction' | 'total', time: number): void {
    this.layerMetrics[layer] = time;
  }
  
  setVisibilityMetrics(visible: number, total: number): void {
    this.visibleIslands = visible;
    this.totalIslands = total;
  }
  
  private recordMetric(name: string, duration: number, extraData?: Record<string, any>): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metrics = this.metrics.get(name)!;
    metrics.push({
      name,
      duration,
      timestamp: performance.now(),
      extraData
    });
    
    // Keep only last 100 measurements per metric
    if (metrics.length > 100) {
      metrics.shift();
    }
  }
  
  private recordObservedMetric(entry: PerformanceEntry): void {
    const name = entry.name.replace(this.MARK_PREFIX, '');
    this.recordMetric(name, entry.duration);
  }
  
  private resetFrameCounters(): void {
    this.drawCalls = 0;
    this.canvasOps = {
      fillRect: 0,
      drawImage: 0,
      fillText: 0,
      stroke: 0,
      fill: 0,
    };
  }
  
  getStats(): PerformanceStats {
    const stats: PerformanceStats = {
      fps: this.fps,
      frameTime: this.lastFrameTime,
      renderTime: this.layerMetrics.total || (this.layerMetrics.background + this.layerMetrics.islands + this.layerMetrics.interaction),
      drawCalls: this.drawCalls,
      visibleIslands: this.visibleIslands,
      totalIslands: this.totalIslands,
      canvasOperations: { ...this.canvasOps },
      layerMetrics: { ...this.layerMetrics }
    };
    
    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      stats.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    
    return stats;
  }
  
  getAverageMetrics(): Map<string, { average: number; min: number; max: number; count: number }> {
    const averages = new Map();
    
    for (const [name, metrics] of this.metrics) {
      if (metrics.length === 0) continue;
      
      const durations = metrics.map(m => m.duration);
      const sum = durations.reduce((a, b) => a + b, 0);
      const average = sum / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      averages.set(name, {
        average,
        min,
        max,
        count: metrics.length
      });
    }
    
    return averages;
  }
  
  logReport(): void {
    const stats = this.getStats();
    const averages = this.getAverageMetrics();
    
    console.group('🎮 Canvas Performance Report');
    
    console.group('Frame Metrics');
    console.log(`FPS: ${stats.fps}`);
    console.log(`Frame Time: ${stats.frameTime.toFixed(2)}ms`);
    console.log(`Render Time: ${stats.renderTime.toFixed(2)}ms`);
    console.groupEnd();
    
    console.group('Visibility');
    console.log(`Visible Islands: ${stats.visibleIslands}/${stats.totalIslands}`);
    console.log(`Culling Rate: ${((1 - stats.visibleIslands / stats.totalIslands) * 100).toFixed(1)}%`);
    console.groupEnd();
    
    console.group('Canvas Operations');
    console.log(`Total Draw Calls: ${stats.drawCalls}`);
    console.log('Operation Breakdown:', stats.canvasOperations);
    console.groupEnd();
    
    console.group('Layer Performance');
    console.log(`Background: ${stats.layerMetrics.background.toFixed(2)}ms`);
    console.log(`Islands: ${stats.layerMetrics.islands.toFixed(2)}ms`);
    console.log(`Interaction: ${stats.layerMetrics.interaction.toFixed(2)}ms`);
    console.groupEnd();
    
    if (stats.memoryUsage) {
      console.group('Memory Usage');
      const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);
      console.log(`Used: ${mb(stats.memoryUsage.usedJSHeapSize)}MB`);
      console.log(`Total: ${mb(stats.memoryUsage.totalJSHeapSize)}MB`);
      console.log(`Limit: ${mb(stats.memoryUsage.jsHeapSizeLimit)}MB`);
      console.groupEnd();
    }
    
    if (averages.size > 0) {
      console.group('Timing Averages');
      for (const [name, data] of averages) {
        console.log(`${name}: avg=${data.average.toFixed(2)}ms, min=${data.min.toFixed(2)}ms, max=${data.max.toFixed(2)}ms (${data.count} samples)`);
      }
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  // Export data for external analysis
  exportData(): {
    stats: PerformanceStats;
    metrics: Record<string, TimingMetrics[]>;
    averages: Record<string, any>;
  } {
    const metricsObj: Record<string, TimingMetrics[]> = {};
    for (const [key, value] of this.metrics) {
      metricsObj[key] = value;
    }
    
    const averagesObj: Record<string, any> = {};
    for (const [key, value] of this.getAverageMetrics()) {
      averagesObj[key] = value;
    }
    
    return {
      stats: this.getStats(),
      metrics: metricsObj,
      averages: averagesObj
    };
  }
}