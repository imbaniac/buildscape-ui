<script lang="ts">
  import { onMount } from "svelte";
  import Island from "./Island.svelte";
  import YAML from "yaml";
  import { goto } from "$app/navigation";

  const initialViewBox = { x: -5000, y: -5000, width: 10000, height: 10000 };
  let svg = $state<SVGSVGElement>();
  let svgContainer = $state<HTMLDivElement>();
  let isPanning = $state(false);
  let startPoint = $state({ x: 0, y: 0 });

  // Start with a scale that works for both, adjust on mount
  let scale = $state(1.5);
  let translateX = $state(0);
  let translateY = $state(0);
  let panStartTranslate = { x: 0, y: 0 };
  let animationFrame: number | null = null;

  // Interaction state tracking
  let isInteracting = $state(false);
  let lastInteractionTime = 0;
  
  // Click detection
  let potentialClick = false;
  let clickThreshold = 5; // pixels of movement before we consider it a drag

  // Smooth zoom system
  let zoomDelta = 0;
  let zoomMomentum = 0;
  let zoomTarget: { x: number; y: number } | null = null;
  let zoomAnimationFrame: number | null = null;
  let lastZoomTime = 0;
  
  // Touch handling for pinch zoom
  let touches: Touch[] = [];
  let lastTouchDistance = 0;
  let isPinching = $state(false);
  
  // Mobile viewport detection
  let isMobileViewport = $state(false);
  
  // Momentum variables
  let panVelocity = { x: 0, y: 0 };
  let lastPanTime = 0;
  let lastPanPoint = { x: 0, y: 0 };

  // Import positions statically
  import savedPositions from "../data/positions.json";

  // Edit mode state
  let editMode = $state(false);
  let islandPositions = $state<Record<string, { x: number; y: number }>>(
    savedPositions && Object.keys(savedPositions).length > 0
      ? savedPositions
      : {}
  );
  let isDraggingIsland = $state(false);
  let draggedIsland = $state<string | null>(null);
  let dragOffset = { x: 0, y: 0 };

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
        name: frontmatter.name || name,
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
        ([_, chain]) => chain.chainId !== 1
      );
      l2Chains.forEach(([chainKey], i) => {
        const angle = (2 * Math.PI * i) / l2Chains.length;
        positions[chainKey] = {
          x: 3000 * Math.cos(angle),
          y: 3000 * Math.sin(angle),
        };
      });

      islandPositions = positions;
    }
  });

  // Example: how to get static data for a chain
  // const ethStatic = staticChains['ethereum'];
  // Example: how to get dynamic loader for a chain
  // const ethLoader = await getDynamicLoader('ethereum');

  function handlePointerDown(event: PointerEvent) {
    // Skip all touch events - handled by touch handlers
    if (event.pointerType === 'touch') return;
    
    if (event.button === 0) {
      // Check if we're clicking on an island in edit mode
      if (editMode && event.target) {
        const islandElement = (event.target as Element).closest(
          ".island-group"
        );
        if (islandElement) {
          // Find which chain this island represents by checking position
          let chainName: string | null = null;
          const transform = islandElement.getAttribute("transform");
          if (transform) {
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              // Find the chain with matching position
              for (const [key, pos] of Object.entries(islandPositions)) {
                if (Math.abs(pos.x - x) < 1 && Math.abs(pos.y - y) < 1) {
                  chainName = key;
                  break;
                }
              }
            }
          }

          if (chainName) {
            // Start dragging island
            isDraggingIsland = true;
            draggedIsland = chainName;
            const pos = islandPositions[chainName];
            if (pos && svg) {
              const pt = svg.createSVGPoint();
              pt.x = event.clientX;
              pt.y = event.clientY;
              const ctm = svg.getScreenCTM();
              if (ctm) {
                const svgP = pt.matrixTransform(ctm.inverse());
                dragOffset = {
                  x: svgP.x - pos.x,
                  y: svgP.y - pos.y,
                };
              }
            }
          }
          svgContainer?.setPointerCapture(event.pointerId);
          event.preventDefault();
          return;
        }
      }

      // Don't start panning immediately - wait for movement
      potentialClick = true;
      startPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      panStartTranslate = {
        x: translateX,
        y: translateY,
      };
      
      // Initialize momentum tracking
      lastPanTime = Date.now();
      lastPanPoint = { x: event.clientX, y: event.clientY };
      panVelocity = { x: 0, y: 0 };
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (isDraggingIsland && draggedIsland && svg) {
      // Handle island dragging
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        if (!svg || !draggedIsland) return;

        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const ctm = svg.getScreenCTM();
        if (ctm) {
          const svgP = pt.matrixTransform(ctm.inverse());

          // Calculate new position
          const newX = svgP.x - dragOffset.x;
          const newY = svgP.y - dragOffset.y;

          // Update position without any boundaries
          islandPositions[draggedIsland] = { x: newX, y: newY };
        }
      });
      return;
    }

    // Check if we should start panning
    if (potentialClick && !isPanning) {
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - startPoint.x, 2) +
        Math.pow(event.clientY - startPoint.y, 2)
      );
      
      if (moveDistance > clickThreshold) {
        // Start panning
        potentialClick = false;
        isPanning = true;
        isInteracting = true;
        lastInteractionTime = Date.now();
        svgContainer?.setPointerCapture(event.pointerId);
        event.preventDefault();
      } else {
        return; // Don't pan yet
      }
    }
    
    if (!isPanning) return;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {
      const dx = event.clientX - startPoint.x;
      const dy = event.clientY - startPoint.y;

      translateX = panStartTranslate.x + dx;
      translateY = panStartTranslate.y + dy;
      
      // Track velocity for momentum
      const now = Date.now();
      const dt = Math.max(1, now - lastPanTime);
      panVelocity = {
        x: (event.clientX - lastPanPoint.x) / dt * 16, // normalize to ~60fps
        y: (event.clientY - lastPanPoint.y) / dt * 16
      };
      
      lastPanTime = now;
      lastPanPoint = { x: event.clientX, y: event.clientY };
    });
  }

  function handlePointerUp(event: PointerEvent) {
    if (isDraggingIsland) {
      isDraggingIsland = false;
      draggedIsland = null;
      svgContainer?.releasePointerCapture(event.pointerId);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      return;
    }

    if (potentialClick && !isPanning) {
      // This was a click, not a drag
      const target = event.target as Element;
      const islandElement = target.closest('.island-group');
      
      if (islandElement && !editMode) {
        // Find which island was clicked
        const transform = islandElement.getAttribute('transform');
        if (transform) {
          const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            
            // Find the chain with matching position
            for (const [chainName, pos] of Object.entries(islandPositions)) {
              if (Math.abs(pos.x - x) < 1 && Math.abs(pos.y - y) < 1) {
                openBookByName(chainName);
                break;
              }
            }
          }
        }
      }
    }
    
    // Reset potential click
    potentialClick = false;
    
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
      
      // Start momentum animation if velocity is significant
      if (Math.abs(panVelocity.x) > 2 || Math.abs(panVelocity.y) > 2) {
        momentumAnimation();
      }
    }
  }

  function handleWheel(event: WheelEvent) {
    // Skip wheel events if we're pinching on mobile
    if (isPinching) return;
    
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

  // Touch tracking for tap detection
  let touchStartTime = 0;
  let touchStartPos = { x: 0, y: 0 };
  const TAP_THRESHOLD = 300; // ms
  const MOVE_THRESHOLD = 10; // pixels
  
  // Touch event handlers for mobile pinch zoom
  function handleTouchStart(event: TouchEvent) {
    // Don't prevent default for taps on islands
    const target = event.target as Element;
    const isIsland = target.closest('.island-group');
    
    if (!isIsland) {
      event.preventDefault(); // Only prevent scroll for non-island touches
    }
    
    if (event.touches.length === 2) {
      isPinching = true;
      isPanning = false; // Stop any panning
      touches = Array.from(event.touches);
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate pinch center for zoom target
      const rect = svgContainer!.getBoundingClientRect();
      const centerX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
      zoomTarget = {
        x: centerX - rect.width / 2,
        y: centerY - rect.height / 2,
      };
    } else if (event.touches.length === 1 && !isPinching) {
      // Track for tap detection
      touchStartTime = Date.now();
      touchStartPos = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      
      // Single touch - start pan if not on island
      if (!isIsland) {
        isPanning = true;
        startPoint = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
        panStartTranslate = {
          x: translateX,
          y: translateY,
        };
      }
    }
  }
  
  function handleTouchMove(event: TouchEvent) {
    event.preventDefault(); // Prevent page scroll
    
    if (isPinching && event.touches.length === 2) {
      touches = Array.from(event.touches);
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDistance > 0) {
        const scaleDelta = (currentDistance - lastTouchDistance) / lastTouchDistance;
        
        // Update pinch center dynamically
        const rect = svgContainer!.getBoundingClientRect();
        const centerX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
        zoomTarget = {
          x: centerX - rect.width / 2,
          y: centerY - rect.height / 2,
        };
        
        // Apply zoom similar to wheel but gentler
        const now = Date.now();
        lastZoomTime = now;
        isInteracting = true;
        lastInteractionTime = now;
        
        // Accumulate zoom delta with increased sensitivity for mobile
        zoomDelta += scaleDelta * 1.5; // Increased for more responsive feel
        zoomMomentum = scaleDelta * 0.2; // Slightly more momentum
        
        // Start smooth zoom loop if not running
        if (!zoomAnimationFrame) {
          smoothZoomLoop();
        }
      }
      
      lastTouchDistance = currentDistance;
    } else if (isPanning && event.touches.length === 1) {
      // Handle single touch pan
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      
      const deltaX = currentX - startPoint.x;
      const deltaY = currentY - startPoint.y;
      
      translateX = panStartTranslate.x + deltaX;
      translateY = panStartTranslate.y + deltaY;
      
      // Apply momentum
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      const now = Date.now();
      lastInteractionTime = now;
      isInteracting = true;
    }
  }
  
  function handleTouchEnd(event: TouchEvent) {
    const target = event.target as Element;
    const isIsland = target.closest('.island-group');
    
    if (!isIsland) {
      event.preventDefault();
    }
    
    if (event.touches.length < 2) {
      isPinching = false;
      touches = [];
      lastTouchDistance = 0;
    }
    
    if (event.touches.length === 0) {
      // Check if this was a tap
      const timeDiff = Date.now() - touchStartTime;
      const touchEndPos = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      const moveDist = Math.sqrt(
        Math.pow(touchEndPos.x - touchStartPos.x, 2) +
        Math.pow(touchEndPos.y - touchStartPos.y, 2)
      );
      
      // If it's a tap on an island, trigger click
      if (timeDiff < TAP_THRESHOLD && moveDist < MOVE_THRESHOLD && isIsland) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: touchEndPos.x,
          clientY: touchEndPos.y,
        });
        isIsland.dispatchEvent(clickEvent);
      }
      
      isPanning = false;
      
      // Start momentum animation only if we were panning
      if (!isIsland && !animationFrame) {
        momentumAnimation();
      }
    }
  }

  function smoothZoomLoop() {
    const step = () => {
      // Apply accumulated zoom gradually
      if (Math.abs(zoomDelta) > 0.001 || Math.abs(zoomMomentum) > 0.001) {
        // Calculate zoom factor from accumulated delta - more responsive on mobile
        const isMobile = window.innerWidth <= 600;
        const zoomStep = zoomDelta * (isMobile ? 0.5 : 0.3); // Apply more zoom per frame on mobile
        const momentumStep = zoomMomentum * 0.8; // Apply momentum

        const totalStep = zoomStep + momentumStep;
        const zoomFactor =
          totalStep > 0
            ? 1 + Math.min(totalStep, 0.05)
            : 1 + Math.max(totalStep, -0.05);

        const minScale = isMobileViewport ? 1.0 : 0.3;
        const newScale = Math.max(minScale, Math.min(5, scale * zoomFactor));

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

  function momentumAnimation() {
    const friction = 0.95;
    const minVelocity = 0.5;
    
    const animate = () => {
      if (Math.abs(panVelocity.x) > minVelocity || Math.abs(panVelocity.y) > minVelocity) {
        translateX += panVelocity.x;
        translateY += panVelocity.y;
        
        panVelocity.x *= friction;
        panVelocity.y *= friction;
        
        animationFrame = requestAnimationFrame(animate);
      } else {
        panVelocity = { x: 0, y: 0 };
        animationFrame = null;
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
  }

  function resetView() {
    scale = 1.5;
    translateX = 0;
    translateY = 0;
  }

  let showPositionsModal = $state(false);
  let positionsJson = $state("");

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

  function resetPositions() {
    const positions: Record<string, { x: number; y: number }> = {};

    // Ethereum at center
    positions["ethereum"] = { x: 0, y: 0 };

    // L2s in a circle with larger radius
    const l2Chains = Object.entries(staticChains).filter(
      ([_, chain]) => chain.chainId !== 1
    );
    l2Chains.forEach(([chainKey], i) => {
      const angle = (2 * Math.PI * i) / l2Chains.length;
      positions[chainKey] = {
        x: 3000 * Math.cos(angle),
        y: 3000 * Math.sin(angle),
      };
    });

    islandPositions = positions;
  }

  function openBookByName(chainName: string) {
    // Prevent opening modal during edit mode
    if (editMode) {
      return;
    }

    // Don't block clicks even if we're panning/interacting
    // The click handler will only fire if we didn't actually pan
    
    goto("/chain/" + chainName);
  }

  onMount(() => {
    // Check if mobile viewport
    const checkMobileViewport = () => {
      isMobileViewport = window.innerWidth <= 768;
    };
    
    checkMobileViewport();
    window.addEventListener('resize', checkMobileViewport);
    
    if (svgContainer) {
      svgContainer.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        svgContainer?.removeEventListener("wheel", handleWheel);
        window.removeEventListener('resize', checkMobileViewport);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        if (zoomAnimationFrame) {
          cancelAnimationFrame(zoomAnimationFrame);
        }
      };
    }
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={svgContainer}
  class="map-container {isPanning ? 'panning' : ''} {isDraggingIsland
    ? 'dragging-island'
    : ''}"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  ontouchcancel={handleTouchEnd}
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
      x="0"
      y="2500"
      font-size="400"
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
      x={islandPositions["ethereum"]?.x || 0}
      y={islandPositions["ethereum"]?.y || 0}
      {editMode}
    />

    <!-- L2s in a circle, spaced further out, exclude chainId 1 -->
    {#each Object.entries(staticChains).filter(([_, chain]) => chain.chainId !== 1) as [chainKey, blockchain], i}
      <Island
        name={blockchain.name}
        color={blockchain.color}
        darkColor={blockchain.darkColor}
        logo={blockchain.logoUrl}
        scale={0.8}
        x={islandPositions[chainKey]?.x ||
          3000 *
            Math.cos(
              (2 * Math.PI * i) /
                Object.entries(staticChains).filter(
                  ([_, chain]) => chain.chainId !== 1
                ).length
            )}
        y={islandPositions[chainKey]?.y ||
          3000 *
            Math.sin(
              (2 * Math.PI * i) /
                Object.entries(staticChains).filter(
                  ([_, chain]) => chain.chainId !== 1
                ).length
            )}
        {editMode}
      />
    {/each}
  </svg>

  <div class="controls">
    <button onclick={resetView}>Reset View</button>
    <button onclick={() => (editMode = !editMode)} class:active={editMode}>
      {editMode ? "Exit Edit Mode" : "Edit Mode"}
    </button>
    {#if editMode}
      <button onclick={savePositions}>Save Positions</button>
    {/if}
    <button onclick={resetPositions}>Reset Positions</button>
  </div>
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
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #87c1d3;
    cursor: grab;
    touch-action: none; /* Prevent all default touch behaviors */
    -webkit-user-select: none;
    user-select: none;
    position: fixed; /* Prevent page scrolling */
    top: 0;
    left: 0;
  }
  .map-container.panning {
    cursor: grabbing;
  }

  .map-container.dragging-island {
    cursor: move;
  }

  svg {
    width: 100%;
    height: 100%;
    will-change: transform; /* Hint for hardware acceleration */
    transition: none !important; /* Disable any default transitions for smooth panning */
    transform-origin: center center;
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
