<script lang="ts">
  import { onMount } from "svelte";
  import Island from "./Island.svelte";
  import BoatLoader from "./BoatLoader.svelte";
  import SearchBar from "./SearchBar.svelte";
  import YAML from "yaml";
  import { goto } from "$app/navigation";
  import { overviewStore, tvlLookupByChainId } from "$lib/stores/overviewStore";

  // Center the viewBox on (0,0) where Ethereum is located
  const initialViewBox = { x: -5000, y: -5000, width: 20000, height: 20000 };
  let baseViewBox = $state(initialViewBox);

  let svg = $state<SVGSVGElement>();
  let svgContainer = $state<HTMLDivElement>();
  let isPanning = $state(false);
  let startPoint = $state({ x: 0, y: 0 });

  // Pan state (now tracks viewBox offset)
  let panX = $state(0);
  let panY = $state(0);
  let panStart = { x: 0, y: 0 };
  let animationFrame: number | null = null;

  // Zoom state
  let scale = $state(1); // Will be calculated dynamically in onMount
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const ZOOM_SPEED = 0.001; // For wheel events

  // Computed viewBox that includes pan offset and zoom
  let viewBox = $derived({
    x: baseViewBox.x + panX,
    y: baseViewBox.y + panY,
    width: baseViewBox.width / scale,
    height: baseViewBox.height / scale,
  });

  // Store subscription - need to use derived state for reactivity
  let overviewStoreState = $derived($overviewStore);

  // Show loader until we have TVL data
  let showLoader = $derived(
    overviewStoreState.isLoading || !overviewStoreState.data
  );

  // Interaction state tracking
  let isInteracting = $state(false);
  let lastInteractionTime = 0;

  // Click detection
  let potentialClick = false;
  let clickThreshold = 5; // pixels of movement before we consider it a drag

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
          x: 5000 * Math.cos(angle),
          y: 5000 * Math.sin(angle),
        };
      });

      islandPositions = positions;
    }
  });

  function handlePointerDown(event: PointerEvent) {
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
              const rect = svgContainer?.getBoundingClientRect();
              if (rect) {
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;

                // Convert screen coordinates to SVG coordinates
                const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
                const svgY =
                  viewBox.y + (mouseY / rect.height) * viewBox.height;

                dragOffset = {
                  x: svgX - pos.x,
                  y: svgY - pos.y,
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
      panStart = {
        x: panX,
        y: panY,
      };
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (isDraggingIsland && draggedIsland && svg) {
      // Handle island dragging
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        if (!svgContainer || !draggedIsland || !svg) return;

        const rect = svgContainer.getBoundingClientRect();
        if (rect) {
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;

          // Calculate the SVG-to-screen ratio
          const svgWidth = initialViewBox.width;
          const screenWidth = rect.width;
          const ratio = svgWidth / screenWidth / scale;

          // Convert screen coordinates to SVG coordinates
          const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
          const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;

          // Calculate new position
          const newX = svgX - dragOffset.x;
          const newY = svgY - dragOffset.y;

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

      // Convert pixel movement to SVG units
      const containerWidth = svgContainer?.clientWidth || 1;
      const containerHeight = svgContainer?.clientHeight || 1;
      const svgDx = -dx * (viewBox.width / containerWidth);
      const svgDy = -dy * (viewBox.height / containerHeight);

      panX = panStart.x + svgDx;
      panY = panStart.y + svgDy;
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
      const islandElement = target.closest(".island-group");

      if (islandElement && !editMode) {
        // Find which island was clicked
        const transform = islandElement.getAttribute("transform");
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

      // Reset velocity without momentum animation
      panVelocity = { x: 0, y: 0 };
    }
  }

  function handleWheel(event: WheelEvent) {
    // Prevent default scroll behavior
    event.preventDefault();

    // Detect pinch on trackpad (ctrlKey is true for pinch gestures)
    const isPinchGesture = event.ctrlKey;

    // Calculate zoom factor
    let delta;
    if (isPinchGesture) {
      // Pinch gesture on trackpad
      delta = -event.deltaY * ZOOM_SPEED * 2;
    } else {
      // Regular mouse wheel
      delta = -event.deltaY * ZOOM_SPEED;
    }

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale * (1 + delta))
    );

    if (newScale !== scale && svgContainer) {
      // Get mouse position relative to the container
      const rect = svgContainer.getBoundingClientRect();
      if (rect) {
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Convert mouse position to SVG coordinates before zoom
        const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
        const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;

        // Update scale
        scale = newScale;

        // Adjust pan to keep the mouse position fixed
        // After zoom, the new viewBox width/height will be baseViewBox.width/newScale
        const newViewBoxWidth = baseViewBox.width / newScale;
        const newViewBoxHeight = baseViewBox.height / newScale;

        // Calculate new pan to keep mouse point fixed
        panX = svgX - (mouseX / rect.width) * newViewBoxWidth - baseViewBox.x;
        panY = svgY - (mouseY / rect.height) * newViewBoxHeight - baseViewBox.y;
      }
    }
  }

  // Touch tracking for tap detection
  let touchStartTime = 0;
  let touchStartPos = { x: 0, y: 0 };

  // Pinch zoom tracking
  let isPinching = $state(false);
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let lastPinchCenter = { x: 0, y: 0 };

  // Helper functions for pinch zoom
  function getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchCenter(touches: TouchList): { x: number; y: number } {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }

  // Touch event handlers for mobile - only for preventing default scroll
  function handleTouchStart(event: TouchEvent) {
    // Track for tap detection
    touchStartTime = Date.now();
    touchStartPos = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    // Check for pinch gesture (two fingers) - but not in edit mode
    if (event.touches.length === 2 && !editMode) {
      isPinching = true;
      pinchStartDistance = getTouchDistance(event.touches);
      pinchStartScale = scale;
      lastPinchCenter = getTouchCenter(event.touches);

      // Prevent panning while pinching
      isPanning = false;
      potentialClick = false;

      event.preventDefault();
    }
  }

  function handleTouchMove(event: TouchEvent) {
    // Handle pinch zoom
    if (isPinching && event.touches.length === 2) {
      event.preventDefault();

      const currentDistance = getTouchDistance(event.touches);
      const currentCenter = getTouchCenter(event.touches);

      // Calculate new scale based on pinch distance
      const distanceRatio = currentDistance / pinchStartDistance;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinchStartScale * distanceRatio)
      );

      if (newScale !== scale && svgContainer) {
        // Get center position relative to the container
        const rect = svgContainer.getBoundingClientRect();
        if (rect) {
          const centerX = currentCenter.x - rect.left;
          const centerY = currentCenter.y - rect.top;

          // Convert pinch center to SVG coordinates before zoom
          const svgX = viewBox.x + (centerX / rect.width) * viewBox.width;
          const svgY = viewBox.y + (centerY / rect.height) * viewBox.height;

          // Update scale
          scale = newScale;

          // Adjust pan to keep the pinch center fixed
          const newViewBoxWidth = baseViewBox.width / newScale;
          const newViewBoxHeight = baseViewBox.height / newScale;

          // Calculate new pan to keep pinch center fixed
          panX =
            svgX - (centerX / rect.width) * newViewBoxWidth - baseViewBox.x;
          panY =
            svgY - (centerY / rect.height) * newViewBoxHeight - baseViewBox.y;

          lastPinchCenter = currentCenter;
        }
      }
      return;
    }

    // Only prevent scroll if we're actively panning
    if (isPanning) {
      event.preventDefault();
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    // Stop pinching if less than 2 touches
    if (event.touches.length < 2) {
      isPinching = false;
    }

    // Let pointer events handle the actual interaction
  }

  function momentumAnimation() {
    const friction = 0.95;
    const minVelocity = 0.1; // Adjusted for SVG units

    const animate = () => {
      if (
        Math.abs(panVelocity.x) > minVelocity ||
        Math.abs(panVelocity.y) > minVelocity
      ) {
        panX += panVelocity.x;
        panY += panVelocity.y;

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

  function openBookByName(chainName: string) {
    // Prevent opening modal during edit mode
    if (editMode) {
      return;
    }

    // Don't block clicks even if we're panning/interacting
    // The click handler will only fire if we didn't actually pan

    goto("/chain/" + chainName);
  }

  // Calculate island scale based on TVL using power scaling for visual hierarchy
  function calculateIslandScale(tvl: number): number {
    // Use a reference TVL for Base (~$3.4B) as our "normal" size
    const REFERENCE_TVL = 3_400_000_000; // Base TVL
    const REFERENCE_SCALE = 1.0; // Base gets scale 1.0

    // Use power of 0.35 to compress differences
    // This makes 20x TVL difference appear as ~3.5x visual difference
    const scale = REFERENCE_SCALE * Math.pow(tvl / REFERENCE_TVL, 0.35);

    // Apply reasonable bounds
    const MIN_SCALE = 0.3;
    const MAX_SCALE = 2.0;

    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
  }

  // Get TVL lookup from store
  let tvlLookupMap = $derived($tvlLookupByChainId);

  // Search state
  let searchQuery = $state("");
  let searchResults = $state<string[]>([]);
  let currentResultIndex = $state(0);
  let isSearchActive = $state(false);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Search implementation
  function performSearch(query: string) {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    if (query.length < 3) {
      searchResults = [];
      currentResultIndex = 0;
      return;
    }

    searchDebounceTimer = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      const matches: string[] = [];

      // Search through all chains
      for (const [chainKey, chain] of Object.entries(staticChains)) {
        // Only search chains that have positions
        if (!islandPositions[chainKey]) continue;

        // Search in chain name (case insensitive)
        const chainName = chain.name?.toLowerCase() || chainKey.toLowerCase();
        if (chainName.includes(lowerQuery)) {
          matches.push(chainKey);
        }
      }

      searchResults = matches;
      currentResultIndex = 0;

      // Navigate to first result if any
      if (matches.length > 0) {
        navigateToChain(matches[0]);
      }
    }, 300);
  }

  function navigateToChain(chainKey: string) {
    const position = islandPositions[chainKey];
    if (!position) return;

    // Cancel any ongoing momentum animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    panVelocity = { x: 0, y: 0 };

    // If we're zoomed out too much, zoom in a bit to see the island better
    const targetScale = scale < 1.5 ? 1.5 : scale;
    
    // Calculate the viewBox dimensions at target scale
    const targetViewBoxWidth = baseViewBox.width / targetScale;
    const targetViewBoxHeight = baseViewBox.height / targetScale;
    
    // Calculate pan to center the island
    // We want the island position to be at the center of the viewBox
    const targetPanX = position.x - targetViewBoxWidth / 2 - baseViewBox.x;
    const targetPanY = position.y - targetViewBoxHeight / 2 - baseViewBox.y;

    // Animation parameters
    const duration = 600; // ms
    const startTime = Date.now();
    const startPanX = panX;
    const startPanY = panY;
    const startScale = scale;

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      panX = startPanX + (targetPanX - startPanX) * eased;
      panY = startPanY + (targetPanY - startPanY) * eased;
      scale = startScale + (targetScale - startScale) * eased;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        animationFrame = null;
      }
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function handleSearchNavigation(direction: 'prev' | 'next') {
    if (searchResults.length === 0) return;

    if (direction === 'next') {
      currentResultIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      currentResultIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    }

    navigateToChain(searchResults[currentResultIndex]);
  }

  function clearSearch() {
    searchQuery = "";
    searchResults = [];
    currentResultIndex = 0;
    isSearchActive = false;
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
  }

  // Keyboard shortcuts
  function handleGlobalKeyDown(event: KeyboardEvent) {
    // Cmd/Ctrl + F to activate search
    if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
      event.preventDefault();
      isSearchActive = true;
      // Force focus to search input
      setTimeout(() => {
        const searchInput = document.querySelector('.search-bar input') as HTMLInputElement;
        searchInput?.focus();
      }, 50);
    }
  }

  onMount(() => {
    // Calculate initial scale based on viewport
    const calculateInitialScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth <= 768;

      if (isMobile) {
        // For mobile, use full viewBox but zoom in with scale
        baseViewBox = initialViewBox;
        scale = 2.5; // Zoom in to show ~8000 units (20000/2.5)

        // Reset pan
        panX = 0;
        panY = 0;
      } else {
        // Desktop: use full viewBox and appropriate scale
        baseViewBox = initialViewBox;
        scale = 2.0; // Show ~10000 units (20000/2)

        // Reset pan
        panX = 0;
        panY = 0;
      }
    };

    calculateInitialScale();

    // Check if mobile viewport
    const checkMobileViewport = () => {
      isMobileViewport = window.innerWidth <= 768;
    };

    checkMobileViewport();

    // Recalculate scale on resize
    const handleResize = () => {
      checkMobileViewport();
      calculateInitialScale();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleGlobalKeyDown);

    if (svgContainer) {
      svgContainer.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        svgContainer?.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", handleGlobalKeyDown);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        if (searchDebounceTimer) {
          clearTimeout(searchDebounceTimer);
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
    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Map of the EVM ecosystem"
    role="region"
    style="width: 100%; height: 100%;"
  >
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3" />
      </filter>
      
      <!-- Ocean texture pattern -->
      <pattern id="oceanTexture" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="2" fill="#a8d5e8" opacity="0.3" />
        <circle cx="150" cy="50" r="3" fill="#a8d5e8" opacity="0.25" />
        <circle cx="100" cy="100" r="2.5" fill="#a8d5e8" opacity="0.28" />
        <circle cx="50" cy="150" r="2" fill="#a8d5e8" opacity="0.3" />
        <circle cx="150" cy="150" r="2.8" fill="#a8d5e8" opacity="0.26" />
      </pattern>
    </defs>
    
    <!-- Ocean texture overlay -->
    <rect 
      x={viewBox.x} 
      y={viewBox.y} 
      width={viewBox.width} 
      height={viewBox.height} 
      fill="url(#oceanTexture)" 
      opacity="0.3"
    />

    {#if !showLoader}
      <!-- Isometric grid -->
      <defs>
        <pattern id="grid" width="500" height="289" patternUnits="userSpaceOnUse">
          <path d="M 250 0 L 500 144.5 L 250 289 L 0 144.5 Z" fill="none" stroke="#7fc3e6" stroke-width="1" opacity="0.15" />
        </pattern>
      </defs>
      <rect 
        x={viewBox.x} 
        y={viewBox.y} 
        width={viewBox.width} 
        height={viewBox.height} 
        fill="url(#grid)" 
      />
      
      <!-- EVM SEA ocean label -->
      <g transform="translate(0, 2500)">
        <!-- White outline for contrast -->
        <text
          x="0"
          y="0"
          font-size="450"
          fill="none"
          stroke="#ffffff"
          stroke-width="4"
          text-anchor="middle"
          font-weight="700"
          opacity="0.6"
          transform="skewY(0) scale(1,0.866)"
          style="font-family: 'Lato', 'Inter', 'Helvetica Neue', sans-serif; letter-spacing: 60px; text-transform: uppercase; animation: fadeIn 3s ease-out;"
        >
          EVM SEA
        </text>
        <!-- Main text -->
        <text
          x="0"
          y="0"
          font-size="450"
          fill="#3a7fa3"
          text-anchor="middle"
          font-weight="700"
          opacity="0.7"
          transform="skewY(0) scale(1,0.866)"
          style="font-family: 'Lato', 'Inter', 'Helvetica Neue', sans-serif; letter-spacing: 60px; text-transform: uppercase; animation: fadeIn 3s ease-out;"
        >
          EVM SEA
        </text>
      </g>

      <!-- Main Ethereum Island (center) -->
      {#if islandPositions["ethereum"]}
        <Island
          name={staticChains["ethereum"]?.name}
          color={staticChains["ethereum"]?.color}
          darkColor={staticChains["ethereum"]?.darkColor}
          logo={staticChains["ethereum"]?.logoUrl}
          slug="ethereum"
          scale={(() => {
            const chainId = staticChains["ethereum"]?.chainId;
            const tvl = chainId ? tvlLookupMap.get(chainId) || 0 : 0;
            return tvl > 0 ? calculateIslandScale(tvl) : 1.8; // Default large scale for Ethereum
          })()}
          x={islandPositions["ethereum"].x}
          y={islandPositions["ethereum"].y}
          {editMode}
          isSearchMatch={searchResults.includes("ethereum")}
          isCurrentSearchResult={searchResults[currentResultIndex] === "ethereum"}
        />
      {/if}

      <!-- L2s that have positions defined, exclude chainId 1 -->
      {#each Object.entries(staticChains).filter(([chainKey, chain]) => chain.chainId !== 1 && islandPositions[chainKey]) as [chainKey, blockchain], i}
        <Island
          name={blockchain.name}
          color={blockchain.color}
          darkColor={blockchain.darkColor}
          logo={blockchain.logoUrl}
          slug={chainKey}
          scale={(() => {
            const chainId = blockchain.chainId;
            const tvl = chainId ? tvlLookupMap.get(chainId) || 0 : 0;
            return tvl > 0 ? calculateIslandScale(tvl) : 0.6; // Default scale for unknown TVL
          })()}
          x={islandPositions[chainKey].x}
          y={islandPositions[chainKey].y}
          {editMode}
          isSearchMatch={searchResults.includes(chainKey)}
          isCurrentSearchResult={searchResults[currentResultIndex] === chainKey}
        />
      {/each}
    {/if}
  </svg>

  {#if showLoader}
    <BoatLoader />
  {/if}

  {#if !showLoader}
    <SearchBar
      bind:searchQuery
      {searchResults}
      {currentResultIndex}
      isActive={isSearchActive}
      onSearch={performSearch}
      onNavigate={handleSearchNavigation}
      onActivate={() => isSearchActive = true}
      onClear={clearSearch}
    />
  {/if}

  <div class="controls">
    <button onclick={() => (editMode = !editMode)} class:active={editMode}>
      {editMode ? "Exit Edit Mode" : "Edit Mode"}
    </button>
    {#if editMode}
      <button onclick={savePositions}>Save Positions</button>
    {/if}
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
    background: 
      radial-gradient(ellipse at center top, #87ceeb 0%, #6bb6d8 30%, #5ca9ce 60%, #4d9bc3 100%),
      linear-gradient(to bottom, #7fc3e6 0%, #5ca9ce 100%);
    background-blend-mode: normal;
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
    image-rendering: -webkit-optimize-contrast; /* Better rendering on WebKit */
    shape-rendering: geometricPrecision; /* Precise shape rendering */
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

  /* Fade in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

</style>
