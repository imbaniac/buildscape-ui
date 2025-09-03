<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

  import { analytics } from "$lib/analytics";
  import SEO from "$lib/components/SEO.svelte";
  import savedPositions from "$lib/positions.json";
  import { mapStore } from "$lib/stores/mapStore";
  import { searchChains } from "$lib/utils/searchUtils";

  import Header from "../components/Header.svelte";
  import PerformanceOverlay from "../components/PerformanceOverlay.svelte";
  import SearchBar from "../components/SearchBar.svelte";

  // Get map components from store
  const map = $derived($mapStore);
  const viewport = $derived(map.viewport);
  const mapRenderer = $derived(map.mapRenderer);
  const renderManager = $derived(map.renderManager);

  // Search state
  let searchQuery = $state("");
  let searchResults = $state<string[]>([]);
  let currentResultIndex = $state(0);
  let isSearchActive = $state(false);
  let hasSearched = $state(false);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Edit mode state (for dev)
  let editMode = $state(false);
  let showPositionsModal = $state(false);
  let positionsJson = $state("");

  // Performance metrics (for dev)
  let performanceMetrics = $state({
    fps: 0,
    renderCount: 0,
    isAnimating: false,
  });

  // Get parsed chains from page data for search
  const { data } = $props();

  // Search implementation
  function performSearch(query: string) {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    if (query.length < 3) {
      searchResults = [];
      currentResultIndex = 0;
      hasSearched = false;
      return;
    }

    searchDebounceTimer = setTimeout(() => {
      // Filter chains to only those with positions
      const chainsWithPositions: Record<string, any> = {};
      for (const [chainKey, chain] of Object.entries(data.chains || {})) {
        const position = (savedPositions as any)[chainKey];
        if (position) {
          chainsWithPositions[chainKey] = chain;
        }
      }

      // Use shared search utility for consistent search behavior
      const matches = searchChains(chainsWithPositions, query);

      searchResults = matches;
      currentResultIndex = 0;
      hasSearched = true;

      // Track search with no results
      if (matches.length === 0) {
        analytics.track("search_no_results", {
          query: query,
        });
      }

      // Navigate to first result if any
      if (matches.length > 0) {
        navigateToChain(matches[0]);
      }
    }, 300);
  }

  function navigateToChain(chainKey: string) {
    const position = (savedPositions as any)[chainKey];
    if (!position || !viewport) return;

    // Track search conversion if this was from a search
    if (searchQuery && searchResults.length > 0) {
      analytics.track("search_converted", {
        query: searchQuery,
        selected_chain: chainKey,
      });
    }

    // Animate to the island with a moderate zoom level
    viewport.animate({
      position: { x: position.x, y: position.y },
      scale: 0.25, // Less aggressive zoom - shows island with context
      time: 600, // Slightly faster animation
      ease: "easeInOutSine",
    });

    // Update search highlighting
    mapRenderer?.setSearchResults(searchResults);
    mapRenderer?.setCurrentSearchResult(chainKey);
    renderManager?.markDirty();
  }

  function handleSearchNavigation(direction: "prev" | "next") {
    if (searchResults.length === 0) return;

    if (direction === "next") {
      currentResultIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      currentResultIndex =
        (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    }

    navigateToChain(searchResults[currentResultIndex]);
  }

  function clearSearch() {
    searchQuery = "";
    searchResults = [];
    currentResultIndex = 0;
    isSearchActive = false;
    hasSearched = false;
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    // Clear search highlighting
    mapRenderer?.setSearchResults([]);
    mapRenderer?.setCurrentSearchResult(null);
    renderManager?.markDirty();
  }

  function savePositions() {
    // Get current positions from mapStore
    const currentPositions = map.islandPositions;
    positionsJson = JSON.stringify(currentPositions, null, 2);
    showPositionsModal = true;
  }

  function copyPositions() {
    navigator.clipboard
      .writeText(positionsJson)
      .then(() => {
        alert("Positions copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy to clipboard. Please copy manually.");
      });
  }

  // Update search results highlighting
  $effect(() => {
    if (mapRenderer) {
      mapRenderer.setSearchResults(searchResults);
      if (searchResults.length > 0) {
        mapRenderer.setCurrentSearchResult(searchResults[currentResultIndex]);
      } else {
        mapRenderer.setCurrentSearchResult(null);
      }
      renderManager?.markDirty();
    }
  });

  // Update edit mode in map renderer
  $effect(() => {
    if (mapRenderer) {
      mapRenderer.setEditMode(editMode);
    }
  });

  // Handle island clicks from viewport
  $effect(() => {
    if (viewport) {
      // Remove any existing listener
      viewport.off("clicked");

      // Add click handler
      viewport.on("clicked", (event) => {
        // Don't navigate if in edit mode
        if (editMode) {
          return;
        }

        const island = mapRenderer?.getIslandAtPosition(
          event.world.x,
          event.world.y,
        );

        if (island) {
          // Pass state to track that we came from the map view
          goto(`/chain/${island.slug}`, { state: { from: "/" } });
        }
      });
    }
  });

  // Keyboard shortcuts
  onMount(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      // Cmd/Ctrl + F to activate search
      if ((event.metaKey || event.ctrlKey) && event.key === "f") {
        event.preventDefault();
        isSearchActive = true;
        // Force focus to search input
        setTimeout(() => {
          const searchInput = document.querySelector(
            ".search-bar input",
          ) as HTMLInputElement;
          searchInput?.focus();
        }, 50);
      }
    };

    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  });

  // Update performance metrics in dev mode using effect
  let metricsInterval: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    // Start interval when renderManager becomes available
    if (import.meta.env.DEV && renderManager && !metricsInterval) {
      metricsInterval = setInterval(() => {
        if (renderManager) {
          performanceMetrics = renderManager.getMetrics();
        }
      }, 1000);
    }

    // Cleanup on destroy
    return () => {
      if (metricsInterval) {
        clearInterval(metricsInterval);
        metricsInterval = null;
      }
    };
  });

  // FAQ structured data for homepage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Chain ID for a blockchain network?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chain ID is a unique identifier for each blockchain network. You can find the Chain ID for any network by clicking on its island in our interactive map. Each chain page displays its Chain ID prominently.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add a blockchain network to MetaMask?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To add a network to MetaMask: 1) Click on any blockchain island in our map, 2) Click on Add to Wallet button.",
        },
      },
      {
        "@type": "Question",
        name: "What is the RPC URL for blockchain networks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RPC URLs allow your wallet or dApp to connect to blockchain networks. Each chain page on Buildscape provides multiple verified public RPC endpoints you can use for free.",
        },
      },
      {
        "@type": "Question",
        name: "Which blockchain has the lowest gas fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gas fees vary in real-time. Use our interactive blockchain map to compare current gas fees across all EVM chains. Layer 2 solutions like Base, Arbitrum, and Polygon typically offer lower fees than Ethereum mainnet.",
        },
      },
      {
        "@type": "Question",
        name: "What is a Layer 2 blockchain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Layer 2 (L2) blockchains are scaling solutions built on top of Layer 1 networks like Ethereum. They process transactions off the main chain for faster speeds and lower costs while inheriting security from the L1.",
        },
      },
    ],
  };
