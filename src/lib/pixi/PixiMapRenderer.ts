import { Application, Container, Graphics, Rectangle, Sprite } from "pixi.js";
import type { Viewport } from "pixi-viewport";

import { goto, preloadCode } from "$app/navigation";

import type { Island } from "$lib/types/island";

import IslandAtlasManager from "./IslandAtlasManager";
import PixiIslandRenderer from "./PixiIslandRenderer";
import type RenderManager from "./RenderManager";

export default class PixiMapRenderer {
  private app: Application;
  private viewport: Viewport;
  private islandRenderer: PixiIslandRenderer;
  private atlasManager: IslandAtlasManager;
  private renderManager: RenderManager | null = null;

  // Containers
  private oceanContainer: Container;
  private islandsContainer: Container;
  private overlayContainer: Container; // For shields/banners on hover
  private highlightContainer: Container;

  // Islands data
  private islands: Island[] = [];
  private islandSprites: Map<string, Sprite> = new Map();
  private islandContainers: Map<string, Container> = new Map(); // Keep for compatibility

  // Hover and search state
  private hoveredIsland: Island | null = null;
  private searchResults: Set<string> = new Set();
  private currentSearchResult: string | null = null;

  // Edit mode and dragging
  private editMode: boolean = false;
  private isDragging: boolean = false;
  private draggedIsland: Island | null = null;
  private dragData: any = null;
  private dragOffset = { x: 0, y: 0 };

  // Callbacks
  private onIslandMove?: (slug: string, x: number, y: number) => void;
  private onIslandDragEnd?: (slug: string, x: number, y: number) => void;
  private onDirty?: () => void;

  constructor(app: Application, viewport: Viewport) {
    this.app = app;
    this.viewport = viewport;

    // Initialize island renderer and atlas manager
    this.islandRenderer = new PixiIslandRenderer();
    this.islandRenderer.setRenderer(app.renderer);
    this.atlasManager = new IslandAtlasManager(
      app.renderer,
      this.islandRenderer,
    );

    // Create containers
    this.oceanContainer = new Container();
    this.islandsContainer = new Container();
    this.overlayContainer = new Container();
    this.highlightContainer = new Container();

    // Optimize container event modes for performance
    this.oceanContainer.eventMode = "none"; // Ocean doesn't need events
    this.highlightContainer.eventMode = "none"; // Highlights don't need events

    // Add containers to viewport in correct order
    this.viewport.addChild(this.oceanContainer);
    this.viewport.addChild(this.islandsContainer);
    this.viewport.addChild(this.overlayContainer); // For hover overlays
    this.viewport.addChild(this.highlightContainer); // On top of everything

    // Enable sorting for islands by Y position (for isometric depth)
    this.islandsContainer.sortableChildren = true;

    // Setup global drag move handler
    this.setupGlobalDragHandler();
  }

  private setupGlobalDragHandler(): void {
    this.viewport.on("pointermove", (event: any) => {
      if (this.isDragging && this.draggedIsland) {
        const globalPos = event.global;
        const localPos = this.viewport.toLocal(globalPos);

        // Calculate new position
        const newX = localPos.x - this.dragOffset.x;
        const newY = localPos.y - this.dragOffset.y;

        // Update island data
        this.draggedIsland.x = newX;
        this.draggedIsland.y = newY;

        // Update container position
        const container = this.islandContainers.get(this.draggedIsland.slug);
        if (container) {
          container.x = newX;
          container.y = newY;
          container.zIndex = newY; // Update depth sorting
        }

        // Mark dirty for continuous rendering during drag
        if (this.renderManager) {
          this.renderManager.markDirty();
        }

        // Update highlight position if this is the hovered island
        if (this.hoveredIsland === this.draggedIsland) {
          this.showHoverHighlight(this.draggedIsland);
        }

        // Prevent viewport dragging
        event.stopPropagation();
      }
    });
  }

  async setIslands(islands: Island[]): Promise<void> {
    this.islands = islands;

    // Clear existing islands
    this.islandsContainer.removeChildren();
    this.overlayContainer.removeChildren();
    this.islandSprites.clear();
    this.islandContainers.clear();

    // Destroy old atlas to free GPU memory before creating new one
    this.atlasManager.destroy();

    // Preload all logo assets
    const logoUrls = islands
      .map((island) => island.logoUrl)
      .filter((url) => url) as string[];

    await this.islandRenderer.preloadLogos(logoUrls);

    // Generate the texture atlas with all islands
    await this.atlasManager.generateAtlas(islands);

    // Clear texture caches now that everything is in the atlas
    // This frees up duplicate GPU memory (shields and logos are already baked into atlas)
    this.islandRenderer.clearTextureCaches();

    // Create sprites from atlas for all islands
    for (const island of islands) {
      await this.createIslandFromAtlas(island);
    }

    // Trigger a single dirty update after all islands are added
    if (this.onDirty) {
      this.onDirty();
    }
  }

