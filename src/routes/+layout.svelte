<script lang="ts">
  import "../app.css";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import { connectSSE, disconnectSSE } from "$lib/stores/sse";
  import SEO from "$lib/components/SEO.svelte";
  import { analytics } from "$lib/analytics";

  // Map imports
  import * as PixiViewport from "pixi-viewport";
  import { Application, Ticker } from "pixi.js";
  import PixiMapRenderer from "$lib/pixi/PixiMapRenderer";
  import RenderManager from "$lib/pixi/RenderManager";
  import { webGLDebugger } from "$lib/pixi/WebGLDebugger";
  import { perfMonitor } from "$lib/pixi/PerformanceMonitor";
  import { mapStore } from "$lib/stores/mapStore";
  import {
    overviewStore,
    tvlLookupByChainId,
    tpsLookupByChainId,
  } from "$lib/stores/overviewStore";
  import savedPositions from "$lib/positions.json";
  import BoatLoader from "../components/BoatLoader.svelte";
  import type { Viewport as ViewportType } from "pixi-viewport";

  let { children, data } = $props();

  // Determine if we're on a chain page
  const isChainPage = $derived(
    $page.route.id?.includes("/chain/[slug]") || false,
  );

  // Determine if we're on the home page (map should be interactive)
  const isHomePage = $derived($page.route.id === "/");

  // Container for Pixi app
  let pixiContainer = $state<HTMLDivElement>();

  // Pixi application
  let app = $state<Application>();
  let viewport = $state<ViewportType>();
  let mapRenderer = $state<PixiMapRenderer>();
  let renderManager = $state<RenderManager>();

  // Store data
  let overviewStoreState = $derived($overviewStore);
  let tvlLookupMap = $derived($tvlLookupByChainId);
  let tpsLookupMap = $derived($tpsLookupByChainId);

  // Show loader until we have TVL data AND map is ready
  let mapReady = $state(false);
  // Only show loader on initial load, not when updating overview period
  let showLoader = $derived(
    (!overviewStoreState.data && overviewStoreState.isLoading) || !mapReady,
  );

  // Track if initial viewport has been set
  let hasInitialViewportBeenSet = false;

  // Track if islands have been set
  let islandsInitialized = false;

  // Island positions
  let islandPositions = $state<Record<string, { x: number; y: number }>>(
    savedPositions && Object.keys(savedPositions).length > 0
      ? savedPositions
      : {},
  );

  // Get parsed chains from server-side data
  const staticChains = $derived(data.chains || {});

  // Calculate island scale based on TVL
  function calculateIslandScale(tvl: number): number {
    const tvlMillions = tvl / 1_000_000;

    const MIN_SCALE = 0.3;
    const MAX_SCALE = 6.0;

    if (tvlMillions < 10) {
      return MIN_SCALE;
    }

    const scale = MIN_SCALE + Math.pow(tvlMillions, 0.4) * 0.08;

    return Math.min(scale, MAX_SCALE);
  }

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

    // Set islands asynchronously (generates texture atlas)
    console.log("[Layout] Generating island texture atlas...");
    mapRenderer.setIslands(islands).then(() => {
      islandsInitialized = true;
      console.log("[Layout] Island texture atlas generated");

      // Trigger immediate render and mark map as ready
      renderManager?.markDirty();

      // Small delay to ensure first frame is rendered
      setTimeout(() => {
        mapReady = true;
      }, 50);
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

  // Update map store when components are ready
  $effect(() => {
    if (app && viewport && mapRenderer && renderManager) {
      mapStore.setApp(app);
      mapStore.setViewport(viewport);
      mapStore.setMapRenderer(mapRenderer);
      mapStore.setRenderManager(renderManager);
    }
  });

  // Update ready state whenever mapReady changes
  $effect(() => {
    mapStore.setReady(mapReady);
  });

  // Sync island positions to mapStore whenever they change
  $effect(() => {
    mapStore.setIslandPositions(islandPositions);
  });

  // Disable map interaction on non-home pages
  $effect(() => {
    if (viewport) {
      if (isHomePage) {
        // Enable viewport interactions on home page
        viewport.pause = false;
        viewport.cursor = "grab";
      } else {
        // Pause all viewport interactions on other pages
        viewport.pause = true;
        viewport.cursor = "default";
      }
    }
  });

  // Add cleanup tracking
  let isCleaningUp = false;
  let keyboardHandler: ((event: KeyboardEvent) => void) | null = null;
  let metricsInterval: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    if (!pixiContainer) {
      console.error("Pixi container not found");
      return;
    }

    // Connect to SSE
    connectSSE();

    // Run async initialization
    (async () => {
      // Add small delay in development to ensure proper cleanup during hot reload
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 50));
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
        autoStart: false, // Don't start ticker automatically
      });

      // Set max FPS to 60
      app.ticker.maxFPS = 60;

      // Add canvas to container
      // eslint-disable-next-line svelte/no-dom-manipulating
      pixiContainer.appendChild(app.canvas);

      // Initialize WebGL debugger (only when explicitly enabled via ?debug=webgl)
      webGLDebugger.init(app.canvas as HTMLCanvasElement);

      // Create viewport with noTicker to prevent internal updates
      viewport = new PixiViewport.Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 20000,
        worldHeight: 20000,
        events: app.renderer.events,
        noTicker: true, // Disable internal ticker - we'll update manually
        stopPropagation: true, // Stop event propagation for better performance
        disableOnContextMenu: true, // Disable on right-click context menu
      });

      // Debug: Only log if debug mode is enabled
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("debug") === "tickers") {
        console.log("[Viewport Debug] Options:", {
          noTicker: viewport.options.noTicker,
          stopPropagation: viewport.options.stopPropagation,
        });

        // Check for any active PIXI tickers
        console.log("[PIXI Debug] Tickers:", {
          sharedStarted: Ticker.shared.started,
          sharedCount: Ticker.shared.count,
          systemStarted: Ticker.system.started,
          systemCount: Ticker.system.count,
        });
      }

      // Always stop system ticker if it's running (it shouldn't be)
      if (Ticker.system.started) {
        Ticker.system.stop();
      }

      // Add viewport to stage
      app.stage.addChild(viewport);

      // Setup viewport behaviors with optimized settings
      viewport
        .drag({
          mouseButtons: "left", // Only left mouse button for drag
        })
        .pinch()
        .wheel({
          smooth: 3, // Reduce smoothing for faster response
        });

      // Set zoom limits
      viewport.clampZoom({
        minScale: 0.05,
        maxScale: 3,
      });

      // Initialize map renderer with viewport
      mapRenderer = new PixiMapRenderer(app, viewport);

      // Initialize render manager with debug mode in development
      renderManager = new RenderManager(app, import.meta.env.DEV);
      renderManager.setViewport(viewport);
      renderManager.setupRenderLoop();

      // Pass render manager to map renderer for drag animations
      mapRenderer.setRenderManager(renderManager);

      // Setup island drag end callback for edit mode
      // Only update reactive state when drag ends to avoid performance issues
      mapRenderer.setOnIslandDragEnd((slug: string, x: number, y: number) => {
        // Update island positions
        islandPositions = { ...islandPositions, [slug]: { x, y } };
      });

      // Setup dirty callback for re-renders
      mapRenderer.setOnDirty(() => {
        renderManager?.markDirty();
      });

      // Trigger initial render to show ocean
      renderManager.markDirty();

      // Set up viewport render triggers
      viewport.on("moved", () => {
        renderManager?.markDirty();
      });
      viewport.on("zoomed", () => {
        renderManager?.markDirty();
      });

      // Handle animation end states
      viewport.on("moved-end", () => {
        renderManager?.setAnimating(false);
        renderManager?.markDirty(); // Final render after movement
      });
      viewport.on("zoomed-end", () => {
        renderManager?.setAnimating(false);
        renderManager?.markDirty(); // Final render after zoom
      });

      // Mark as animating during movement
      viewport.on("drag-start", () => {
        renderManager?.setAnimating(true);
        renderManager?.markDirty();
      });
      viewport.on("wheel-start", () => {
        renderManager?.setAnimating(true);
        renderManager?.markDirty();
      });
      viewport.on("pinch-start", () => {
        renderManager?.setAnimating(true);
        renderManager?.markDirty();
      });

      // Set up performance metrics updates (only in dev mode)
      if (import.meta.env.DEV && renderManager) {
        // Only start monitoring if debug is enabled
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("debug") === "perf") {
          perfMonitor?.start();
        }

        metricsInterval = setInterval(() => {
          if (renderManager) {
            // Update performance metrics if needed
          }
        }, 1000); // Update every second
      }
    })(); // End async initialization

    // Cleanup
    return () => {
      isCleaningUp = true;

      // Clear metrics interval
      if (metricsInterval) {
        clearInterval(metricsInterval);
        metricsInterval = null;
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

      // Stop performance monitor
      if (import.meta.env.DEV) {
        perfMonitor?.stop();
      }

      // Clean up Pixi app last
      if (app) {
        // Remove canvas from DOM before destroying
        if (app.canvas && app.canvas.parentNode) {
          app.canvas.parentNode.removeChild(app.canvas);
        }
        app.destroy(true, { children: true, texture: true });
        app = undefined;
      }

      // Reset map store
      mapStore.reset();

      isCleaningUp = false;
    };
  });

  // Disconnect SSE when the app is destroyed
  onDestroy(() => {
    disconnectSSE();
  });

  // Track page views on client-side navigation
  if (browser) {
    afterNavigate((navigation) => {
      if (navigation.to) {
        analytics.trackPageView(
          navigation.to.url.href,
          navigation.to.url.pathname,
        );
      }
    });
  }
</script>

<SEO />

<!-- Map container (always visible) -->
<div bind:this={pixiContainer} class="pixi-container">
  {#if showLoader}
    <BoatLoader />
  {/if}
</div>

<!-- Page content overlays on top of map -->
<div class="page-content" class:chain-page={isChainPage}>
  {@render children()}
</div>

<style>
  .pixi-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    z-index: 0;
    touch-action: none;
  }

  .pixi-container :global(canvas) {
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
  }

  .page-content {
    position: relative;
    z-index: 2;
  }
</style>
