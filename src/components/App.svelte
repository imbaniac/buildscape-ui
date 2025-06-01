<script lang="ts">
  import { onMount } from "svelte";
  import Island from "./Island.svelte";
  import YAML from "yaml";
  import Book from "./Book.svelte";

  const initialViewBox = { x: 0, y: -2000, width: 2000, height: 5000 };
  let svg = $state<SVGSVGElement>();
  let svgContainer = $state<HTMLDivElement>();
  let isPanning = $state(false);
  let startPoint = $state({ x: 0, y: 0 });
  let scale = 1;
  let translateX = $state(0);
  let translateY = $state(0);
  let panStartTranslate = { x: 0, y: 0 };
  let animationFrame: number | null = null;

  // Interaction state tracking
  let isInteracting = $state(false);
  let lastInteractionTime = 0;

  // Smooth zoom system
  let zoomDelta = 0;
  let zoomMomentum = 0;
  let zoomTarget: { x: number; y: number } | null = null;
  let zoomAnimationFrame: number | null = null;
  let lastZoomTime = 0;
  let modalOpen = $state(false);
  let selectedChainName: string | null = null;
  let selectedChainStatic: any = $state(null);
  let selectedChainDynamic: any = $state(null);
  let metricsSpan: "1h" | "24h" | "7d" | "30d" = $state("24h");
  let loadingDynamic = $state(false);
  let activeTab = $state("Overview");

  // Update import.meta.glob to use query syntax
  const chainMdModules = import.meta.glob("../data/chains/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });
  const chainTsModules = import.meta.glob("../data/chains/*.ts");
  const logoAssets = import.meta.glob("../lib/assets/chains/*", {
    eager: true,
    query: "?url",
    import: "default",
  });

  function resolveLogoUrl(logoFilename: string): string | undefined {
    for (const path in logoAssets) {
      if (path.endsWith("/" + logoFilename)) {
        return logoAssets[path] as string;
      }
    }
    return undefined;
  }

  // Helper to extract YAML frontmatter and markdown body
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
    // fallback: no frontmatter
    return { frontmatter: {}, content: raw.trim() };
  }

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
        name,
      };
    }
    return chains;
  }

  const staticChains: Record<string, any> = loadStaticChains();

  // Helper to get dynamic loader for a chain
  async function getDynamicLoader(
    chainName: string
  ): Promise<null | ((span: string) => Promise<any>)> {
    const tsPath = `../data/chains/${chainName}.ts`;
    if (chainTsModules[tsPath]) {
      const mod = await chainTsModules[tsPath]();
      const loader = (mod as any).default;
      if (typeof loader === "function") {
        return loader as (span: string) => Promise<any>;
      }
    }
    return null;
  }

  // Example: how to get all chain names
  const allChainNames = Object.keys(staticChains);

  // Example: how to get static data for a chain
  // const ethStatic = staticChains['ethereum'];
  // Example: how to get dynamic loader for a chain
  // const ethLoader = await getDynamicLoader('ethereum');

  function handlePointerDown(event: PointerEvent) {
    if (event.button === 0) {
      isPanning = true;
      startPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      panStartTranslate = {
        x: translateX,
        y: translateY,
      };
      svgContainer?.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isPanning) return;

    // Only mark as interacting if actually moving significant distance
    const moveDistance = Math.sqrt(
      Math.pow(event.clientX - startPoint.x, 2) +
        Math.pow(event.clientY - startPoint.y, 2)
    );

    if (moveDistance > 5) {
      isInteracting = true;
      lastInteractionTime = Date.now();
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {
      const dx = event.clientX - startPoint.x;
      const dy = event.clientY - startPoint.y;

      translateX = panStartTranslate.x + dx;
      translateY = panStartTranslate.y + dy;
    });
  }

  function handlePointerUp(event: PointerEvent) {
    if (isPanning) {
      isPanning = false;
      svgContainer?.releasePointerCapture(event.pointerId);

      // Only set cooldown if we were actually interacting (moving)
      if (isInteracting) {
        setTimeout(() => {
          isInteracting = false;
        }, 100);
      }

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    const now = Date.now();
    const rect = svgContainer!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Set zoom target only once per gesture
    if (!zoomTarget || now - lastZoomTime > 150) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      zoomTarget = {
        x: mouseX - centerX,
        y: mouseY - centerY,
      };
    }

    lastZoomTime = now;
    isInteracting = true;
    lastInteractionTime = now;

    // Accumulate zoom delta with momentum
    const sensitivity = Math.abs(event.deltaY) < 10 ? 0.003 : 0.01; // Trackpad vs mouse wheel
    const deltaContribution = -event.deltaY * sensitivity;

    // Add to accumulated zoom with momentum
    zoomDelta += deltaContribution;
    zoomMomentum = deltaContribution * 0.3; // Momentum for smooth continuation

    // Start smooth zoom loop if not running
    if (!zoomAnimationFrame) {
      smoothZoomLoop();
    }
  }

  function smoothZoomLoop() {
    const step = () => {
      // Apply accumulated zoom gradually
      if (Math.abs(zoomDelta) > 0.001 || Math.abs(zoomMomentum) > 0.001) {
        // Calculate zoom factor from accumulated delta
        const zoomStep = zoomDelta * 0.3; // Apply 30% of accumulated zoom per frame
        const momentumStep = zoomMomentum * 0.8; // Apply momentum

        const totalStep = zoomStep + momentumStep;
        const zoomFactor =
          totalStep > 0
            ? 1 + Math.min(totalStep, 0.05)
            : 1 + Math.max(totalStep, -0.05);

        const newScale = Math.max(0.3, Math.min(5, scale * zoomFactor));

        if (zoomTarget && newScale !== scale) {
          // Calculate the content point under the zoom target
          const contentX = (zoomTarget.x - translateX) / scale;
          const contentY = (zoomTarget.y - translateY) / scale;

          // Update scale and adjust translation
          scale = newScale;
          translateX = zoomTarget.x - contentX * scale;
          translateY = zoomTarget.y - contentY * scale;
        }

        // Reduce accumulated values
        zoomDelta *= 0.7; // Decay accumulated zoom
        zoomMomentum *= 0.9; // Decay momentum

        zoomAnimationFrame = requestAnimationFrame(step);
      } else {
        // Animation complete
        zoomDelta = 0;
        zoomMomentum = 0;
        zoomAnimationFrame = null;

        // Clear interaction state after a delay
        setTimeout(() => {
          isInteracting = false;
          zoomTarget = null;
        }, 100);
      }
    };

    zoomAnimationFrame = requestAnimationFrame(step);
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
  }

  function openBookByName(chainName: string) {
    // Prevent opening modal during active interactions
    if (isInteracting || isPanning) {
      return;
    }

    // Check if recent interaction happened (only for zoom, not clicks)
    if (lastInteractionTime > 0) {
      const timeSinceInteraction = Date.now() - lastInteractionTime;
      if (timeSinceInteraction < 100) {
        return;
      }
    }

    selectedChainName = chainName;
    selectedChainStatic = staticChains[chainName];
    modalOpen = true;
    loadDynamic(chainName, metricsSpan);
  }

  async function loadDynamic(
    chainName: string,
    span: "1h" | "24h" | "7d" | "30d"
  ) {
    loadingDynamic = true;
    selectedChainDynamic = null;
    const loader = await getDynamicLoader(chainName);
    if (loader) {
      selectedChainDynamic = await loader(span);
    }
    loadingDynamic = false;
  }

  function handleMetricsSpanChange(span: "1h" | "24h" | "7d" | "30d") {
    metricsSpan = span;
    if (selectedChainName) {
      loadDynamic(selectedChainName, span);
    }
  }

  function closeBook() {
    modalOpen = false;
    selectedChainName = null;
    selectedChainStatic = null;
    selectedChainDynamic = null;
  }

  onMount(() => {
    if (svgContainer) {
      svgContainer.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        svgContainer?.removeEventListener("wheel", handleWheel);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        if (zoomAnimationFrame) {
          cancelAnimationFrame(zoomAnimationFrame);
        }
      };
    }
  });

  $effect(() => {
    if (modalOpen && selectedChainStatic) {
      activeTab = selectedChainStatic.bookmarks?.[0] || "Overview";
    }
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={svgContainer}
  class="map-container {isPanning ? 'panning' : ''}"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
>
  <svg
    bind:this={svg}
    viewBox={`${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Map of the EVM ecosystem"
    role="region"
    style="transform: translate({translateX}px, {translateY}px) scale({scale}); transform-origin: center center;"
  >
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3" />
      </filter>
    </defs>

    <text
      x="1000"
      y="2800"
      font-size="220"
      fill="#5A8BA8"
      text-anchor="middle"
      font-weight="bold"
      opacity="0.25"
      transform="skewY(0) scale(1,0.866)"
      style="font-family: inherit; letter-spacing: 8px;"
    >
      EVM SEA
    </text>

    <!-- Main Ethereum Island (center) -->
    <Island
      name={staticChains["ethereum"]?.name}
      color={staticChains["ethereum"]?.color}
      darkColor={staticChains["ethereum"]?.darkColor}
      logo={staticChains["ethereum"]?.logoUrl}
      scale={1.5}
      x={1000}
      y={600}
      onclick={() => openBookByName("ethereum")}
    />

    <!-- L2s in a circle, spaced further out, exclude chainId 1 -->
    {#each Object.entries(staticChains).filter(([_, chain]) => chain.chainId !== 1) as [chainKey, blockchain], i}
      <Island
        name={blockchain.name}
        color={blockchain.color}
        darkColor={blockchain.darkColor}
        logo={blockchain.logoUrl}
        scale={0.8}
        x={1000 +
          1900 *
            Math.cos(
              (2 * Math.PI * i) /
                Object.entries(staticChains).filter(
                  ([_, chain]) => chain.chainId !== 1
                ).length
            )}
        y={600 +
          1200 *
            Math.sin(
              (2 * Math.PI * i) /
                Object.entries(staticChains).filter(
                  ([_, chain]) => chain.chainId !== 1
                ).length
            )}
        onclick={() => openBookByName(chainKey)}
      />
    {/each}
  </svg>

  <div class="controls">
    <button onclick={resetView}>Reset View</button>
  </div>
</div>

<Book
  open={modalOpen}
  chainStatic={selectedChainStatic}
  chainDynamic={selectedChainDynamic}
  {metricsSpan}
  {loadingDynamic}
  onClose={closeBook}
  onMetricsSpanChange={handleMetricsSpanChange}
/>

<style>
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #87c1d3;
    cursor: grab;
    touch-action: none; /* Prevent default touch behaviors */
  }
  .map-container.panning {
    cursor: grabbing;
  }

  svg {
    width: 100%;
    height: 100%;
    will-change: transform; /* Hint for hardware acceleration */
    transition: none; /* Disable any default transitions for smooth panning */
  }

  .controls {
    position: absolute;
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
</style>
