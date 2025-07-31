/**
 * Performance Benchmark Script
 * 
 * This script helps identify performance bottlenecks by:
 * 1. Running controlled tests with different scenarios
 * 2. Measuring frame times and identifying slow paths
 * 3. Testing viewport culling effectiveness
 * 4. Profiling island rendering at different scales
 */

import type CanvasRenderer from './CanvasRenderer';
import type ViewportManager from './ViewportManager';
import type PerformanceProfiler from './PerformanceProfiler';

interface BenchmarkScenario {
  name: string;
  description: string;
  setup: (viewport: ViewportManager) => void;
  duration: number; // ms
}

interface BenchmarkResult {
  scenario: string;
  avgFPS: number;
  minFPS: number;
  maxFPS: number;
  avgFrameTime: number;
  p95FrameTime: number;
  p99FrameTime: number;
  avgDrawCalls: number;
  cullingEfficiency: number;
  layerBreakdown: {
    background: number;
    islands: number;
    interaction: number;
  };
}

export class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];
  
  constructor(
    private renderer: CanvasRenderer,
    private viewport: ViewportManager,
    private profiler: PerformanceProfiler
  ) {}
  
  // Define benchmark scenarios
  private scenarios: BenchmarkScenario[] = [
    {
      name: 'idle-center',
      description: 'Static view at center (0,0) with default zoom',
      setup: (viewport) => viewport.navigateTo(0, 0, 0.12),
      duration: 5000
    },
    {
      name: 'idle-zoomed-in',
      description: 'Static view zoomed in on single island',
      setup: (viewport) => viewport.navigateTo(0, 0, 0.4),
      duration: 5000
    },
    {
      name: 'idle-zoomed-out',
      description: 'Static view zoomed out showing many islands',
      setup: (viewport) => viewport.navigateTo(0, 0, 0.05),
      duration: 5000
    },
    {
      name: 'pan-horizontal',
      description: 'Continuous horizontal panning',
      setup: (viewport) => {
        viewport.navigateTo(-2000, 0, 0.12);
        // Simulate panning
        let x = -2000;
        const panInterval = setInterval(() => {
          x += 20;
          viewport.navigateTo(x, 0, 0.12);
          this.renderer.onViewportChange();
          if (x > 2000) clearInterval(panInterval);
        }, 16);
      },
      duration: 5000
    },
    {
      name: 'zoom-in-out',
      description: 'Continuous zoom in and out',
      setup: (viewport) => {
        viewport.navigateTo(0, 0, 0.05);
        // Simulate zooming
        let scale = 0.05;
        let direction = 1;
        const zoomInterval = setInterval(() => {
          scale += 0.002 * direction;
          if (scale > 0.4) direction = -1;
          if (scale < 0.05) direction = 1;
          viewport.navigateTo(0, 0, scale);
          this.renderer.onViewportChange();
        }, 16);
      },
      duration: 5000
    },
    {
      name: 'dense-area',
      description: 'View of area with many overlapping islands',
      setup: (viewport) => viewport.navigateTo(500, 500, 0.15),
      duration: 5000
    }
  ];
  
  async runBenchmarks(): Promise<void> {
    console.log('🚀 Starting Performance Benchmarks...\n');
    
    for (const scenario of this.scenarios) {
      console.log(`Running scenario: ${scenario.name}`);
      console.log(`Description: ${scenario.description}`);
      
      const result = await this.runScenario(scenario);
      this.results.push(result);
      
      console.log(`✓ Completed. Avg FPS: ${result.avgFPS.toFixed(1)}\n`);
      
      // Cool down between scenarios
      await this.sleep(2000);
    }
    
    this.printReport();
  }
  
  private async runScenario(scenario: BenchmarkScenario): Promise<BenchmarkResult> {
    // Reset profiler data
    this.profiler.logReport(); // Clear previous data
    
    // Setup scenario
    scenario.setup(this.viewport);
    
    // Let it stabilize
    await this.sleep(500);
    
    // Collect metrics for specified duration
    const startTime = performance.now();
    const frameData: number[] = [];
    const drawCallData: number[] = [];
    const cullingData: number[] = [];
    const layerData: { background: number[], islands: number[], interaction: number[] } = {
      background: [],
      islands: [],
      interaction: []
    };
    
    while (performance.now() - startTime < scenario.duration) {
      await this.renderer.renderFrame();
      
      const stats = this.profiler.getStats();
      frameData.push(stats.frameTime);
      drawCallData.push(stats.drawCalls);
      
      if (stats.totalIslands > 0) {
        cullingData.push(stats.visibleIslands / stats.totalIslands);
      }
      
      layerData.background.push(stats.layerMetrics.background);
      layerData.islands.push(stats.layerMetrics.islands);
      layerData.interaction.push(stats.layerMetrics.interaction);
      
      await this.sleep(0); // Yield to browser
    }
    
    // Calculate statistics
    const fps = frameData.map(ft => ft > 0 ? 1000 / ft : 0);
    fps.sort((a, b) => a - b);
    frameData.sort((a, b) => a - b);
    
    return {
      scenario: scenario.name,
      avgFPS: this.average(fps),
      minFPS: fps[0] || 0,
      maxFPS: fps[fps.length - 1] || 0,
      avgFrameTime: this.average(frameData),
      p95FrameTime: this.percentile(frameData, 95),
      p99FrameTime: this.percentile(frameData, 99),
      avgDrawCalls: this.average(drawCallData),
      cullingEfficiency: cullingData.length > 0 ? (1 - this.average(cullingData)) : 0,
      layerBreakdown: {
        background: this.average(layerData.background),
        islands: this.average(layerData.islands),
        interaction: this.average(layerData.interaction)
      }
    };
  }
  
  private printReport(): void {
    console.log('\n📊 PERFORMANCE BENCHMARK REPORT\n');
    console.log('='.repeat(80));
    
    // Summary table
    console.log('\n📈 Frame Rate Summary:');
    console.log('Scenario'.padEnd(20) + 'Avg FPS'.padEnd(12) + 'Min FPS'.padEnd(12) + 'P95 Frame'.padEnd(12) + 'P99 Frame');
    console.log('-'.repeat(68));
    
    for (const result of this.results) {
      console.log(
        result.scenario.padEnd(20) +
        result.avgFPS.toFixed(1).padEnd(12) +
        result.minFPS.toFixed(1).padEnd(12) +
        result.p95FrameTime.toFixed(1).padEnd(12) + 'ms' +
        result.p99FrameTime.toFixed(1) + 'ms'
      );
    }
    
    // Draw calls and culling
    console.log('\n🎨 Rendering Efficiency:');
    console.log('Scenario'.padEnd(20) + 'Avg Draw Calls'.padEnd(16) + 'Culling %');
    console.log('-'.repeat(48));
    
    for (const result of this.results) {
      console.log(
        result.scenario.padEnd(20) +
        result.avgDrawCalls.toFixed(0).padEnd(16) +
        (result.cullingEfficiency * 100).toFixed(1) + '%'
      );
    }
    
    // Layer breakdown
    console.log('\n🎭 Layer Performance (ms):');
    console.log('Scenario'.padEnd(20) + 'Background'.padEnd(12) + 'Islands'.padEnd(12) + 'Interaction');
    console.log('-'.repeat(56));
    
    for (const result of this.results) {
      console.log(
        result.scenario.padEnd(20) +
        result.layerBreakdown.background.toFixed(2).padEnd(12) +
        result.layerBreakdown.islands.toFixed(2).padEnd(12) +
        result.layerBreakdown.interaction.toFixed(2)
      );
    }
    
    // Identify bottlenecks
    console.log('\n🔍 Bottleneck Analysis:');
    console.log('='.repeat(80));
    
    // Find worst performing scenarios
    const worstFPS = this.results.reduce((a, b) => a.avgFPS < b.avgFPS ? a : b);
    const worstP99 = this.results.reduce((a, b) => a.p99FrameTime > b.p99FrameTime ? a : b);
    const mostDrawCalls = this.results.reduce((a, b) => a.avgDrawCalls > b.avgDrawCalls ? a : b);
    
    console.log(`\n⚠️  Worst Average FPS: ${worstFPS.scenario} (${worstFPS.avgFPS.toFixed(1)} FPS)`);
    console.log(`⚠️  Worst P99 Frame Time: ${worstP99.scenario} (${worstP99.p99FrameTime.toFixed(1)}ms)`);
    console.log(`⚠️  Most Draw Calls: ${mostDrawCalls.scenario} (${mostDrawCalls.avgDrawCalls.toFixed(0)} calls/frame)`);
    
    // Layer-specific bottlenecks
    for (const result of this.results) {
      const total = result.layerBreakdown.background + result.layerBreakdown.islands + result.layerBreakdown.interaction;
      const islandPercent = (result.layerBreakdown.islands / total) * 100;
      
      if (islandPercent > 80) {
        console.log(`\n🏝️  Island rendering dominates in '${result.scenario}' (${islandPercent.toFixed(0)}% of frame time)`);
      }
    }
    
    // Recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('='.repeat(80));
    
    if (worstFPS.avgFPS < 30) {
      console.log('❗ Critical: Some scenarios run below 30 FPS');
    }
    
    if (mostDrawCalls.avgDrawCalls > 1000) {
      console.log('❗ High draw call count detected. Consider:');
      console.log('   - Batching similar operations');
      console.log('   - More aggressive culling');
      console.log('   - Simplifying island rendering');
    }
    
    const avgCulling = this.average(this.results.map(r => r.cullingEfficiency));
    if (avgCulling < 0.5) {
      console.log('❗ Low culling efficiency. Consider:');
      console.log('   - Optimizing viewport bounds calculation');
      console.log('   - Adding spatial indexing (quadtree)');
    }
    
    // Check for specific slow layers
    for (const result of this.results) {
      if (result.layerBreakdown.islands > 10) {
        console.log(`❗ Slow island rendering in '${result.scenario}'. Consider:`);
        console.log('   - Caching rendered islands');
        console.log('   - Level-of-detail (LOD) system');
        console.log('   - Simplifying tile rendering');
        break;
      }
    }
    
    console.log('\n' + '='.repeat(80));
  }
  
  // Export detailed data for external analysis
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results,
      profilerData: this.profiler.exportData()
    }, null, 2);
  }
  
  // Utility functions
  private average(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }
  
  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const index = Math.ceil((p / 100) * arr.length) - 1;
    return arr[Math.max(0, Math.min(index, arr.length - 1))];
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}