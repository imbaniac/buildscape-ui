import { writable } from "svelte/store";
import type { Application } from "pixi.js";
import type { Viewport } from "pixi-viewport";
import type PixiMapRenderer from "$lib/pixi/PixiMapRenderer";
import type RenderManager from "$lib/pixi/RenderManager";

interface MapState {
  app: Application | null;
  viewport: Viewport | null;
  mapRenderer: PixiMapRenderer | null;
  renderManager: RenderManager | null;
  isReady: boolean;
  islandPositions: Record<string, { x: number; y: number }>;
}

function createMapStore() {
  const { subscribe, set, update } = writable<MapState>({
    app: null,
    viewport: null,
    mapRenderer: null,
    renderManager: null,
    isReady: false,
    islandPositions: {},
  });

  return {
    subscribe,
    setApp: (app: Application) => update((state) => ({ ...state, app })),
    setViewport: (viewport: Viewport) =>
      update((state) => ({ ...state, viewport })),
    setMapRenderer: (mapRenderer: PixiMapRenderer) =>
      update((state) => ({ ...state, mapRenderer })),
    setRenderManager: (renderManager: RenderManager) =>
      update((state) => ({ ...state, renderManager })),
    setReady: (isReady: boolean) => update((state) => ({ ...state, isReady })),
    setIslandPositions: (
      islandPositions: Record<string, { x: number; y: number }>,
    ) => update((state) => ({ ...state, islandPositions })),
    reset: () =>
      set({
        app: null,
        viewport: null,
        mapRenderer: null,
        renderManager: null,
        isReady: false,
        islandPositions: {},
      }),
  };
}

export const mapStore = createMapStore();