  private async createIslandFromAtlas(island: Island): Promise<void> {
    const sprite = this.atlasManager.createIslandSprite(island);
    if (!sprite) {
      console.warn(
        `[PixiMapRenderer] Failed to create sprite for ${island.slug}`,
      );
      return;
    }

    // Create a container wrapper for compatibility
    const container = new Container();
    container.x = island.x;
    container.y = island.y;
    container.zIndex = island.y;

    // Center the sprite in the container
    sprite.x = 0;
    sprite.y = 0;
    container.addChild(sprite);

    // Add to containers
    this.islandsContainer.addChild(container);
    this.islandSprites.set(island.slug, sprite);
    this.islandContainers.set(island.slug, container);

    // Make container interactive for hover/click
    container.eventMode = "static";
    container.cursor = "pointer";

    // IMPORTANT: Set hit area for better interaction detection
    // The island sprite is centered, so we need to ensure hit area is correct
    // const bounds = container.getLocalBounds();
    // container.hitArea = new Rectangle(
    //   bounds.x,
    //   bounds.y,
    //   bounds.width,
    //   bounds.height,
    // );

    // Setup drag events for edit mode
    this.setupIslandInteraction(container, island);
  }

  private setupIslandInteraction(container: Container, island: Island): void {
    // Store island reference on container for easy access
    (container as any).island = island;

    let dragStarted = false;
    let clickStartPos = { x: 0, y: 0 };

    // Add hover events
    container.on("pointerover", () => {
      this.setHoveredIsland(island);
      // Preload the chain page code on hover to prevent FOUC
      preloadCode(`/chain/${island.slug}`).catch(() => {
        // Ignore errors, preloading is optional
      });
    });

    container.on("pointerout", () => {
      if (this.hoveredIsland === island) {
        this.setHoveredIsland(null);
      }
    });

    container.on("pointerdown", (event: any) => {
      dragStarted = false;
      clickStartPos = { x: event.global.x, y: event.global.y };

      if (this.editMode) {
        // Start dragging
        this.isDragging = true;
        this.draggedIsland = island;
        this.dragData = event.data;
        dragStarted = true;

        // Calculate offset from island center to click point
        const globalPos = event.global;
        const localPos = this.viewport.toLocal(globalPos);
        this.dragOffset.x = localPos.x - island.x;
        this.dragOffset.y = localPos.y - island.y;

        // Change cursor
        this.viewport.cursor = "move";

        // Mark as animating for smooth drag rendering
        if (this.renderManager) {
          this.renderManager.setAnimating(true);
        }

        // Prevent viewport dragging
        event.stopPropagation();
      }
    });

    container.on("pointerup", (event: any) => {
      if (this.isDragging && this.draggedIsland === island) {
        this.endDrag();
        dragStarted = false;
      } else if (!this.editMode && !dragStarted) {
        // Check if it was a click (not a drag)
        const dist = Math.sqrt(
          Math.pow(event.global.x - clickStartPos.x, 2) +
            Math.pow(event.global.y - clickStartPos.y, 2),
        );

        if (dist < 5) {
          // It was a click, not a drag - navigate to chain page
          // Pass state to track that we came from the map view
          goto(`/chain/${island.slug}`, { state: { from: "/" } });
        }
      }
    });

    container.on("pointerupoutside", () => {
      if (this.isDragging && this.draggedIsland === island) {
        this.endDrag();
      }
      dragStarted = false;
    });
  }

  private endDrag(): void {
    // Notify parent component of final position
    if (this.draggedIsland && this.onIslandDragEnd) {
      this.onIslandDragEnd(
        this.draggedIsland.slug,
        this.draggedIsland.x,
        this.draggedIsland.y,
      );
    }

    // Stop animation mode
    if (this.renderManager) {
      this.renderManager.setAnimating(false);
      this.renderManager.markDirty(); // One final render at the end position
    }

    this.isDragging = false;
    this.draggedIsland = null;
    this.dragData = null;
    this.viewport.cursor = "grab";
  }

