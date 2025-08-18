<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { overviewStore } from "$lib/stores/overviewStore";

  let overviewState = $derived($overviewStore);
  let overviewData = $derived(overviewState?.data);

  // Determine current view based on route
  const isTableView = $derived($page.route.id === "/chains");
  const isMapView = $derived($page.route.id === "/");

  function formatNumber(num: number) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  }

  function formatCurrency(num: number) {
    return "$" + formatNumber(num);
  }
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
        <span class="resource-label">
          <span class="desktop-text">Population (24h)</span>
          <span class="mobile-text">Users</span>
        </span>
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
          <span class="mobile-text">TXs (24h)</span>
          <span class="desktop-text">Transactions (24h)</span>
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

    <!-- Separator between metrics and view toggle -->
    <div class="brass-separator"></div>

    <!-- View Toggle -->
    <div class="view-toggle">
      <button
        class="view-btn view-btn-left"
        class:active={isMapView}
        onclick={() => goto("/")}
        aria-label="Map view"
      >
        <span class="btn-icon">🗺️</span>
        <span class="btn-label">Map</span>
      </button>
      <button
        class="view-btn view-btn-right"
        class:active={isTableView}
        onclick={() => goto("/chains")}
        aria-label="Table view"
      >
        <span class="btn-icon">📊</span>
        <span class="btn-label">Table</span>
      </button>
    </div>
  </div>
</header>

<style>
  .header-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    padding: 12px 0;
  }

  .resource-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: linear-gradient(180deg, #3a4456 0%, #2c3542 100%);
    border: 1px solid #525e72;
    border-radius: 8px;
    padding: 8px 20px;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  }

  .resource-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
  }

  .resource-icon {
    font-size: 24px;
    filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.5));
  }

  .resource-value {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .resource-number {
    font-size: 18px;
    font-weight: bold;
    color: #f0e6d2;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 8px rgba(240, 230, 210, 0.2);
    line-height: 1;
  }

  .resource-label {
    font-size: 11px;
    color: #9ca3b0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
    white-space: nowrap;
  }

  /* Show/hide text based on screen size */
  .mobile-text {
    display: none;
  }

  .desktop-text {
    display: inline;
  }

  @media (max-width: 640px) {
    .mobile-text {
      display: inline;
    }

    .desktop-text {
      display: none;
    }
  }

  .resource-divider {
    width: 1px;
    height: 32px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      #525e72 20%,
      #525e72 80%,
      transparent 100%
    );
  }

  .resource-item:hover .resource-number {
    color: #ffd700;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 12px rgba(255, 215, 0, 0.3);
  }

  /* Brass Separator */
  .brass-separator {
    width: 2px;
    height: 36px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      #7a8599 15%,
      #9ca3b0 50%,
      #7a8599 85%,
      transparent 100%
    );
    margin: 0 12px;
    box-shadow: 0 0 2px rgba(156, 163, 176, 0.3);
  }

  /* View Toggle - Segmented Control */
  .view-toggle {
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    border: 1px solid #525e72;
    margin-right: 12px;
  }

  .view-btn {
    height: 40px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: #9ca3b0;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .view-btn-left {
    border-radius: 5px 0 0 5px;
    border-right: 1px solid #525e72;
  }

  .view-btn-right {
    border-radius: 0 5px 5px 0;
  }

  .view-btn:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
    color: #c8cdd6;
  }

  .view-btn.active {
    background: linear-gradient(135deg, #4a7c59, #3a6c49);
    color: #ffffff;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .btn-icon {
    font-size: 16px;
    filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.3));
  }

  .btn-label {
    line-height: 1;
  }

  /* Mobile styles - matching app's standard breakpoints */
  @media (max-width: 640px) {
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

  /* Mobile screens */
  @media (max-width: 640px) {
    .resource-bar {
      padding: 8px;
      flex-wrap: wrap;
      justify-content: space-between;
      row-gap: 10px;
    }

    .resource-item {
      padding: 0 6px;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .resource-value {
      min-height: 32px;
      justify-content: center;
    }

    .resource-icon {
      font-size: 18px;
    }

    .resource-number {
      font-size: 14px;
      font-weight: 700;
    }

    .resource-label {
      font-size: 9px;
      letter-spacing: 0.3px;
    }

    .resource-divider {
      height: 28px;
    }

    /* Hide brass separator on mobile - view toggle goes to new line */
    .brass-separator {
      display: none;
    }

    /* View toggle on its own line */
    .view-toggle {
      width: 100%;
      margin: 0;
      display: flex;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      border: 1px solid #525e72;
      padding: 2px;
    }

    .view-btn {
      height: 36px;
      padding: 0;
      font-size: 12px;
      gap: 5px;
      flex: 1;
      border: none;
      border-radius: 6px;
      justify-content: center;
      align-items: center;
    }

    .view-btn-left {
      border-radius: 6px;
      border-right: none;
    }

    .view-btn-right {
      border-radius: 6px;
    }

    .view-btn.active {
      background: linear-gradient(135deg, #4a7c59, #3a6c49);
      color: #ffffff;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    }

    .btn-icon {
      font-size: 16px;
    }

    .btn-label {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
</style>
