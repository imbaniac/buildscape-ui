<script lang="ts">
  import { marked } from "marked";

  import { browser } from "$app/environment";

  import { processGlossaryTerms } from "$lib/processGlossaryTerms";
  import { glossary } from "$lib/tooltips";

  import Tooltip from "../Tooltip.svelte";

  interface Props {
    content: string;
    class?: string;
  }

  let { content, class: className = "" }: Props = $props();

  // Process markdown and then add glossary terms
  const processedContent = $derived.by(() => {
    const html = marked.parse(content);
    return processGlossaryTerms(html as string);
  });

  // Track tooltip state
  let activeTooltip = $state<{
    term: string;
    anchor: HTMLElement;
  } | null>(null);
  let hoverTimeout: number;
  let closeTimeout: number;
  let isHoveringTooltip = $state(false);

  function handleTermMouseEnter(e: MouseEvent, term: string) {
    // The term already comes from data-term attribute which is the correct key
    if (!glossary[term] || !browser) return;

    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    clearTimeout(hoverTimeout);
    clearTimeout(closeTimeout);
    hoverTimeout = window.setTimeout(() => {
      activeTooltip = {
        term: term,
        anchor: target,
      };
    }, 300);
  }

  function handleTermMouseLeave() {
    if (!browser) return;

    clearTimeout(hoverTimeout);
    // Add a small delay before closing to allow moving to tooltip
    closeTimeout = window.setTimeout(() => {
      if (!isHoveringTooltip) {
        activeTooltip = null;
      }
    }, 100);
  }

  function handleTooltipMouseEnter() {
    if (!browser) return;

    clearTimeout(closeTimeout);
    isHoveringTooltip = true;
  }

  function handleTooltipMouseLeave() {
    if (!browser) return;

    isHoveringTooltip = false;
    // Small delay to allow moving back to term
    closeTimeout = window.setTimeout(() => {
      activeTooltip = null;
    }, 100);
  }

  // Add event listeners to glossary terms after content updates
  $effect(() => {
    // Only run in browser environment
    if (!browser) return;

    // Wait for DOM update
    setTimeout(() => {
      const terms = document.querySelectorAll(".glossary-term");
      terms.forEach((term) => {
        const termEl = term as HTMLElement;
        const termName = termEl.dataset.term;

        if (termName) {
          termEl.addEventListener("mouseenter", (e) =>
            handleTermMouseEnter(e as MouseEvent, termName),
          );
          termEl.addEventListener("mouseleave", handleTermMouseLeave);

          // Add accessibility attributes
          termEl.setAttribute("role", "button");
          termEl.setAttribute("tabindex", "0");
          termEl.setAttribute(
            "aria-label",
            `Definition of ${termEl.textContent}`,
          );
        }
      });
    }, 0);

    // Cleanup
    return () => {
      clearTimeout(hoverTimeout);
      clearTimeout(closeTimeout);
      if (!browser) return;

      const terms = document.querySelectorAll(".glossary-term");
      terms.forEach((term) => {
        const termEl = term as HTMLElement;
        termEl.removeEventListener("mouseenter", handleTermMouseEnter as any);
        termEl.removeEventListener("mouseleave", handleTermMouseLeave);
      });
    };
  });
</script>

<div class="markdown-content {className}">
  {@html processedContent}
</div>

{#if browser && activeTooltip && glossary[activeTooltip.term]}
  <Tooltip
    content={glossary[activeTooltip.term]}
    anchor={activeTooltip.anchor}
    visible={true}
    onMouseEnter={handleTooltipMouseEnter}
    onMouseLeave={handleTooltipMouseLeave}
  />
{/if}

<style>
  .markdown-content :global(.glossary-term) {
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

  .markdown-content :global(.glossary-term:hover) {
    text-decoration-color: #c4a962;
    text-shadow: 0 0 8px rgba(196, 169, 98, 0.2);
  }

  .markdown-content :global(.glossary-term:focus) {
    outline: 2px solid rgba(196, 169, 98, 0.3);
    outline-offset: 2px;
    border-radius: 2px;
  }
</style>
