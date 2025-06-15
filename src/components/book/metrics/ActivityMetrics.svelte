<script lang="ts">
  import { formatNumber, formatNumberWithCommas } from "$lib/utils/formatters";
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
    />
    <MetricCard
      label="Transactions"
      value={chainDynamic?.metrics?.numTransactions}
      formatter={(v) => formatNumber(v)}
      tooltip={chainDynamic?.metrics?.numTransactions ? formatNumberWithCommas(chainDynamic.metrics.numTransactions) : undefined}
      loading={showSkeleton}
    />
    <MetricCard
      label="Users"
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
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metrics-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .metric-tab {
    padding: 0.5rem 1.25rem;
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
  }

  .metric-tab:hover {
    background: #e2e8f0;
  }

  .metric-tab.active {
    background: var(--brand-color);
    color: white;
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
