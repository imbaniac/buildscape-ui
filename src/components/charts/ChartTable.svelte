<script lang="ts">
  import { goto } from "$app/navigation";

  import { searchChains } from "$lib/utils/searchUtils";

  import ChartFilters from "./ChartFilters.svelte";
  import ChartHeader from "./ChartHeader.svelte";
  import ChartRow from "./ChartRow.svelte";

  interface Chain {
    slug: string;
    name: string;
    chainId: number;
    nativeCurrency?: string;
    type: string;
    tvl: number;
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
      type?: string; // "Optimistic Rollup", "ZK Rollup", etc.
      settlementLayer?: string; // "Ethereum", etc.
      isL2?: boolean;
      isEVM?: boolean;
      stack?: string; // "OP Stack", "zkSync Stack", etc.
    };
  }

  import { SvelteMap } from "svelte/reactivity";

  import type { PeriodType } from "$lib/stores/userPreferencesStore";

  interface Props {
    chains: Chain[];
    isLoading?: boolean;
    selectedPeriod?: PeriodType;
    onPeriodChange?: (period: PeriodType) => void;
    tableWrapper?: HTMLDivElement;
  }

  let {
    chains = [],
    isLoading = false,
    selectedPeriod: initialPeriod = "24h",
    onPeriodChange,
    tableWrapper = $bindable(),
  }: Props = $props();

  // State
  let searchQuery = $state("");
  let sortColumn = $state<
    | "name"
    | "tvl"
    | "tps"
    | "transactions"
    | "activeAddresses"
    | "contracts"
    | "blockTime"
  >("tvl");
  let sortDirection = $state<"asc" | "desc">("desc");
  let activeFilters = $state<Map<string, Set<string>>>(new Map([]));
  let selectedPeriod = $state<PeriodType>(initialPeriod);

  // Handle period change
  function handlePeriodChange(period: PeriodType) {
    selectedPeriod = period;
    onPeriodChange?.(period);
  }

  // Filtered and sorted chains
  const processedChains = $derived(() => {
    let filtered = chains;

    // Apply search filter using shared utility
    if (searchQuery && searchQuery.length >= 3) {
      const matchingSlugs = searchChains(chains, searchQuery);
      filtered = filtered.filter((chain) => matchingSlugs.includes(chain.slug));
    } else if (searchQuery) {
      // For queries less than 3 chars, show no results
      filtered = [];
    }

    // Apply filters (AND logic between categories, OR within categories)
    activeFilters.forEach((values, category) => {
      if (values.size > 0) {
        filtered = filtered.filter((chain) => {
          switch (category) {
            case "layer":
              return values.has(chain.type);
            case "technology":
              return (
                chain.technology?.type && values.has(chain.technology.type)
              );
            default:
              return true;
          }
        });
      }
    });

    // Sort chains
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Handle string comparison for name
      if (sortColumn === "name") {
        aVal = aVal?.toString().toLowerCase() || "";
        bVal = bVal?.toString().toLowerCase() || "";
      }

      // Handle undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === "asc" ? -1 : 1;
      if (bVal == null) return sortDirection === "asc" ? 1 : -1;

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  });

  // Handlers
  function handleSort(column: typeof sortColumn) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "desc";
    }
  }

  function handleFilterChange(category: string, values: Set<string>) {
    const newFilters = new SvelteMap(activeFilters);
    if (values.size > 0) {
      newFilters.set(category, values);
    } else {
      newFilters.delete(category);
    }
    activeFilters = newFilters;
  }

  function handleRowClick(chain: Chain) {
    // Pass state to track that we came from the table view
    goto(`/chain/${chain.slug}`, { state: { from: "/chains" } });
  }

  // Format large numbers
  function formatValue(
    value: number | undefined,
    type: "tvl" | "tps" | "gas" | "count" | "blockTime",
  ): string {
    if (value === undefined || value === null) {
      return "-";
    }

    if (type === "tvl") {
      if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
      } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
      } else if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
      }
      return `$${value.toFixed(0)}`;
    } else if (type === "tps") {
      return value.toFixed(1);
    } else if (type === "gas") {
      return value ? `${value.toFixed(1)}` : "-";
    } else if (type === "blockTime") {
      return value ? `${value.toFixed(1)}s` : "-";
    } else if (type === "count") {
      if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
      } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
      } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
      }
      return value.toFixed(0);
    }
    return value.toString();
  }
</script>

