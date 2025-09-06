import {
  Container,
  Rectangle,
  type Renderer,
  RenderTexture,
  Sprite,
  Texture,
} from "pixi.js";

import type { Island } from "$lib/types/island";

import type PixiIslandRenderer from "./PixiIslandRenderer";

interface AtlasLocation {
  atlasIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number; // Scale applied to fit in atlas
}

interface PackItem {
  id: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

interface Shelf {
  y: number;
  height: number;
  width: number;
  items: PackItem[];
}

/**
 * Manages a texture atlas for all island base textures.
 * Uses shelf packing algorithm to efficiently pack islands into a single texture.
 */
export default class IslandAtlasManager {
  private renderer: Renderer;
  private islandRenderer: PixiIslandRenderer;
  private atlases: RenderTexture[] = [];
  private islandLocations: Map<string, AtlasLocation> = new Map();
  private atlasSize: number = 4096;
  private readonly PADDING = 4; // Prevent texture bleeding

  constructor(renderer: Renderer, islandRenderer: PixiIslandRenderer) {
    this.renderer = renderer;
    this.islandRenderer = islandRenderer;
    this.detectOptimalAtlasSize();
  }

  /**
   * Detect the maximum texture size supported by the device
   */
  private detectOptimalAtlasSize(): void {
    try {
      const gl = (this.renderer as any).gl;
      const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      if (maxSize >= 4096) {
        this.atlasSize = 4096; // Optimal for current needs
      } else {
        this.atlasSize = 2048; // Fallback for very old devices
        console.warn(
          "[IslandAtlasManager] Device only supports 2048 textures, may need multiple atlases",
        );
      }

      console.log(
        `[IslandAtlasManager] Atlas size set to ${this.atlasSize}x${this.atlasSize}`,
      );
    } catch (error) {
      console.error(
        "[IslandAtlasManager] Error detecting texture size, using default 4096",
        error,
      );
      this.atlasSize = 4096;
    }
  }

  /**
   * Generate texture atlases containing all island textures
   */
  async generateAtlas(islands: Island[]): Promise<void> {
    console.log(
      `[IslandAtlasManager] Generating atlases for ${islands.length} islands`,
    );

    // First pass: render all islands and collect their bounds
    const islandContainers: Map<
      string,
      { container: Container; bounds: any; scale: number }
    > = new Map();

    for (const island of islands) {
      try {
        const container =
          await this.islandRenderer.renderIslandForAtlas(island);
        let bounds = container.getLocalBounds();
        let scale = 1;

        // Check if island is too large for atlas (with padding)
        const maxSize = this.atlasSize - this.PADDING * 4;
        if (bounds.width > maxSize || bounds.height > maxSize) {
          // Scale down to fit
          scale = Math.min(maxSize / bounds.width, maxSize / bounds.height);
          container.scale.set(scale);
          bounds = container.getLocalBounds(); // Recalculate bounds after scaling
          console.log(
            `[IslandAtlasManager] Scaling ${island.slug} by ${scale} to fit in atlas`,
          );
        }

        islandContainers.set(island.slug, { container, bounds, scale });
      } catch (error) {
        console.error(
          `[IslandAtlasManager] Failed to render island ${island.slug}:`,
          error,
        );
      }
    }

    // Sort islands by area (largest first) for better packing
    const sortedIslands = Array.from(islandContainers.entries()).sort(
      (a, b) => {
        const areaA = a[1].bounds.width * a[1].bounds.height;
        const areaB = b[1].bounds.width * b[1].bounds.height;
        return areaB - areaA;
      },
    );

    // Pack islands using shelf algorithm
    const packItems: PackItem[] = sortedIslands.map(([slug, data]) => ({
      id: slug,
      width: Math.ceil(data.bounds.width) + this.PADDING * 2,
      height: Math.ceil(data.bounds.height) + this.PADDING * 2,
    }));

    // Pack islands into multiple atlases if needed
    const packedAtlases = this.packIntoMultipleAtlases(packItems);

    // Render each atlas
    for (let atlasIndex = 0; atlasIndex < packedAtlases.length; atlasIndex++) {
      const atlasItems = packedAtlases[atlasIndex];

      // Create render texture for this atlas
      const atlas = RenderTexture.create({
        width: this.atlasSize,
        height: this.atlasSize,
      });
      this.atlases.push(atlas);

      // Container for this atlas
      const container = new Container();

      // Position each island in this atlas
      for (const item of atlasItems) {
        const data = islandContainers.get(item.id);
        if (!data) continue;

        const { container: islandContainer, bounds } = data;

        // Offset to properly position the island in its allocated space
        // We need to translate from local bounds to atlas position
        const offsetX = -bounds.x + this.PADDING;
        const offsetY = -bounds.y + this.PADDING;

        islandContainer.x = (item.x || 0) + offsetX;
        islandContainer.y = (item.y || 0) + offsetY;

        container.addChild(islandContainer);

        // Store location for sprite creation
        const containerData = islandContainers.get(item.id);
        const appliedScale = containerData?.scale || 1;
        this.islandLocations.set(item.id, {
          atlasIndex,
          x: (item.x || 0) + this.PADDING,
          y: (item.y || 0) + this.PADDING,
          width: Math.ceil(bounds.width * appliedScale),
          height: Math.ceil(bounds.height * appliedScale),
          scale: appliedScale,
        });
      }

      // Render container to atlas
      this.renderer.render({ container, target: atlas });

      // Clean up atlas container
      container.destroy({ children: true });
    }

    // Destroy all island containers to free GPU memory
    // These containers have Graphics objects with massive GPU buffers
    console.log("[IslandAtlasManager] Cleaning up island containers...");
    islandContainers.forEach((data) => {
      if (data.container) {
        // Destroy the container and all its children (including Graphics)
        data.container.destroy({
          children: true,
          texture: true,
        });
      }
    });
    islandContainers.clear();

    // Force GPU garbage collection to free memory immediately
    if (this.renderer.textureGC) {
      this.renderer.textureGC.run();
    }

    console.log(
      `[IslandAtlasManager] Generated ${this.atlases.length} atlases with ${this.islandLocations.size} islands`,
    );
  }

