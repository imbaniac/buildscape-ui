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
  import { overviewStore, getChainById, getPeriodFromHours } from "$lib/stores/overviewStore";
  import { analytics } from "$lib/analytics";
  import type { LayoutData } from "./$types";
  import { setContext } from "svelte";
  import type { PeriodType } from "$lib/stores/userPreferencesStore";

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
  const chainOverview = $derived(chainOverviewStore ? $chainOverviewStore : null);
  const overviewStoreState = $derived($overviewStore);
  
  // Check if the overview data matches the requested period
  const isCorrectPeriod = $derived(
    overviewStoreState.data && 
    getPeriodFromHours(overviewStoreState.data.period_hours) === metricsSpan
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
    overviewStoreState.isLoading || !isCorrectPeriod || !chainOverview
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

  // Provide dynamic data to child pages via context
  setContext('chainDynamicData', {
    get chainStatic() { return chainStatic; },
    get chainDynamic() { return isCorrectPeriod ? chainOverview : null; }, // Only provide data if period matches
    get loadingDynamic() { return actualLoadingDynamic; },
    get metricsSpan() { return metricsSpan; },
    get chainStatus() { return chainStatus; },
    get loadingStatus() { return loadingStatus; },
    setMetricsSpan: (span: PeriodType) => { metricsSpan = span; }
  });

  // Determine where to navigate back to based on navigation state
  const backPath = $derived(
    $page.state?.from === "/chains" ? "/chains" : 
    $page.state?.from === "/" ? "/" :
    "/"
  );

  function handleClose() {
    goto(backPath);
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

{@render children()}

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
</style>
