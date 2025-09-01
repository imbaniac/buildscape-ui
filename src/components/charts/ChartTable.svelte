<script lang="ts">
  import { goto } from "$app/navigation";

  import { searchChains } from "$lib/utils/searchUtils";

  import ChartFilters from "./ChartFilters.svelte";

  interface Chain {
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
    if (searchQuery && searchQuery.length > 1) {
      const matchingSlugs = searchChains(chains, searchQuery);
      filtered = filtered.filter((chain) => matchingSlugs.includes(chain.slug));
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
  <div class="map-backdrop"></div>
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

    <!-- Grid Table -->
    <div class="table-wrapper" bind:this={tableWrapper}>
      <div class="grid-table">
        <!-- Header Row -->
        <div class="grid-header sticky-header sticky-corner logo-header">
          <!-- Empty header for logo column -->
        </div>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "name"}
          onclick={() => handleSort("name")}
        >
          <div class="header-content">
            <span class="header-label">Chain</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'name'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "tvl"}
          onclick={() => handleSort("tvl")}
        >
          <div class="header-content">
            <span class="header-label">Treasury</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'tvl'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "tps"}
          onclick={() => handleSort("tps")}
        >
          <div class="header-content">
            <span class="header-label">Activity</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'tps'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "blockTime"}
          onclick={() => handleSort("blockTime")}
        >
          <div class="header-content">
            <span class="header-label">SPEED</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'blockTime'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "transactions"}
          onclick={() => handleSort("transactions")}
        >
          <div class="header-content">
            <span class="header-label">TXs</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'transactions'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "activeAddresses"}
          onclick={() => handleSort("activeAddresses")}
        >
          <div class="header-content">
            <span class="header-label">Users</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'activeAddresses'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button
          class="grid-header sticky-header sortable"
          class:active={sortColumn === "contracts"}
          onclick={() => handleSort("contracts")}
        >
          <div class="header-content">
            <span class="header-label">Contracts</span>
            <span
              class="sort-arrow"
              style="transform: {sortColumn === 'contracts'
                ? sortDirection === 'asc'
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)'
                : 'rotate(90deg)'}"
            >
              ▲
            </span>
          </div>
        </button>
        <button class="grid-header sticky-header type-header">Type</button>

        <!-- Data Rows -->
        {#each processedChains() as chain, index (chain.slug)}
          <!-- Logo column (sticky) -->
          <button
            class="grid-cell sticky-column logo-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if chain.logoUrl}
              <div
                class="chain-seal"
                style="--chain-color: {chain.color || '#7a8599'}"
              >
                <div class="seal-inner">
                  <img
                    src={chain.logoUrl}
                    alt={chain.name}
                    class="chain-logo"
                  />
                </div>
              </div>
            {:else}
              <div
                class="chain-seal placeholder"
                style="--chain-color: {chain.color || '#7a8599'}"
              >
                <div class="seal-inner">
                  <span class="logo-initial">{chain.name.charAt(0)}</span>
                </div>
              </div>
            {/if}
          </button>
          <!-- Chain name column -->
          <button
            class="grid-cell chain-name-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            <div class="name-wrapper">
              <span class="name-text">{chain.name}</span>
              <span class="chain-id-text">#{chain.chainId}</span>
            </div>
          </button>
          <!-- Data cells -->
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <div class="tvl-container">
                <span class="value-text">{formatValue(chain.tvl, "tvl")}</span>
                {#if chain.tvlChange !== null && chain.tvlChange !== undefined}
                  <span
                    class="tvl-change"
                    class:positive={chain.tvlChange > 0}
                    class:negative={chain.tvlChange < 0}
                  >
                    {chain.tvlChange > 0 ? "+" : ""}{chain.tvlChange.toFixed(
                      1,
                    )}%
                  </span>
                {/if}
              </div>
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <span class="value-text">{formatValue(chain.tps, "tps")} TPS</span
              >
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <span class="value-text"
                >{formatValue(chain.blockTime, "blockTime")}</span
              >
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <span class="value-text"
                >{formatValue(chain.transactions, "count")}</span
              >
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <span class="value-text"
                >{formatValue(chain.activeAddresses, "count")}</span
              >
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            {#if isLoading}
              <span class="skeleton-metric"></span>
            {:else}
              <span class="value-text"
                >{formatValue(chain.contracts, "count")}</span
              >
            {/if}
          </button>
          <button
            class="grid-cell"
            class:alt-row={index % 2 === 1}
            onclick={() => handleRowClick(chain)}
          >
            <span
              class="type-badge {chain.type === 'L1'
                ? 'badge-l1'
                : chain.type === 'L2'
                  ? 'badge-l2'
                  : 'badge-default'}"
            >
              {chain.type}
            </span>
          </button>
        {/each}
      </div>

      {#if !isLoading && processedChains().length === 0}
        <div class="no-results">No chains found matching your filters</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .chart-container {
    width: 100%;
    padding-top: 90px; /* More space for header */
    cursor: default;
  }
  .map-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    cursor: default;
    background: rgb(5, 16, 21);
    opacity: 0.5;
  }

  .table-container {
    max-width: 1600px;
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
    margin: 1rem 1rem 0 1rem;
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
    margin: 0 1rem 1rem 1rem;
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

  .grid-table {
    display: grid;
    grid-template-columns:
      70px 200px minmax(180px, 1.5fr) minmax(120px, 1fr) minmax(100px, 0.8fr)
      minmax(100px, 1fr) minmax(100px, 1fr) minmax(140px, 1fr) minmax(
        60px,
        0.8fr
      );
    width: 100%;
    min-width: 900px;
  }

  /* Grid headers */
  .grid-header {
    background: linear-gradient(135deg, #4a5568, #3a4456);
    padding: 0.75rem 1rem;
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid #525e72;
    display: flex;
    align-items: center;
    border-right: 1px solid rgba(82, 94, 114, 0.5);
    border-top: none;
    border-left: none;
  }

  .grid-header.sortable {
    cursor: pointer;
    user-select: none;
    transition: background 0.2s ease;
  }

  .grid-header.sortable:hover {
    background: linear-gradient(135deg, #526178, #3f4a5c);
  }

  .grid-header.active {
    background: linear-gradient(135deg, #526178, #3f4a5c);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .header-label {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .sort-arrow {
    font-size: 0.7rem;
    opacity: 0.6;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .grid-header.active .sort-arrow {
    opacity: 1;
  }

  /* Sticky positioning */
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sticky-column {
    position: sticky;
    left: 0;
    z-index: 1;
    background: #f8f7f5;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  }

  .sticky-corner {
    z-index: 3;
    left: 0;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Grid cells */
  .grid-cell {
    padding: 0.75rem 1rem;
    border: none;
    border-bottom: 1px solid #e0dcd5;
    background: #f8f7f5;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .grid-cell:hover {
    background: #f0eee9;
  }

  .grid-cell.alt-row {
    background: #f2f1ee;
  }

  .grid-cell.alt-row:hover {
    background: #ebe9e4;
  }

  .sticky-column.alt-row {
    background: #f2f1ee;
  }

  /* Logo cell styling */
  .logo-cell {
    min-width: 70px;
    justify-content: center;
    padding: 0.5rem;
  }

  .logo-header {
    min-width: 0;
  }

  /* Chain name cell styling */
  .chain-name-cell {
    min-width: 200px;
    justify-content: flex-start;
  }

  .chain-seal {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      var(--chain-color),
      color-mix(in srgb, var(--chain-color) 70%, black)
    );
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.15),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }

  .seal-inner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .chain-logo {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .chain-seal.placeholder .seal-inner {
    background: rgba(255, 255, 255, 0.9);
  }

  .logo-initial {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--chain-color);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    text-align: initial;
  }

  .name-text {
    font-family: var(--font-ui);
    font-size: 0.95rem;
    font-weight: 600;
    color: #3a3633;
  }

  .chain-id-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #8a837a;
    font-weight: 400;
  }

  /* Value styling */
  .value-text {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: #3a3633;
    font-weight: 500;
  }

  .tvl-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tvl-change {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-weight: 600;
  }

  .tvl-change.positive {
    color: #2d7a2d;
    background: rgba(45, 122, 45, 0.1);
  }

  .tvl-change.negative {
    color: #c73030;
    background: rgba(199, 48, 48, 0.1);
  }

  /* Type badge */
  .type-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;
    font-family: var(--font-ui);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, #6b6862, #57534e);
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-l1 {
    background: linear-gradient(135deg, #8b7355, #6d5a44);
  }

  .badge-l2 {
    background: linear-gradient(135deg, #5a7a8b, #476472);
  }

  /* Loading skeleton */
  .skeleton-metric {
    display: inline-block;
    width: 60px;
    height: 20px;
    background: linear-gradient(90deg, #e0dcd5 0%, #ebe8e3 50%, #e0dcd5 100%);
    border-radius: 3px;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -100px;
    }
    100% {
      background-position: 100px;
    }
  }

  .type-header {
    padding: 0.75rem 1rem;
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: #f0e6d2;
    text-align: left;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

    .grid-header,
    .grid-cell {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }

    .logo-cell {
      min-width: 60px;
      padding: 0.4rem;
    }

    .chain-name-cell {
      min-width: 160px;
    }

    .chain-seal {
      width: 36px;
      height: 36px;
    }

    .seal-inner {
      width: 28px;
      height: 28px;
    }

    .chain-logo {
      width: 20px;
      height: 20px;
    }

    .name-text {
      font-size: 0.9rem;
    }

    .value-text {
      font-size: 0.85rem;
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
    .grid-table {
      font-size: 0.8rem;
      min-width: 750px; /* Ensure all columns are accessible with scroll */
      grid-template-columns:
        50px 140px minmax(140px, 1.5fr) minmax(100px, 1fr)
        minmax(60px, 0.8fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(
          120px,
          1fr
        )
        minmax(40px, 0.6fr);
    }

    .grid-header,
    .grid-cell {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .logo-cell {
      min-width: 50px;
      padding: 0.3rem;
    }

    .chain-name-cell {
      min-width: 140px;
    }

    .chain-seal {
      width: 32px;
      height: 32px;
    }

    .seal-inner {
      width: 26px;
      height: 26px;
    }

    .chain-logo {
      width: 18px;
      height: 18px;
    }

    .name-text {
      font-size: 0.85rem;
    }

    .chain-id-text {
      font-size: 0.7rem;
    }

    .value-text {
      font-size: 0.8rem;
    }
  }
</style>
