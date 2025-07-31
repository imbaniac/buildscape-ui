<script lang="ts">
  import { onMount } from 'svelte';
  import type PerformanceProfiler from '$lib/canvas/PerformanceProfiler';
  
  interface Props {
    profiler?: PerformanceProfiler;
    expanded?: boolean;
  }
  
  let { profiler, expanded = false }: Props = $props();
  
  let stats = $state({
    fps: 0,
    frameTime: 0,
    renderTime: 0,
    drawCalls: 0,
    visibleIslands: 0,
    totalIslands: 0,
    canvasOperations: {
      fillRect: 0,
      drawImage: 0,
      fillText: 0,
      stroke: 0,
      fill: 0,
    },
    layerMetrics: {
      background: 0,
      islands: 0,
      interaction: 0,
    },
    memoryUsage: null as { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number; } | null
  });
  
  let showExpanded = $state(expanded);
  let updateInterval: ReturnType<typeof setInterval>;
  
  onMount(() => {
    const updateStats = () => {
      if (profiler) {
        const newStats = profiler.getStats();
        stats = {
          ...newStats,
          memoryUsage: newStats.memoryUsage || null
        };
      }
    };
    
    // Update stats every 100ms
    updateInterval = setInterval(updateStats, 100);
    
    return () => {
      clearInterval(updateInterval);
    };
  });
  
  function formatMemory(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(1) + 'MB';
  }
  
  function toggleExpanded() {
    showExpanded = !showExpanded;
  }
  
  function exportPerformanceData() {
    if (!profiler) return;
    
    const data = profiler.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function logReport() {
    if (profiler) {
      profiler.logReport();
    }
  }
</script>

{#if import.meta.env.DEV && profiler}
  <div class="performance-monitor" class:expanded={showExpanded}>
    <button class="header" onclick={toggleExpanded} type="button">
      <span class="fps" class:good={stats.fps >= 55} class:warning={stats.fps >= 30 && stats.fps < 55} class:bad={stats.fps < 30}>
        {stats.fps} FPS
      </span>
      <span class="frame-time">({stats.frameTime.toFixed(1)}ms)</span>
      <span class="toggle">
        {showExpanded ? '▼' : '▶'}
      </span>
    </button>
    
    {#if showExpanded}
      <div class="details">
        <div class="section">
          <h4>Rendering</h4>
          <div class="metric">
            <span>Render Time:</span>
            <span>{stats.renderTime.toFixed(2)}ms</span>
          </div>
          <div class="metric">
            <span>Draw Calls:</span>
            <span>{stats.drawCalls}</span>
          </div>
        </div>
        
        <div class="section">
          <h4>Visibility</h4>
          <div class="metric">
            <span>Islands:</span>
            <span>{stats.visibleIslands}/{stats.totalIslands}</span>
          </div>
          <div class="metric">
            <span>Culling:</span>
            <span>{((1 - stats.visibleIslands / Math.max(1, stats.totalIslands)) * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        <div class="section">
          <h4>Layers (ms)</h4>
          <div class="metric">
            <span>Background:</span>
            <span>{stats.layerMetrics.background.toFixed(1)}</span>
          </div>
          <div class="metric">
            <span>Islands:</span>
            <span>{stats.layerMetrics.islands.toFixed(1)}</span>
          </div>
          <div class="metric">
            <span>Interaction:</span>
            <span>{stats.layerMetrics.interaction.toFixed(1)}</span>
          </div>
        </div>
        
        <div class="section">
          <h4>Canvas Ops</h4>
          <div class="metric">
            <span>fillRect:</span>
            <span>{stats.canvasOperations.fillRect}</span>
          </div>
          <div class="metric">
            <span>drawImage:</span>
            <span>{stats.canvasOperations.drawImage}</span>
          </div>
          <div class="metric">
            <span>fillText:</span>
            <span>{stats.canvasOperations.fillText}</span>
          </div>
          <div class="metric">
            <span>fill:</span>
            <span>{stats.canvasOperations.fill}</span>
          </div>
        </div>
        
        {#if stats.memoryUsage}
          <div class="section">
            <h4>Memory</h4>
            <div class="metric">
              <span>Used:</span>
              <span>{formatMemory(stats.memoryUsage.usedJSHeapSize)}</span>
            </div>
            <div class="metric">
              <span>Total:</span>
              <span>{formatMemory(stats.memoryUsage.totalJSHeapSize)}</span>
            </div>
          </div>
        {/if}
        
        <div class="actions">
          <button onclick={logReport}>Log Report</button>
          <button onclick={exportPerformanceData}>Export Data</button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .performance-monitor {
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    border-radius: 4px;
    z-index: 9999;
    user-select: none;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 120px;
  }
  
  .header {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    width: 100%;
    text-align: left;
  }
  
  .fps {
    font-weight: bold;
  }
  
  .fps.good { color: #4ade80; }
  .fps.warning { color: #fbbf24; }
  .fps.bad { color: #ef4444; }
  
  .frame-time {
    color: #9ca3af;
    font-size: 11px;
  }
  
  .toggle {
    margin-left: auto;
    color: #9ca3af;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .details {
    padding: 0 12px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .section {
    margin-top: 10px;
  }
  
  .section h4 {
    margin: 0 0 4px 0;
    color: #60a5fa;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    color: #e5e7eb;
  }
  
  .metric span:first-child {
    color: #9ca3af;
  }
  
  .metric span:last-child {
    font-weight: 500;
  }
  
  .actions {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 8px;
  }
  
  .actions button {
    flex: 1;
    padding: 4px 8px;
    background-color: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.4);
    color: #60a5fa;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s;
  }
  
  .actions button:hover {
    background-color: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.6);
  }
  
  .expanded {
    width: 280px;
  }
</style>