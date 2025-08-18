<script lang="ts">
  import Tooltip from "../ui/Tooltip.svelte";

  interface Props {
    gasPrice: number;
    fullGasPrice?: number;
  }

  let { gasPrice, fullGasPrice }: Props = $props();

  const gasLevel = $derived(
    gasPrice <= 10
      ? { level: "low", color: "#10b981", label: "Low" }
      : gasPrice <= 30
        ? { level: "medium", color: "#f59e0b", label: "Medium" }
        : gasPrice <= 50
          ? { level: "high", color: "#f97316", label: "High" }
          : { level: "very-high", color: "#ef4444", label: "Very High" },
  );

  // Convert gas price to angle (0-180 degrees)
  const meterAngle = $derived(Math.min((gasPrice / 100) * 180, 180));
</script>

<div class="gas-meter-container">
  <div class="gas-meter">
    <svg viewBox="0 0 120 65" class="meter-svg">
      <!-- Background arc -->
      <path
        d="M 10 60 A 50 50 0 0 1 110 60"
        fill="none"
        stroke="#e2e8f0"
        stroke-width="6"
        stroke-linecap="round"
      />
      <!-- Colored arc -->
      <path
        d="M 10 60 A 50 50 0 0 1 110 60"
        fill="none"
        stroke={gasLevel.color}
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray={`${(meterAngle / 180) * 157} 157`}
        class="meter-fill-path"
      />
    </svg>
    <div class="gas-value-container">
      {#if fullGasPrice !== undefined && fullGasPrice !== gasPrice}
        <Tooltip text={`${fullGasPrice.toFixed(9)} gwei`}>
          <span class="gas-value">{gasPrice}</span>
          <span class="gas-unit">gwei</span>
        </Tooltip>
      {:else}
        <span class="gas-value">{gasPrice}</span>
        <span class="gas-unit">gwei</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .gas-meter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .gas-meter {
    position: relative;
    width: 100%;
    max-width: 90px;
    height: 45px;
  }

  .meter-svg {
    width: 100%;
    height: 100%;
  }

  .meter-fill-path {
    transition:
      stroke-dasharray 0.3s ease,
      stroke 0.3s ease;
  }

  .gas-value-container {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .gas-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  .gas-unit {
    font-size: 0.5625rem;
    color: #64748b;
    margin-left: 1px;
  }

  @media (max-width: 640px) {
    .gas-meter {
      max-width: 80px;
      height: 40px;
    }

    .gas-value {
      font-size: 0.75rem;
    }

    .gas-unit {
      font-size: 0.5rem;
    }
  }
</style>
