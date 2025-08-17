import { writable, derived, type Readable } from "svelte/store";
import { fetchOverviewData, type OverviewData } from "$lib/api/overview";

interface OverviewStoreState {
  isLoading: boolean;
  data: OverviewData | null;
  error: Error | null;
  lastLoadedAt: number | null;
  currentPeriod: string | null;
}

function createOverviewStore() {
  const { subscribe, set, update } = writable<OverviewStoreState>({
    isLoading: false,
    data: null,
    error: null,
    lastLoadedAt: null,
    currentPeriod: null,
  });

  let currentState: OverviewStoreState = {
    isLoading: false,
    data: null,
    error: null,
    lastLoadedAt: null,
    currentPeriod: null,
  };

  // Subscribe to our own store to keep currentState in sync
  subscribe((state) => {
    currentState = state;
  });

  async function load(period: "1h" | "24h" | "7d" | "30d" = "24h") {
    // Check if we need to load
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    // Skip if we have recent data for the same period
    if (
      currentState.data &&
      currentState.currentPeriod === period &&
      currentState.lastLoadedAt &&
      now - currentState.lastLoadedAt < fiveMinutes
    ) {
      return; // Data is fresh enough
    }

    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const data = await fetchOverviewData(period);
      set({
        isLoading: false,
        data,
        error: null,
        lastLoadedAt: now,
        currentPeriod: period,
      });
    } catch (error) {
      console.error("Error loading overview data:", error);
      set({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
        lastLoadedAt: null,
        currentPeriod: null,
      });
    }
  }

  function getState(): OverviewStoreState {
    return currentState;
  }

  function isLoaded(): boolean {
    return currentState.data !== null;
  }

  function getCurrentPeriod(): string | null {
    return currentState.currentPeriod;
  }

  return {
    subscribe,
    load,
    getState,
    isLoaded,
    getCurrentPeriod,
  };
}

export const overviewStore = createOverviewStore();

// Derived store for TVL lookup map by chain ID
export const tvlLookupByChainId: Readable<Map<number, number>> = derived(
  overviewStore,
  ($overviewStore) => {
    const lookup = new Map<number, number>();

    if (!$overviewStore.data?.chains) return lookup;

    // Create mappings by chain ID
    for (const chain of $overviewStore.data.chains) {
      lookup.set(chain.chain_id, chain.tvl);
    }

    return lookup;
  },
);

// Derived store for TPS lookup map by chain ID
export const tpsLookupByChainId: Readable<Map<number, number>> = derived(
  overviewStore,
  ($overviewStore) => {
    const lookup = new Map<number, number>();

    if (!$overviewStore.data?.chains) return lookup;

    // Create mappings by chain ID
    for (const chain of $overviewStore.data.chains) {
      lookup.set(chain.chain_id, chain.tps);
    }

    return lookup;
  },
);

// Helper to get a single chain by ID from overview data
export function getChainById(chainId: number) {
  return derived(overviewStore, ($overviewStore) => {
    if (!$overviewStore.data?.chains) return null;
    return (
      $overviewStore.data.chains.find((c) => c.chain_id === chainId) || null
    );
  });
}

// Helper to convert period_hours from API to period string
export function getPeriodFromHours(hours: number | undefined): string {
  switch (hours) {
    case 1:
      return "1h";
    case 24:
      return "24h";
    case 168:
      return "7d"; // 7 * 24
    case 720:
      return "30d"; // 30 * 24
    default:
      return "24h";
  }
}
