<script lang="ts">
  interface Chain {
    slug: string;
    name: string;
    chainId: number;
    type: string;
    tvl: number;
    tvlChange?: number | null;
    tps: number;
    transactions: number;
    activeAddresses: number;
    contracts: number;
    blockTime?: number;
    logoUrl?: string;
    color?: string;
    gasPrice?: number;
    status?: string;
  }

  interface Props {
    chain: Chain;
    formatValue: (
      value: number | undefined,
      type: "tvl" | "tps" | "gas" | "count" | "blockTime",
    ) => string;
    isLoading?: boolean;
    onClick: () => void;
  }

  let { chain, formatValue, isLoading = false, onClick }: Props = $props();

  // Type badge styling
  const typeBadgeClass = $derived(() => {
    switch (chain.type) {
      case "L1":
        return "badge-l1";
      case "L2":
        return "badge-l2";
      default:
        return "badge-default";
    }
  });
</script>

<tr class="chart-row" onclick={onClick}>
  <td class="chain-name">
    <div class="name-container">
      {#if chain.logoUrl}
        <div
          class="chain-seal"
          style="--chain-color: {chain.color || '#7a8599'}"
        >
          <div class="seal-inner">
            <img src={chain.logoUrl} alt={chain.name} class="chain-logo" />
          </div>
        </div>
      {:else}
        <div
          class="chain-seal placeholder"
          style="--chain-color: {chain.color || '#7a8599'}"
        >
          <div class="seal-inner">
            <span class="logo-initial">{chain.name.charAt(0)}</span>
          </div>
        </div>
      {/if}
      <div class="name-wrapper">
        <span class="name-text">{chain.name}</span>
        <span class="chain-id-text">#{chain.chainId}</span>
      </div>
    </div>
  </td>
  <td class="chain-tvl">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <div class="tvl-container">
        <span class="value-text">{formatValue(chain.tvl, "tvl")}</span>
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
  </td>
  <td class="chain-tps">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text">{formatValue(chain.tps, "tps")} TPS</span>
    {/if}
  </td>
  <td class="chain-block-time">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text">{formatValue(chain.blockTime, "blockTime")}</span
      >
    {/if}
  </td>
  <td class="chain-transactions">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text">{formatValue(chain.transactions, "count")}</span>
    {/if}
  </td>
  <td class="chain-addresses">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text"
        >{formatValue(chain.activeAddresses, "count")}</span
      >
    {/if}
  </td>
  <td class="chain-contracts">
    {#if isLoading}
      <span class="skeleton-metric"></span>
    {:else}
      <span class="value-text">{formatValue(chain.contracts, "count")}</span>
    {/if}
  </td>
  <td class="chain-type">
    <span class="type-badge {typeBadgeClass()}">{chain.type}</span>
  </td>
</tr>

<style>
  .chart-row {
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #e0ddd8;
  }

  .chart-row:hover {
    background: rgba(237, 235, 232, 0.5);
    position: relative;
    z-index: 1;
  }

  .chart-row td {
    padding: 0.75rem 1rem;
    font-family: var(--font-body);
    color: #2c3542;
    border-right: 1px solid rgba(224, 221, 216, 0.5);
  }

  .chart-row td:last-child {
    border-right: none;
  }

  /* Chain name column */
  .chain-name {
    min-width: 250px;
  }

  .name-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .chain-seal {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background:
      radial-gradient(
        circle at 40% 40%,
        color-mix(in srgb, var(--chain-color) 35%, #f4f0e8),
        color-mix(in srgb, var(--chain-color) 50%, #e8e2d5)
      ),
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--chain-color) 30%, rgba(184, 134, 11, 0.2)) 0%,
        transparent 50%,
        color-mix(in srgb, var(--chain-color) 30%, rgba(139, 69, 19, 0.2)) 100%
      );
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 3px 8px rgba(0, 0, 0, 0.25),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 248, 220, 0.5),
      inset 0 -2px 3px
        color-mix(in srgb, var(--chain-color) 40%, rgba(139, 69, 19, 0.3)),
      inset 0 0 0 1px
        color-mix(in srgb, var(--chain-color) 55%, rgba(184, 134, 11, 0.3));
    position: relative;
    overflow: visible;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .chain-seal::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      linear-gradient(
        135deg,
        rgba(255, 248, 220, 0.3) 0%,
        transparent 40%,
        rgba(139, 69, 19, 0.08) 100%
      ),
      radial-gradient(
        circle at 50% 0%,
        rgba(255, 248, 220, 0.2) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  .chain-seal::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      transparent 3deg,
      color-mix(in srgb, var(--chain-color) 25%, rgba(184, 134, 11, 0.15)) 3deg,
      color-mix(in srgb, var(--chain-color) 25%, rgba(184, 134, 11, 0.15)) 6deg
    );
    border: 2px solid color-mix(in srgb, var(--chain-color) 80%, #8b6914);
    box-shadow:
      inset 0 0 0 1px
        color-mix(in srgb, var(--chain-color) 65%, rgba(139, 69, 19, 0.5)),
      inset 0 1px 0 rgba(255, 248, 220, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

  .seal-inner {
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 50%,
      #fdfcf8 0%,
      #f8f4ec 50%,
      #f0e8dc 100%
    );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    box-shadow:
      inset 0 2px 3px rgba(0, 0, 0, 0.08),
      inset 0 -1px 2px rgba(255, 248, 220, 0.5),
      0 1px 0 rgba(255, 248, 220, 0.6);
    position: relative;
  }

  /* Parchment texture effect */
  .seal-inner::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-image: repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0,
      transparent 2px,
      rgba(139, 69, 19, 0.02) 2px,
      rgba(139, 69, 19, 0.02) 3px
    );
    pointer-events: none;
  }

  .chain-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15)) sepia(0.04)
      contrast(1.02);
    position: relative;
    z-index: 1;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  .chain-seal.placeholder {
    background:
      radial-gradient(
        circle at 40% 40%,
        color-mix(in srgb, var(--chain-color) 15%, #e8e2d5),
        color-mix(in srgb, var(--chain-color) 30%, #d4caba)
      ),
      linear-gradient(
        135deg,
        rgba(184, 134, 11, 0.15) 0%,
        transparent 50%,
        rgba(139, 69, 19, 0.15) 100%
      );
  }

  .chain-seal.placeholder .seal-inner {
    background: radial-gradient(
      circle at 50% 50%,
      #f4f0e8 0%,
      #ebe5d8 50%,
      #e0d8c8 100%
    );
  }

  .logo-initial {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    color: color-mix(in srgb, var(--chain-color) 70%, #4a3820);
    text-shadow:
      0 1px 0 rgba(255, 248, 220, 0.7),
      0 -1px 2px rgba(139, 69, 19, 0.2),
      0 0 4px rgba(184, 134, 11, 0.1);
    letter-spacing: 0.05em;
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .name-text {
    font-weight: 600;
    font-size: 1.05rem;
    color: #1a1f28;
  }

  .chain-id-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #7a7671;
    opacity: 0.9;
  }

  /* Data columns */
  .value-text {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
  }

  .chain-tvl {
    text-align: right;
    color: #6b5d47;
    min-width: 140px;
  }

  .tvl-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }

  .tvl-change {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    white-space: nowrap;
  }

  .tvl-change.positive {
    color: #2d6a4f;
    background: rgba(45, 106, 79, 0.08);
  }

  .tvl-change.negative {
    color: #a94442;
    background: rgba(169, 68, 66, 0.08);
  }

  .chain-tps {
    text-align: right;
    color: #4a4742;
    min-width: 80px;
  }

  .chain-block-time {
    text-align: right;
    color: #4a4742;
    min-width: 90px;
  }

  .chain-transactions {
    text-align: right;
    color: #4a4742;
    min-width: 110px;
  }

  .chain-addresses {
    text-align: right;
    color: #4a4742;
    min-width: 100px;
  }

  .chain-contracts {
    text-align: right;
    color: #4a4742;
    min-width: 100px;
  }

  /* Type column */
  .chain-type {
    text-align: right;
    min-width: 70px;
  }

  /* Type badge */
  .type-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-family: var(--font-ui);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-l1 {
    background: linear-gradient(135deg, #4a7c59, #5a8c69);
    color: #ffffff;
    border: 1px solid #3a6c49;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .badge-l2 {
    background: linear-gradient(135deg, #4a6d8d, #5a7d9d);
    color: #ffffff;
    border: 1px solid #3a5d7d;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .badge-default {
    background: linear-gradient(135deg, #7a756f, #8a857f);
    color: #ffffff;
    border: 1px solid #6a655f;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Hover effect - wax seal press */
  .chart-row:hover .chain-seal {
    transform: translateY(-1px);
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 248, 220, 0.6),
      inset 0 -2px 4px rgba(139, 69, 19, 0.2),
      inset 0 0 0 1px rgba(184, 134, 11, 0.15);
  }

  .chart-row:hover .chain-seal::after {
    animation: seal-shimmer 2s ease-in-out infinite;
  }

  @keyframes seal-shimmer {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .chart-row td {
      padding: 0.6rem 0.5rem;
      font-size: 0.85rem;
      border-right: none;
    }

    .chain-name {
      min-width: 200px;
    }

    .chain-tvl {
      min-width: 110px;
    }

    .chain-tps {
      min-width: 70px;
    }

    .tvl-change {
      font-size: 0.75rem;
      padding: 0.05rem 0.25rem;
    }

    .chain-transactions,
    .chain-addresses,
    .chain-contracts {
      min-width: 80px;
    }

    .name-container {
      gap: 0.5rem;
    }

    .chain-seal {
      width: 32px;
      height: 32px;
      padding: 2px;
    }

    .seal-inner {
      padding: 4px;
    }

    .name-text {
      font-size: 0.9rem;
    }

    .chain-id-text {
      font-size: 0.7rem;
    }

    .value-text {
      font-size: 0.85rem;
    }

    .chain-tvl,
    .chain-tps,
    .chain-block-time,
    .chain-transactions,
    .chain-addresses,
    .chain-contracts {
      text-align: right;
    }

    /* Keep type column visible on mobile */
    .chain-type {
      padding: 0.6rem 0.3rem;
    }

    .type-badge {
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
    }

    .logo-initial {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .chart-row td {
      padding: 0.5rem 0.35rem;
      font-size: 0.8rem;
    }

    .chain-seal {
      width: 28px;
      height: 28px;
    }

    .seal-inner {
      padding: 3px;
    }

    .name-text {
      font-size: 0.85rem;
    }

    .chain-id-text {
      font-size: 0.65rem;
    }

    .value-text {
      font-size: 0.8rem;
    }

    .logo-initial {
      font-size: 0.8rem;
    }
  }

  /* Skeleton loader for metrics */
  .skeleton-metric {
    display: inline-block;
    height: 14px;
    min-width: 40px;
    width: 100%;
    max-width: 90px;
    background: linear-gradient(
      90deg,
      rgba(224, 221, 216, 0.3) 0%,
      rgba(224, 221, 216, 0.5) 50%,
      rgba(224, 221, 216, 0.3) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    border-radius: 4px;
  }

  @keyframes skeleton-pulse {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .chain-tvl .skeleton-metric {
    max-width: 85px;
  }

  .chain-tps .skeleton-metric {
    max-width: 85px;
  }

  .chain-block-time .skeleton-metric {
    max-width: 55px;
  }

  .chain-transactions .skeleton-metric,
  .chain-addresses .skeleton-metric,
  .chain-contracts .skeleton-metric {
    max-width: 75px;
  }

  @media (max-width: 768px) {
    .skeleton-metric {
      height: 12px;
      min-width: 35px;
    }

    .chain-tvl .skeleton-metric {
      max-width: 70px;
    }

    .chain-tps .skeleton-metric {
      max-width: 75px;
    }

    .chain-block-time .skeleton-metric {
      max-width: 50px;
    }

    .chain-transactions .skeleton-metric,
    .chain-addresses .skeleton-metric,
    .chain-contracts .skeleton-metric {
      max-width: 65px;
    }
  }
</style>
