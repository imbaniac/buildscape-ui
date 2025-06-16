<script lang="ts">
  import Tooltip from '../ui/Tooltip.svelte';
  
  interface Props {
    gasPrice: number;
    utilization: number;
    previousGasPrice?: number;
  }

  let { gasPrice, utilization, previousGasPrice }: Props = $props();
  
  // Ensure values are valid
  const safeGasPrice = $derived(Math.max(0, gasPrice || 0));
  const safeUtilization = $derived(Math.max(0, Math.min(100, utilization || 0)));
  
  // Calculate trend
  const trend = $derived(() => {
    if (!previousGasPrice || previousGasPrice === safeGasPrice) return 'stable';
    return safeGasPrice > previousGasPrice ? 'up' : 'down';
  });
  
  // Mercury color based on utilization
  const mercuryColor = $derived(() => {
    if (safeUtilization <= 50) return '#10b981'; // Green
    if (safeUtilization <= 75) return '#f59e0b'; // Yellow
    if (safeUtilization <= 90) return '#f97316'; // Orange
    return '#ef4444'; // Red
  });
  
  // Calculate mercury width (0-100% scale, max at 200 gwei)
  const mercuryWidth = $derived(Math.max(2, Math.min(100, (safeGasPrice / 200) * 100)));
  
  // Utilization status text
  const utilizationStatus = $derived(() => {
    if (safeUtilization <= 50) return 'Low';
    if (safeUtilization <= 75) return 'Moderate';
    if (safeUtilization <= 90) return 'High';
    return 'Critical';
  });
  
  // Format tooltip text
  const tooltipText = $derived(() => {
    return `Gas: ${safeGasPrice} gwei • Utilization: ${safeUtilization}% • ${utilizationStatus()} pressure`;
  });
</script>

<div class="pressure-wrapper">
  <div class="thermometer-bar">
    <div class="thermo-track">
      <div 
        class="thermo-fill" 
        style="width: {mercuryWidth}%; background-color: {mercuryColor()};"
      ></div>
      <div class="gas-label">
        <Tooltip text={tooltipText()}>
          {#snippet children()}
            <div class="gas-content">
              <span class="gas-value">{safeGasPrice.toFixed(2)}</span>
              <span class="gas-unit">gwei</span>
              {#if trend() === 'up'}
                <span class="trend trend-up">↑</span>
              {:else if trend() === 'down'}
                <span class="trend trend-down">↓</span>
              {/if}
            </div>
          {/snippet}
        </Tooltip>
      </div>
    </div>
  </div>
</div>

<style>
  .pressure-wrapper {
    width: 100%;
  }
  
  .thermometer-bar {
    width: 100%;
    display: block;
  }
  
  .thermo-track {
    height: 32px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  
  .thermo-fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 7px;
    opacity: 0.15;
  }
  
  .gas-label {
    position: relative;
    z-index: 1;
    padding: 0 0.75rem;
    width: 100%;
  }
  
  .gas-content {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  
  .gas-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .gas-unit {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
  }
  
  .trend {
    font-size: 0.875rem;
    margin-left: 0.125rem;
  }
  
  .trend-up {
    color: #ef4444;
  }
  
  .trend-down {
    color: #10b981;
  }
  
  @media (max-width: 640px) {
    .thermo-track {
      height: 36px;
    }
    
    .gas-value {
      font-size: 1.25rem;
      font-weight: 700;
    }
    
    .gas-unit {
      font-size: 0.6875rem;
    }
    
    .gas-label {
      justify-content: center;
    }
  }
</style>