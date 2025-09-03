<script lang="ts">
  import Tooltip from "../ui/Tooltip.svelte";

  import GasTooltip from "./GasTooltip.svelte";

  interface Props {
    gasPrice: number;
    utilization: number;
    previousGasPrice?: number;
    nativeCurrency?: string;
    blockTime?: number;
    lastBlock?: string;
    networkStatus?: string;
    brandColor?: string;
    nativeTokenPriceUSD?: number;
    nativeTokenPriceUpdatedAt?: string;
  }

  let {
    gasPrice,
    utilization,
    previousGasPrice,
    nativeCurrency = "ETH",
    blockTime,
    lastBlock,
    networkStatus = "live",
    brandColor = "#3b82f6",
    nativeTokenPriceUSD,
    nativeTokenPriceUpdatedAt,
  }: Props = $props();

  // Ensure values are valid
  const safeGasPrice = $derived(Math.max(0, gasPrice || 0));
  const safeUtilization = $derived(
    Math.max(0, Math.min(100, utilization || 0)),
  );

  // Calculate trend
  const trend = $derived(() => {
    if (!previousGasPrice || previousGasPrice === safeGasPrice) return "stable";
    return safeGasPrice > previousGasPrice ? "up" : "down";
  });

  // Get pressure status and color
  const pressureStatus = $derived(() => {
    if (safeUtilization <= 30)
      return { text: "LOW", color: "#10b981", class: "low" };
    if (safeUtilization <= 60)
      return { text: "MODERATE", color: "#f59e0b", class: "moderate" };
    if (safeUtilization <= 85)
      return { text: "HIGH", color: "#f97316", class: "high" };
    return { text: "CRITICAL", color: "#ef4444", class: "critical" };
  });

  // Get status color and label
  function getStatusInfo(status: string) {
    switch (status) {
      case "starting":
        return { color: "#3b82f6", label: "STARTING", pulse: true };
      case "syncing":
        return { color: "#d4af37", label: "SYNCING", pulse: true };
      case "live":
        return { color: "#10b981", label: "LIVE", pulse: false };
      case "paused":
        return { color: "#f59e0b", label: "PAUSED", pulse: false };
      case "error":
        return { color: "#ef4444", label: "ERROR", pulse: true };
      case "stopped":
        return { color: "#6b7280", label: "STOPPED", pulse: false };
      case "connecting":
        return { color: "#3b82f6", label: "CONNECTING", pulse: true };
      default:
        return { color: "#6b7280", label: status.toUpperCase(), pulse: false };
    }
  }

  const statusInfo = $derived(getStatusInfo(networkStatus));

  // Calculate USD cost for a standard transfer (21,000 gas)
  const usdCost = $derived(() => {
    if (!nativeTokenPriceUSD || nativeTokenPriceUSD <= 0) return null;
    // gasPrice is in gwei, convert to ETH (1e-9), multiply by gas units and USD price
    const cost = safeGasPrice * 1e-9 * 21000 * nativeTokenPriceUSD;
    return cost;
  });

  // Format USD cost
  const formattedUSDCost = $derived(() => {
    const cost = usdCost();
    if (cost === null) return null;

    if (cost < 0.0001) {
      return "<$0.0001";
    } else if (cost < 0.01) {
      return `$${cost.toFixed(4)}`;
    } else if (cost < 1) {
      return `$${cost.toFixed(2)}`;
    } else {
      return `$${cost.toFixed(2)}`;
    }
  });

  // Format gwei display
  const formattedGwei = $derived(() => {
    if (safeGasPrice < 0.01) {
      return "<0.01";
    }
    return safeGasPrice.toFixed(2);
  });

  // Format native token price
  const formattedTokenPrice = $derived(() => {
    if (!nativeTokenPriceUSD || nativeTokenPriceUSD <= 0) return null;

    if (nativeTokenPriceUSD < 0.0001) return "<$0.0001";
    if (nativeTokenPriceUSD < 1) return `$${nativeTokenPriceUSD.toFixed(4)}`;
    if (nativeTokenPriceUSD < 10) return `$${nativeTokenPriceUSD.toFixed(2)}`;
    if (nativeTokenPriceUSD < 100) return `$${nativeTokenPriceUSD.toFixed(2)}`;
    if (nativeTokenPriceUSD < 1000) return `$${nativeTokenPriceUSD.toFixed(0)}`;
    return `$${Math.round(nativeTokenPriceUSD).toLocaleString()}`;
  });
</script>

