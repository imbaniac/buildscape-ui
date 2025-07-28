<script lang="ts">
  import { onMount } from "svelte";
  import CanvasRenderer from "$lib/canvas/CanvasRenderer";
  import ViewportManager from "$lib/canvas/ViewportManager";
  import InteractionManager from "$lib/canvas/InteractionManager";
  import YAML from "yaml";
  import { overviewStore, tvlLookupByChainId, tpsLookupByChainId } from "$lib/stores/overviewStore";
  import savedPositions from "$lib/positions.json";
  import BoatLoader from "./BoatLoader.svelte";
  import FPSMeter from "./FPSMeter.svelte";
  
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
  
  // Store data
  let overviewStoreState = $derived($overviewStore);
  let tvlLookupMap = $derived($tvlLookupByChainId);
  let tpsLookupMap = $derived($tpsLookupByChainId);
  
  // Show loader until we have TVL data
  let showLoader = $derived(
    overviewStoreState.isLoading || !overviewStoreState.data
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
      const scale = tvl > 0 ? calculateIslandScale(tvl) : (chain.chainId === 1 ? 1.8 : 0.6);
      
      islands.push({
        chainId: chain.chainId,
        name: chain.name,
        slug: chainKey,
        x: position.x,
        y: position.y,
        scale,
        tps,
        brandColor: chain.color || "#95060D",
        logoUrl: chain.logoUrl
      });
    }
    
    renderer.setIslands(islands);
  });
  
  onMount(() => {
    if (!backgroundCanvas || !islandsCanvas || !interactionCanvas || !canvasContainer) {
      console.error("Canvas elements not found");
      return;
    }
    
    // Initialize managers
    viewportManager = new ViewportManager();
    renderer = new CanvasRenderer(
      backgroundCanvas,
      islandsCanvas,
      interactionCanvas,
      viewportManager
    );
    interactionManager = new InteractionManager(
      canvasContainer,
      viewportManager,
      renderer,
      (panning) => { isPanning = panning; }
    );
    
    
    // Set up canvas size
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set canvas dimensions with device pixel ratio support for sharp rendering on retina screens
      const dpr = window.devicePixelRatio || 1;
      [backgroundCanvas, islandsCanvas, interactionCanvas].forEach(canvas => {
        if (canvas) {
          // Set actual size in memory (scaled up for retina)
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          // Set display size (CSS pixels)
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          // Scale the drawing context to match device pixel ratio
          const ctx = canvas.getContext('2d');
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
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
  <canvas
    bind:this={backgroundCanvas}
    class="canvas-layer background-layer"
  ></canvas>
  
  <!-- Islands layer - All island graphics (updates on pan/zoom) -->
  <canvas
    bind:this={islandsCanvas}
    class="canvas-layer islands-layer"
  ></canvas>
  
  <!-- Interaction layer - Hover effects, search highlights (frequent updates) -->
  <canvas
    bind:this={interactionCanvas}
    class="canvas-layer interaction-layer"
  ></canvas>
  
  {#if showLoader}
    <BoatLoader />
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