<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Props {
    text: string;
    children?: import('svelte').Snippet;
  }

  let { text, children }: Props = $props();
  
  let isVisible = $state(false);
  let isClickedOpen = $state(false);
  let tooltipWrapper: HTMLElement;
  let portalTarget: HTMLDivElement | null = null;
  let tooltipInstance: HTMLDivElement | null = null;
  let position = $state({ x: 0, y: 0 });
  
  function updatePosition() {
    if (!tooltipWrapper) return;
    
    const rect = tooltipWrapper.getBoundingClientRect();
    const padding = 20;
    const gap = 12; // Gap between tooltip and element
    
    // Calculate initial center position
    let x = rect.left + rect.width / 2;
    let y = rect.top - gap; // Start just above the element
    
    position = { x, y };
  }
  
  function showTooltip() {
    if (!portalTarget) return;
    
    // Hide any existing tooltip first
    if (tooltipInstance) {
      hideTooltip();
    }
    
    isVisible = true;
    updatePosition();
    
    // Create a div for the tooltip content
    const tooltipDiv = document.createElement('div');
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'svelte-tooltip-portal';
    tooltipContent.style.cssText = `
      position: fixed;
      left: ${position.x}px;
      bottom: ${window.innerHeight - position.y}px;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 400;
      line-height: 1.4;
      white-space: normal;
      max-width: 280px;
      min-width: 200px;
      width: max-content;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      text-align: left;
      animation: tooltipFadeIn 0.2s ease-out;
    `;
    
    // Add text content safely
    tooltipContent.textContent = text;
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top-color: #1e293b;
      border-bottom-width: 0;
    `;
    tooltipContent.appendChild(arrow);
    tooltipDiv.appendChild(tooltipContent);
    
    // Add to portal
    portalTarget.appendChild(tooltipDiv);
    
    // Get actual dimensions and adjust if needed
    const tooltipRect = tooltipContent.getBoundingClientRect();
    const viewportPadding = 20;
    
    // Calculate the actual center based on real tooltip width
    const actualHalfWidth = tooltipRect.width / 2;
    const leftEdge = position.x - actualHalfWidth;
    const rightEdge = position.x + actualHalfWidth;
    
    if (leftEdge < viewportPadding) {
      // Tooltip overflows on left - adjust position
      const adjustment = viewportPadding - leftEdge;
      tooltipContent.style.left = `${position.x + adjustment}px`;
    } else if (rightEdge > window.innerWidth - viewportPadding) {
      // Tooltip overflows on right - adjust position
      const adjustment = rightEdge - (window.innerWidth - viewportPadding);
      tooltipContent.style.left = `${position.x - adjustment}px`;
    }
    
    // Check if tooltip would go above viewport
    if (tooltipRect.top < viewportPadding) {
      // Get wrapper rect again for positioning
      const wrapperRect = tooltipWrapper.getBoundingClientRect();
      // Show below instead
      tooltipContent.style.bottom = 'auto';
      tooltipContent.style.top = `${wrapperRect.bottom + 12}px`;
      // Flip arrow
      arrow.style.top = 'auto';
      arrow.style.bottom = '100%';
      arrow.style.borderTopColor = 'transparent';
      arrow.style.borderBottomColor = '#1e293b';
      arrow.style.borderTopWidth = '0';
      arrow.style.borderBottomWidth = '6px';
    }
    
    tooltipInstance = tooltipDiv;
  }
  
  function hideTooltip() {
    if (tooltipInstance && portalTarget && portalTarget.contains(tooltipInstance)) {
      try {
        portalTarget.removeChild(tooltipInstance);
      } catch (e) {
        // Already removed
      }
      tooltipInstance = null;
    }
    isVisible = false;
  }
  
  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (isClickedOpen) {
      isClickedOpen = false;
      hideTooltip();
    } else {
      isClickedOpen = true;
      showTooltip();
    }
  }
  
  function handleClickOutside(e: MouseEvent) {
    if (tooltipWrapper && !tooltipWrapper.contains(e.target as Node) && 
        tooltipInstance && !tooltipInstance.contains(e.target as Node)) {
      isClickedOpen = false;
      hideTooltip();
    }
  }
  
  onMount(() => {
    // Create portal target
    portalTarget = document.createElement('div');
    portalTarget.className = 'tooltip-portal-container';
    document.body.appendChild(portalTarget);
    
    // Add global styles for animation
    if (!document.getElementById('tooltip-portal-styles')) {
      const style = document.createElement('style');
      style.id = 'tooltip-portal-styles';
      style.textContent = `
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      hideTooltip();
      if (portalTarget && portalTarget.parentNode) {
        portalTarget.parentNode.removeChild(portalTarget);
      }
    };
  });
  
  // Effect for click outside handling
  $effect(() => {
    if (isClickedOpen) {
      // Small timeout to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });
  
  // Effect for position updates on scroll/resize
  $effect(() => {
    if (isVisible) {
      const handlePositionUpdate = () => {
        updatePosition();
        if (tooltipInstance) {
          const tooltipContent = tooltipInstance.firstElementChild as HTMLElement;
          if (tooltipContent) {
            // Recalculate position
            const rect = tooltipWrapper.getBoundingClientRect();
            const tooltipRect = tooltipContent.getBoundingClientRect();
            const padding = 20;
            
            // Update base position
            tooltipContent.style.left = `${position.x}px`;
            tooltipContent.style.bottom = `${window.innerHeight - position.y}px`;
            
            // Force layout
            tooltipContent.offsetWidth;
            
            // Recalculate with actual dimensions
            const newTooltipRect = tooltipContent.getBoundingClientRect();
            const actualHalfWidth = newTooltipRect.width / 2;
            const leftEdge = position.x - actualHalfWidth;
            const rightEdge = position.x + actualHalfWidth;
            
            if (leftEdge < padding) {
              const adjustment = padding - leftEdge;
              tooltipContent.style.left = `${position.x + adjustment}px`;
            } else if (rightEdge > window.innerWidth - padding) {
              const adjustment = rightEdge - (window.innerWidth - padding);
              tooltipContent.style.left = `${position.x - adjustment}px`;
            }
          }
        }
      };
      
      window.addEventListener('scroll', handlePositionUpdate, true);
      window.addEventListener('resize', handlePositionUpdate);
      
      return () => {
        window.removeEventListener('scroll', handlePositionUpdate, true);
        window.removeEventListener('resize', handlePositionUpdate);
      };
    }
  });
</script>

<span 
  class="tooltip-wrapper" 
  onclick={handleClick}
  onmouseenter={() => {
    if (!isClickedOpen) {
      showTooltip();
    }
  }}
  onmouseleave={() => {
    // Only hide on mouseleave if not clicked open
    if (!isClickedOpen && isVisible) {
      hideTooltip();
    }
  }}
  bind:this={tooltipWrapper}
>
  {#if children}
    {@render children()}
  {/if}
</span>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: help;
  }
</style>