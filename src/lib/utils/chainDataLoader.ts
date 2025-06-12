// Configuration for API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

interface ChainMetricsResponse {
  period: string;
  tps: number;
  transactions: number;
  active_addresses: number;
  contracts: number;
  gas_price: number;
  block_size: number;
  utilization: number;
  last_block: number;
}

interface ChainStatusResponse {
  chain_id: number;
  name: string;
  status: string;
  current_block: number;
  target_block: number;
  sync_progress: number;
  last_error: string | null;
  last_error_at: string | null;
  retry_in_seconds: number | null;
  gas_price_gwei: number;
  block_size_mb: number;
  utilization_pct: number;
}

export function getDynamicDataFactory(chainId: number) {
  return async function getDynamicData(span: "1h" | "24h" | "7d" | "30d") {
    try {
      // Fetch metrics from the API
      const response = await fetch(
        `${API_BASE_URL}/api/chains/${chainId}/metrics?period=${span}`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ChainMetricsResponse = await response.json();

      // Transform API response to match UI expectations
      return {
        lastBlock: data.last_block,
        lastGas: Math.round(data.gas_price), // Convert to gwei
        lastBlockSize: Number(data.block_size.toFixed(2)),
        utilization: `${Math.round(data.utilization)}%`,
        metrics: {
          txPerSecond: Number(data.tps.toFixed(2)),
          numTransactions: data.transactions,
          activeUsers: data.active_addresses,
          contractsDeployed: data.contracts,
        },
      };
    } catch (error) {
      console.error("Failed to fetch chain metrics:", error);

      // Return null to show "No live metrics available" in UI
      return null;
    }
  };
}

export async function getChainStatus(chainId: number): Promise<ChainStatusResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chains/${chainId}/status`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: ChainStatusResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch chain status:", error);
    return null;
  }
}
