import {
  Application,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from "pixi.js";
import type { Viewport } from "pixi-viewport";
import { goto } from "$app/navigation";
import PixiIslandRenderer from "./PixiIslandRenderer";
import type { Island } from "$lib/types/island";

export default class PixiMapRenderer {
  private app: Application;
  private viewport: Viewport;
  private islandRenderer: PixiIslandRenderer;

  // Containers
  private oceanContainer: Container;
  private islandsContainer: Container;
  private highlightContainer: Container;

  // Islands data
  private islands: Island[] = [];
  private islandContainers: Map<string, Container> = new Map();

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
  private onDirty?: () => void;

  constructor(app: Application, viewport: Viewport) {
    this.app = app;
    this.viewport = viewport;

    // Initialize island renderer
    this.islandRenderer = new PixiIslandRenderer();
    this.islandRenderer.setRenderer(app.renderer);

    // Create containers
    this.oceanContainer = new Container();
    this.islandsContainer = new Container();
    this.highlightContainer = new Container();

    // Add containers to viewport in correct order
    this.viewport.addChild(this.oceanContainer);
    this.viewport.addChild(this.islandsContainer);
    this.viewport.addChild(this.highlightContainer); // On top of islands

    // Enable sorting for islands by Y position (for isometric depth)
    this.islandsContainer.sortableChildren = true;

    // Initialize ocean
    this.createOceanBackground();

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

        // Notify parent component
        if (this.onIslandMove) {
          this.onIslandMove(this.draggedIsland.slug, newX, newY);
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

  private createOceanBackground(): void {
    const graphics = new Graphics();

    // Draw large ocean background
    const size = 20000;
    graphics.rect(-size / 2, -size / 2, size, size);
    graphics.fill({ color: 0x5ca9ce });

    this.oceanContainer.addChild(graphics);
  }

  async setIslands(islands: Island[]): Promise<void> {
    this.islands = islands;

    // Clear existing islands
    this.islandsContainer.removeChildren();
    this.islandContainers.clear();

    // Preload all logo assets
    const logoUrls = islands
      .map((island) => island.logoUrl)
      .filter((url) => url) as string[];

    await this.islandRenderer.preloadLogos(logoUrls);

    // Create islands
    islands.forEach((island) => {
      this.createIslandContainer(island);
    });
  }

  private async createIslandContainer(island: Island): Promise<void> {
    const container = new Container();
    container.x = island.x;
    container.y = island.y;

    // Set zIndex for proper layering (based on Y position for isometric view)
    container.zIndex = island.y;

    // Create the island graphics
    const islandGraphics = await this.islandRenderer.createIsland(island);
    container.addChild(islandGraphics);

    // Add to containers
    this.islandsContainer.addChild(container);
    this.islandContainers.set(island.slug, container);

    // Make container interactive for hover/click
    container.eventMode = "static";
    container.cursor = "pointer";

    // IMPORTANT: Set hit area for better interaction detection
    // The island sprite is centered, so we need to ensure hit area is correct
    const bounds = container.getLocalBounds();
    container.hitArea = new Rectangle(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
    );

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
          goto(`/chain/${island.slug}`);
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
    container.tint = 0xccffff; // Light cyan tint for hover
    container.scale.set(1.05); // Subtle scale up
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
      const isCurrent = slug === this.currentSearchResult;

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

  setOnDirty(callback: () => void): void {
    this.onDirty = callback;
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

  // Clean up resources
  destroy(): void {
    // Clean up island renderer
    this.islandRenderer.destroy();

    // Clear containers
    this.islandContainers.clear();
  }
}
