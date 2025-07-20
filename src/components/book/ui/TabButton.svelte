<script lang="ts">
  interface Props {
    active?: boolean;
    onclick: () => void;
    brandColor?: string;
    children?: import("svelte").Snippet;
    icon?: string;
  }

  let { active = false, onclick, brandColor = '#3b82f6', children, icon }: Props = $props();
</script>

<button 
  class="tab-button" 
  class:active 
  {onclick}
  style="--brand-color: {brandColor}"
>
  <span class="tab-content">
    {#if icon}
      <span class="tab-icon">{icon}</span>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </span>
  <span class="tab-glow"></span>
</button>

<style>
  .tab-button {
    padding: 0.625rem 1.25rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    margin-bottom: -1px;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    letter-spacing: -0.01em;
    flex: 1;
    text-align: center;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .tab-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    z-index: 1;
  }
  
  .tab-icon {
    font-size: 1.125rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .tab-glow {
    display: none;
  }

  .tab-button::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--brand-color);
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  .tab-button:hover {
    color: #334155;
    background: rgba(248, 250, 252, 0.5);
  }
  
  .tab-button:hover .tab-icon {
    opacity: 0.85;
  }

  .tab-button.active {
    color: var(--brand-color);
    font-weight: 600;
    background: transparent;
  }
  
  .tab-button.active .tab-icon {
    opacity: 1;
  }

  .tab-button.active::after {
    transform: scaleX(1);
  }
</style>