<div class="resource-panel" style="--brand-color: {brandColor}">
  <div class="panel-header">
    <span class="header-icon">🏰</span>
    <span class="header-title">NETWORK RESOURCES</span>
    <div class="status-indicator">
      <div
        class="status-dot"
        class:pulse={statusInfo.pulse}
        style="background-color: {statusInfo.color}; --glow-color: {statusInfo.color}"
      ></div>
      <span class="status-label">{statusInfo.label}</span>
    </div>
  </div>

  <div class="panel-body">
    <div class="resources-grid">
      <GasTooltip
        gasPrice={safeGasPrice}
        nativeTokenPrice={nativeTokenPriceUSD}
        {nativeCurrency}
        utilization={safeUtilization}
        pressureStatus={pressureStatus()}
      >
        <div class="resource-item resource-item-interactive">
          <span class="resource-icon pressure-icon {pressureStatus().class}">
            {#if pressureStatus().class === "low"}
              🟢
            {:else if pressureStatus().class === "moderate"}
              🟡
            {:else if pressureStatus().class === "high"}
              🟠
            {:else}
              🔴
            {/if}
          </span>
          <div class="resource-data">
            <span class="resource-label">TX COST</span>
            <div class="resource-value stacked">
              {#if formattedUSDCost()}
                <div class="primary-value-row">
                  <span class="value-number">{formattedUSDCost()}</span>
                  {#if trend() === "up"}
                    <span class="trend-indicator up">↑</span>
                  {:else if trend() === "down"}
                    <span class="trend-indicator down">↓</span>
                  {/if}
                </div>
                <span class="secondary-value">{formattedGwei()} gwei</span>
              {:else}
                <div class="primary-value-row">
                  <span class="value-number">{formattedGwei()}</span>
                  <span class="value-unit">gwei</span>
                  {#if trend() === "up"}
                    <span class="trend-indicator up">↑</span>
                  {:else if trend() === "down"}
                    <span class="trend-indicator down">↓</span>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </GasTooltip>

      <div class="resource-item">
        <span class="resource-icon">🪙</span>
        <div class="resource-data">
          <span class="resource-label">CURRENCY</span>
          <div class="resource-value stacked">
            <span class="value-number">{nativeCurrency}</span>
            {#if formattedTokenPrice()}
              <span class="secondary-value">{formattedTokenPrice()}</span>
            {/if}
          </div>
        </div>
      </div>

      <div class="resource-item">
        <span class="resource-icon">⏱️</span>
        <div class="resource-data">
          <span class="resource-label">SPEED</span>
          <div class="resource-value">
            <span class="value-number"
              >{blockTime ? blockTime.toFixed(1) : "-"}</span
            >
            <span class="value-unit">s</span>
          </div>
        </div>
      </div>

      <div class="resource-item">
        <span class="resource-icon">🏁</span>
        <div class="resource-data">
          <span class="resource-label">LAST BLOCK</span>
          <div class="resource-value">
            <span class="value-number">{lastBlock || "0"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .resource-panel {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    box-shadow:
      0 2px 8px rgba(52, 73, 94, 0.08),
      0 1px 2px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  /* Brand color accent bar */
  .resource-panel::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--brand-color);
  }

  .panel-header {
    background: linear-gradient(180deg, #34495e 0%, #2c3e50 100%);
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    border-bottom: 1px solid #253443;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .header-icon {
    font-size: 0.875rem;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
  }

  .header-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    flex: 1;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .status-dot.pulse {
    animation: glow 2s ease-in-out infinite;
  }

  @keyframes glow {
    0%,
    100% {
      box-shadow:
        0 0 4px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.3),
        0 0 8px var(--glow-color, currentColor);
    }
    50% {
      box-shadow:
        0 0 4px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.3),
        0 0 12px var(--glow-color, currentColor);
    }
  }

  .status-label {
    font-size: 0.625rem;
    font-weight: 600;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  }

  .panel-body {
    padding: 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .resource-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .resource-item:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .resource-item-interactive {
    cursor: help;
  }

  .resource-item-interactive:hover {
    background: #f3f4f6;
    border-color: #c6c9d0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .resource-icon {
    font-size: 1rem;
    opacity: 0.8;
  }

  .pressure-icon {
    filter: none;
    opacity: 1;
  }

  .resource-data {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .resource-label {
    font-size: 0.5625rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  .resource-value {
    display: flex;
    align-items: baseline;
    gap: 0.125rem;
  }

  .value-number {
    font-size: 0.6875rem;
    font-weight: 700;
    color: #1e293b;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  .value-unit {
    font-size: 0.6875rem;
    font-weight: 500;
    color: #95a5a6;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  .trend-indicator {
    font-size: 0.625rem;
    font-weight: 700;
    margin-left: 0.125rem;
  }

  .trend-indicator.up {
    color: #ef4444;
  }

  .trend-indicator.down {
    color: #10b981;
  }

  .resource-value.stacked {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .primary-value-row {
    display: flex;
    align-items: baseline;
    gap: 0.125rem;
  }

  .secondary-value {
    font-size: 0.5625rem;
    color: #95a5a6;
    font-weight: 500;
    line-height: 1.2;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  @media (max-width: 1280px) {
    .resources-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }

  @media (max-width: 640px) {
    .panel-header {
      padding: 0.5rem 0.625rem;
    }

    .panel-body {
      padding: 0.5rem;
    }

    .resources-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.375rem;
    }

    .resource-item {
      padding: 0.5rem 0.375rem;
    }

    .value-number {
      font-size: 0.875rem;
    }

    .health-bar {
      gap: 1px;
    }

    .bar-segment {
      height: 10px;
    }
  }
</style>
