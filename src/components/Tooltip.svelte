<script lang="ts">
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
  } from "@floating-ui/dom";

  import { browser } from "$app/environment";

  import type { TooltipContent } from "$lib/tooltips";

  interface Props {
    content: TooltipContent;
    anchor: HTMLElement | null;
    visible: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }

  let { content, anchor, visible, onMouseEnter, onMouseLeave }: Props =
    $props();

  let tooltipEl: HTMLDivElement;
  let arrowEl: HTMLDivElement;
  let cleanup: (() => void) | null = null;
  let isPositioned = $state(false);

  function updatePosition() {
    if (!anchor || !tooltipEl) return;

    computePosition(anchor, tooltipEl, {
      placement: "top",
      middleware: [
        offset(10),
        flip(),
        shift({ padding: 10 }),
        arrow({ element: arrowEl }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltipEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Handle arrow positioning
      if (middlewareData.arrow && arrowEl) {
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]];

        Object.assign(arrowEl.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [staticSide!]: "-6px",
        });

        // Update arrow class for styling
        arrowEl.className = `tooltip-arrow tooltip-arrow-${placement.split("-")[0]}`;
      }

      // Mark as positioned after first calculation
      if (!isPositioned) {
        isPositioned = true;
      }
    });
  }

  // Set up positioning when anchor or visibility changes
  $effect(() => {
    // Only run positioning in browser
    if (!browser) return;

    if (anchor && tooltipEl) {
      if (visible) {
        // Reset positioned state when becoming visible
        isPositioned = false;

        // Calculate position immediately
        updatePosition();

        // Set up auto-update for continuous updates
        cleanup = autoUpdate(anchor, tooltipEl, updatePosition);
      } else {
        // Clean up when hidden
        if (cleanup) {
          cleanup();
          cleanup = null;
        }
        isPositioned = false;
      }
    }

    return () => {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    };
  });
</script>

<!-- Only render in browser to prevent SSR issues -->
{#if browser}
  <div
    bind:this={tooltipEl}
    class="tooltip"
    class:visible={visible && isPositioned}
    role="tooltip"
    aria-hidden={!visible}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
  >
    <div class="tooltip-header">
      <div class="tooltip-icon">📜</div>
      <div class="tooltip-title">Knowledge</div>
    </div>

    <div class="tooltip-content">
      <p>{content.text}</p>
    </div>

    {#if content.link}
      <div class="tooltip-footer">
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          class="tooltip-link"
        >
          <span class="link-icon">🔗</span>
          {content.linkText || "Learn more"}
        </a>
      </div>
    {/if}

    <div bind:this={arrowEl} class="tooltip-arrow"></div>
  </div>
{/if}

<style>
  .tooltip {
    position: fixed;
    z-index: 999999;
    background: linear-gradient(to bottom, #3a4456, #2c3542);
    border: 1px solid #525e72;
    border-radius: 8px;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.5),
      0 8px 32px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    color: #f0e6d2;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    max-width: 320px;

    /* Hidden by default */
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95);
    transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out,
      visibility 0.2s;
    pointer-events: none;
  }

  .tooltip.visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    pointer-events: auto;
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 8px;
    border-bottom: 1px solid rgba(82, 94, 114, 0.5);
    background: linear-gradient(to bottom, rgba(82, 94, 114, 0.2), transparent);
  }

  .tooltip-icon {
    font-size: 16px;
    filter: sepia(0.3);
  }

  .tooltip-title {
    font-family: var(--font-display);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #9ca3b0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .tooltip-content {
    padding: 12px 14px;
    background: rgba(0, 0, 0, 0.2);
  }

  .tooltip-content p {
    margin: 0;
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .tooltip-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 10px;
    border-top: 1px solid rgba(82, 94, 114, 0.3);
    background: linear-gradient(to top, rgba(82, 94, 114, 0.15), transparent);
  }

  .tooltip-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #9ca3b0;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.2s ease;
    padding: 4px 8px;
    border-radius: 4px;
    flex: 1;
    text-decoration: none;
  }

  .tooltip-link:hover {
    color: #c4c9d4;
    background: rgba(156, 163, 176, 0.1);
    text-shadow: 0 0 8px rgba(156, 163, 176, 0.3);
    text-decoration: none;
  }

  .tooltip-link:visited {
    color: #9ca3b0;
  }

  .link-icon {
    font-size: 12px;
    filter: brightness(1.2);
  }

  .tooltip-arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #2c3542;
    border: 1px solid #525e72;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .tooltip {
      max-width: calc(100vw - 40px);
      font-size: 13px;
    }

    .tooltip-title {
      font-size: 12px;
    }
  }
</style>
