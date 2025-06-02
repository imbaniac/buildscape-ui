<script lang="ts">
  import Tooltip from '../ui/Tooltip.svelte';
  
  interface Props {
    label: string;
    value: string | number;
    tooltip?: string;
  }

  let { label, value, tooltip }: Props = $props();
</script>

<div class="metric-card">
  <span class="metric-label">{label}</span>
  {#if tooltip}
    <Tooltip text={tooltip}>
      <span class="metric-value with-tooltip">{value}</span>
    </Tooltip>
  {:else}
    <span class="metric-value">{value}</span>
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
</style>