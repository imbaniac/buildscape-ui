<script lang="ts">
  interface Props {
    percentage: number;
  }

  let { percentage }: Props = $props();

  // Ensure percentage is a valid number
  const safePercentage = $derived(Math.max(0, Math.min(100, percentage || 0)));

  const utilizationColor = $derived(
    safePercentage <= 50
      ? "#10b981"
      : safePercentage <= 75
        ? "#f59e0b"
        : safePercentage <= 90
          ? "#f97316"
          : "#ef4444",
  );
</script>

<div class="utilization-container">
  <div class="utilization-bar">
    <div
      class="utilization-fill"
      style="width: {safePercentage}%; background-color: {utilizationColor};"
    ></div>
  </div>
  <span class="utilization-text">{safePercentage}%</span>
</div>

<style>
  .utilization-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .utilization-bar {
    flex: 1;
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }

  .utilization-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    min-width: 2px;
    transition:
      width 0.3s ease,
      background-color 0.3s ease;
    border-radius: 6px;
  }

  .utilization-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    min-width: 2.5rem;
    text-align: right;
  }
</style>