  /**
   * Pack items into multiple atlases
   */
  private packIntoMultipleAtlases(items: PackItem[]): PackItem[][] {
    const atlases: PackItem[][] = [];
    let currentAtlas: PackItem[] = [];
    let currentShelfY = 0;
    let shelves: Shelf[] = [];

    // Sort by height (tallest first) for better shelf utilization
    items.sort((a, b) => b.height - a.height);

    for (const item of items) {
      let placed = false;

      // Try to fit in existing shelves in current atlas
      for (const shelf of shelves) {
        if (
          shelf.width + item.width <= this.atlasSize &&
          shelf.height >= item.height
        ) {
          // Item fits in this shelf
          item.x = shelf.width;
          item.y = shelf.y;
          shelf.width += item.width;
          shelf.items.push(item);
          currentAtlas.push(item);
          placed = true;
          break;
        }
      }

      // Try to create new shelf in current atlas
      if (!placed && currentShelfY + item.height <= this.atlasSize) {
        const newShelf: Shelf = {
          y: currentShelfY,
          height: item.height,
          width: item.width,
          items: [item],
        };

        item.x = 0;
        item.y = currentShelfY;

        shelves.push(newShelf);
        currentShelfY += item.height;
        currentAtlas.push(item);
        placed = true;
      }

      // Need a new atlas
      if (!placed) {
        // Save current atlas if it has items
        if (currentAtlas.length > 0) {
          atlases.push(currentAtlas);
        }

        // Start new atlas
        currentAtlas = [];
        shelves = [];
        currentShelfY = 0;

        // Add item to new atlas
        const newShelf: Shelf = {
          y: 0,
          height: item.height,
          width: item.width,
          items: [item],
        };

        item.x = 0;
        item.y = 0;

        shelves.push(newShelf);
        currentShelfY = item.height;
        currentAtlas.push(item);
      }
    }

    // Add last atlas if it has items
    if (currentAtlas.length > 0) {
      atlases.push(currentAtlas);
    }

    return atlases;
  }

  /**
   * Get an atlas texture by index
   */
  getAtlas(index: number): RenderTexture | null {
    return this.atlases[index] || null;
  }

  /**
   * Get all atlases
   */
  getAllAtlases(): RenderTexture[] {
    return this.atlases;
  }

  /**
   * Get the atlas size being used
   */
  getAtlasSize(): number {
    return this.atlasSize;
  }

  /**
   * Get the location of an island in the atlas
   */
  getLocation(slug: string): AtlasLocation | undefined {
    return this.islandLocations.get(slug);
  }

  /**
   * Create a sprite for an island from the atlas
   */
  createIslandSprite(island: Island): Sprite | null {
    const location = this.islandLocations.get(island.slug);
    if (!location) {
      console.warn(
        `[IslandAtlasManager] No atlas location found for ${island.slug}`,
      );
      return null;
    }

    const atlas = this.atlases[location.atlasIndex];
    if (!atlas) {
      console.warn(
        `[IslandAtlasManager] No atlas at index ${location.atlasIndex}`,
      );
      return null;
    }

    // Create texture from atlas region
    // RenderTexture in PixiJS v8 has a different structure
    const texture = new Texture({
      source: atlas.source,
      frame: new Rectangle(
        location.x,
        location.y,
        location.width,
        location.height,
      ),
    });

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);

    // Apply inverse scale to restore original size
    if (location.scale < 1) {
      sprite.scale.set(1 / location.scale);
    }

    return sprite;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    for (const atlas of this.atlases) {
      atlas.destroy(true);
    }
    this.atlases = [];
    this.islandLocations.clear();
  }
}