<div class="chart-container">
  <div class="table-container">
    <!-- Search and filters -->
    <div class="chart-controls">
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="search"
          placeholder="Search by name, chain ID, or currency..."
          bind:value={searchQuery}
          class="chart-search"
        />
        {#if searchQuery}
          <button
            class="clear-button"
            onclick={() => (searchQuery = "")}
            aria-label="Clear search"
          >
            ×
          </button>
        {/if}
      </div>
      <div class="controls-right">
        <div class="period-selector">
          {#each ["1h", "24h", "7d", "30d"] as const as period (period)}
            <button
              class="period-btn"
              class:active={selectedPeriod === period}
              onclick={() => handlePeriodChange(period)}
            >
              {period}
            </button>
          {/each}
        </div>
        <ChartFilters
          {activeFilters}
          onFilterChange={handleFilterChange}
          {chains}
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper" bind:this={tableWrapper}>
      <table class="chart-table">
        <thead class="table-header">
          <tr>
            <ChartHeader
              column="name"
              label="Chain"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
              showLogo={true}
            />
            <ChartHeader
              column="tvl"
              label="Treasury"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <ChartHeader
              column="tps"
              label="Activity"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <ChartHeader
              column="blockTime"
              label="SPEED"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <ChartHeader
              column="transactions"
              label="TXs"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <ChartHeader
              column="activeAddresses"
              label="Users"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <ChartHeader
              column="contracts"
              label="Contracts"
              currentSort={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
            />
            <th class="type-header">Type</th>
          </tr>
        </thead>
        <tbody>
          {#each processedChains() as chain (chain.slug)}
            <ChartRow
              {chain}
              {formatValue}
              {isLoading}
              onClick={() => handleRowClick(chain)}
            />
          {/each}
        </tbody>
      </table>

      {#if !isLoading && processedChains().length === 0}
        <div class="no-results">No chains found matching your filters</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .chart-container {
    width: 100%;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    padding-top: 90px; /* More space for header */
  }

  .table-container {
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: calc(100dvh - 90px); /* Account for padding-top */
  }

  .chart-controls {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(180deg, #3a4456 0%, #2c3542 100%);
    border: 1px solid #525e72;
    border-bottom: 1px solid #525e72;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    margin: 1.5rem 1.5rem 0 1.5rem;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    min-height: 60px;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .search-container {
    flex: 1;
    max-width: 400px;
    position: relative;
  }

  .controls-right {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .period-selector {
    display: flex;
    gap: 0.25rem;
    background: rgba(0, 0, 0, 0.15);
    padding: 0.25rem;
    border-radius: 4px;
  }

  .period-btn {
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    color: #9ca3b0;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .period-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f0e6d2;
  }

  .period-btn.active {
    background: rgba(255, 255, 255, 0.2);
    color: #f0e6d2;
    font-weight: 600;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    opacity: 0.8;
    display: flex;
    align-items: center;
  }

  .clear-button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3b0;
    font-size: 20px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.15s ease;
    padding: 0;
    line-height: 1;
    font-family: Arial, sans-serif;
  }

  .clear-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f0e6d2;
  }

  .chart-search {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 3rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #525e72;
    border-radius: 4px;
    color: #f0e6d2;
    font-family: var(--font-ui);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .chart-search::placeholder {
    color: #9ca3b0;
  }

  .chart-search:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.3);
    border-color: #7a8599;
    box-shadow: 0 0 0 1px rgba(122, 133, 153, 0.3);
  }

  .table-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 0;
    background: #f8f7f5;
    border-left: 1px solid #525e72;
    border-right: 1px solid #525e72;
    border-bottom: 1px solid #525e72;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  }

  .chart-table {
    width: 100%;
    min-width: 900px; /* Increased minimum width for more columns */
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 0;
    table-layout: auto; /* Changed to auto for better column sizing */
  }

  .table-header {
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .table-header tr {
    background: linear-gradient(135deg, #4a5568, #3a4456);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .table-header tr th:first-child {
    border-top-left-radius: 0;
  }

  .table-header tr th:last-child {
    border-top-right-radius: 0;
  }

  .type-header {
    padding: 0.75rem 1rem;
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: #f0e6d2;
    text-align: left;
    background: linear-gradient(135deg, #4a5568, #3a4456);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid #525e72;
    position: sticky;
    top: 0;
    min-width: 70px;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #6b6862;
    font-family: var(--font-ui);
    font-size: 1.1rem;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .chart-container {
      padding-top: 100px; /* More padding to account for header */
    }

    .table-container {
      height: calc(100dvh - 100px);
    }

    .chart-controls {
      flex-direction: column;
      padding: 0.75rem;
      margin: 0.5rem 0.5rem 0 0.5rem;
      gap: 0.75rem;
      min-height: auto;
    }

    .search-container {
      max-width: 100%;
      width: 100%;
    }

    .controls-right {
      flex-direction: column;
      width: 100%;
      gap: 0.75rem;
    }

    .period-selector {
      width: 100%;
      justify-content: center;
    }

    .chart-search {
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      font-size: 0.95rem;
    }

    .search-icon {
      font-size: 1rem;
      left: 0.75rem;
    }

    .table-wrapper {
      margin: 0 0.5rem 0.5rem 0.5rem;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top: none;
      -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    }

    .chart-table {
      font-size: 0.85rem;
      min-width: 800px; /* Increased minimum width for more columns */
    }

    /* Keep all columns visible, allow horizontal scroll */
    .type-header {
      width: 15%;
      min-width: 60px;
    }
  }

  /* Small mobile responsiveness */
  @media (max-width: 480px) {
    .chart-container {
      padding-top: 90px;
      align-items: baseline;
    }

    .table-container {
      height: calc(100dvh - 110px);
      margin-top: 20px;
    }

    .chart-controls {
      margin: 0.5rem 0.5rem 0 0.5rem;
    }

    .table-wrapper {
      margin: 0 0.5rem 0.5rem 0.5rem;
      border: none;
    }

    /* Smaller text on very small screens */
    .chart-table {
      font-size: 0.8rem;
      min-width: 750px; /* Ensure all columns are accessible with scroll */
    }
  }
</style>
