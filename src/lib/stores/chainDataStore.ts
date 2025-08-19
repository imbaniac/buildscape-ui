import { derived, writable } from "svelte/store";

import { chainsData } from "./sse";

// Debug flag - only log in development
const DEBUG = import.meta.env.DEV;

interface ChainData {
  // Status fields
  status?: string;

  // Block fields
  current_block?: number;
  target_block?: number;
  sync_progress?: number;

  // Gas and performance
  gas_price_gwei?: number;
  utilization_pct?: number;
  block_size_mb?: number;
  tps?: number;

  // Metadata
  timestamp?: string;
  lastUpdated: number;
  lastError?: string | null;
  errorCount?: number;
}

interface ChainDataStore {
  [chainId: string]: ChainData;
}

// Store for chain data
const chainDataStore = writable<ChainDataStore>({});

// Subscribe to SSE updates
chainsData.subscribe((chains) => {
  if (chains && Array.isArray(chains)) {
    chainDataStore.update((store) => {
      const updatedStore = { ...store };

      // Process each chain's data from SSE
      chains.forEach((chainData) => {
        if (chainData && chainData.chainId) {
          const chainId = chainData.chainId.toString();
          updatedStore[chainId] = {
            // Status fields
            status: chainData.status,

            // Block fields
            current_block: chainData.currentBlock,
            target_block: chainData.targetBlock,
            sync_progress: chainData.syncProgress,

            // Gas and performance
            gas_price_gwei: chainData.gasPrice,
            utilization_pct: chainData.utilization,
            block_size_mb: chainData.blockSize,
            tps: chainData.tps,

            // Metadata
            timestamp: new Date().toISOString(),
            lastUpdated: Date.now(),
            lastError: chainData.lastError,
            errorCount: chainData.errorCount,
          };
        }
      });

      return updatedStore;
    });
  }
});

// Initialize data feed for a chain
export function initializeChainDataFeed(chainId: string) {
  // SSE will automatically provide data for this chain
  // No polling needed - overview API provides fallback data
  if (DEBUG)
    console.log(`Initialized data feed for chain ${chainId} (SSE-based)`);
}

// Get chain data for a specific chain
export function getChainData(chainId: string) {
  return derived(chainDataStore, ($store) => $store[chainId] || null);
}

// Get all chain data
export function getAllChainData() {
  return chainDataStore;
}
