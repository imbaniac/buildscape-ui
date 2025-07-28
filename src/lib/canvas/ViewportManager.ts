export default class ViewportManager {
  // Screen dimensions
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  // Viewport state (in world/SVG coordinates)
  private centerX: number = 0;
  private centerY: number = 0;
  private scale: number = 0.1; // Default zoom level - much farther away to see more islands

  // Zoom constraints
  private readonly MIN_SCALE = 0.1;
  private readonly MAX_SCALE = 5;
  private readonly ZOOM_SPEED = 0.001;

  // SVG coordinate system bounds (matching original implementation)
  private readonly WORLD_WIDTH = 20000;
  private readonly WORLD_HEIGHT = 20000;

  constructor() {
    // Initialize centered on (0,0) where Ethereum is located
    this.centerX = 0;
    this.centerY = 0;
  }

  setScreenSize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  // Get the visible world bounds
  getViewBounds(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  } {
    const halfWidth = this.screenWidth / this.scale / 2;
    const halfHeight = this.screenHeight / this.scale / 2;

    return {
      left: this.centerX - halfWidth,
      top: this.centerY - halfHeight,
      right: this.centerX + halfWidth,
      bottom: this.centerY + halfHeight,
      width: this.screenWidth / this.scale,
      height: this.screenHeight / this.scale,
    };
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    const bounds = this.getViewBounds();
    return {
      x: bounds.left + (screenX / this.screenWidth) * bounds.width,
      y: bounds.top + (screenY / this.screenHeight) * bounds.height,
    };
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    const bounds = this.getViewBounds();
    return {
      x: ((worldX - bounds.left) / bounds.width) * this.screenWidth,
      y: ((worldY - bounds.top) / bounds.height) * this.screenHeight,
    };
  }

  // Pan the viewport
  pan(deltaX: number, deltaY: number): void {
    // Convert screen delta to world delta
    const worldDeltaX = deltaX / this.scale;
    const worldDeltaY = deltaY / this.scale;

    this.centerX += worldDeltaX;
    this.centerY += worldDeltaY;
  }

  // Zoom with a specific focal point (Google Maps style)
  zoom(delta: number, focalScreenX: number, focalScreenY: number): void {
    const oldScale = this.scale;

    // Calculate new scale
    const zoomFactor = 1 + delta * this.ZOOM_SPEED;
    const newScale = Math.max(
      this.MIN_SCALE,
      Math.min(this.MAX_SCALE, this.scale * zoomFactor),
    );

    if (newScale === oldScale) return;

    // Get focal point in world coordinates before zoom
    const focalWorld = this.screenToWorld(focalScreenX, focalScreenY);

    // Update scale
    this.scale = newScale;

    // Calculate new viewport dimensions
    const newViewportWidth = this.screenWidth / newScale;
    const newViewportHeight = this.screenHeight / newScale;

    // Calculate new center to keep focal point fixed
    // The focal point should be at the same relative position in the viewport
    const relativeX = focalScreenX / this.screenWidth;
    const relativeY = focalScreenY / this.screenHeight;

    this.centerX = focalWorld.x - (relativeX - 0.5) * newViewportWidth;
    this.centerY = focalWorld.y - (relativeY - 0.5) * newViewportHeight;
  }

  // Pinch zoom for mobile (centered on pinch midpoint)
  pinchZoom(
    newScale: number,
    centerScreenX: number,
    centerScreenY: number,
  ): void {
    const oldScale = this.scale;

    // Clamp scale
    newScale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));

    if (newScale === oldScale) return;

    // Get center point in world coordinates before zoom
    const centerWorld = this.screenToWorld(centerScreenX, centerScreenY);

    // Update scale
    this.scale = newScale;

    // Calculate new viewport dimensions
    const newViewportWidth = this.screenWidth / newScale;
    const newViewportHeight = this.screenHeight / newScale;

    // Calculate new center to keep pinch center fixed
    const relativeX = centerScreenX / this.screenWidth;
    const relativeY = centerScreenY / this.screenHeight;

    this.centerX = centerWorld.x - (relativeX - 0.5) * newViewportWidth;
    this.centerY = centerWorld.y - (relativeY - 0.5) * newViewportHeight;
  }

  // Navigate to a specific world position with optional zoom
  navigateTo(worldX: number, worldY: number, targetScale?: number): void {
    this.centerX = worldX;
    this.centerY = worldY;

    if (targetScale !== undefined) {
      this.scale = Math.max(
        this.MIN_SCALE,
        Math.min(this.MAX_SCALE, targetScale),
      );
    }
  }

  // Check if a point is within the viewport (with optional margin)
  isInViewport(worldX: number, worldY: number, margin: number = 200): boolean {
    const bounds = this.getViewBounds();
    const scaledMargin = margin / this.scale;

    return (
      worldX >= bounds.left - scaledMargin &&
      worldX <= bounds.right + scaledMargin &&
      worldY >= bounds.top - scaledMargin &&
      worldY <= bounds.bottom + scaledMargin
    );
  }

  // Check if a rectangle overlaps the viewport
  isRectInViewport(
    x: number,
    y: number,
    width: number,
    height: number,
    margin: number = 200,
  ): boolean {
    const bounds = this.getViewBounds();
    const scaledMargin = margin / this.scale;

    return !(
      x + width < bounds.left - scaledMargin ||
      x > bounds.right + scaledMargin ||
      y + height < bounds.top - scaledMargin ||
      y > bounds.bottom + scaledMargin
    );
  }

  // Getters
  getScale(): number {
    return this.scale;
  }

  getCenter(): { x: number; y: number } {
    return { x: this.centerX, y: this.centerY };
  }
}
