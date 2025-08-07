<script lang="ts">
  import { onMount } from "svelte";
  import * as PixiViewport from "pixi-viewport";
  import { Application } from "pixi.js";
  import { goto } from "$app/navigation";
  import PixiMapRenderer from "$lib/pixi/PixiMapRenderer";
  import RenderManager from "$lib/pixi/RenderManager";
  import { webGLDebugger } from "$lib/pixi/WebGLDebugger";
  import type { Island } from "$lib/types/island";
  import {
    overviewStore,
    tvlLookupByChainId,
    tpsLookupByChainId,
  } from "$lib/stores/overviewStore";
  import savedPositions from "$lib/positions.json";
  import { parseFrontmatterAndContent } from "$lib/utils/markdown";
  import BoatLoader from "../components/BoatLoader.svelte";
  import Header from "../components/Header.svelte";
  import SearchBar from "../components/SearchBar.svelte";
  import PerformanceOverlay from "../components/PerformanceOverlay.svelte";

  import { type Viewport as ViewportType } from "pixi-viewport";

  interface Props {
    initialSearchQuery?: string;
  }

  let { initialSearchQuery = "" }: Props = $props();

  // Container for Pixi app
  let pixiContainer = $state<HTMLDivElement>();

  // Pixi application
  let app = $state<Application>();
  let viewport = $state<ViewportType>();
  let mapRenderer = $state<PixiMapRenderer>();
  let renderManager = $state<RenderManager>();

  // Search state
  let searchQuery = $state(initialSearchQuery || "");
  let searchResults = $state<string[]>([]);
  let currentResultIndex = $state(0);
  let isSearchActive = $state(false);
  let hasSearched = $state(false);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Edit mode state
  let editMode = $state(false);
  let islandPositions = $state<Record<string, { x: number; y: number }>>(
    savedPositions && Object.keys(savedPositions).length > 0
      ? savedPositions
      : {},
  );

  // Track if initial viewport has been set
  let hasInitialViewportBeenSet = false;
  let showPositionsModal = $state(false);
  let positionsJson = $state("");

  // Store data
  let overviewStoreState = $derived($overviewStore);
  let tvlLookupMap = $derived($tvlLookupByChainId);
  let tpsLookupMap = $derived($tpsLookupByChainId);

  // Show loader until we have TVL data
  let showLoader = $derived(
    overviewStoreState.isLoading || !overviewStoreState.data,
  );

  // Performance metrics
  let performanceMetrics = $state({
    fps: 0,
    renderCount: 0,
    isAnimating: false,
  });

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
        const logoUrl = logoAssets[path] as string;
        return logoUrl;
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

  // Calculate island scale based on TVL - power function for clear hierarchy
  function calculateIslandScale(tvl: number): number {
    const tvlMillions = tvl / 1_000_000;
    
    const MIN_SCALE = 0.3;
    const MAX_SCALE = 6.0;
    
    if (tvlMillions < 10) {
      // Tiny chains: keep them small but visible
      return MIN_SCALE;
    }
    
    // Power function: scale = 0.3 + (tvlMillions^0.4) * 0.08
    // This gives us:
    // $10M -> 0.3 + 2.51 * 0.08 = 0.50
    // $100M -> 0.3 + 6.31 * 0.08 = 0.80
    // $1B -> 0.3 + 15.85 * 0.08 = 1.57
    // $3.4B (Base) -> 0.3 + 23.25 * 0.08 = 2.16
    // $10B -> 0.3 + 39.81 * 0.08 = 3.48
    // $65B (Ethereum) -> 0.3 + 71.5 * 0.08 = 6.02 (capped at 6.0)
    
    const scale = MIN_SCALE + Math.pow(tvlMillions, 0.4) * 0.08;
    
    return Math.min(scale, MAX_SCALE);
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
    if (!position || !viewport) return;

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

  // Track if islands have been set
  let islandsInitialized = false;

  // Build islands array from data
  $effect(() => {
    // Guard: Only run when ALL dependencies are ready
    if (
      !mapRenderer ||
      overviewStoreState.isLoading ||
      !overviewStoreState.data
    ) {
      return;
    }

    // Only set islands once to prevent texture recreation
    if (islandsInitialized) {
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

    // Set islands asynchronously
    mapRenderer.setIslands(islands).then(() => {
      islandsInitialized = true;
      renderManager?.markDirty();
    });

    // Set initial viewport position and zoom (only once when first loaded)
    if (viewport && !hasInitialViewportBeenSet) {
      // Center on Ethereum (position 0, 0)
      viewport.moveCenter(0, 0);

      // Set zoom to show more islands (farther away)
      viewport.setZoom(0.1); // Adjust this value - lower = farther away

      hasInitialViewportBeenSet = true;
      renderManager?.markDirty();
    }
  });

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

  // Add cleanup tracking
  let isCleaningUp = false;
  let keyboardHandler: ((event: KeyboardEvent) => void) | null = null;

  onMount(() => {
    if (!pixiContainer) {
      console.error("Pixi container not found");
      return;
    }

    // Run async initialization
    (async () => {
      // Add small delay in development to ensure proper cleanup during hot reload
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Check if we're cleaning up (prevents race conditions during hot reload)
      if (isCleaningUp) {
        return;
      }
      
      // Initialize Pixi application
      app = new Application();

      await app.init({
        antialias: false, // Better mobile performance
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: 0x5ca9ce,
        resizeTo: window,
        hello: true,
      });

      // Set max FPS to 60
      app.ticker.maxFPS = 60;

      // Add canvas to container
      pixiContainer.appendChild(app.canvas);

      // Initialize WebGL debugger (only when explicitly enabled via ?debug=webgl)
      webGLDebugger.init(app.canvas as HTMLCanvasElement);

      // Create viewport
      viewport = new PixiViewport.Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 20000,
        worldHeight: 20000,
        events: app.renderer.events,
      });

      // Add viewport to stage
      app.stage.addChild(viewport);

      // Setup viewport behaviors
      viewport.drag().pinch().wheel();

      // Set zoom limits
      viewport.clampZoom({
        minScale: 0.1,
        maxScale: 3,
      });

      // Initialize map renderer with viewport
      mapRenderer = new PixiMapRenderer(app, viewport);
      
      // Setup island move callback for edit mode
      mapRenderer.setOnIslandMove((slug: string, x: number, y: number) => {
        // Update island positions
        islandPositions = { ...islandPositions, [slug]: { x, y } };
      });
      
      // Setup dirty callback for re-renders
      mapRenderer.setOnDirty(() => {
        renderManager?.markDirty();
      });

      // Initialize render manager with debug mode in development
      renderManager = new RenderManager(app, import.meta.env.DEV);
      renderManager.setupRenderLoop();

      // Set up viewport render triggers
      viewport.on("moved", () => renderManager?.markDirty());
      viewport.on("zoomed", () => renderManager?.markDirty());
      viewport.on("moved-end", () => renderManager?.setAnimating(false));
      viewport.on("zoomed-end", () => renderManager?.setAnimating(false));

      // Mark as animating during movement
      viewport.on("drag-start", () => renderManager?.setAnimating(true));
      viewport.on("wheel-start", () => renderManager?.setAnimating(true));
      viewport.on("pinch-start", () => renderManager?.setAnimating(true));

      // Handle island clicks
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
          goto(`/chain/${island.slug}`);
        }
      });

      // Hover is now handled directly by island containers in PixiMapRenderer

      // Keyboard shortcuts
      keyboardHandler = (event: KeyboardEvent) => {
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

      // Perform initial search if query provided
      if (initialSearchQuery) {
        performSearch(initialSearchQuery);
        isSearchActive = true;
      }
    })(); // End async initialization

    // Cleanup
    return () => {
      isCleaningUp = true;
      
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }

      // Remove keyboard event listener
      if (keyboardHandler) {
        window.removeEventListener("keydown", keyboardHandler);
        keyboardHandler = null;
      }

      // Clean up viewport first
      if (viewport) {
        viewport.removeAllListeners();
        viewport.destroy();
        viewport = undefined;
      }

      // Clean up render manager
      if (renderManager) {
        renderManager.destroy();
        renderManager = undefined;
      }

      // Clean up map renderer
      if (mapRenderer) {
        mapRenderer.destroy();
        mapRenderer = undefined;
      }

      // Clean up WebGL debugger
      webGLDebugger.destroy();

      // Clean up Pixi app last
      if (app) {
        // Remove canvas from DOM before destroying
        if (app.canvas && app.canvas.parentNode) {
          app.canvas.parentNode.removeChild(app.canvas);
        }
        app.destroy(true, { children: true, texture: true, baseTexture: true });
        app = undefined;
      }
      
      isCleaningUp = false;
    };
  });
</script>

<div bind:this={pixiContainer} class="pixi-container">
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
</div>

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
  .pixi-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .pixi-container :global(canvas) {
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
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
