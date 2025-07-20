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
  
  // Map labels to icons
  const defaultIcons: Record<string, string> = {
    'TPS': '⚡',
    'Transactions': '📊',
    'Population': '👥',
    'Contracts': '📜'
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
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .metric-card:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }
  
  .metric-card:hover::before {
    opacity: 1;
  }
  
  .metric-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  
  .metric-icon {
    font-size: 0.875rem;
    filter: grayscale(0.2);
  }

  .metric-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .metric-value-wrapper {
    position: relative;
  }

  .metric-value {
    font-size: 1.375rem;
    font-weight: 700;
    color: #1e293b;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
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