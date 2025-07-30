import type ViewportManager from "./ViewportManager";
import type CanvasRenderer from "./CanvasRenderer";

interface Island {
  chainId: number;
  name: string;
  slug: string;
  x: number;
  y: number;
  scale: number;
  tps: number;
  brandColor: string;
  logoUrl?: string;
}

export default class InteractionManager {
  private container: HTMLElement;
  private viewportManager: ViewportManager;
  private renderer: CanvasRenderer;
  private onPanningChange?: (isPanning: boolean) => void;
  private onIslandClick?: (island: Island) => void;

  // Islands data for click detection
  private islands: Island[] = [];

  // Hover state
  private hoveredIsland: Island | null = null;
  private onHoverChange?: (island: Island | null) => void;

  // Pan state
  private isPanning: boolean = false;
  private panStartPoint = { x: 0, y: 0 };
  private panStartViewport = { x: 0, y: 0 };

  // Click detection
  private potentialClick: boolean = false;
  private clickThreshold: number = 5; // pixels of movement before we consider it a drag

  // Touch tracking for pinch zoom
  private isPinching: boolean = false;
  private pinchStartDistance: number = 0;
  private pinchStartScale: number = 1;

  // Event handlers (stored for cleanup)
  private boundHandlers: { [key: string]: any } = {};

  // Bounding box dimensions for click detection - based on tile grid
  private readonly TILE_WIDTH = 72;
  private readonly TILE_HEIGHT = 36;

  // Edit mode
  private editMode: boolean = false;
  private isDraggingIsland: boolean = false;
  private draggedIsland: Island | null = null;
  private dragOffset = { x: 0, y: 0 };
  private onIslandMove?: (slug: string, x: number, y: number) => void;
  private onDraggingChange?: (isDragging: boolean) => void;

  constructor(
    container: HTMLElement,
    viewportManager: ViewportManager,
    renderer: CanvasRenderer,
    onPanningChange?: (isPanning: boolean) => void,
    onIslandClick?: (island: Island) => void,
    onHoverChange?: (island: Island | null) => void,
  ) {
    this.container = container;
    this.viewportManager = viewportManager;
    this.renderer = renderer;
    this.onPanningChange = onPanningChange;
    this.onIslandClick = onIslandClick;
    this.onHoverChange = onHoverChange;

    // Bind event handlers
    this.bindEventHandlers();
  }

  private bindEventHandlers(): void {
    // Pointer events for mouse and touch
    this.boundHandlers.pointerdown = this.handlePointerDown.bind(this);
    this.boundHandlers.pointermove = this.handlePointerMove.bind(this);
    this.boundHandlers.pointerup = this.handlePointerUp.bind(this);
    this.boundHandlers.pointercancel = this.handlePointerUp.bind(this);

    // Wheel event for zoom
    this.boundHandlers.wheel = this.handleWheel.bind(this);

    // Touch events for pinch zoom
    this.boundHandlers.touchstart = this.handleTouchStart.bind(this);
    this.boundHandlers.touchmove = this.handleTouchMove.bind(this);
    this.boundHandlers.touchend = this.handleTouchEnd.bind(this);

    // Add event listeners
    this.container.addEventListener(
      "pointerdown",
      this.boundHandlers.pointerdown,
    );
    this.container.addEventListener(
      "pointermove",
      this.boundHandlers.pointermove,
    );
    this.container.addEventListener("pointerup", this.boundHandlers.pointerup);
    this.container.addEventListener(
      "pointercancel",
      this.boundHandlers.pointercancel,
    );
    this.container.addEventListener("wheel", this.boundHandlers.wheel, {
      passive: false,
    });
    this.container.addEventListener(
      "touchstart",
      this.boundHandlers.touchstart,
    );
    this.container.addEventListener("touchmove", this.boundHandlers.touchmove);
    this.container.addEventListener("touchend", this.boundHandlers.touchend);
  }

  private handlePointerDown(event: PointerEvent): void {
    if (event.button !== 0) return; // Only handle left mouse button

    // Check if we're clicking on an island in edit mode
    if (this.editMode) {
      const worldPos = this.viewportManager.screenToWorld(
        event.clientX,
        event.clientY,
      );
      const island = this.getIslandAtPosition(worldPos.x, worldPos.y);
      
      if (island) {
        // Start dragging island
        this.isDraggingIsland = true;
        this.draggedIsland = island;
        this.dragOffset = {
          x: worldPos.x - island.x,
          y: worldPos.y - island.y,
        };
        this.onDraggingChange?.(true);
        this.container.style.cursor = "move";
        this.container.setPointerCapture(event.pointerId);
        event.preventDefault();
        return;
      }
    }

    // Don't start panning immediately - wait for movement (click detection)
    this.potentialClick = true;
    this.panStartPoint = {
      x: event.clientX,
      y: event.clientY,
    };

    const center = this.viewportManager.getCenter();
    this.panStartViewport = {
      x: center.x,
      y: center.y,
    };
  }

