export interface Chain {
  slug: string;
  name: string;
  chainId: number;
  nativeCurrency?: string;
  type: string;
  tvl: number;
  tvlChange?: number | null;
  tps: number;
  transactions: number;
  activeAddresses: number;
  contracts: number;
  blockTime?: number;
  logoUrl?: string;
  color?: string;
  gasPrice?: number;
  status?: string;
  technology?: {
    type?: string; // "Optimistic Rollup", "ZK Rollup", "PoS", "PoW", etc.
    layer?: string; // "L1", "L2", "L3", "Sidechain", "Appchain"
    vm?: {
      type: string; // "EVM", "SVM", "MoveVM", etc.
      evmCompatible: boolean;
    };
    settlementLayer?: string; // "Ethereum", "Bitcoin", etc.
    stack?: string; // "OP Stack", "ZK Stack", "Cosmos SDK", etc.
    dataAvailability?: string; // "Avail", "EigenDA", etc.
    // Deprecated fields for backward compatibility
    isL2?: boolean;
    isEVM?: boolean;
  };
}

export type SortColumn =
  | "name"
  | "tvl"
  | "tps"
  | "transactions"
  | "activeAddresses"
  | "contracts"
  | "blockTime";

export type SortDirection = "asc" | "desc";

export type PeriodType = "1h" | "24h" | "7d" | "30d";
