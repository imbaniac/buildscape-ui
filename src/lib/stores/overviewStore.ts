import { writable, derived, type Readable } from "svelte/store";
import {
  fetchOverviewData,
  type OverviewData,
  type ChainOverview,
} from "$lib/api/overview";

interface OverviewStoreState {
  isLoading: boolean;
  data: OverviewData | null;
  error: Error | null;
}

function createOverviewStore() {
  const { subscribe, set, update } = writable<OverviewStoreState>({
    isLoading: true,
    data: null,
    error: null,
  });

  async function load() {
    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const data = await fetchOverviewData();
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

  return {
    subscribe,
    load,
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
  }
);
