<script lang="ts">
  import Tooltip from '../ui/Tooltip.svelte';
  import SkeletonLoader from '../ui/SkeletonLoader.svelte';
  import NumberAnimation from '../ui/NumberAnimation.svelte';
  
  interface Props {
    label: string;
    value?: string | number;
    tooltip?: string;
    loading?: boolean;
    formatter?: (value: number) => string;
    useAnimation?: boolean;
    icon?: string;
  }

  let { label, value, tooltip, loading = false, formatter, useAnimation = true, icon }: Props = $props();
  
  // Map labels to icons - subtle strategy game icons
  const defaultIcons: Record<string, string> = {
    'TPS': '⚡',
    'Transactions': '💱',
    'Population': '👥',
    'Contracts': '📋'
  };
  
  const displayIcon = $derived(icon || defaultIcons[label] || '');
</script>

<div class="metric-card">
  <div class="metric-header">
    {#if displayIcon}
      <span class="metric-icon">{displayIcon}</span>
    {/if}
    <span class="metric-label">{label}</span>
  </div>
  {#if loading}
    <SkeletonLoader height="1.5rem" width="80%" />
  {:else if tooltip}
    <Tooltip text={tooltip}>
      <div class="metric-value-wrapper">
        {#if useAnimation && typeof value === 'number'}
          <NumberAnimation value={value} formatter={formatter} />
        {:else if typeof value === 'number' && formatter}
          <span class="metric-value with-tooltip">{formatter(value)}</span>
        {:else}
          <span class="metric-value with-tooltip">{value || '0'}</span>
        {/if}
      </div>
    </Tooltip>
  {:else}
    <div class="metric-value-wrapper">
      {#if useAnimation && typeof value === 'number'}
        <NumberAnimation value={value} formatter={formatter} />
      {:else if typeof value === 'number' && formatter}
        <span class="metric-value">{formatter(value)}</span>
      {:else}
        <span class="metric-value">{value || '0'}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .metric-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: visible;
    box-shadow: 
      0 2px 8px rgba(44, 62, 80, 0.08),
      0 1px 2px rgba(44, 62, 80, 0.04);
  }
  
  /* Subtle corner accents */
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #34495e 0%, transparent 50%, #34495e 100%);
    opacity: 0.1;
    border-radius: 8px 8px 0 0;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px rgba(44, 62, 80, 0.12),
      0 2px 4px rgba(44, 62, 80, 0.06);
    border-color: rgba(52, 73, 94, 0.25);
  }
  
  .metric-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  
  .metric-icon {
    font-size: 1rem;
    opacity: 0.7;
  }

  .metric-label {
    font-size: 0.5625rem;
    font-weight: 600;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }
  
  .metric-value-wrapper {
    position: relative;
  }

  .metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    letter-spacing: -0.02em;
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