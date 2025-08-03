import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import type { Viewport } from "pixi-viewport";
import PixiIslandRenderer from "./PixiIslandRenderer";
import type { Island } from "$lib/types/island";

export default class PixiMapRenderer {
  private app: Application;
  private viewport: Viewport;
  private islandRenderer: PixiIslandRenderer;

  // Containers
  private oceanContainer: Container;
  private islandsContainer: Container;

  // Islands data
  private islands: Island[] = [];
  private islandContainers: Map<string, Container> = new Map();

  // Hover and search state
  private hoveredIsland: Island | null = null;
  private searchResults: Set<string> = new Set();
  private currentSearchResult: string | null = null;

  // Edit mode
  private editMode: boolean = false;

  constructor(app: Application, viewport: Viewport) {
    this.app = app;
    this.viewport = viewport;

    // Initialize island renderer
    this.islandRenderer = new PixiIslandRenderer();
    this.islandRenderer.setRenderer(app.renderer);

    // Create containers
    this.oceanContainer = new Container();
    this.islandsContainer = new Container();

    // Add containers to viewport
    this.viewport.addChild(this.oceanContainer);
    this.viewport.addChild(this.islandsContainer);

    // Enable sorting for islands by Y position (for isometric depth)
    this.islandsContainer.sortableChildren = true;

    // Initialize ocean
    this.createOceanBackground();
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
  }

  setHoveredIsland(island: Island | null): void {
    this.hoveredIsland = island;

    // Update cursor only, don't pause drag
    if (island) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "grab";
    }
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
    this.islandContainers.forEach((container, slug) => {
      const isSearchResult = this.searchResults.has(slug);
      const isCurrent = slug === this.currentSearchResult;

      container.alpha =
        isSearchResult || this.searchResults.size === 0 ? 1 : 0.3;

      if (isCurrent) {
        // Add highlight effect
        container.scale.set(1.1);
      } else {
        container.scale.set(1);
      }
    });
  }

  setEditMode(enabled: boolean): void {
    this.editMode = enabled;
  }

  // Get island at world position
  getIslandAtPosition(worldX: number, worldY: number): Island | null {
    // Check islands in reverse order (top to bottom)
    for (let i = this.islands.length - 1; i >= 0; i--) {
      const island = this.islands[i];
      const container = this.islandContainers.get(island.slug);

      if (!container) continue;

      // Simple distance check for diamond shape
      const dx = Math.abs(worldX - island.x);
      const dy = Math.abs(worldY - island.y);
      const size = 100 * island.scale;

      if (dx + dy < size) {
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
