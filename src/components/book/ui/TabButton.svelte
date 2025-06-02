<script lang="ts">
  interface Props {
    active?: boolean;
    onclick: () => void;
    children?: import('svelte').Snippet;
  }

  let { active = false, onclick, children }: Props = $props();
</script>

<button
  class="tab-button"
  class:active
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .tab-button {
    padding: 0.875rem 1rem;
    background: none;
    border: none;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    margin-bottom: -1px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
    flex: 1;
    text-align: center;
    min-width: 0;
    white-space: nowrap;
  }
  
  .tab-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  .tab-button:hover {
    color: #334155;
  }

  .tab-button.active {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .tab-button.active::after {
    transform: scaleX(1);
  }
</style>