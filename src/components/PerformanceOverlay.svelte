<script lang="ts">
  interface Props {
    fps: number;
    renderCount: number;
    isAnimating: boolean;
  }

  let { fps = 0, renderCount = 0, isAnimating = false }: Props = $props();
</script>

<div class="performance-overlay">
  <div class="metric">
    <span class="label">FPS:</span>
    <span class="value" class:good={fps >= 50} class:warning={fps >= 30 && fps < 50} class:bad={fps < 30}>
      {fps.toFixed(1)}
    </span>
  </div>
  <div class="metric">
    <span class="label">Renders:</span>
    <span class="value">{renderCount}</span>
  </div>
  <div class="metric">
    <span class="label">Status:</span>
    <span class="value status" class:animating={isAnimating}>
      {isAnimating ? 'Animating' : 'Idle'}
    </span>
  </div>
</div>

<style>
  .performance-overlay {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    z-index: 1000;
  }

  .metric {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .label {
    opacity: 0.7;
  }

  .value {
    font-weight: bold;
  }

  .value.good {
    color: #4ade80;
  }

  .value.warning {
    color: #fbbf24;
  }

  .value.bad {
    color: #ef4444;
  }

  .value.status.animating {
    color: #60a5fa;
  }
</style>