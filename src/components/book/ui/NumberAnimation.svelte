<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Props {
    value: number;
    duration?: number;
    format?: (value: number) => string;
    mode?: 'smooth' | 'instant';
  }

  let { value, duration = 800, format = (v) => String(v), mode = 'instant' }: Props = $props();
  
  let displayValue = $state(value);
  let animationId: number | null = null;
  let previousValue = value;
  let isFirstRender = true;
  
  function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }
  
  function animateValue(from: number, to: number) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    // Skip animation on first render or if values are the same
    if (isFirstRender || from === to || mode === 'instant') {
      displayValue = to;
      isFirstRender = false;
      return;
    }
    
    const startTime = performance.now();
    
    function updateValue(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      displayValue = from + (to - from) * easedProgress;
      
      if (progress < 1) {
        animationId = requestAnimationFrame(updateValue);
      } else {
        displayValue = to; // Ensure we end exactly at the target value
        animationId = null;
      }
    }
    
    animationId = requestAnimationFrame(updateValue);
  }
  
  $effect(() => {
    if (value !== previousValue) {
      animateValue(previousValue, value);
      previousValue = value;
    }
  });
  
  onMount(() => {
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<span class="animated-number">{format(displayValue)}</span>

<style>
  .animated-number {
    display: inline-block;
    tabular-nums: lining-nums;
  }
</style>