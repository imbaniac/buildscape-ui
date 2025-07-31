<script lang="ts">
  import { onMount } from "svelte";
  import CanvasRenderer from "$lib/canvas/CanvasRenderer";
  import ViewportManager from "$lib/canvas/ViewportManager";
  import InteractionManager from "$lib/canvas/InteractionManager";
  import PerformanceProfiler from "$lib/canvas/PerformanceProfiler";
  import { parseFrontmatterAndContent } from "$lib/utils/markdown";
  import {
    overviewStore,
    tvlLookupByChainId,
    tpsLookupByChainId,
  } from "$lib/stores/overviewStore";
  import savedPositions from "$lib/positions.json";
  import BoatLoader from "./BoatLoader.svelte";
  import FPSMeter from "./FPSMeter.svelte";
  import PerformanceMonitor from "./PerformanceMonitor.svelte";
  import Header from "./Header.svelte";
  import SearchBar from "./SearchBar.svelte";
  import { goto } from "$app/navigation";
  import { memoryDebugger } from "$lib/debug/MemoryDebugger";

  interface Props {
    initialSearchQuery?: string;
    isPaused?: boolean;
  }

  let { initialSearchQuery = "", isPaused = false }: Props = $props();

  // Canvas container
  let canvasContainer = $state<HTMLDivElement>();

  // Canvas layers
  let backgroundCanvas = $state<HTMLCanvasElement>();
  let islandsCanvas = $state<HTMLCanvasElement>();
  let interactionCanvas = $state<HTMLCanvasElement>();

  // Managers
  let renderer = $state<CanvasRenderer>();
  let viewportManager = $state<ViewportManager>();
  let interactionManager = $state<InteractionManager>();
  let profiler = $state<PerformanceProfiler>();

  // Animation frame
  let animationFrameId: number | null = null;

  // Interaction state
  let isPanning = $state(false);

  // Edit mode state
  let editMode = $state(false);
  let islandPositions = $state<Record<string, { x: number; y: number }>>(
    savedPositions && Object.keys(savedPositions).length > 0
      ? savedPositions
      : {},
  );
  let isDraggingIsland = $state(false);
  let draggedIsland = $state<string | null>(null);
  let showPositionsModal = $state(false);
  let positionsJson = $state("");

  // Search state
  let searchQuery = $state(initialSearchQuery || "");
  let searchResults = $state<string[]>([]);
  let currentResultIndex = $state(0);
  let isSearchActive = $state(false);
  let hasSearched = $state(false);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Store data
  let overviewStoreState = $derived($overviewStore);
  let tvlLookupMap = $derived($tvlLookupByChainId);
  let tpsLookupMap = $derived($tpsLookupByChainId);

  // Show loader until we have TVL data
  let showLoader = $derived(
    overviewStoreState.isLoading || !overviewStoreState.data,
  );

  // Import chain data modules
  const chainMdModules = import.meta.glob("/data/chains/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const logoAssets = import.meta.glob("/assets/chains/*", {
    eager: true,
    query: "?url",
    import: "default",
  });

  // Helper to resolve logo URL
  function resolveLogoUrl(logoFilename: string): string | undefined {
    for (const path in logoAssets) {
      if (path.endsWith("/" + logoFilename)) {
        return logoAssets[path] as string;
      }
    }
    return undefined;
  }

  // Load static chain data
  function loadStaticChains(): Record<string, any> {
    const chains: Record<string, any> = {};
    for (const path in chainMdModules) {
      const raw = chainMdModules[path] as string;
      if (!raw) continue;
      const { frontmatter, content } = parseFrontmatterAndContent(raw);
      const name = path.split("/").pop()?.replace(".md", "");
      if (!name) continue;
      let logoUrl = undefined;
      if (frontmatter.logo) {
        logoUrl = resolveLogoUrl(frontmatter.logo);
      }
      chains[name] = {
        ...frontmatter,
        logoUrl,
        description: content,
        name: frontmatter.name || name,
      };
    }
    return chains;
  }

  const staticChains: Record<string, any> = loadStaticChains();

  // Calculate island scale based on TVL
  function calculateIslandScale(tvl: number): number {
    const REFERENCE_TVL = 3_400_000_000; // Base TVL
    const REFERENCE_SCALE = 1.0;
    // Use power of 0.4 for more linear size differences
    const scale = REFERENCE_SCALE * Math.pow(tvl / REFERENCE_TVL, 0.4);
    const MIN_SCALE = 0.15; // Balanced minimum for visibility
    const MAX_SCALE = 2.5; // Increased for larger chains
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
  }

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
      const lowerQuery = query.toLowerCase().trim();
      const matches: string[] = [];

      // Search through all chains
      for (const [chainKey, chain] of Object.entries(staticChains)) {
        // Only search chains that have positions
        const position = (savedPositions as any)[chainKey];
        if (!position) continue;

        // Search in chain name (case insensitive)
        const chainName = chain.name?.toLowerCase() || chainKey.toLowerCase();
        if (chainName.includes(lowerQuery)) {
          matches.push(chainKey);
        }
      }

      searchResults = matches;
      currentResultIndex = 0;
      hasSearched = true;

      // Navigate to first result if any
      if (matches.length > 0) {
        navigateToChain(matches[0]);
      }
    }, 300);
  }

  function navigateToChain(chainKey: string) {
    const position = (savedPositions as any)[chainKey];
    if (!position || !viewportManager) return;

    // Center the viewport on the island with minimal zoom adjustment
    const currentScale = viewportManager.getScale();

    const minTargetScale = 0.2;
    const targetScale =
      currentScale < minTargetScale ? minTargetScale : currentScale;
    viewportManager.navigateTo(position.x, position.y, targetScale);

    // Update search highlighting
    renderer?.setSearchResults(searchResults);
    renderer?.setCurrentSearchResult(chainKey);

    // Trigger re-render
    renderer?.onViewportChange();
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
    renderer?.setSearchResults([]);
    renderer?.setCurrentSearchResult(null);
  }

  function savePositions() {
    positionsJson = JSON.stringify(islandPositions, null, 2);
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

  // Initialize island positions with saved positions or calculated positions
  $effect(() => {
    // Only set default positions if we don't have any loaded positions
    if (Object.keys(islandPositions).length === 0) {
      // Use default circular positions
      const positions: Record<string, { x: number; y: number }> = {};

      // Ethereum at center
      positions["ethereum"] = { x: 0, y: 0 };

      // L2s in a circle with larger radius
      const l2Chains = Object.entries(staticChains).filter(
        ([_, chain]) => chain.chainId !== 1,
      );
      l2Chains.forEach(([chainKey], i) => {
        const angle = (2 * Math.PI * i) / l2Chains.length;
        positions[chainKey] = {
          x: 5000 * Math.cos(angle),
          y: 5000 * Math.sin(angle),
        };
      });

      islandPositions = positions;
    }
  });

  // Build islands array from data
  $effect(() => {
    // Guard: Only run when ALL dependencies are ready
    if (!renderer || overviewStoreState.isLoading || !overviewStoreState.data) {
      return;
    }

    const islands = [];

    // Process all chains
    for (const [chainKey, chain] of Object.entries(staticChains)) {
      const position = islandPositions[chainKey];
      if (!position || !chain.chainId) continue;

      const tvl = tvlLookupMap.get(chain.chainId) || 0;
      const tps = tpsLookupMap.get(chain.chainId) || 0;
      const scale =
        tvl > 0 ? calculateIslandScale(tvl) : chain.chainId === 1 ? 1.8 : 0.6;

      islands.push({
        chainId: chain.chainId,
        name: chain.name,
        slug: chainKey,
        x: position.x,
        y: position.y,
        scale,
        tps,
        brandColor: chain.color || "#95060D",
        logoUrl: chain.logoUrl,
      });
    }

    renderer.setIslands(islands);
    interactionManager?.setIslands(islands);
  });

  // Update search results highlighting
  $effect(() => {
    if (renderer) {
      renderer.setSearchResults(searchResults);
      if (searchResults.length > 0) {
        renderer.setCurrentSearchResult(searchResults[currentResultIndex]);
      } else {
        renderer.setCurrentSearchResult(null);
      }
    }
  });

  // Update edit mode in interaction manager
  $effect(() => {
    if (interactionManager) {
      interactionManager.setEditMode(editMode);
    }
  });

  // Handle pause state
  $effect(() => {
    if (interactionManager) {
      // Disable interactions when paused
      interactionManager.setEnabled(!isPaused);
    }
  });

  onMount(() => {
    if (
      !backgroundCanvas ||
      !islandsCanvas ||
      !interactionCanvas ||
      !canvasContainer
    ) {
      console.error("Canvas elements not found");
      return;
    }

    // Initialize managers
    viewportManager = new ViewportManager();
    renderer = new CanvasRenderer(
      backgroundCanvas,
      islandsCanvas,
      interactionCanvas,
      viewportManager,
    );
    
    // Initialize performance profiler
    profiler = new PerformanceProfiler();
    renderer.setProfiler(profiler);
    
    interactionManager = new InteractionManager(
      canvasContainer,
      viewportManager,
      renderer,
      (panning) => {
        isPanning = panning;
      },
      (island) => {
        // Handle island click - navigate to chain page
        if (!editMode) {
          goto(`/chain/${island.slug}`);
        }
      },
      (island) => {
        // Handle hover change
        renderer?.setHoveredIsland(island);
      },
    );

    // Set up island position update callback
    interactionManager.setOnIslandMove((slug, x, y) => {
      // Update position in our state
      islandPositions[slug] = { x, y };
      // Force islands rebuild
      islandPositions = { ...islandPositions };
    });

    // Set up dragging state callback
    interactionManager.setOnDraggingChange((dragging) => {
      isDraggingIsland = dragging;
    });

    // Set up canvas size
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set canvas dimensions with device pixel ratio support for sharp rendering on retina screens
      const dpr = window.devicePixelRatio || 1;
      [backgroundCanvas, islandsCanvas, interactionCanvas].forEach((canvas) => {
        if (canvas) {
          // Set actual size in memory (scaled up for retina)
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          // Set display size (CSS pixels)
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          // Scale the drawing context to match device pixel ratio
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.scale(dpr, dpr);
          }
        }
      });

      // Update viewport
      viewportManager?.setScreenSize(width, height);

      // Invalidate background cache on resize
      renderer?.invalidateBackgroundCache();

      // Force re-render
      renderer?.renderAll();
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    // Debug memory after initialization
    setTimeout(() => {
      console.log("=== Initial Memory Analysis ===");
      memoryDebugger.getAllMeasurements();
      memoryDebugger.countIslandAssets(renderer);
    }, 2000);
    
    // Export for debugging in dev mode
    if (import.meta.env.DEV) {
      (window as any).__canvasRenderer = renderer;
      (window as any).__viewportManager = viewportManager;
      (window as any).__profiler = profiler;
      
      // Make benchmark available
      import('$lib/canvas/performance-benchmark').then(module => {
        (window as any).PerformanceBenchmark = module.PerformanceBenchmark;
      });
    }

    // Start render loop
    const renderLoop = async () => {
      if (renderer && !isPaused) {
        await renderer.renderFrame();
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Keyboard shortcuts
    function handleGlobalKeyDown(event: KeyboardEvent) {
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
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Perform initial search if query provided
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
      isSearchActive = true;
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleGlobalKeyDown);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }

      // Clean up managers
      interactionManager?.destroy();
    };
  });
</script>

<div
  bind:this={canvasContainer}
  class="canvas-container {isPanning ? 'panning' : ''} {isDraggingIsland
    ? 'dragging-island'
    : ''}"
>
  <!-- Background layer - Ocean, grid (rarely updates) -->
  <canvas bind:this={backgroundCanvas} class="canvas-layer background-layer"
  ></canvas>

  <!-- Islands layer - All island graphics (updates on pan/zoom) -->
  <canvas bind:this={islandsCanvas} class="canvas-layer islands-layer"></canvas>

  <!-- Interaction layer - Hover effects, search highlights (frequent updates) -->
  <canvas bind:this={interactionCanvas} class="canvas-layer interaction-layer"
  ></canvas>

  {#if showLoader}
    <BoatLoader />
  {/if}

  {#if !showLoader}
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

  <PerformanceMonitor {profiler} expanded={false} />

  {#if import.meta.env.DEV}
    <div class="controls">
      <button onclick={() => (editMode = !editMode)} class:active={editMode}>
        {editMode ? "Exit Edit Mode" : "Edit Mode"}
      </button>
      {#if editMode}
        <button onclick={savePositions}>Save Positions</button>
      {/if}
    </div>
  {/if}
</div>

{#if showPositionsModal}
  <div
    class="positions-modal-backdrop"
    onclick={() => (showPositionsModal = false)}
  >
    <div class="positions-modal" onclick={(e) => e.stopPropagation()}>
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
  .canvas-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #5ca9ce;
    cursor: grab;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
    position: fixed;
    top: 0;
    left: 0;
  }

  .canvas-container.panning {
    cursor: grabbing;
  }

  .canvas-container.dragging-island {
    cursor: move;
  }

  .canvas-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .background-layer {
    z-index: 1;
  }

  .islands-layer {
    z-index: 2;
  }

  .interaction-layer {
    z-index: 3;
    pointer-events: none; /* Let events pass through to container */
  }

  .controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 100;
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
    z-index: 1000;
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
  @media (max-width: 768px) {
    .controls {
      display: none;
    }
  }
</style>
