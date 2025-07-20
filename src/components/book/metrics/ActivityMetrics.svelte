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
  
</script>

<div class="metrics-section">
  <h3>Activity Metrics</h3>
  <div class="metrics-tabs">
    {#each spans as span}
      <button
        class="metric-tab"
        class:active={metricsSpan === span}
        onclick={() => onSpanChange(span)}
        style="--brand-color: {brandColor}"
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
      brandColor={brandColor}
    />
    <MetricCard
      label="Transactions"
      value={chainDynamic?.metrics?.numTransactions}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.numTransactions ? formatNumberWithCommas(chainDynamic.metrics.numTransactions) : undefined}
      loading={showSkeleton}
      brandColor={brandColor}
    />
    <MetricCard
      label="Population"
      value={chainDynamic?.metrics?.activeUsers}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.activeUsers ? formatNumberWithCommas(chainDynamic.metrics.activeUsers) : undefined}
      loading={showSkeleton}
      brandColor={brandColor}
    />
    <MetricCard
      label="Contracts"
      value={chainDynamic?.metrics?.contractsDeployed}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.contractsDeployed ? formatNumberWithCommas(chainDynamic.metrics.contractsDeployed) : undefined}
      loading={showSkeleton}
      brandColor={brandColor}
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
    color: #6b7280;
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
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.6875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }

  .metric-tab:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    color: #4b5563;
  }

  .metric-tab.active {
    background: var(--brand-color);
    color: #ffffff;
    border-color: var(--brand-color);
    font-weight: 700;
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
