<script lang="ts">
  import Tooltip from '../ui/Tooltip.svelte';
  import SkeletonLoader from '../ui/SkeletonLoader.svelte';
  
  interface Props {
    label: string;
    value?: string | number;
    tooltip?: string;
    loading?: boolean;
    formatter?: (value: number) => string;
    useAnimation?: boolean;
  }

  let { label, value, tooltip, loading = false, formatter, useAnimation = true }: Props = $props();
</script>

<div class="metric-card">
  <span class="metric-label">{label}</span>
  {#if loading}
    <SkeletonLoader height="1.25rem" width="80%" />
  {:else if tooltip}
    <Tooltip text={tooltip}>
      <span class="metric-value with-tooltip">
        {#if typeof value === 'number' && formatter}
          {formatter(value)}
        {:else}
          {value || '0'}
        {/if}
      </span>
    </Tooltip>
  {:else}
    <span class="metric-value">
      {#if typeof value === 'number' && formatter}
        {formatter(value)}
      {:else}
        {value || '0'}
      {/if}
    </span>
  {/if}
</div>

<style>
  .metric-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 0.2s;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .metric-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .metric-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }

  .with-tooltip {
    cursor: help;
  }

  @media (max-width: 640px) {
    .metric-card {
      padding: 1rem 0.75rem;
      text-align: center;
      align-items: center;
      justify-content: center;
      min-height: 80px;
    }

    .metric-label {
      font-size: 0.6875rem;
      letter-spacing: 0.25px;
      text-align: center;
      width: 100%;
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 700;
      text-align: center;
      width: 100%;
    }
  }
</style>