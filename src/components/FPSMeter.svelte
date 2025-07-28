<script lang="ts">
  import { onMount } from 'svelte';
  
  let fps = $state(0);
  let frameCount = 0;
  let lastTime = performance.now();
  let animationFrameId: number;
  
  onMount(() => {
    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      // Update FPS every second
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
</script>

{#if import.meta.env.DEV}
  <div class="fps-meter">
    {fps} FPS
  </div>
{/if}

<style>
  .fps-meter {
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #00ff00;
    padding: 5px 10px;
    font-family: monospace;
    font-size: 14px;
    border-radius: 3px;
    z-index: 9999;
    pointer-events: none;
    user-select: none;
  }
</style>