  setHoveredIsland(island: Island | null): void {
    this.hoveredIsland = island;

    // Update cursor
    if (island) {
      document.body.style.cursor = this.editMode ? "move" : "pointer";
    } else {
      document.body.style.cursor = "grab";
    }

    // Update hover highlight
    if (island && !this.isDragging) {
      this.showHoverHighlight(island);
    } else {
      this.hideHoverHighlight();
    }

    // Trigger re-render
    if (this.onDirty) {
      this.onDirty();
    }
  }

  private showHoverHighlight(island: Island): void {
    const container = this.islandContainers.get(island.slug);
    if (!container) return;

    // Don't override search highlight
    if (island.slug === this.currentSearchResult) return;

    // Hover gets cyan tint and scale
    container.tint = 0x99ffff; // Light cyan tint for hover
    container.alpha = 1;
  }

  private hideHoverHighlight(): void {
    // Reset container tints and scales (but not for search-highlighted islands)
    this.islandContainers.forEach((container, slug) => {
      if (slug !== this.currentSearchResult) {
        container.tint = 0xffffff; // Reset to white (no tint)
        container.scale.set(1); // Reset scale
        container.alpha = 1;
      }
    });
  }

  setSearchResults(results: string[]): void {
    this.searchResults = new Set(results);
    this.updateSearchHighlights();
  }

  setCurrentSearchResult(slug: string | null): void {
    this.currentSearchResult = slug;
    this.updateSearchHighlights();
  }

  private updateSearchHighlights(): void {
    // Update container opacity for search results
    this.islandContainers.forEach((container, slug) => {
      const isSearchResult = this.searchResults.has(slug);

      // Fade out non-matching islands
      container.alpha =
        isSearchResult || this.searchResults.size === 0 ? 1 : 0.3;
    });

    // Show/hide search highlight for current result
    if (this.currentSearchResult) {
      const island = this.islands.find(
        (i) => i.slug === this.currentSearchResult,
      );
      if (island) {
        this.showSearchHighlight(island);
      }
    } else {
      this.hideSearchHighlight();
    }
  }

  private showSearchHighlight(island: Island): void {
    const container = this.islandContainers.get(island.slug);
    if (!container) return;

    // Static highlight - just scale up, no animation
    container.scale.set(1.15);
    container.tint = 0xffffff; // Keep original colors
    container.alpha = 1;
  }

  private hideSearchHighlight(): void {
    // Reset any search-highlighted containers
    if (this.currentSearchResult) {
      const container = this.islandContainers.get(this.currentSearchResult);
      if (container) {
        container.tint = 0xffffff;
        container.scale.set(1);
        container.alpha = 1;
      }
    }
  }

  setEditMode(enabled: boolean): void {
    this.editMode = enabled;

    // Reset dragging state when disabling edit mode
    if (!enabled && this.isDragging) {
      this.endDrag();
    }

    // Update viewport dragging
    if (enabled) {
      // Disable viewport dragging in edit mode
      this.viewport.pause = true;
    } else {
      // Re-enable viewport dragging
      this.viewport.pause = false;
    }

    // Update cursor
    this.viewport.cursor = "grab";
  }

  setOnIslandMove(
    callback: (slug: string, x: number, y: number) => void,
  ): void {
    this.onIslandMove = callback;
  }

  setOnIslandDragEnd(
    callback: (slug: string, x: number, y: number) => void,
  ): void {
    this.onIslandDragEnd = callback;
  }

  setOnDirty(callback: () => void): void {
    this.onDirty = callback;
  }

  setRenderManager(renderManager: RenderManager): void {
    this.renderManager = renderManager;
  }

  // Get all islands with their current positions
  getIslands(): Island[] {
    return this.islands;
  }

  // Get island at world position
  getIslandAtPosition(worldX: number, worldY: number): Island | null {
    // Check islands in reverse order (top to bottom)
    for (let i = this.islands.length - 1; i >= 0; i--) {
      const island = this.islands[i];
      const container = this.islandContainers.get(island.slug);

      if (!container) continue;

      // Get the bounds of the container
      const bounds = container.getBounds();

      // Check if the world position is within the container bounds
      // Bounds don't have contains method, so we check manually
      if (
        worldX >= bounds.x &&
        worldX <= bounds.x + bounds.width &&
        worldY >= bounds.y &&
        worldY <= bounds.y + bounds.height
      ) {
        return island;
      }
    }

    return null;
  }