  private handlePointerMove(event: PointerEvent): void {
    // Handle island dragging
    if (this.isDraggingIsland && this.draggedIsland) {
      const worldPos = this.viewportManager.screenToWorld(
        event.clientX,
        event.clientY,
      );

      // Calculate new position
      const newX = worldPos.x - this.dragOffset.x;
      const newY = worldPos.y - this.dragOffset.y;

      // Update island position
      this.draggedIsland.x = newX;
      this.draggedIsland.y = newY;

      // Notify about position change
      this.onIslandMove?.(this.draggedIsland.slug, newX, newY);

      // Notify renderer to update
      this.renderer.onViewportChange();
      return;
    }

    // Check if we should start panning
    if (this.potentialClick && !this.isPanning) {
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - this.panStartPoint.x, 2) +
          Math.pow(event.clientY - this.panStartPoint.y, 2),
      );

      if (moveDistance > this.clickThreshold) {
        // Start panning
        this.potentialClick = false;
        this.isPanning = true;
        this.onPanningChange?.(true);
        this.container.style.cursor = "grabbing";
        this.container.setPointerCapture(event.pointerId);
        event.preventDefault();
      } else {
        return; // Don't pan yet
      }
    }

    if (!this.isPanning && !this.isPinching) {
      // Check for hover when not panning or pinching
      const worldPos = this.viewportManager.screenToWorld(
        event.clientX,
        event.clientY,
      );
      const island = this.getIslandAtPosition(worldPos.x, worldPos.y);

      if (island !== this.hoveredIsland) {
        this.hoveredIsland = island;
        this.onHoverChange?.(island);
        // In edit mode, show move cursor when hovering over islands
        if (this.editMode && island) {
          this.container.style.cursor = "move";
        } else {
          this.container.style.cursor = island ? "pointer" : "grab";
        }
      }
      return;
    }

    if (!this.isPanning) return;

    // Calculate pan delta
    const dx = event.clientX - this.panStartPoint.x;
    const dy = event.clientY - this.panStartPoint.y;

    // Pan the viewport (direct tracking, no momentum)
    // Negative because dragging right should move the world left
    this.viewportManager.pan(-dx, -dy);

    // Update start point for next frame
    this.panStartPoint = {
      x: event.clientX,
      y: event.clientY,
    };

    // Notify renderer about viewport change
    this.renderer.onViewportChange();
  }

  private handlePointerUp(event: PointerEvent): void {
    // Handle island dragging end
    if (this.isDraggingIsland) {
      this.isDraggingIsland = false;
      this.draggedIsland = null;
      this.onDraggingChange?.(false);
      this.container.style.cursor = "grab";
      this.container.releasePointerCapture(event.pointerId);
      return;
    }

    if (this.potentialClick && !this.isPanning) {
      // This was a click, not a drag
      const worldPos = this.viewportManager.screenToWorld(
        event.clientX,
        event.clientY,
      );

      // Find which island was clicked
      const clickedIsland = this.getIslandAtPosition(worldPos.x, worldPos.y);

      if (clickedIsland) {
        this.onIslandClick?.(clickedIsland);
      }
    }

    // Reset states
    this.potentialClick = false;

    if (this.isPanning) {
      this.isPanning = false;
      this.onPanningChange?.(false);
      this.container.style.cursor = "grab";
      this.container.releasePointerCapture(event.pointerId);
    }
  }

  private handleWheel(event: WheelEvent): void {
    event.preventDefault();

    // Detect pinch on trackpad (ctrlKey is true for pinch gestures)
    const isPinchGesture = event.ctrlKey;

    // Calculate zoom delta
    let delta;
    if (isPinchGesture) {
      // Pinch gesture on trackpad
      delta = -event.deltaY * 2;
    } else {
      // Regular mouse wheel
      delta = -event.deltaY;
    }

    // Zoom with mouse position as focal point
    this.viewportManager.zoom(delta, event.clientX, event.clientY);

    // Notify renderer about viewport change
    this.renderer.onViewportChange();
  }

  // Touch event handlers for pinch zoom
  private handleTouchStart(event: TouchEvent): void {
    // Check for pinch gesture (two fingers) - but not in edit mode
    if (event.touches.length === 2 && !this.editMode) {
      this.isPinching = true;
      this.pinchStartDistance = this.getTouchDistance(event.touches);
      this.pinchStartScale = this.viewportManager.getScale();

      // Prevent panning while pinching
      this.isPanning = false;
      this.potentialClick = false;

      event.preventDefault();
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    if (this.isPinching && event.touches.length === 2) {
      event.preventDefault();

      const currentDistance = this.getTouchDistance(event.touches);
      const currentCenter = this.getTouchCenter(event.touches);

      // Calculate new scale based on pinch distance
      const distanceRatio = currentDistance / this.pinchStartDistance;
      const newScale = this.pinchStartScale * distanceRatio;

      // Apply pinch zoom
      this.viewportManager.pinchZoom(
        newScale,
        currentCenter.x,
        currentCenter.y,
      );

      // Notify renderer about viewport change
      this.renderer.onViewportChange();
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    // Stop pinching if less than 2 touches
    if (event.touches.length < 2) {
      this.isPinching = false;
    }
  }

  // Helper functions for touch calculations
  private getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touches: TouchList): { x: number; y: number } {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }

  // Check which island is at the given world position
  private getIslandAtPosition(worldX: number, worldY: number): Island | null {
    // Check islands in reverse order (front to back) for proper hit detection
    for (let i = this.islands.length - 1; i >= 0; i--) {
      const island = this.islands[i];

      // Calculate tile grid size based on island scale - must match IslandRenderer
      const baseSize = 14;
      const scaleFactor = 0.6 + island.scale * 0.4;
      const gridSize = Math.max(10, Math.min(18, Math.floor(baseSize * scaleFactor)));
      
      // Calculate bounding box for tile-based islands
      // For isometric tiles, the bounding box is a diamond shape
      // but we'll use a rectangular approximation for simplicity
      const tileGridWidth = gridSize * this.TILE_WIDTH / 2;
      const tileGridHeight = gridSize * this.TILE_HEIGHT;
      
      // The bounding box for isometric tiles
      const halfWidth = tileGridWidth;
      const halfHeight = tileGridHeight / 2;

      const left = island.x - halfWidth;
      const right = island.x + halfWidth;
      const top = island.y - halfHeight;
      const bottom = island.y + halfHeight;

      // Check if click is within bounding box
      if (
        worldX >= left &&
        worldX <= right &&
        worldY >= top &&
        worldY <= bottom
      ) {
        return island;
      }
    }

    return null;
  }

  // Set islands data for click detection
  setIslands(islands: Island[]): void {
    // Sort islands by Y position for proper layering (back to front)
    this.islands = [...islands].sort((a, b) => a.y - b.y);
  }

  // Set edit mode
  setEditMode(enabled: boolean): void {
    this.editMode = enabled;
    // Update cursor
    if (!enabled) {
      this.container.style.cursor = "grab";
      // Reset drag state
      this.isDraggingIsland = false;
      this.draggedIsland = null;
    }
  }

  // Enable/disable all interactions
  setEnabled(enabled: boolean): void {
    if (enabled) {
      // Re-enable interactions
      this.container.style.pointerEvents = "auto";
      this.container.style.cursor = "grab";
    } else {
      // Disable interactions
      this.container.style.pointerEvents = "none";
      this.container.style.cursor = "default";
      // Reset any ongoing interactions
      this.isPanning = false;
      this.isPinching = false;
      this.potentialClick = false;
      this.isDraggingIsland = false;
      this.draggedIsland = null;
      this.hoveredIsland = null;
      this.onPanningChange?.(false);
      this.onDraggingChange?.(false);
      this.onHoverChange?.(null);
    }
  }

  // Set island move callback
  setOnIslandMove(callback: (slug: string, x: number, y: number) => void): void {
    this.onIslandMove = callback;
  }

  // Set dragging change callback
  setOnDraggingChange(callback: (isDragging: boolean) => void): void {
    this.onDraggingChange = callback;
  }

  // Cleanup
  destroy(): void {
    // Remove all event listeners
    this.container.removeEventListener(
      "pointerdown",
      this.boundHandlers.pointerdown,
    );
    this.container.removeEventListener(
      "pointermove",
      this.boundHandlers.pointermove,
    );
    this.container.removeEventListener(
      "pointerup",
      this.boundHandlers.pointerup,
    );
    this.container.removeEventListener(
      "pointercancel",
      this.boundHandlers.pointercancel,
    );
    this.container.removeEventListener("wheel", this.boundHandlers.wheel);
    this.container.removeEventListener(
      "touchstart",
      this.boundHandlers.touchstart,
    );
    this.container.removeEventListener(
      "touchmove",
      this.boundHandlers.touchmove,
    );
    this.container.removeEventListener("touchend", this.boundHandlers.touchend);
  }
}
