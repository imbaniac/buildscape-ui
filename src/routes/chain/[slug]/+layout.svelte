<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import { sseConnection } from "$lib/stores/sse";
  import {
    getChainData,
    initializeChainDataFeed,
    cleanupChainDataFeed,
  } from "$lib/stores/chainDataStore";
  import { analytics } from "$lib/analytics";
  import type { LayoutData } from "./$types";
  import { setContext } from "svelte";

  let { data, children }: { data: LayoutData; children: any } = $props();

  // Track view duration
  let viewStartTime: number;

  // Get real-time chain data from SSE store
  const chainDataStore = data.chainStatic?.chainId
    ? getChainData(data.chainStatic.chainId.toString())
    : null;

  // Derive chain status from store
  const chainStatus = $derived(chainDataStore ? $chainDataStore : null);
  const loadingStatus = $derived(!chainStatus);

  // State for metrics span and dynamic data - shared across all tabs
  let metricsSpan = $state<"1h" | "24h" | "7d" | "30d">("24h");
  let chainDynamic = $state<any>(null);
  let loadingDynamic = $state(false);

  async function loadDynamic(span: "1h" | "24h" | "7d" | "30d") {
    const dynamicLoader = data.dynamicLoader;
    if (!dynamicLoader) return;

    loadingDynamic = true;
    try {
      chainDynamic = await dynamicLoader(span);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
    } finally {
      loadingDynamic = false;
    }
  }

  // Load dynamic data when loader becomes available
  $effect(() => {
    if (data.dynamicLoader && !chainDynamic) {
      loadDynamic(metricsSpan);
    }
  });

  // React to metricsSpan changes
  let previousSpan = metricsSpan;
  $effect(() => {
    if (metricsSpan !== previousSpan) {
      previousSpan = metricsSpan;
      loadDynamic(metricsSpan);
    }
  });

  // Provide dynamic data to child pages via context
  setContext('chainDynamicData', {
    get chainDynamic() { return chainDynamic; },
    get loadingDynamic() { return loadingDynamic; },
    get metricsSpan() { return metricsSpan; },
    get chainStatus() { return chainStatus; },
    get loadingStatus() { return loadingStatus; },
    setMetricsSpan: (span: "1h" | "24h" | "7d" | "30d") => { metricsSpan = span; }
  });

  function handleClose() {
    goto("/");
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
    if (data.chainStatic?.chainId) {
      initializeChainDataFeed(data.chainStatic.chainId.toString());
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    // Track view duration
    if (viewStartTime && data.chainStatic) {
      const duration = Math.round((Date.now() - viewStartTime) / 1000);
      analytics.track("chain_view_duration", {
        chain_name: data.chainStatic.name || data.chainStatic.slug,
        chain_id: data.chainStatic.chainId || 0,
        duration_seconds: duration,
      });
    }

    // Clean up polling for this specific chain
    if (data.chainStatic?.chainId) {
      cleanupChainDataFeed(data.chainStatic.chainId.toString());
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