  /**
   * Report GPU memory usage for debugging
   */
  reportMemoryUsage(): void {
    console.group("🎮 GPU Memory Report");

    const textureStats = new Map<
      string,
      { count: number; memory: number; textures: any[] }
    >();
    let totalMemory = 0;
    let totalTextures = 0;

    // Get ALL texture sources - PixiJS v8 structure
    const renderer = this.app.renderer as any;
    const allSources = new Set<any>();

    // Method 1: Get sources from TextureSource manager
    const textureSystem = renderer.texture;
    if (textureSystem) {
      // Check managed textures
      if (textureSystem.managedTextures) {
        textureSystem.managedTextures.forEach((tex: any) => {
          if (tex?.source) allSources.add(tex.source);
        });
      }

      // Check all bound textures
      for (let i = 0; i < 16; i++) {
        const boundTexture = textureSystem.boundTextures?.[i];
        if (boundTexture?.source) allSources.add(boundTexture.source);
      }
    }

    // Method 2: Scan the entire app stage for sprites and their textures
    const scanContainer = (container: any) => {
      if (!container) return;

      // Check if it's a sprite with a texture
      if (container.texture?.source) {
        allSources.add(container.texture.source);
      }

      // Check if it's a graphics object with a texture
      if (container._texture?.source) {
        allSources.add(container._texture.source);
      }

      // Recursively check children
      if (container.children) {
        container.children.forEach((child: any) => scanContainer(child));
      }
    };

    // Scan the entire stage
    scanContainer(this.app.stage);
    scanContainer(this.viewport);
    scanContainer(this.islandsContainer);
    scanContainer(this.overlayContainer);

    // Method 3: Check our island renderer's cached textures
    const islandRenderer = this.islandRenderer as any;
    if (islandRenderer) {
      // Check shield textures
      if (islandRenderer.shieldTextures) {
        islandRenderer.shieldTextures.forEach((tex: any) => {
          if (tex?.source) allSources.add(tex.source);
        });
      }

      // Check logo textures
      if (islandRenderer.logoTextures) {
        islandRenderer.logoTextures.forEach((tex: any) => {
          if (tex?.source) allSources.add(tex.source);
        });
      }

      // Check banner texture
      if (islandRenderer.bannerTexture?.source) {
        allSources.add(islandRenderer.bannerTexture.source);
      }
    }

    // Method 4: Check our own atlases directly
    this.atlasManager.getAllAtlases().forEach((atlas: any) => {
      if (atlas?.source) allSources.add(atlas.source);
    });

    // Method 5: Check Assets cache
    const Assets = (window as any).PIXI?.Assets;
    if (Assets?.cache) {
      const cache = Assets.cache;
      if (cache._cache) {
        cache._cache.forEach((asset: any) => {
          if (asset?.source) allSources.add(asset.source);
          if (asset?.texture?.source) allSources.add(asset.texture.source);
        });
      }
    }

    console.log(`Found ${allSources.size} unique texture sources`);

    // Analyze each texture source
    allSources.forEach((source: any) => {
      if (!source) return;

      const width = source.pixelWidth || source.width || 0;
      const height = source.pixelHeight || source.height || 0;
      const memory = width * height * 4; // RGBA

      // Try to identify texture type
      let category = "unknown";
      const label = source.label || source.resource?.src || "";

      if (
        width === this.atlasManager.getAtlasSize() &&
        height === this.atlasManager.getAtlasSize()
      ) {
        category = "atlas";
      } else if (width === 890 && height === 1115) {
        category = "shield (full-res!)";
      } else if (width === 1415 && height === 475) {
        category = "banner";
      } else if (label.includes("shield")) {
        category = `shield-${width}x${height}`;
      } else if (label.includes("logo") || label.includes("chains")) {
        category = "logo";
      } else if (label.includes("data:image")) {
        category = "logo-dataurl";
      } else if (width === 1 && height === 1) {
        category = "1x1-pixel";
      } else if (width < 512 && height < 512) {
        category = "small-texture";
      } else if (width === 1000 && height === 1000) {
        category = "logo-1000x1000";
      } else {
        category = `other-${width}x${height}`;
      }

      if (!textureStats.has(category)) {
        textureStats.set(category, { count: 0, memory: 0, textures: [] });
      }

      const stat = textureStats.get(category)!;
      stat.count++;
      stat.memory += memory;
      stat.textures.push({
        width,
        height,
        memory: memory / 1024 / 1024,
        label: label.substring(0, 50),
      });

      totalMemory += memory;
      totalTextures++;
    });

    // Report atlas-specific stats
    const atlasCount = this.atlasManager.getAllAtlases().length;
    const atlasSize = this.atlasManager.getAtlasSize();
    const atlasMemory = atlasCount * atlasSize * atlasSize * 4;

    console.log(`📊 Atlas Stats:`);
    console.log(`  - Count: ${atlasCount}`);
    console.log(`  - Size: ${atlasSize}x${atlasSize}`);
    console.log(`  - Memory: ${(atlasMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Islands: ${this.islands.length}`);

    // Report by category
    console.log(`\n📈 Texture Categories:`);
    textureStats.forEach((stat, category) => {
      const memoryMB = (stat.memory / 1024 / 1024).toFixed(2);
      console.log(`  ${category}: ${stat.count} textures, ${memoryMB} MB`);
      if (category === "shield (full-res!)" && stat.count > 0) {
        console.warn(
          `    ⚠️ Shields at full resolution! Should be ~311x390 not 890x1115`,
        );
      }
      // Show largest textures in category
      if (stat.textures.length > 0) {
        const sorted = stat.textures.sort((a, b) => b.memory - a.memory);
        const largest = sorted[0];
        console.log(
          `    Largest: ${largest.width}x${largest.height} (${largest.memory.toFixed(2)} MB)`,
        );
      }
    });

    // Total summary
    console.log(`\n💾 Total GPU Memory:`);
    console.log(`  - Textures: ${totalTextures}`);
    console.log(`  - Memory: ${(totalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `  - Per Island: ${(totalMemory / 1024 / 1024 / Math.max(1, this.islands.length)).toFixed(2)} MB`,
    );

    // Check for potential issues
    if (totalMemory > 2 * 1024 * 1024 * 1024) {
      // > 2GB
      console.warn(`\n⚠️ High memory usage detected! Consider:`);
      console.warn(
        `  - Reducing atlas size (currently ${atlasSize}x${atlasSize})`,
      );
      console.warn(`  - Creating shields at display size (35% of original)`);
      console.warn(`  - Optimizing logo sizes`);
    }

    console.groupEnd();

    // Also report WebGL memory directly
    this.reportWebGLMemory();
  }

  /**
   * Report WebGL texture memory directly
   */
  private reportWebGLMemory(): void {
    console.group("🔍 WebGL Memory Analysis");

    const gl = (this.app.renderer as any).gl;
    if (!gl) {
      console.warn("WebGL context not available");
      console.groupEnd();
      return;
    }

    // Get WebGL info
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      console.log(`GPU: ${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`);
    }

    // Try to get memory info if available (Chrome/Chromium)
    const memInfo = (performance as any).memory;
    if (memInfo) {
      console.log(
        `JS Heap: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB / ${(memInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      );
      console.log(
        `JS Heap Limit: ${(memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      );
    }

    // Count WebGL textures
    const webglExt = gl.getExtension("WEBGL_lose_context");
    const textureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    console.log(`Max Texture Units: ${textureUnits}`);

    // Check texture size limits
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    console.log(`Max Texture Size: ${maxTextureSize}x${maxTextureSize}`);
    console.log(
      `Max Renderbuffer Size: ${maxRenderbufferSize}x${maxRenderbufferSize}`,
    );

    // Try to estimate GPU memory from our known textures
    const atlasMemory =
      this.atlasManager.getAllAtlases().length *
      this.atlasManager.getAtlasSize() *
      this.atlasManager.getAtlasSize() *
      4;

    console.log(`\n📊 Memory Estimate:`);
    console.log(`Atlas Memory: ${(atlasMemory / 1024 / 1024).toFixed(2)} MB`);

    // Check for texture pooling
    const renderer = this.app.renderer as any;
    if (renderer.texturePool) {
      let pooledCount = 0;
      let pooledMemory = 0;

      if (renderer.texturePool.texturePool) {
        Object.entries(renderer.texturePool.texturePool).forEach(
          ([key, textures]: [string, any]) => {
            if (Array.isArray(textures)) {
              pooledCount += textures.length;
              // Parse key format: "pixelWidthxpixelHeight"
              const [width, height] = key.split("x").map(Number);
              if (width && height) {
                pooledMemory += textures.length * width * height * 4;
              }
            }
          },
        );
      }

      console.log(
        `Texture Pool: ${pooledCount} textures, ${(pooledMemory / 1024 / 1024).toFixed(2)} MB`,
      );
    }

    console.groupEnd();
  }

  // Clean up resources
  destroy(): void {
    // Clean up island renderer
    this.islandRenderer.destroy();

    // Clean up atlas manager - crucial for freeing GPU memory
    this.atlasManager.destroy();

    // Clear containers
    this.islandContainers.clear();
  }
}
