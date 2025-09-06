const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.buildscape.org";

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
  // New fields from enhanced API
  gas_price: number;
  block_size: number;
  utilization: number;
  last_block: number;
  sync_progress: number;
  data_complete: boolean;
  data_start: string;
  data_end: string;
  tvl_change_24h?: number | null;
  tvl_change_7d?: number | null;
  tvl_change_30d?: number | null;
  native_token_symbol: string;
  native_token_price_usd: number;
  native_token_price_updated_at: string;
  created_at?: string;
}

export interface OverviewData {
  period_hours: number; // Period that was requested (1, 24, 168, 720)
  total_tps: number;
  total_transactions: number;
  total_active_addresses: number;
  active_chains: number;
  total_tvl: number;
  chains: ChainOverview[];
}

export async function fetchOverviewData(
  period: "1h" | "24h" | "7d" | "30d" = "24h",
): Promise<OverviewData> {
  const response = await fetch(`${API_BASE_URL}/overview?period=${period}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch overview data: ${response.statusText}`);
  }

  return response.json();
}
