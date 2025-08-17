import { writable, get, derived } from 'svelte/store';
import { chainsData, sseConnection } from './sse';

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
  
  // Financial metrics
  tvl?: number;
  tvl_usd?: number;
  
  // Legacy/compatibility fields
  avg_block_time?: number;
  active_validators?: number;
  transactions_24h?: number;
  unique_addresses_24h?: number;
  volume_24h_usd?: number;
  market_cap_usd?: number;
  
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

// Note: Polling removed - we now use overview API + SSE for all data


// Subscribe to SSE updates
chainsData.subscribe((chains) => {
  if (chains && Array.isArray(chains)) {
    chainDataStore.update(store => {
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
            
            // Financial metrics
            tvl: chainData.tvl === null ? undefined : chainData.tvl,
            tvl_usd: chainData.tvl === null ? undefined : chainData.tvl, // For compatibility
            
            // Legacy/compatibility fields
            avg_block_time: 0, // Not provided by SSE
            active_validators: 0, // Not provided by SSE
            transactions_24h: Math.round(chainData.tps * 86400), // Convert TPS to 24h transactions
            unique_addresses_24h: 0, // Not provided by SSE
            volume_24h_usd: 0, // Not provided by SSE
            market_cap_usd: 0, // Not provided by SSE
            
            // Metadata
            timestamp: new Date().toISOString(),
            lastUpdated: Date.now(),
            lastError: chainData.lastError,
            errorCount: chainData.errorCount
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
  if (DEBUG) console.log(`Initialized data feed for chain ${chainId} (SSE-based)`);
}

// Get chain data for a specific chain
export function getChainData(chainId: string) {
  return derived(chainDataStore, $store => $store[chainId] || null);
}

// Get all chain data
export function getAllChainData() {
  return chainDataStore;
}

// Clean up function - no longer needed but kept for compatibility
export function stopAllPolling() {
  // No polling to stop
}

// Clean up for a specific chain - no longer needed but kept for compatibility
export function cleanupChainDataFeed(chainId: string) {
  // No polling to clean up
}

