import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { z } from 'zod';

// Debug flag - only log in development
const DEBUG = import.meta.env.DEV;

// Types
export interface ChainData {
  chainId: number;
  name: string;
  status: 'starting' | 'syncing' | 'live' | 'paused' | 'error' | 'stopped' | 'never_started';
  currentBlock: number;
  targetBlock: number;
  syncProgress: number;
  tps: number;
  gasPrice: number;
  utilization: number;
  blockSize: number;
  tvl: number | null;
  lastError: string | null;
  errorCount: number;
}

export interface SSEUpdate {
  timestamp: number;
  mode: 'live' | 'api_only';
  chains: ChainData[];
}

// Connection states
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Zod schemas for runtime validation
const ChainDataSchema = z.object({
  chainId: z.number(),
  name: z.string(),
  status: z.enum(['starting', 'syncing', 'live', 'paused', 'error', 'stopped', 'never_started']),
  currentBlock: z.number(),
  targetBlock: z.number(),
  syncProgress: z.number(),
  tps: z.number(),
  gasPrice: z.number(),
  utilization: z.number(),
  blockSize: z.number(),
  tvl: z.number().nullable(),
  lastError: z.string().nullable(),
  errorCount: z.number()
});

const SSEUpdateSchema = z.object({
  timestamp: z.number(),
  mode: z.enum(['live', 'api_only']),
  chains: z.array(ChainDataSchema)
});

// For backward compatibility with direct array format
const ChainDataArraySchema = z.array(ChainDataSchema);

// Stores
export const sseConnection: Writable<ConnectionStatus> = writable('disconnected');
export const chainsData: Writable<ChainData[]> = writable([]);
export const lastUpdate: Writable<number | null> = writable(null);
export const dataMode: Writable<'live' | 'api_only' | null> = writable(null);

// SSE connection management
let eventSource: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 1000; // Start with 1 second
let connectionTimeout: ReturnType<typeof setTimeout> | null = null;

export function connectSSE(url: string = 'https://api.buildscape.org/events') {
  // Prevent multiple simultaneous connections
  if (get(sseConnection) === 'connecting') {
    if (DEBUG) console.warn('SSE connection already in progress');
    return;
  }
  
  // Clean up existing connection
  disconnectSSE();
  
  sseConnection.set('connecting');
  
  try {
    // Test URL validity first
    const testUrl = new URL(url);
    
    eventSource = new EventSource(url);
    
    // Add timeout for initial connection
    connectionTimeout = setTimeout(() => {
      if (get(sseConnection) === 'connecting') {
        if (DEBUG) console.error('SSE connection timeout');
        disconnectSSE();
        scheduleReconnect();
      }
    }, 5000);
    
    eventSource.onopen = () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
      if (DEBUG) console.log('SSE connected');
      sseConnection.set('connected');
      reconnectDelay = 1000; // Reset delay on successful connection
    };
    
    eventSource.addEventListener('update', (event) => {
      try {
        const rawData = JSON.parse(event.data);
        
        // Try to parse as full SSE update format first
        const sseUpdateResult = SSEUpdateSchema.safeParse(rawData);
        if (sseUpdateResult.success) {
          const data = sseUpdateResult.data;
          chainsData.set(data.chains);
          lastUpdate.set(data.timestamp);
          dataMode.set(data.mode);
          return;
        }
        
        // Try to parse as direct array format for backward compatibility
        const arrayResult = ChainDataArraySchema.safeParse(rawData);
        if (arrayResult.success) {
          chainsData.set(arrayResult.data);
          lastUpdate.set(Date.now());
          dataMode.set('live');
          return;
        }
        
        // If neither format is valid, log the validation error
        if (DEBUG) {
          console.error('Invalid SSE data format:', sseUpdateResult.error || arrayResult.error);
          console.error('Raw data received:', rawData);
        }
      } catch (error) {
        if (DEBUG) console.error('Failed to parse SSE data:', error);
      }
    });
    
    eventSource.onerror = (error) => {
      if (DEBUG) console.error('SSE error:', error);
      sseConnection.set('error');
      
      // Exponential backoff reconnection
      scheduleReconnect();
    };
    
  } catch (error) {
    if (DEBUG) console.error('Failed to create EventSource:', error);
    sseConnection.set('error');
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  
  reconnectTimer = setTimeout(() => {
    if (DEBUG) console.log(`Reconnecting SSE in ${reconnectDelay}ms...`);
    connectSSE();
    // Exponential backoff with max 30 seconds
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  }, reconnectDelay);
}

export function disconnectSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  
  sseConnection.set('disconnected');
}