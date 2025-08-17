import { writable, derived, type Readable } from "svelte/store";
import { fetchOverviewData, type OverviewData } from "$lib/api/overview";

interface OverviewStoreState {
  isLoading: boolean;
  data: OverviewData | null;
  error: Error | null;
}

function createOverviewStore() {
  const { subscribe, set, update } = writable<OverviewStoreState>({
    isLoading: false,
    data: null,
    error: null,
  });

  let currentState: OverviewStoreState = {
    isLoading: false,
    data: null,
    error: null,
  };

  // Subscribe to our own store to keep currentState in sync
  subscribe((state) => {
    currentState = state;
  });

  async function load(period: "1h" | "24h" | "7d" | "30d" = "24h") {
    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const data = await fetchOverviewData(period);
      set({ isLoading: false, data, error: null });
    } catch (error) {
      console.error("Error loading overview data:", error);
      set({
        isLoading: false,
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }

  function getState(): OverviewStoreState {
    return currentState;
  }

  function isLoaded(): boolean {
    return currentState.data !== null;
  }

  return {
    subscribe,
    load,
    getState,
    isLoaded,
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
