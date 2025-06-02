<script lang="ts">
  import { formatNumberWithCommas } from '$lib/utils/formatters';
  import Tooltip from '../ui/Tooltip.svelte';
  
  interface Props {
    chainDynamic: any;
  }

  let { chainDynamic }: Props = $props();
</script>

<div class="network-status">
  <h3>Network Status</h3>
  <div class="status-grid">
    <div class="status-item">
      <span class="status-label">Last Block</span>
      <span class="status-value">{formatNumberWithCommas(chainDynamic.lastBlock)}</span>
    </div>
    <div class="status-item">
      <span class="status-label">Gas Price</span>
      <span class="status-value">{chainDynamic.lastGas} gwei</span>
    </div>
    <div class="status-item">
      <span class="status-label">Block Size</span>
      <span class="status-value">{chainDynamic.lastBlockSize}</span>
    </div>
    <div class="status-item">
      <span class="status-label">
        Utilization
        <Tooltip text="Based on last 5 blocks">
          <span class="info-icon">ⓘ</span>
        </Tooltip>
      </span>
      <span class="status-value">{chainDynamic.utilization || "85%"}</span>
    </div>
  </div>
</div>

<style>
  .network-status {
    margin-bottom: 0;
  }

  .network-status h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  .status-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 0.2s;
  }

  .status-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .status-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    font-size: 10px;
    color: #64748b;
    background: #e2e8f0;
    border-radius: 50%;
    cursor: help;
    position: relative;
    font-style: normal;
  }

  .status-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  @media (max-width: 1024px) {
    .status-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>