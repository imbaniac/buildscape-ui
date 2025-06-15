<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import BookLayout from "../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../components/book/ChainDetailsPage.svelte";
  import { sseConnection } from "$lib/stores/sse";
  import { getChainData, initializeChainDataFeed, cleanupChainDataFeed } from "$lib/stores/chainDataStore";
  import type { PageData } from "./$types";
  import type { BookmarkTab, BookmarkField } from "$lib/types";

  let { data }: { data: PageData } = $props();

  let activeTab = $state(data.initialTab);
  let activeGroup = $state(data.initialTab);
  let metricsSpan = $state<"1h" | "24h" | "7d" | "30d">(data.initialSpan);
  let chainDynamic = $state<any>(null);
  let loadingDynamic = $state(false);
  
  // Get real-time chain data from SSE store
  const chainDataStore = data.chainStatic?.chainId ? getChainData(data.chainStatic.chainId.toString()) : null;
  
  // Derive chain status from store
  const chainStatus = $derived(chainDataStore ? $chainDataStore : null);
  const loadingStatus = $derived(!chainStatus);

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
    // Initialize chain data feed for this specific chain
    if (data.chainStatic?.chainId) {
      initializeChainDataFeed(data.chainStatic.chainId.toString());
    }
    
    // Load dynamic metrics history
    loadDynamic(metricsSpan);
    
    window.addEventListener("keydown", handleKeydown);
    
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    // Clean up polling for this specific chain
    if (data.chainStatic?.chainId) {
      cleanupChainDataFeed(data.chainStatic.chainId.toString());
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
</script>

<!-- SSE Connection Status Indicator -->
{#if $sseConnection !== 'connected'}
  <div class="sse-status-indicator" class:connecting={$sseConnection === 'connecting'} class:error={$sseConnection === 'error' || $sseConnection === 'disconnected'}>
    <span class="status-dot"></span>
    <span class="status-text">
      {#if $sseConnection === 'connecting'}
        Connecting...
      {:else}
        Connection lost
      {/if}
    </span>
  </div>
{/if}

<BookLayout onClose={handleClose}>
  {#snippet leftPage()}
    <ChainInfoPage 
      chainStatic={data.chainStatic}
      {chainDynamic}
      {chainStatus}
      {loadingDynamic}
      {loadingStatus}
      {metricsSpan}
      onSpanChange={(span) => metricsSpan = span}
    />
  {/snippet}
  
  {#snippet rightPage()}
    <ChainDetailsPage
      chainStatic={data.chainStatic}
      bookmarks={data.bookmarks}
      walletsByCategory={data.walletsByCategory}
      {activeTab}
      {activeGroup}
      onTabClick={handleTabClick}
    />
  {/snippet}
</BookLayout>

<style>
  .sse-status-indicator {
    position: fixed;
    top: 1rem;
    right: 5rem; /* Position to the left of the close button */
    z-index: 15;
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
  @media (max-width: 800px) {
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