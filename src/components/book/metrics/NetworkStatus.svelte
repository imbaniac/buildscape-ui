<script lang="ts">
  import { formatNumberWithCommas } from '$lib/utils/formatters';
  import Tooltip from '../ui/Tooltip.svelte';
  import NumberAnimation from '../ui/NumberAnimation.svelte';
  import SkeletonLoader from '../ui/SkeletonLoader.svelte';
  import GasMeter from './GasMeter.svelte';
  import UtilizationBar from './UtilizationBar.svelte';
  
  interface Props {
    chainDynamic: any;
    chainStatus: any;
    loadingStatus: boolean;
  }

  let { chainDynamic, chainStatus, loadingStatus }: Props = $props();
  
  // Only show skeleton on initial load, not on updates
  const showSkeleton = $derived(loadingStatus && !chainStatus && !chainDynamic);
  
  // Get status color and label
  function getStatusInfo(status: string) {
    switch (status) {
      case 'starting':
        return { color: '#3b82f6', label: 'Starting', pulse: true };
      case 'syncing':
        return { color: '#8b5cf6', label: 'Syncing', pulse: true };
      case 'live':
        return { color: '#10b981', label: 'Live', pulse: false };
      case 'paused':
        return { color: '#f59e0b', label: 'Paused', pulse: false };
      case 'error':
        return { color: '#ef4444', label: 'Error', pulse: true };
      case 'stopped':
        return { color: '#6b7280', label: 'Stopped', pulse: false };
      case 'never_started':
        return { color: '#94a3b8', label: 'Never Started', pulse: false };
      case 'disabled':
        return { color: '#6b7280', label: 'Disabled', pulse: false };
      case 'not_configured':
        return { color: '#94a3b8', label: 'Not Configured', pulse: false };
      default:
        return { color: '#6b7280', label: status, pulse: false };
    }
  }
  
  const statusInfo = $derived(getStatusInfo(chainStatus?.status || 'stopped'));
</script>

<div class="network-status">
  <div class="status-header">
    <h3>Network Status</h3>
    <div class="status-indicator-container">
      <div 
        class="status-dot" 
        class:pulse={statusInfo.pulse}
        style="background-color: {statusInfo.color}"
      ></div>
      <span class="status-label-text">{statusInfo.label}</span>
    </div>
  </div>
  
  <div class="sync-progress-container">
    {#if chainStatus?.sync_progress > 0 && chainStatus?.status === 'syncing'}
      <div class="sync-progress-bar">
        <div class="sync-progress-fill" style="width: {chainStatus.sync_progress * 100}%"></div>
        <span class="sync-progress-text">{Math.round(chainStatus.sync_progress * 100)}% synced</span>
      </div>
    {/if}
  </div>
  
  <div class="status-grid">
    <div class="status-item">
      <span class="status-label">Last Block</span>
      {#if showSkeleton}
        <SkeletonLoader height="1.25rem" />
      {:else}
        <span class="status-value">
          <NumberAnimation 
            value={chainStatus?.current_block || chainDynamic?.lastBlock || 0} 
            format={formatNumberWithCommas}
          />
        </span>
      {/if}
    </div>
    <div class="status-item">
      <span class="status-label">Gas Price</span>
      {#if showSkeleton}
        <SkeletonLoader height="45px" />
      {:else}
        <GasMeter gasPrice={Math.round(chainStatus?.gas_price_gwei || chainDynamic?.lastGas || 0)} />
      {/if}
    </div>
    <div class="status-item">
      <span class="status-label">Block Size</span>
      {#if showSkeleton}
        <SkeletonLoader height="1.25rem" />
      {:else}
        <span class="status-value">
          {chainStatus?.block_size_mb?.toFixed(2) || chainDynamic?.lastBlockSize || '0'} MB
        </span>
      {/if}
    </div>
    <div class="status-item">
      <span class="status-label">
        Utilization
        <Tooltip text="Network capacity usage">
          <span class="info-icon">ⓘ</span>
        </Tooltip>
      </span>
      {#if showSkeleton}
        <SkeletonLoader height="1.25rem" />
      {:else}
        <UtilizationBar percentage={Math.round(chainStatus?.utilization_pct || (chainDynamic?.utilization ? parseInt(chainDynamic.utilization) : 0))} />
      {/if}
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
  
  .status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  
  .status-indicator-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: relative;
  }
  
  .status-dot.pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .status-dot.pulse::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background-color: inherit;
    opacity: 0.4;
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .status-label-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
  }
  
  .sync-progress-container {
    height: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .sync-progress-bar {
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }
  
  .sync-progress-fill {
    height: 100%;
    background: #8b5cf6;
    transition: width 0.3s ease;
  }
  
  .sync-progress-text {
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 0.625rem;
    color: #64748b;
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

  @media (max-width: 640px) {
    .network-status {
      margin-bottom: 1.25rem;
    }

    .network-status h3 {
      font-size: 0.75rem;
      margin-bottom: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-header {
      margin-bottom: 0.5rem;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
    }
    
    .status-label-text {
      font-size: 0.6875rem;
    }

    .status-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.625rem;
    }

    .status-item {
      padding: 1rem 0.75rem;
      text-align: center;
      align-items: center;
      justify-content: center;
      min-height: 80px;
    }

    .status-label {
      font-size: 0.6875rem;
      letter-spacing: 0.25px;
      justify-content: center;
      text-align: center;
      width: 100%;
    }

    .status-value {
      font-size: 1.25rem;
      font-weight: 700;
      text-align: center;
      width: 100%;
    }

    .info-icon {
      width: 12px;
      height: 12px;
      font-size: 9px;
    }
  }
</style>