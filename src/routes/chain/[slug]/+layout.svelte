<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import { sseConnection } from "$lib/stores/sse";
  import {
    getChainData,
    initializeChainDataFeed,
    cleanupChainDataFeed,
  } from "$lib/stores/chainDataStore";
  import {
    overviewStore,
    getChainById,
    getPeriodFromHours,
  } from "$lib/stores/overviewStore";
  import { analytics } from "$lib/analytics";
  import type { LayoutData } from "./$types";
  import { setContext } from "svelte";
  import type { PeriodType } from "$lib/stores/userPreferencesStore";
  import BookLayout from "../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../components/book/ChainInfoPage.svelte";
  import TabButton from "../../../components/book/ui/TabButton.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";

  let { data, children }: { data: LayoutData; children: any } = $props();

  // Track view duration
  let viewStartTime: number;

  // Get data directly from layout
  const chainStatic = $derived(data.chainStatic);

  // Get real-time chain data from SSE store
  const chainDataStore = data.chainId
    ? getChainData(data.chainId.toString())
    : null;

  // Derive chain status from store
  const chainStatus = $derived(chainDataStore ? $chainDataStore : null);
  const loadingStatus = $derived(!chainStatus);

  // Get chain data from overview store
  const chainOverviewStore = data.chainId ? getChainById(data.chainId) : null;
  const chainOverview = $derived(
    chainOverviewStore ? $chainOverviewStore : null,
  );
  const overviewStoreState = $derived($overviewStore);

  // Check if the overview data matches the requested period
  const isCorrectPeriod = $derived(
    overviewStoreState.data &&
      getPeriodFromHours(overviewStoreState.data.period_hours) === metricsSpan,
  );

  // State for metrics span - shared across all tabs
  // Initialize from overviewStore's current period if available, otherwise default
  let initialPeriod: PeriodType = overviewStoreState.currentPeriod
    ? (overviewStoreState.currentPeriod as PeriodType)
    : "24h";

  let metricsSpan = $state<PeriodType>(initialPeriod);
  let loadingDynamic = $state(false);

  // Actual loading state considering period mismatch
  const actualLoadingDynamic = $derived(
    overviewStoreState.isLoading || !isCorrectPeriod || !chainOverview,
  );

  // Load overview data when span changes
  let previousSpan = metricsSpan;
  $effect(() => {
    if (metricsSpan !== previousSpan) {
      previousSpan = metricsSpan;
      // The smart loading in overviewStore will handle avoiding unnecessary fetches
      overviewStore.load(metricsSpan);
    }
  });

  // Tabs configuration
  const tabIcons: Record<string, string> = {
    overview: "📋",
    resources: "📚",
    explorers: "🔍",
    development: "🛠️",
    wallets: "💰",
  };

  // Reference to tabs header for scroll preservation
  let tabsHeader = $state<HTMLDivElement>();

  // Determine active tab from current path
  const activeTab = $derived.by(() => {
    const path = $page.url.pathname;
    // Check for specific routes
    if (path.endsWith("/overview") || path.includes("/overview/"))
      return "overview";
    if (path.endsWith("/resources") || path.includes("/resources/"))
      return "resources";
    if (path.endsWith("/explorers") || path.includes("/explorers/"))
      return "explorers";
    if (path.includes("/development")) return "development";
    if (path.endsWith("/wallets") || path.includes("/wallets/"))
      return "wallets";
    // Base chain path (e.g., /chain/ethereum) should show overview as active
    if (path.match(/^\/chain\/[^\/]+$/)) return "overview";
    // Default to overview
    return "overview";
  });

  // Handle tab navigation
  function handleTabClick(tabId: string) {
    const basePath = `/chain/${data.slug}`;
    if (tabId === "development") {
      // Navigate to first development subtab - use replaceState to avoid creating history entries
      goto(`${basePath}/development/rpcs`, { replaceState: true });
    } else {
      goto(`${basePath}/${tabId}`, { replaceState: true });
    }
  }

  // Export snapshot for tabs scroll preservation
  export const snapshot = {
    capture: () => ({
      tabsScrollLeft: tabsHeader?.scrollLeft ?? 0,
    }),
    restore: (value) => {
      if (tabsHeader && value?.tabsScrollLeft !== undefined) {
        requestAnimationFrame(() => {
          if (tabsHeader) {
            tabsHeader.scrollLeft = value.tabsScrollLeft;
          }
        });
      }
    },
  };

  // Provide dynamic data to child pages via context
  setContext("chainDynamicData", {
    get chainStatic() {
      return chainStatic;
    },
    get chainDynamic() {
      return isCorrectPeriod ? chainOverview : null;
    }, // Only provide data if period matches
    get loadingDynamic() {
      return actualLoadingDynamic;
    },
    get metricsSpan() {
      return metricsSpan;
    },
    get chainStatus() {
      return chainStatus;
    },
    get loadingStatus() {
      return loadingStatus;
    },
    get activeTab() {
      return activeTab;
    },
    setMetricsSpan: (span: PeriodType) => {
      metricsSpan = span;
    },
  });

  function handleClose() {
    history.back();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  onMount(() => {
    // Track view start time
    viewStartTime = Date.now();

    // Initialize chain data feed for this specific chain
    if (data.chainId) {
      initializeChainDataFeed(data.chainId.toString());
    }

    // Load overview data only if needed (smart loading handles staleness check)
    overviewStore.load(metricsSpan);

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    // Track view duration
    if (viewStartTime && (chainStatic || data.name)) {
      const duration = Math.round((Date.now() - viewStartTime) / 1000);
      analytics.track("chain_view_duration", {
        chain_name: chainStatic?.name || data.name || data.slug,
        chain_id: data.chainId || 0,
        duration_seconds: duration,
      });
    }

    // Clean up polling for this specific chain
    if (data.chainId) {
      cleanupChainDataFeed(data.chainId.toString());
    }
  });
</script>

<!-- SSE Connection Status Indicator -->
{#if $sseConnection !== "connected"}
  <div
    class="sse-status-indicator"
    class:connecting={$sseConnection === "connecting"}
    class:error={$sseConnection === "error" ||
      $sseConnection === "disconnected"}
  >
    <span class="status-dot"></span>
    <span class="status-text">
      {#if $sseConnection === "connecting"}
        Connecting...
      {:else}
        Connection lost
      {/if}
    </span>
  </div>
{/if}

<!-- Book Layout with tabs inside -->
<BookLayout
  onClose={handleClose}
  brandColor={getAccessibleBrandColor(chainStatic?.color || "#3b82f6")}
  currentPath={$page.url.pathname}
>
  {#snippet leftPage()}
    <ChainInfoPage {chainStatic} />
  {/snippet}

  {#snippet rightPage()}
    <div class="page-content">
      <!-- Tabs Header inside the book -->
      {#if data.bookmarks}
        <div class="tabs-header" bind:this={tabsHeader}>
          {#each data.bookmarks as group}
            {#if group.id !== "wallets" || chainStatic?.technology?.isEVM}
              <TabButton
                active={activeTab === group.id}
                onclick={() => handleTabClick(group.id)}
                brandColor={getAccessibleBrandColor(
                  chainStatic?.color || "#3b82f6",
                )}
                icon={tabIcons[group.id]}
              >
                {group.name}
              </TabButton>
            {/if}
          {/each}
        </div>
      {/if}

      <!-- Tab content from child routes -->
      <div class="tab-content">
        {@render children()}
      </div>
    </div>
  {/snippet}
</BookLayout>

<style>
  .sse-status-indicator {
    position: fixed;
    top: 1rem;
    right: 5rem; /* Position to the left of the close button */
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 9999px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    font-size: 0.75rem;
    transition: opacity 0.2s ease;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .sse-status-indicator.connecting .status-dot {
    background-color: #eab308; /* Yellow */
  }

  .sse-status-indicator.error .status-dot {
    background-color: #ef4444; /* Red */
  }

  .status-text {
    color: #64748b;
    font-weight: 500;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .sse-status-indicator {
      top: 0.75rem;
      right: 4rem;
      font-size: 0.7rem;
      padding: 0.25rem 0.625rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
    }
  }

  /* Page content styles */
  .page-content {
    position: absolute;
    top: 2rem;
    right: 3rem;
    bottom: 2rem;
    left: 3rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .tabs-header {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 2.5rem;
    padding-bottom: 0;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 4px;
    padding-right: 2rem;
  }

  /* Mobile/Tablet view - single page */
  @media (max-width: 1280px) {
    .page-content {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      padding: 1.5rem;
      height: auto;
    }

    .tabs-header {
      margin-bottom: 1.5rem;
      gap: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tabs-header :global(.tab-button) {
      padding: 0.625rem 0.875rem;
      font-size: 0.75rem;
      flex: 0 0 auto;
      white-space: nowrap;
    }

    .tab-content {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
