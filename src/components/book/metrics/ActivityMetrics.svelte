<script lang="ts">
  import { formatNumber, formatNumberWithCommas } from '$lib/utils/formatters';
  import MetricCard from './MetricCard.svelte';
  import Spinner from '../ui/Spinner.svelte';
  
  interface Props {
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    onSpanChange: (span: "1h" | "24h" | "7d" | "30d") => void;
    loadingDynamic: boolean;
    chainDynamic: any;
  }

  let { metricsSpan, onSpanChange, loadingDynamic, chainDynamic }: Props = $props();
  
  const spans: Array<"1h" | "24h" | "7d" | "30d"> = ["1h", "24h", "7d", "30d"];
</script>

<div class="metrics-section">
  <h3>Activity Metrics</h3>
  <div class="metrics-tabs">
    {#each spans as span}
      <button
        class="metric-tab"
        class:active={metricsSpan === span}
        onclick={() => onSpanChange(span)}
      >
        {span}
      </button>
    {/each}
  </div>

  {#if loadingDynamic}
    <div class="metrics-loading">
      <Spinner />
      <span>Loading metrics...</span>
    </div>
  {:else if chainDynamic}
    <div class="metrics-grid">
      <MetricCard 
        label="TPS" 
        value={chainDynamic.metrics.txPerSecond} 
      />
      <MetricCard 
        label="Transactions" 
        value={formatNumber(chainDynamic.metrics.numTransactions)}
        tooltip={formatNumberWithCommas(chainDynamic.metrics.numTransactions)}
      />
      <MetricCard 
        label="Users" 
        value={formatNumber(chainDynamic.metrics.uniqueUsers)}
        tooltip={formatNumberWithCommas(chainDynamic.metrics.uniqueUsers)}
      />
      <MetricCard 
        label="Contracts" 
        value={formatNumber(chainDynamic.metrics.contractsDeployed)}
        tooltip={formatNumberWithCommas(chainDynamic.metrics.contractsDeployed)}
      />
    </div>
  {:else}
    <div class="no-metrics">
      <p>No live metrics available</p>
    </div>
  {/if}
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
    background: #3b82f6;
    color: white;
  }

  .metrics-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: #64748b;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .no-metrics {
    text-align: center;
    padding: 3rem;
    color: #64748b;
  }

  @media (max-width: 1024px) {
    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }
</style>