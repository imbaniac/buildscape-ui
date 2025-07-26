<script lang="ts">
  import { overviewStore } from "$lib/stores/overviewStore";

  let overviewState = $derived($overviewStore);
  let overviewData = $derived(overviewState?.data);

  function formatNumber(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  }

  function formatCurrency(num: number) {
    return "$" + formatNumber(num);
  }

  // Check if mobile - using app's standard breakpoints
  let isMobile = $state(false);

  $effect(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth <= 768;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  });
</script>

<header class="header-container">
  <div class="resource-bar">
    <div class="resource-item">
      <span class="resource-icon">🏝️</span>
      <div class="resource-value">
        <span class="resource-number">{overviewData?.active_chains || 0}</span>
        <span class="resource-label">Chains</span>
      </div>
    </div>

    <div class="resource-divider"></div>

    <div class="resource-item">
      <span class="resource-icon">👥</span>
      <div class="resource-value">
        <span class="resource-number"
          >{formatNumber(overviewData?.total_active_addresses || 0)}</span
        >
        <span class="resource-label">Population (24h) </span>
      </div>
    </div>

    <div class="resource-divider"></div>

    <div class="resource-item">
      <span class="resource-icon">⚡</span>
      <div class="resource-value">
        <span class="resource-number"
          >{formatNumber(overviewData?.total_transactions || 0)}</span
        >
        <span class="resource-label">
          {isMobile ? "TXs (24h)" : "Transactions (24h)"}
        </span>
      </div>
    </div>

    <div class="resource-divider"></div>

    <div class="resource-item">
      <span class="resource-icon">💎</span>
      <div class="resource-value">
        <span class="resource-number"
          >{formatCurrency(overviewData?.total_tvl || 0)}</span
        >
        <span class="resource-label">TVL</span>
      </div>
    </div>
  </div>
</header>

<style>
  .header-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 12px 0;
  }

  .resource-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: linear-gradient(180deg, #2a2416 0%, #1f1a12 100%);
    border: 2px solid #4a3f2a;
    border-radius: 8px;
    padding: 8px 20px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  .resource-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
  }

  .resource-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
  }

  .resource-value {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .resource-number {
    font-size: 18px;
    font-weight: bold;
    color: #f4e4c1;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.5),
      0 0 12px rgba(255, 215, 0, 0.2);
    line-height: 1;
  }

  .resource-label {
    font-size: 11px;
    color: #a89568;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  .resource-divider {
    width: 1px;
    height: 32px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      #4a3f2a 20%,
      #4a3f2a 80%,
      transparent 100%
    );
  }

  .resource-item:hover .resource-number {
    color: #ffd700;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(255, 215, 0, 0.4);
  }

  /* Mobile styles - matching app's standard breakpoints */
  @media (max-width: 768px) {
    .header-container {
      padding: 8px;
      width: 100%;
      left: 0;
      transform: none;
    }

    .resource-bar {
      padding: 8px 12px;
      border-radius: 6px;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
    }

    .resource-item {
      padding: 0 8px;
      gap: 6px;
      flex: 1;
      justify-content: center;
    }

    .resource-icon {
      font-size: 20px;
    }

    .resource-value {
      align-items: center;
    }

    .resource-number {
      font-size: 14px;
    }

    .resource-label {
      font-size: 9px;
      text-align: center;
    }

    .resource-divider {
      height: 24px;
    }
  }

  /* Small mobile screens */
  @media (max-width: 640px) {
    .resource-bar {
      padding: 6px 8px;
    }

    .resource-item {
      padding: 0 6px;
      gap: 4px;
    }

    .resource-icon {
      font-size: 18px;
    }

    .resource-number {
      font-size: 13px;
    }

    .resource-label {
      font-size: 8px;
    }
  }

  /* Very small mobile screens */
  @media (max-width: 480px) {
    .resource-item {
      padding: 0 4px;
    }

    .resource-icon {
      font-size: 16px;
    }

    .resource-number {
      font-size: 12px;
    }

    .resource-divider {
      display: none; /* Remove dividers on very small screens to save space */
    }

    /* Hide labels on extra small screens */
    .resource-label {
      display: none;
    }
  }
</style>
