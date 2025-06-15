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

// Polling intervals for different chains (in milliseconds)
const POLLING_INTERVALS: { [chainId: string]: number } = {
  'ethereum': 15000,
  'polygon': 10000,
  'arbitrum': 5000,
  'optimism': 5000,
  'base': 5000,
  'avalanche': 10000,
  'bsc': 10000,
  // Add more chains as needed
};

// Active polling timers
const pollingTimers: { [chainId: string]: ReturnType<typeof setInterval> } = {};

// Transform polling data format (already in correct format)
function transformPollingData(data: any): ChainData {
  return {
    ...data,
    lastUpdated: Date.now()
  };
}

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
            tvl: chainData.tvl,
            tvl_usd: chainData.tvl || undefined, // For compatibility
            
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
          
          // If we receive SSE data, stop polling for this chain
          if (pollingTimers[chainId]) {
            clearInterval(pollingTimers[chainId]);
            delete pollingTimers[chainId];
          }
        }
      });
      
      return updatedStore;
    });
  }
});

// Polling fallback for a specific chain
async function pollChainData(chainId: string) {
  try {
    // Fetch status from the API
    const response = await fetch(`https://api.buildscape.org/chains/${chainId}/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.status}`);
    }
    
    const data = await response.json();
    
    chainDataStore.update(store => ({
      ...store,
      [chainId]: {
        // Map the API response to our expected format
        status: data.status,
        current_block: data.current_block,
        gas_price_gwei: data.gas_price_gwei,
        block_size_mb: data.block_size_mb,
        utilization_pct: data.utilization_pct,
        tvl: data.tvl,
        tvl_usd: data.tvl,
        
        // Fields not provided by status endpoint
        target_block: 0,
        sync_progress: 100,
        tps: 0,
        avg_block_time: 0,
        active_validators: 0,
        transactions_24h: 0,
        unique_addresses_24h: 0,
        volume_24h_usd: 0,
        market_cap_usd: 0,
        
        // Metadata
        timestamp: new Date().toISOString(),
        lastUpdated: Date.now(),
        lastError: null,
        errorCount: 0
      }
    }));
  } catch (error) {
    if (DEBUG) console.error(`Failed to poll data for ${chainId}:`, error);
  }
}

// Start polling for a specific chain
function startPolling(chainId: string) {
  // Don't start polling if we already have a timer
  if (pollingTimers[chainId]) return;
  
  // Initial poll
  pollChainData(chainId);
  
  // Set up interval
  const interval = POLLING_INTERVALS[chainId] || 30000; // Default 30s
  pollingTimers[chainId] = setInterval(() => {
    pollChainData(chainId);
  }, interval);
}

// Initialize data feed for a chain
export function initializeChainDataFeed(chainId: string) {
  // Check SSE connection status first
  const connectionStatus = get(sseConnection);
  
  if (connectionStatus === 'connected') {
    // Wait for first SSE update with timeout
    let timeout: ReturnType<typeof setTimeout>;
    let unsubscribe: (() => void) | null = null;
    
    timeout = setTimeout(() => {
      const currentData = get(chainDataStore)[chainId];
      if (!currentData) {
        if (DEBUG) console.log(`No SSE data for chain ${chainId}, starting polling fallback`);
        startPolling(chainId);
      }
      // Clean up subscription if timeout fires
      if (unsubscribe) {
        unsubscribe();
      }
    }, 5000);
    
    // Cancel timeout if data arrives
    unsubscribe = chainDataStore.subscribe(store => {
      if (store[chainId]) {
        clearTimeout(timeout);
        if (unsubscribe) {
          unsubscribe();
        }
      }
    });
  } else {
    // Start polling immediately if SSE is not connected
    if (DEBUG) console.log(`SSE not connected, starting polling for chain ${chainId}`);
    startPolling(chainId);
  }
}

// Get chain data for a specific chain
export function getChainData(chainId: string) {
  return derived(chainDataStore, $store => $store[chainId] || null);
}

// Get all chain data
export function getAllChainData() {
  return chainDataStore;
}

// Clean up function to stop all polling
export function stopAllPolling() {
  Object.values(pollingTimers).forEach(timer => clearInterval(timer));
  Object.keys(pollingTimers).forEach(key => delete pollingTimers[key]);
}

// Clean up polling for a specific chain
export function cleanupChainDataFeed(chainId: string) {
  if (pollingTimers[chainId]) {
    clearInterval(pollingTimers[chainId]);
    delete pollingTimers[chainId];
  }
}

