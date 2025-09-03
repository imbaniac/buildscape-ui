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

  interface Props {
    gasPrice: number;
    nativeTokenPrice?: number;
    nativeCurrency?: string;
    utilization?: number;
    pressureStatus?: { text: string; color: string; class: string };
    children?: any;
  }

  let {
    gasPrice,
    nativeTokenPrice,
    nativeCurrency = "ETH",
    utilization = 0,
    pressureStatus,
    children,
  }: Props = $props();

  let showTooltip = $state(false);
  let anchorElement: HTMLElement | null = $state(null);
  let tooltipEl = $state<HTMLDivElement>();
  let arrowEl = $state<HTMLDivElement>();
  let cleanup: (() => void) | null = null;
  let isPositioned = $state(false);
  let hoverTimeout: number;
  let closeTimeout: number;
  let isHoveringTooltip = $state(false);

  // Calculate transaction costs
  const standardTransferCost = $derived(() => {
    if (!nativeTokenPrice || nativeTokenPrice <= 0) return null;
    return gasPrice * 1e-9 * 21000 * nativeTokenPrice;
  });

  const formatUSD = (cost: number | null) => {
    if (cost === null) return "---";
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
  };

  function updatePosition() {
    if (!anchorElement || !tooltipEl || !arrowEl) return;

    computePosition(anchorElement, tooltipEl, {
      placement: "top",
      middleware: [
        offset(24),
        flip(),
        shift({ padding: 10 }),
        arrow({ element: arrowEl }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltipEl!.style, {
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

        Object.assign(arrowEl!.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [staticSide!]: "-6px",
        });

        // Update arrow class for styling
        arrowEl!.className = `tooltip-arrow tooltip-arrow-${placement.split("-")[0]}`;
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

    if (anchorElement && tooltipEl) {
      if (showTooltip) {
        // Reset positioned state when becoming visible
        isPositioned = false;

        // Calculate position immediately
        updatePosition();

        // Set up auto-update for continuous updates
        cleanup = autoUpdate(anchorElement, tooltipEl, updatePosition);
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

  function handleMouseEnter() {
    if (!anchorElement || !browser) return;

    clearTimeout(closeTimeout);
    hoverTimeout = window.setTimeout(() => {
      showTooltip = true;
    }, 300);
  }

  function handleMouseLeave() {
    if (!browser) return;

    clearTimeout(hoverTimeout);
    closeTimeout = window.setTimeout(() => {
      if (!isHoveringTooltip) {
        showTooltip = false;
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
    closeTimeout = window.setTimeout(() => {
      showTooltip = false;
    }, 100);
  }

  function handleClick() {
    if (!browser) return;

    if (showTooltip) {
      showTooltip = false;
    } else {
      clearTimeout(hoverTimeout);
      showTooltip = true;
    }
  }
</script>

<div
  bind:this={anchorElement}
  class="gas-tooltip-wrapper"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
  role="button"
  tabindex="0"
>
  {#if children}
    {@render children()}
  {/if}
</div>

<!-- Custom tooltip with structured content -->
{#if browser}
  <div
    bind:this={tooltipEl}
    class="gas-tooltip"
    class:visible={showTooltip && isPositioned}
    role="tooltip"
    aria-hidden={!showTooltip}
    onmouseenter={handleTooltipMouseEnter}
    onmouseleave={handleTooltipMouseLeave}
  >
    <div class="tooltip-header">
      <div class="tooltip-icon">⛽</div>
      <div class="tooltip-title">Transaction Cost</div>
    </div>

    <div class="tooltip-content">
      <!-- Current Gas Price -->
      <div class="cost-section">
        <div class="section-header">Current Gas Price</div>
        <div class="cost-row">
          <span class="cost-label">Price:</span>
          <span class="cost-value"
            >{gasPrice < 0.01 ? gasPrice.toFixed(6) : gasPrice.toFixed(2)} gwei</span
          >
        </div>
        {#if nativeTokenPrice && nativeTokenPrice > 0}
          <div class="cost-row">
            <span class="cost-label">{nativeCurrency}:</span>
            <span class="cost-value">${nativeTokenPrice.toFixed(2)}</span>
          </div>
        {/if}
      </div>

      <!-- Standard Transfer -->
      <div class="cost-section">
        <div class="section-header">Standard Transfer</div>
        <div class="cost-row">
          <span class="cost-label">Gas Used:</span>
          <span class="cost-value">21,000 units</span>
        </div>
        {#if standardTransferCost()}
          <div class="cost-row highlight">
            <span class="cost-label">USD Cost:</span>
            <span class="cost-value primary"
              >{standardTransferCost()! < 0.0001
                ? `$${standardTransferCost()!.toFixed(8)}`
                : formatUSD(standardTransferCost())}</span
            >
          </div>
        {/if}
      </div>

      <!-- Estimated Costs -->
      {#if standardTransferCost()}
        <div class="cost-section">
          <div class="section-header">Estimated Costs</div>
          <div class="cost-row">
            <span class="cost-label">Token Swap:</span>
            <span class="cost-value"
              >~{formatUSD(standardTransferCost()! * 3)}</span
            >
            <span class="cost-multiplier">(3x)</span>
          </div>
          <div class="cost-row">
            <span class="cost-label">NFT Mint:</span>
            <span class="cost-value"
              >~{formatUSD(standardTransferCost()! * 5)}</span
            >
            <span class="cost-multiplier">(5x)</span>
          </div>
          <div class="cost-row">
            <span class="cost-label">Contract Deploy:</span>
            <span class="cost-value"
              >~{formatUSD(standardTransferCost()! * 20)}</span
            >
            <span class="cost-multiplier">(20x)</span>
          </div>
        </div>
      {:else}
        <div class="cost-section">
          <div class="no-price-message">USD prices unavailable</div>
        </div>
      {/if}

      <!-- Network Pressure -->
      {#if pressureStatus}
        <div class="network-pressure">
          <span class="pressure-icon">
            {#if pressureStatus.class === "low"}
              🟢
            {:else if pressureStatus.class === "moderate"}
              🟡
            {:else if pressureStatus.class === "high"}
              🟠
            {:else}
              🔴
            {/if}
          </span>
          <span class="pressure-text"
            >Network pressure: {pressureStatus.text} ({utilization}% capacity)</span
          >
        </div>
      {/if}
    </div>

    <div bind:this={arrowEl} class="tooltip-arrow"></div>
  </div>
{/if}

<style>
  .gas-tooltip-wrapper {
    display: block;
    width: 100%;
  }

  .gas-tooltip {
    position: fixed;
    z-index: 999999;
    background: linear-gradient(to bottom, #3a4456, #2c3542);
    border: 1px solid #525e72;
    border-radius: 8px;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    color: #f0e6d2;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    width: 300px;

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

  .gas-tooltip.visible {
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
    position: relative;
  }

  .tooltip-icon {
    font-size: 16px;
  }

  .tooltip-title {
    font-family: var(--font-display);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .tooltip-content {
    padding: 12px 14px;
    background: rgba(0, 0, 0, 0.2);
  }

  .cost-section {
    margin-bottom: 12px;
  }

  .cost-section:last-child {
    margin-bottom: 0;
  }

  .section-header {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #9ca3b0;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(156, 163, 176, 0.2);
  }

  .cost-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 4px;
    gap: 8px;
  }

  .cost-row:last-child {
    margin-bottom: 0;
  }

  .cost-row.highlight {
    background: rgba(196, 169, 98, 0.1);
    padding: 2px 4px;
    margin: 4px -4px;
    border-radius: 3px;
  }

  .cost-label {
    font-size: 13px;
    color: #c4c9d4;
  }

  .cost-value {
    font-size: 13px;
    font-weight: 500;
    color: #f0e6d2;
    text-align: right;
    flex: 1;
  }

  .cost-value.primary {
    color: #c4a962;
    font-weight: 600;
  }

  .cost-multiplier {
    font-size: 11px;
    color: #9ca3b0;
    margin-left: 4px;
  }

  .no-price-message {
    text-align: center;
    color: #9ca3b0;
    font-style: italic;
    padding: 8px 0;
  }

  .network-pressure {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 8px;
    margin-top: 8px;
    border-top: 1px solid rgba(156, 163, 176, 0.2);
    font-size: 11px;
    min-height: 16px; /* Prevent height changes */
  }

  .pressure-icon {
    font-size: 10px;
    flex-shrink: 0;
  }

  .pressure-text {
    color: #9ca3b0;
    flex: 1;
  }

  .tooltip-arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #2c3542;
    border: 1px solid #525e72;
    pointer-events: none;
  }

  .tooltip-arrow-top {
    transform: translateX(-50%) translateY(50%) rotate(45deg);
    border-top: none;
    border-left: none;
  }

  .tooltip-arrow-bottom {
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
    border-bottom: none;
    border-right: none;
  }

  .tooltip-arrow-left {
    transform: translateY(-50%) translateX(50%) rotate(45deg);
    border-left: none;
    border-bottom: none;
  }

  .tooltip-arrow-right {
    transform: translateY(-50%) translateX(-50%) rotate(45deg);
    border-right: none;
    border-top: none;
  }

  @media (max-width: 480px) {
    .gas-tooltip {
      width: calc(100vw - 40px);
      max-width: 300px;
      font-size: 13px;
    }

    .tooltip-title {
      font-size: 12px;
    }

    .section-header {
      font-size: 11px;
    }

    .cost-label,
    .cost-value {
      font-size: 12px;
    }
  }
</style>
