<script lang="ts">
  import { formatNumber, formatNumberWithCommas } from "$lib/utils/formatters";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import MetricCard from "./MetricCard.svelte";
  import SkeletonLoader from "../ui/SkeletonLoader.svelte";

  interface Props {
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    onSpanChange: (span: "1h" | "24h" | "7d" | "30d") => void;
    loadingDynamic: boolean;
    chainDynamic: any;
    brandColor?: string;
  }

  let { metricsSpan, onSpanChange, loadingDynamic, chainDynamic, brandColor = '#3b82f6' }: Props =
    $props();

  const spans: Array<"1h" | "24h" | "7d" | "30d"> = ["1h", "24h", "7d", "30d"];
  
  // Only show skeleton on initial load
  const showSkeleton = $derived(loadingDynamic && !chainDynamic);
  
  // Get accessible color for button backgrounds
  const adjustedColor = $derived(getAccessibleBrandColor(brandColor));
</script>

<div class="metrics-section">
  <h3>Activity Metrics</h3>
  <div class="metrics-tabs">
    {#each spans as span}
      <button
        class="metric-tab"
        class:active={metricsSpan === span}
        onclick={() => onSpanChange(span)}
        style="--brand-color: {brandColor}; --adjusted-color: {adjustedColor}"
      >
        {span}
      </button>
    {/each}
  </div>

  <div class="metrics-grid">
    <MetricCard 
      label="TPS" 
      value={chainDynamic?.metrics?.txPerSecond} 
      formatter={(v) => v.toFixed(2)}
      loading={showSkeleton}
    />
    <MetricCard
      label="Transactions"
      value={chainDynamic?.metrics?.numTransactions}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.numTransactions ? formatNumberWithCommas(chainDynamic.metrics.numTransactions) : undefined}
      loading={showSkeleton}
    />
    <MetricCard
      label="Population"
      value={chainDynamic?.metrics?.activeUsers}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.activeUsers ? formatNumberWithCommas(chainDynamic.metrics.activeUsers) : undefined}
      loading={showSkeleton}
    />
    <MetricCard
      label="Contracts"
      value={chainDynamic?.metrics?.contractsDeployed}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.contractsDeployed ? formatNumberWithCommas(chainDynamic.metrics.contractsDeployed) : undefined}
      loading={showSkeleton}
    />
  </div>
</div>

<style>
  .metrics-section {
    margin-bottom: 0;
  }

  .metrics-section h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #7f8c8d;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }

  .metrics-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .metric-tab {
    padding: 0.5rem 1rem;
    background: rgba(52, 73, 94, 0.05);
    border: 1px solid rgba(52, 73, 94, 0.15);
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.6875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }

  .metric-tab:hover {
    background: rgba(52, 73, 94, 0.08);
    border-color: rgba(52, 73, 94, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(44, 62, 80, 0.1);
    color: #34495e;
  }

  .metric-tab.active {
    background: linear-gradient(180deg, #34495e 0%, #2c3e50 100%);
    color: #ffffff;
    border-color: #2c3e50;
    font-weight: 700;
    box-shadow: 
      0 2px 6px rgba(44, 62, 80, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .metric-tab:active {
    transform: translateY(0);
  }


  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 1024px) {
    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }

  @media (max-width: 900px) {
    .metrics-tabs {
      gap: 0.375rem;
    }

    .metric-tab {
      padding: 0.375rem 1rem;
      font-size: 0.8125rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .metrics-section {
      margin-bottom: 0.5rem;
    }

    .metrics-section h3 {
      font-size: 0.75rem;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metrics-tabs {
      gap: 0.375rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
    }

    .metric-tab {
      padding: 0.375rem 0.875rem;
      font-size: 0.75rem;
      border-radius: 6px;
      flex: 1;
      max-width: 80px;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.625rem;
    }

    .metrics-loading {
      padding: 2rem;
      font-size: 0.875rem;
    }
  }
</style>
