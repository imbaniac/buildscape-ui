<script lang="ts">
  import { onMount } from "svelte";
  import CanvasRenderer from "$lib/canvas/CanvasRenderer";
  import ViewportManager from "$lib/canvas/ViewportManager";
  import InteractionManager from "$lib/canvas/InteractionManager";
  import YAML from "yaml";
  import {
    overviewStore,
    tvlLookupByChainId,
    tpsLookupByChainId,
  } from "$lib/stores/overviewStore";
  import savedPositions from "$lib/positions.json";
  import BoatLoader from "./BoatLoader.svelte";
  import FPSMeter from "./FPSMeter.svelte";
  import Header from "./Header.svelte";
  import SearchBar from "./SearchBar.svelte";
  import { goto } from "$app/navigation";

  interface Props {
    initialSearchQuery?: string;
  }

  let { initialSearchQuery = "" }: Props = $props();

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

  // Animation frame
  let animationFrameId: number | null = null;

  // Interaction state
  let isPanning = $state(false);

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

  // Helper to extract YAML frontmatter
  function parseFrontmatterAndContent(raw: string): {
    frontmatter: any;
    content: string;
  } {
    const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw);
    if (match) {
      const frontmatter = YAML.parse(match[1]);
      const content = match[2].trim();
      return { frontmatter, content };
    }
    return { frontmatter: {}, content: raw.trim() };
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
    const scale = REFERENCE_SCALE * Math.pow(tvl / REFERENCE_TVL, 0.35);
    const MIN_SCALE = 0.3;
    const MAX_SCALE = 2.0;
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
    const targetScale = currentScale < 0.2 ? 0.2 : currentScale; // Only zoom in if we're really far out
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

  // Build islands array from data
  $effect(() => {
    // Guard: Only run when ALL dependencies are ready
    if (!renderer || overviewStoreState.isLoading || !overviewStoreState.data) {
      return;
    }

    const islands = [];

    // Process all chains
    for (const [chainKey, chain] of Object.entries(staticChains)) {
      const position = (savedPositions as any)[chainKey];
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
    interactionManager = new InteractionManager(
      canvasContainer,
      viewportManager,
      renderer,
      (panning) => {
        isPanning = panning;
      },
      (island) => {
        // Handle island click - navigate to chain page
        goto(`/chain/${island.slug}`);
      },
      (island) => {
        // Handle hover change
        renderer?.setHoveredIsland(island);
      },
    );

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

      // Force re-render
      renderer?.renderAll();
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    // Start render loop
    const renderLoop = async () => {
      if (renderer) {
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
  class="canvas-container {isPanning ? 'panning' : ''}"
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

  <FPSMeter />
</div>

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
</style>
