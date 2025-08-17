const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.buildscape.org";

export interface ChainOverview {
  chain_id: number;
  name: string;
  status: string;
  tps: number;
  tvl: number;
  transactions: number;
  active_addresses: number;
  contracts: number;
  block_time?: number;
}

export interface OverviewData {
  total_tps: number;
  total_transactions: number;
  total_active_addresses: number;
  active_chains: number;
  total_tvl: number;
  chains: ChainOverview[];
}

export async function fetchOverviewData(period: "1h" | "24h" | "7d" | "30d" = "24h"): Promise<OverviewData> {
  const response = await fetch(`${API_BASE_URL}/overview?period=${period}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch overview data: ${response.statusText}`);
  }
  
  return response.json();
}