</script>

<SEO
  keywords="blockchain explorer, EVM chains, chain id, blockchain map, RPC endpoints, gas fees, layer 2, Ethereum, Base, Arbitrum, Polygon, MetaMask, blockchain metrics, TVL, TPS"
  canonical="https://buildscape.org"
  jsonLd={faqJsonLd}
  includeOrganization={true}
/>

<!-- UI Controls -->
{#if map.isReady}
  <Header />
  <SearchBar
    bind:searchQuery
    {searchResults}
    {currentResultIndex}
    isActive={isSearchActive}
    {hasSearched}
    onSearch={performSearch}
    onNavigate={handleSearchNavigation}
    onActivate={() => (isSearchActive = true)}
    onClear={clearSearch}
  />
{/if}

{#if import.meta.env.DEV}
  <div class="controls">
    <button onclick={() => (editMode = !editMode)} class:active={editMode}>
      {editMode ? "Exit Edit Mode" : "Edit Mode"}
    </button>
    {#if editMode}
      <button onclick={savePositions}>Save Positions</button>
    {/if}
  </div>
  <PerformanceOverlay
    fps={performanceMetrics.fps}
    renderCount={performanceMetrics.renderCount}
    isAnimating={performanceMetrics.isAnimating}
  />
{/if}

{#if showPositionsModal}
  <div class="positions-modal-backdrop">
    <div class="positions-modal">
      <h2>Island Positions</h2>
      <textarea readonly rows="20" cols="50">{positionsJson}</textarea>
      <div class="modal-buttons">
        <button onclick={copyPositions}>Copy to Clipboard</button>
        <button onclick={() => (showPositionsModal = false)}>Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
  }

  button {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button:hover {
    background-color: #f0f0f0;
  }

  button.active {
    background-color: #4a90e2;
    color: white;
  }

  button.active:hover {
    background-color: #357abd;
  }

  .positions-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .positions-modal {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .positions-modal h2 {
    margin: 0 0 15px 0;
    font-size: 1.5em;
  }

  .positions-modal textarea {
    flex: 1;
    min-height: 300px;
    font-family: monospace;
    font-size: 12px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
  }

  .modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    justify-content: flex-end;
  }

  /* Hide controls on mobile */
  @media (max-width: 640px) {
    .controls {
      display: none;
    }
  }
</style>
