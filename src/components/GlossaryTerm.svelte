<script lang="ts">
  import { glossary } from "$lib/tooltips";

  import Tooltip from "./Tooltip.svelte";

  interface Props {
    term: string;
    children?: any;
  }

  let { term, children }: Props = $props();

  let showTooltip = $state(false);
  let anchorElement: HTMLElement | null = $state(null);
  let hoverTimeout: number;
  let closeTimeout: number;
  let isHoveringTooltip = $state(false);

  // Try to find the glossary entry - first as-is, then lowercase with no spaces
  const termKey = term.toLowerCase().replace(/\s+/g, "");
  const content =
    glossary[term] || glossary[termKey] || glossary[term.toLowerCase()];

  function handleMouseEnter() {
    if (!content || !anchorElement) return;

    clearTimeout(closeTimeout);
    hoverTimeout = window.setTimeout(() => {
      showTooltip = true;
    }, 300);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimeout);
    // Add a small delay before closing to allow moving to tooltip
    closeTimeout = window.setTimeout(() => {
      if (!isHoveringTooltip) {
        showTooltip = false;
      }
    }, 100);
  }

  function handleTooltipMouseEnter() {
    clearTimeout(closeTimeout);
    isHoveringTooltip = true;
  }

  function handleTooltipMouseLeave() {
    isHoveringTooltip = false;
    // Small delay to allow moving back to term
    closeTimeout = window.setTimeout(() => {
      showTooltip = false;
    }, 100);
  }
</script>

{#if content}
  <span
    bind:this={anchorElement}
    class="glossary-term"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="button"
    tabindex="0"
  >
    {#if children}
      {@render children()}
    {:else}
      {term}
    {/if}
  </span>

  <Tooltip
    {content}
    anchor={anchorElement}
    visible={showTooltip}
    onMouseEnter={handleTooltipMouseEnter}
    onMouseLeave={handleTooltipMouseLeave}
  />
{:else if children}
  {@render children()}
{:else}
  {term}
{/if}

<style>
  .glossary-term {
    display: inline;
    color: inherit;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: #8b7d65;
    text-underline-offset: 2px;
    cursor: help;
    transition: all 0.2s ease;
    position: relative;
  }

  .glossary-term:hover {
    text-decoration-color: #c4a962;
    text-shadow: 0 0 8px rgba(196, 169, 98, 0.2);
  }

  .glossary-term:focus {
    outline: 2px solid rgba(196, 169, 98, 0.3);
    outline-offset: 2px;
    border-radius: 2px;
  }
</style>
