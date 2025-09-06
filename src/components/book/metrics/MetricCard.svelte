<script lang="ts">
  import SkeletonLoader from "../ui/SkeletonLoader.svelte";
  import Tooltip from "../ui/Tooltip.svelte";

  interface Props {
    label: string;
    value?: string | number;
    tooltip?: string;
    loading?: boolean;
    formatter?: (value: number) => string;
    icon?: string;
    brandColor?: string;
  }

  let {
    label,
    value,
    tooltip,
    loading = false,
    formatter,
    icon,
    brandColor = "#3b82f6",
  }: Props = $props();

  // Map labels to icons - subtle strategy game icons
  const defaultIcons: Record<string, string> = {
    TPS: "⚡",
    Transactions: "💱",
    Population: "👥",
    Contracts: "📋",
  };

  const displayIcon = $derived(icon || defaultIcons[label] || "");
</script>

<div class="metric-card" style="--brand-color: {brandColor}">
  <div class="metric-header">
    {#if displayIcon}
      <span class="metric-icon">{displayIcon}</span>
    {/if}
    <span class="metric-label">{label}</span>
  </div>
  {#if loading}
    <SkeletonLoader height="24px" width="80%" />
  {:else if tooltip}
    <Tooltip text={tooltip}>
      <div class="metric-value-wrapper">
        {#if typeof value === "number" && formatter}
          <span class="metric-value with-tooltip">{formatter(value)}</span>
        {:else}
          <span class="metric-value with-tooltip">{value || "0"}</span>
        {/if}
      </div>
    </Tooltip>
  {:else}
    <div class="metric-value-wrapper">
      {#if typeof value === "number" && formatter}
        <span class="metric-value">{formatter(value)}</span>
      {:else}
        <span class="metric-value"
          >{value === null || value === undefined ? "--" : value || "0"}</span
        >
      {/if}
    </div>
  {/if}
</div>

<style>
  .metric-card {
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
    border: 1px solid #d1d5db;
    border-top: 3px solid #e5e7eb;
    border-radius: 6px 6px 4px 4px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: visible;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.05),
      inset 0 2px 4px rgba(255, 255, 255, 0.9);
  }

  /* Tab indicator line */
  .metric-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: var(--brand-color);
    border-radius: 0 0 3px 3px;
  }

  /* Folder edge shadow */
  .metric-card::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: -1px;
    right: -1px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(52, 73, 94, 0.1) 20%,
      rgba(52, 73, 94, 0.1) 80%,
      transparent
    );
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 -2px 6px rgba(44, 62, 80, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: #d1d5db;
    background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  }

  .metric-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    position: relative;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid rgba(52, 73, 94, 0.08);
  }

  .metric-icon {
    font-size: 1rem;
    opacity: 0.7;
  }

  .metric-label {
    font-size: 0.5625rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: var(--font-ui);
  }

  .metric-value-wrapper {
    position: relative;
  }

  .metric-value {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    font-family: var(--font-mono);
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
      text-align: center;
      width: 100%;
    }
  }
</style>
