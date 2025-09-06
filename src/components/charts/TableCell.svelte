<script lang="ts">
  import { formatChartValue } from "$lib/utils/chartFormatters";

  import Tooltip from "../book/ui/Tooltip.svelte";

  import type { Chain } from "./types";

  interface Props {
    type: "logo" | "name" | "tvl" | "metric" | "type" | "txCost";
    chain: Chain;
    index: number;
    isLoading?: boolean;
    onClick: () => void;
    metricType?: "tps" | "blockTime" | "count";
    metricValue?: number;
    showTpsLabel?: boolean;
  }

  let {
    type,
    chain,
    index,
    isLoading = false,
    onClick,
    metricType,
    metricValue,
    showTpsLabel = false,
  }: Props = $props();

  const isAltRow = $derived(index % 2 === 1);

  // Create tooltip text for tx cost
  const txCostTooltipText = $derived(
    type === "txCost" && chain.txCost && chain.txCost > 0
      ? `$${chain.txCost.toFixed(8)} USD`
      : "",
  );
</script>

{#if type === "logo"}
  <button
    class="grid-cell sticky-column logo-cell"
    class:alt-row={isAltRow}
    onclick={onClick}
  >
    {#if isLoading}
      <div class="skeleton-logo"></div>
    {:else if chain.logoUrl}
      <div class="chain-seal" style="--chain-color: {chain.color || '#7a8599'}">
        <div class="seal-inner">
          <img src={chain.logoUrl} alt={chain.name} class="chain-logo" />
        </div>
      </div>
    {:else if chain.name}
      <div
        class="chain-seal placeholder"
        style="--chain-color: {chain.color || '#7a8599'}"
      >
        <div class="seal-inner">
          <span class="logo-initial">{chain.name.charAt(0)}</span>
        </div>
      </div>
    {:else}
      <span class="skeleton-metric"></span>
    {/if}
  </button>
{:else if type === "name"}
  <button
    class="grid-cell chain-name-cell"
    class:alt-row={isAltRow}
    onclick={onClick}
  >
    {#if isLoading}
      <div class="name-wrapper">
        <span class="skeleton-name"></span>
        <span class="skeleton-chain-id"></span>
      </div>
    {:else}
      <div class="name-wrapper">
        <span class="name-text">{chain.name}</span>
        <span class="chain-id-text">#{chain.chainId}</span>
      </div>
    {/if}
  </button>
{:else if type === "tvl"}
  <button class="grid-cell" class:alt-row={isAltRow} onclick={onClick}>
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <div class="tvl-container">
        <span class="value-text">{formatChartValue(chain.tvl, "tvl")}</span>
        {#if chain.tvlChange !== null && chain.tvlChange !== undefined}
          <span
            class="tvl-change"
            class:positive={chain.tvlChange > 0}
            class:negative={chain.tvlChange < 0}
          >
            {chain.tvlChange > 0 ? "+" : ""}{chain.tvlChange.toFixed(1)}%
          </span>
        {/if}
      </div>
    {/if}
  </button>
{:else if type === "metric"}
  <button class="grid-cell" class:alt-row={isAltRow} onclick={onClick}>
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text">
        {formatChartValue(metricValue, metricType || "count")}{showTpsLabel
          ? " TPS"
          : ""}
      </span>
    {/if}
  </button>
{:else if type === "txCost"}
  <button class="grid-cell" class:alt-row={isAltRow} onclick={onClick}>
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else if chain.txCost && chain.txCost > 0}
      <Tooltip text={txCostTooltipText}>
        <span class="value-text tx-cost-value">
          {#if chain.txCost < 0.0001}
            &lt;$0.0001
          {:else if chain.txCost < 0.01}
            ${chain.txCost.toFixed(4)}
          {:else if chain.txCost < 1}
            ${chain.txCost.toFixed(2)}
          {:else}
            ${chain.txCost.toFixed(2)}
          {/if}
        </span>
      </Tooltip>
    {:else}
      <span class="value-text">-</span>
    {/if}
  </button>
{:else if type === "type"}
  <button class="grid-cell" class:alt-row={isAltRow} onclick={onClick}>
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span
        class="type-badge {chain.type === 'L1'
          ? 'badge-l1'
          : chain.type === 'L2'
            ? 'badge-l2'
            : 'badge-default'}"
      >
        <span class="type-full">{chain.type}</span>
        <span class="type-short">
          {chain.type === "Sidechain" ? "Side" : chain.type}
        </span>
      </span>
    {/if}
  </button>
{/if}

<style>
  .grid-cell {
    padding: 0.75rem 1rem;
    border: none;
    border-bottom: 1px solid #e0dcd5;
    background: #f8f7f5;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.15s ease;
    height: 64px;
  }

  .grid-cell:hover {
    background: #f0eee9;
  }

  .grid-cell.alt-row {
    background: #f2f1ee;
  }

  .grid-cell.alt-row:hover {
    background: #ebe9e4;
  }

  .sticky-column {
    position: sticky;
    left: 0;
    z-index: 1;
    background: #f8f7f5;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  }

  .sticky-column.alt-row {
    background: #f2f1ee;
  }

  .logo-cell {
    min-width: 70px;
    justify-content: center;
    padding: 0.5rem;
    height: 64px;
  }

  .chain-name-cell {
    min-width: 200px;
    justify-content: flex-start;
  }

  .chain-seal {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      var(--chain-color),
      color-mix(in srgb, var(--chain-color) 70%, black)
    );
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.15),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  .seal-inner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .chain-logo {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .chain-seal.placeholder .seal-inner {
    background: rgba(255, 255, 255, 0.9);
  }

  .logo-initial {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--chain-color);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    text-align: initial;
  }

  .name-text {
    font-family: var(--font-ui);
    font-size: 0.95rem;
    font-weight: 600;
    color: #3a3633;
  }

  .chain-id-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #8a837a;
    font-weight: 400;
  }

  .value-text {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: #3a3633;
    font-weight: 500;
  }

  .tvl-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tvl-change {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-weight: 600;
  }

  .tvl-change.positive {
    color: #2d7a2d;
    background: rgba(45, 122, 45, 0.1);
  }

  .tvl-change.negative {
    color: #c73030;
    background: rgba(199, 48, 48, 0.1);
  }

  .type-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;
    font-family: var(--font-ui);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, #6b6862, #57534e);
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-l1 {
    background: linear-gradient(135deg, #8b7355, #6d5a44);
  }

  .badge-l2 {
    background: linear-gradient(135deg, #5a7a8b, #476472);
  }

  /* Show/hide full vs short type labels */
  .type-full {
    display: inline;
  }

  .type-short {
    display: none;
  }

  .skeleton-metric {
    display: inline-block;
    width: 60px;
    height: 20px;
    background: linear-gradient(90deg, #e0dcd5 0%, #ebe8e3 50%, #e0dcd5 100%);
    border-radius: 3px;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-logo {
    display: block;
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #e0dcd5 0%, #ebe8e3 50%, #e0dcd5 100%);
    border-radius: 50%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-name {
    display: inline-block;
    width: 100px;
    height: 16px;
    background: linear-gradient(90deg, #e0dcd5 0%, #ebe8e3 50%, #e0dcd5 100%);
    border-radius: 3px;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-chain-id {
    display: inline-block;
    width: 50px;
    height: 12px;
    background: linear-gradient(90deg, #e0dcd5 0%, #ebe8e3 50%, #e0dcd5 100%);
    border-radius: 3px;
    animation: shimmer 1.5s infinite;
    margin-top: 2px;
  }

  @keyframes shimmer {
    0% {
      background-position: -100px;
    }
    100% {
      background-position: 100px;
    }
  }

  @media (max-width: 768px) {
    .grid-cell {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
      height: 52px;
    }

    .logo-cell {
      min-width: 60px;
      padding: 0.4rem;
      height: 52px;
    }

    .chain-name-cell {
      min-width: 160px;
    }

    .chain-seal {
      width: 36px;
      height: 36px;
    }

    .seal-inner {
      width: 28px;
      height: 28px;
    }

    .chain-logo {
      width: 20px;
      height: 20px;
    }

    .name-text {
      font-size: 0.9rem;
    }

    .value-text {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .grid-cell {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
      height: 52px;
    }

    .logo-cell {
      min-width: 50px;
      padding: 0.3rem;
      height: 52px;
    }

    .chain-name-cell {
      min-width: 140px;
    }

    .chain-seal {
      width: 32px;
      height: 32px;
    }

    .seal-inner {
      width: 26px;
      height: 26px;
    }

    .chain-logo {
      width: 18px;
      height: 18px;
    }

    .name-text {
      font-size: 0.85rem;
    }

    .chain-id-text {
      font-size: 0.7rem;
    }

    .value-text {
      font-size: 0.8rem;
    }

    /* Show short type labels on mobile */
    .type-full {
      display: none;
    }

    .type-short {
      display: inline;
    }
  }
</style>
