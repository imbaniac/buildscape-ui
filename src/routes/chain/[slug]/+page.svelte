<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { marked } from "marked";
  import type { PageData } from "./$types";
  import type { BookmarkTab, BookmarkField, Wallet, WalletsByCategory } from "$lib/types";

  let { data }: { data: PageData } = $props();

  function formatNumber(num: number | string): string {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return num.toString();

    if (n >= 1e9) {
      return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (n >= 1e6) {
      return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (n >= 1e3) {
      return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return n.toString();
  }

  function formatNumberWithCommas(num: number | string): string {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return num.toString();
    return n.toLocaleString();
  }

  let activeTab = $state(data.initialTab);
  let activeGroup = $state(data.initialTab);
  let metricsSpan = $state<"1h" | "24h" | "7d" | "30d">(data.initialSpan);
  let chainDynamic = $state<any>(null);
  let loadingDynamic = $state(false);
  
  const tabGroups = $derived(
    data.bookmarks.map((group: BookmarkTab) => ({
      ...group,
      isActive: group.id === activeTab || group.fields.some((f: BookmarkField) => f.field === activeTab)
    }))
  );

  $effect(() => {
    const currentTab = $page.url.searchParams.get("tab") || "overview";
    const currentSpan = $page.url.searchParams.get("span") || "24h";

    // Only update URL if values have actually changed
    if (currentTab !== activeTab || currentSpan !== metricsSpan) {
      const url = new URL($page.url);
      url.searchParams.set("tab", activeTab);
      url.searchParams.set("span", metricsSpan);
      goto(url.toString(), { replaceState: true, noScroll: true });
    }
  });
  
  function handleTabClick(tabId: string, groupId: string) {
    activeTab = tabId;
    activeGroup = groupId;
  }
  
  $effect(() => {
    // Update activeGroup based on activeTab
    const group = data.bookmarks.find((g: BookmarkTab) => 
      g.id === activeTab || g.fields.some((f: BookmarkField) => f.field === activeTab)
    );
    if (group) {
      activeGroup = group.id;
    }
  });

  async function loadDynamic(span: "1h" | "24h" | "7d" | "30d") {
    if (!data.dynamicLoader) return;

    loadingDynamic = true;
    try {
      chainDynamic = await data.dynamicLoader(span);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
    } finally {
      loadingDynamic = false;
    }
  }

  function handleClose() {
    goto("/");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  onMount(() => {
    loadDynamic(metricsSpan);
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // React to metricsSpan changes after initial mount
  let isInitialized = false;
  $effect(() => {
    if (isInitialized) {
      loadDynamic(metricsSpan);
    } else {
      isInitialized = true;
    }
  });
</script>

<div class="book-fullscreen">
  <div class="book-header">
    <button
      class="close-button"
      onclick={handleClose}
      aria-label="Close and return to map"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <div class="book-spread">
    <!-- Left Page -->
    <div class="book-page book-page-left">
      <div class="page-content">
        <div class="chain-header">
          {#if data.chainStatic.logoUrl}
            <img
              src={data.chainStatic.logoUrl}
              alt={data.chainStatic.name + " logo"}
              class="chain-logo"
            />
          {/if}
          <h1 class="chain-title">{data.chainStatic.name}</h1>
          <div class="chain-subtitle">Chain ID: {data.chainStatic.chainId}</div>
        </div>
        
        <div class="chain-metadata">
          {#if data.chainStatic.parentOrganization}
            <div class="metadata-org">Built by {data.chainStatic.parentOrganization}</div>
          {/if}
          <div class="metadata-tech">
            {#if data.chainStatic.technology?.isL2}
              <span class="tech-tag l2">L2</span>
            {:else}
              <span class="tech-tag l1">L1</span>
            {/if}
            {#if data.chainStatic.technology?.type}
              <span class="tech-tag">{data.chainStatic.technology.type}</span>
            {/if}
            {#if data.chainStatic.technology?.stack}
              <span class="tech-tag">{data.chainStatic.technology.stack}</span>
            {/if}
            {#if data.chainStatic.technology?.isEVM}
              <span class="tech-tag evm">EVM Compatible</span>
            {/if}
          </div>
          {#if data.chainStatic.technology?.settlementLayer}
            <div class="metadata-settlement">Settles on {data.chainStatic.technology.settlementLayer}</div>
          {/if}
        </div>

        {#if chainDynamic}
          <div class="network-status">
            <h3>Network Status</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Last Block</span>
                <span class="status-value"
                  >{formatNumberWithCommas(chainDynamic.lastBlock)}</span
                >
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
                  <span class="info-icon">
                    ⓘ
                    <span class="info-tooltip">Based on last 5 blocks</span>
                  </span>
                </span>
                <span class="status-value">
                  {chainDynamic.utilization || "85%"}
                </span>
              </div>
            </div>
          </div>
        {/if}

        <div class="metrics-section">
          <h3>Activity Metrics</h3>
          <div class="metrics-tabs">
            {#each ["1h", "24h", "7d", "30d"] as span}
              <button
                class="metric-tab"
                class:active={metricsSpan === span}
                onclick={() =>
                  (metricsSpan = span as "1h" | "24h" | "7d" | "30d")}
              >
                {span}
              </button>
            {/each}
          </div>

          {#if loadingDynamic}
            <div class="metrics-loading">
              <div class="spinner"></div>
              <span>Loading metrics...</span>
            </div>
          {:else if chainDynamic}
            <div class="metrics-grid">
              <div class="metric-card">
                <span class="metric-label">TPS</span>
                <span class="metric-value"
                  >{chainDynamic.metrics.txPerSecond}</span
                >
              </div>
              <div class="metric-card">
                <span class="metric-label">Transactions</span>
                <span class="metric-value with-tooltip">
                  {formatNumber(chainDynamic.metrics.numTransactions)}
                  <span class="value-tooltip"
                    >{formatNumberWithCommas(
                      chainDynamic.metrics.numTransactions
                    )}</span
                  >
                </span>
              </div>
              <div class="metric-card">
                <span class="metric-label">Users</span>
                <span class="metric-value with-tooltip">
                  {formatNumber(chainDynamic.metrics.uniqueUsers)}
                  <span class="value-tooltip"
                    >{formatNumberWithCommas(
                      chainDynamic.metrics.uniqueUsers
                    )}</span
                  >
                </span>
              </div>
              <div class="metric-card">
                <span class="metric-label">Contracts</span>
                <span class="metric-value with-tooltip">
                  {formatNumber(chainDynamic.metrics.contractsDeployed)}
                  <span class="value-tooltip"
                    >{formatNumberWithCommas(
                      chainDynamic.metrics.contractsDeployed
                    )}</span
                  >
                </span>
              </div>
            </div>
          {:else}
            <div class="no-metrics">
              <p>No live metrics available</p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Book Spine -->
    <div class="book-spine-effect"></div>

    <!-- Right Page -->
    <div class="book-page book-page-right">
      <div class="page-content">
        <div class="tabs-container">
          <div class="tabs-header">
            {#each data.bookmarks as group}
              {#if group.id !== 'wallets' || data.chainStatic.technology?.isEVM}
                <button
                  class="tab-button"
                  class:active={tabGroups.find(g => g.id === group.id)?.isActive}
                  onclick={() => handleTabClick(group.id, group.id)}
                >
                  {group.name}
                </button>
              {/if}
            {/each}
          </div>

          <div class="tab-content">
            {#if activeTab === "overview"}
              <div class="prose">
                {@html marked.parse(data.chainStatic.description)}

                <h3>Contract Languages</h3>
                <div class="contract-languages-section">
                  <p>
                    This blockchain supports the following smart contract
                    languages:
                  </p>
                  <div class="languages-grid">
                    <a
                      href={data.chainStatic.contractLanguages.primary.url}
                      target="_blank"
                      class="language-card primary"
                    >
                      <span class="language-name"
                        >{data.chainStatic.contractLanguages.primary.name}</span
                      >
                      <span class="language-badge">Primary</span>
                    </a>
                    {#if data.chainStatic.contractLanguages.others?.length}
                      {#each data.chainStatic.contractLanguages.others as lang}
                        <a
                          href={lang.url}
                          target="_blank"
                          class="language-card"
                        >
                          <span class="language-name">{lang.name}</span>
                        </a>
                      {/each}
                    {/if}
                  </div>
                </div>
              </div>
            {:else if activeGroup === "resources"}
              <div class="resources-sections">
                {#each data.bookmarks.find((g: BookmarkTab) => g.id === 'resources')?.fields || [] as field}
                  {#if data.chainStatic[field.field]?.length > 0}
                    <div class="resource-section">
                      <h4 class="section-title">{field.label}</h4>
                      <div class="links-list">
                        {#each data.chainStatic[field.field] || [] as link}
                          {#if typeof link === 'string'}
                            <a href={link} target="_blank" class="link-item">
                              <span class="link-icon">{field.icon}</span>
                              <span>{link}</span>
                            </a>
                          {:else}
                            <a href={link.url} target="_blank" class="link-item">
                              <span class="link-icon">{field.icon}</span>
                              <span>{link.name}</span>
                            </a>
                          {/if}
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {:else if activeGroup === "explorers"}
              <div class="links-list">
                {#each data.chainStatic.blockscanners || [] as link}
                  <a href={link} target="_blank" class="link-item">
                    <span class="link-icon">🔍</span>
                    <span>{link}</span>
                  </a>
                {/each}
              </div>
            {:else if activeGroup === "development"}
              {@const activeField = data.bookmarks.find((g: BookmarkTab) => g.id === 'development')?.fields.find((f: BookmarkField) => f.field === activeTab) || data.bookmarks.find((g: BookmarkTab) => g.id === 'development')?.fields[0]}
              {#if activeField}
                <div class="subtabs">
                  {#each data.bookmarks.find((g: BookmarkTab) => g.id === 'development')?.fields || [] as field}
                    <button
                      class="subtab-button"
                      class:active={activeTab === field.field || (activeTab === 'development' && field === activeField)}
                      onclick={() => (activeTab = field.field)}
                    >
                      {field.label}
                    </button>
                  {/each}
                </div>
                {#if activeField.field === 'rpcs' && data.chainStatic.rpcs}
                  <div class="rpc-section">
                    {#if data.chainStatic.rpcs.public?.length}
                      <h4>Public RPCs</h4>
                      <div class="links-list">
                        {#each data.chainStatic.rpcs.public as rpc}
                          <div class="link-item">
                            <span class="link-icon">🌐</span>
                            <span>{rpc}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}
                    {#if data.chainStatic.rpcs.private?.length}
                      <h4>Private RPCs</h4>
                      <div class="links-list">
                        {#each data.chainStatic.rpcs.private as rpc}
                          <div class="link-item">
                            <span class="link-icon">🔒</span>
                            <span>{rpc}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {:else if activeField.field === 'testnets'}
                  <div class="links-list">
                    {#each data.chainStatic.testnets || [] as net}
                      <div class="link-item">
                        <span class="link-icon">{activeField.icon}</span>
                        <span>{typeof net === 'string' ? net : net.name}</span>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="links-list">
                    {#each data.chainStatic[activeField.field] || [] as link}
                      {#if typeof link === 'string'}
                        <a href={link} target="_blank" class="link-item">
                          <span class="link-icon">{activeField.icon}</span>
                          <span>{link}</span>
                        </a>
                      {:else}
                        <a href={link.url} target="_blank" class="link-item">
                          <span class="link-icon">{activeField.icon}</span>
                          <span>{link.name}</span>
                        </a>
                      {/if}
                    {/each}
                  </div>
                {/if}
              {/if}
            {:else if activeTab === "wallets" && data.chainStatic.technology?.isEVM}
              <div class="wallets-section">
                {#each Object.entries(data.walletsByCategory as WalletsByCategory) as [category, wallets]}
                  {#if wallets.length > 0}
                    <div class="wallet-category">
                      <h4 class="category-title">{category}</h4>
                      <div class="wallets-grid">
                        {#each wallets as wallet}
                          <a href={wallet.url} target="_blank" class="wallet-item">
                            {#if wallet.logo}
                              <img src={wallet.logo} alt={wallet.name} class="wallet-logo" />
                            {:else}
                              <span class="wallet-icon">👛</span>
                            {/if}
                            <span class="wallet-name">{wallet.name}</span>
                          </a>
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {:else}
              <div class="no-content">
                <p>No data available for this section</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .book-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    overflow: hidden;
    z-index: 1000;
  }

  .book-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    z-index: 10;
  }

  .close-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .close-button:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .book-spread {
    display: flex;
    height: 100vh;
    padding: 60px 40px 40px;
    gap: 0;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .book-spread::before {
    content: '';
    position: absolute;
    top: 60px;
    bottom: 40px;
    left: 50%;
    width: 40px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(0, 0, 0, 0.02) 10%,
      rgba(0, 0, 0, 0.04) 20%,
      rgba(0, 0, 0, 0.06) 30%,
      rgba(0, 0, 0, 0.08) 40%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.08) 60%,
      rgba(0, 0, 0, 0.06) 70%,
      rgba(0, 0, 0, 0.04) 80%,
      rgba(0, 0, 0, 0.02) 90%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .book-page {
    background: white;
    height: calc(100vh - 100px);
    width: calc(50vw - 42px);
    max-width: 700px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
  }

  .book-page-left {
    border-radius: 20px 2px 2px 20px;
    background: linear-gradient(to right, #ffffff 0%, #fcfcfc 95%, #f8f8f8 100%);
    overflow: hidden;
    position: relative;
    margin-right: -1px;
  }

  .book-page-right {
    border-radius: 2px 20px 20px 2px;
    background: linear-gradient(to left, #ffffff 0%, #fcfcfc 95%, #f8f8f8 100%);
    position: relative;
    margin-left: -1px;
  }

  .book-spine-effect {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .book-spine-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(ellipse at center,
      rgba(0, 0, 0, 0.12) 0%,
      rgba(0, 0, 0, 0.08) 20%,
      rgba(0, 0, 0, 0.05) 40%,
      rgba(0, 0, 0, 0.02) 60%,
      transparent 100%
    );
  }

  .book-spine-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.06) 10%,
      rgba(0, 0, 0, 0.08) 50%,
      rgba(0, 0, 0, 0.06) 90%,
      transparent 100%
    );
  }

  .page-content {
    padding: 3rem;
    height: 100%;
    overflow-y: auto;
  }

  .book-page-left .page-content {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding-right: 3.5rem;
  }

  .book-page-right .page-content {
    padding: 4rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .chain-header {
    text-align: center;
    margin-bottom: 0;
  }

  .chain-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    display: block;
  }

  .chain-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1a202c;
  }

  .chain-subtitle {
    font-size: 1.1rem;
    color: #64748b;
    font-weight: 500;
  }

  .chain-metadata {
    margin-top: 1.5rem;
    padding: 1.25rem 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .metadata-org {
    font-size: 0.875rem;
    color: #475569;
    font-weight: 500;
  }

  .metadata-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    white-space: nowrap;
  }

  .tech-tag.l1 {
    background: #fef3c7;
    border-color: #fcd34d;
    color: #92400e;
  }

  .tech-tag.l2 {
    background: #dbeafe;
    border-color: #60a5fa;
    color: #1e40af;
  }

  .tech-tag.evm {
    background: #e0e7ff;
    border-color: #a5b4fc;
    color: #3730a3;
  }

  .metadata-settlement {
    font-size: 0.8125rem;
    color: #64748b;
    font-style: italic;
  }

  .network-status h3,
  .metrics-section h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .network-status {
    margin-bottom: 0;
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

  .info-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.25rem);
    background: #1e293b;
    color: white;
    padding: 0.375rem 0.625rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s,
      transform 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-transform: none;
    letter-spacing: normal;
  }

  .info-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1e293b;
  }

  .info-icon:hover .info-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-0.5rem);
  }

  .status-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .metrics-section {
    margin-bottom: 0;
  }

  .metrics-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .metric-tab {
    padding: 0.5rem 1.25rem;
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
  }

  .metric-tab:hover {
    background: #e2e8f0;
  }

  .metric-tab.active {
    background: #3b82f6;
    color: white;
  }

  .metrics-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: #64748b;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

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

  .status-value,
  .metric-value {
    position: relative;
  }

  .with-tooltip {
    cursor: help;
  }

  .value-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.25rem);
    background: #1e293b;
    color: white;
    padding: 0.375rem 0.625rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s,
      transform 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .value-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1e293b;
  }

  .with-tooltip:hover .value-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-0.5rem);
  }

  .no-metrics {
    text-align: center;
    padding: 3rem;
    color: #64748b;
  }

  .tabs-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tabs-header {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 2.5rem;
    position: relative;
  }

  .tab-button {
    padding: 0.875rem 1.25rem;
    background: none;
    border: none;
    font-weight: 500;
    font-size: 0.9375rem;
    color: #64748b;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    margin-bottom: -1px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
    flex: 1;
    text-align: center;
    min-width: 0;
    white-space: nowrap;
  }
  
  .tab-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  .tab-button:hover {
    color: #334155;
  }

  .tab-button.active {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .tab-button.active::after {
    transform: scaleX(1);
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2rem;
  }

  .prose {
    color: #374151;
    line-height: 1.75;
    font-size: 1rem;
    max-width: 70ch;
    font-weight: 400;
    letter-spacing: -0.011em;
  }

  .prose :global(h1) {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.3;
    letter-spacing: -0.025em;
  }

  .prose :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.35;
    letter-spacing: -0.02em;
  }

  .prose :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    letter-spacing: -0.015em;
  }

  .prose :global(p) {
    margin-bottom: 1.25rem;
  }

  .prose :global(a) {
    color: #3b82f6;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;
  }

  .prose :global(a:hover) {
    color: #2563eb;
  }

  .prose :global(code) {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.875em;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  }

  .prose :global(pre) {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .prose :global(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #6b7280;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.75;
  }

  .prose :global(strong) {
    font-weight: 600;
    color: #111827;
  }

  .prose :global(em) {
    font-style: italic;
  }

  .prose :global(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 3rem 0;
  }

  .contract-languages-section {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .contract-languages-section p {
    color: #6b7280;
    margin-bottom: 1.25rem;
    font-size: 0.9375rem;
  }

  .languages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .language-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .language-card:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .language-card.primary {
    border-color: #4338ca;
    background: #f5f3ff;
  }

  .language-card.primary:hover {
    background: #ede9fe;
  }

  .language-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .language-badge {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4338ca;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s;
    font-size: 0.9375rem;
    line-height: 1.5;
    font-weight: 450;
  }

  a.link-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .link-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .rpc-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  .rpc-section h4:first-child {
    margin-top: 0;
  }

  .subtabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .subtab-button {
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .subtab-button:hover {
    background: #f1f5f9;
    color: #475569;
  }

  .subtab-button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .resources-sections {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .resource-section h4.section-title,
  .wallet-category h4.category-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  .resource-section:first-child h4.section-title {
    margin-top: 0;
  }

  .wallets-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .wallet-category:first-child h4.category-title {
    margin-top: 0;
  }

  .wallets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .wallet-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 450;
  }

  .wallet-item:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .wallet-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .wallet-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
    padding: 2px;
  }

  .wallet-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-content {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 0.9375rem;
  }

  @media (max-width: 1024px) {
    .book-spread {
      flex-direction: column;
      padding: 60px 20px 20px;
      gap: 0;
    }

    .book-spread::before,
    .book-spine-effect {
      display: none;
    }

    .book-page {
      width: 100%;
      max-width: 800px;
      height: 50%;
    }

    .book-page-left {
      border-radius: 20px 20px 4px 4px;
    }

    .book-page-right {
      border-radius: 4px 4px 20px 20px;
    }

    .page-content {
      padding: 2rem;
    }

    .book-page-right .page-content {
      padding: 2.5rem;
    }

    .chain-title {
      font-size: 2rem;
    }

    .book-page-left .page-content {
      gap: 2rem;
      padding-right: 2.5rem;
    }

    .status-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }

    .wallets-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }

  @media (max-width: 640px) {
    .book-spread {
      padding: 60px 10px 10px;
    }

    .page-content {
      padding: 1.5rem;
    }

    .book-page-left .page-content {
      padding-right: 2rem;
    }

    .book-page-right .page-content {
      padding: 2rem;
    }

    .prose {
      font-size: 0.9375rem;
    }

    .tab-content {
      padding-right: 0.5rem;
    }

    .chain-logo {
      width: 60px;
      height: 60px;
    }

    .chain-title {
      font-size: 1.75rem;
    }

    .tabs-header {
      gap: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    
    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tab-button {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      flex: 0 0 auto;
    }
  }
</style>
