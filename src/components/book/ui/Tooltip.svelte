<script lang="ts">
  interface Props {
    text: string;
    children?: import('svelte').Snippet;
  }

  let { text, children }: Props = $props();
</script>

<span class="tooltip-wrapper">
  {#if children}
    {@render children()}
  {/if}
  <span class="tooltip">{text}</span>
</span>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: help;
  }

  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.25rem);
    background: #1e293b;
    color: white;
    padding: 0.375rem 0.625rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s,
      transform 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1e293b;
  }

  .tooltip-wrapper:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-0.5rem);
  }
</style>