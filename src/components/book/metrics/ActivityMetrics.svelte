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
  
  // Check if current data is incomplete
  const isDataIncomplete = $derived(
    chainDynamic?.dataCompleteness && !chainDynamic.dataCompleteness.isComplete
  );

  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric'
    };
    // If same day, show time range
    if (startDate.toDateString() === endDate.toDateString()) {
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit',
        minute: '2-digit'
      };
      return `${startDate.toLocaleDateString('en-US', options)} (${startDate.toLocaleTimeString('en-US', timeOptions)} - ${endDate.toLocaleTimeString('en-US', timeOptions)})`;
    }
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const dataRangeText = $derived(
    chainDynamic?.dataCompleteness
      ? formatDateRange(chainDynamic.dataCompleteness.dataStart, chainDynamic.dataCompleteness.dataEnd)
      : ""
  );
</script>

<div class="metrics-section">
  <div class="metrics-header">
    <h3>Activity Metrics</h3>
    {#if isDataIncomplete}
      <div class="data-status incomplete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        </svg>
        <span class="status-text">Partial data</span>
        {#if dataRangeText}
          <span class="date-range">{dataRangeText}</span>
        {/if}
      </div>
    {/if}
  </div>

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

  .metrics-header h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    line-height: 1.5rem; /* Match min-height for alignment */
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

  .metrics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    min-height: 1.5rem; /* Prevent height jumping */
  }

  .data-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    color: #ea580c;
    background: rgba(251, 146, 60, 0.1);
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-weight: 500;
    height: 1.5rem; /* Fixed height to match header */
  }

  .data-status svg {
    flex-shrink: 0;
  }

  .status-text {
    white-space: nowrap;
  }

  .date-range {
    color: #6b7280;
    font-weight: 400;
    padding-left: 0.25rem;
    border-left: 1px solid currentColor;
    opacity: 0.5;
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

    .metrics-header h3 {
      font-size: 0.75rem;
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

    .data-status {
      font-size: 0.625rem;
      padding: 0.1875rem 0.5rem;
    }

    .data-status svg {
      width: 12px;
      height: 12px;
    }

    .date-range {
      font-size: 0.5625rem;
    }
  }
</style>
