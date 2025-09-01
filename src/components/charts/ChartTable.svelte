<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";

  import { goto } from "$app/navigation";

  import { searchChains } from "$lib/utils/searchUtils";

  import TableControls from "./TableControls.svelte";
  import TableHeader from "./TableHeader.svelte";
  import TableRow from "./TableRow.svelte";
  import type { Chain, PeriodType, SortColumn, SortDirection } from "./types";

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
  let sortColumn = $state<SortColumn>("tvl");
  let sortDirection = $state<SortDirection>("desc");
  let activeFilters = $state<Map<string, Set<string>>>(new Map([]));
  let selectedPeriod = $state<PeriodType>(initialPeriod);

  // Handle period change
  function handlePeriodChange(period: PeriodType) {
    selectedPeriod = period;
    onPeriodChange?.(period);
  }

  // Handle search change
  function handleSearchChange(query: string) {
    searchQuery = query;
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
  function handleSort(column: string) {
    const sortCol = column as SortColumn;
    if (sortColumn === sortCol) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = sortCol;
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

  // Column configurations
  const columns = [
    { id: "name", label: "Chain" },
    { id: "tvl", label: "Treasury" },
    { id: "tps", label: "Activity" },
    { id: "blockTime", label: "SPEED" },
    { id: "transactions", label: "TXs" },
    { id: "activeAddresses", label: "Users" },
    { id: "contracts", label: "Contracts" },
  ];
</script>

<div class="chart-container">
  <div class="map-backdrop"></div>
  <div class="table-container">
    <!-- Search and filters -->
    <TableControls
      bind:searchQuery
      {selectedPeriod}
      {activeFilters}
      {chains}
      {isLoading}
      onSearchChange={handleSearchChange}
      onPeriodChange={handlePeriodChange}
      onFilterChange={handleFilterChange}
    />

    <!-- Grid Table -->
    <div class="table-wrapper" bind:this={tableWrapper}>
      <div class="grid-table">
        <!-- Header Row -->
        <div class="grid-header sticky-header sticky-corner logo-header">
          <!-- Empty header for logo column -->
        </div>
        {#each columns as column (column.id)}
          <TableHeader
            column={column.id}
            label={column.label}
            {sortColumn}
            {sortDirection}
            onSort={handleSort}
          />
        {/each}
        <button class="grid-header sticky-header type-header">Type</button>

        <!-- Data Rows -->
        {#if chains.length === 0 && isLoading}
          <!-- Show skeleton rows when no data loaded yet -->
          {#each Array(20) as _, index}
            <TableRow
              chain={{
                slug: `skeleton-${index}`,
                name: "",
                chainId: 0,
                type: "L1",
                tvl: 0,
                tps: 0,
                transactions: 0,
                activeAddresses: 0,
                contracts: 0,
              }}
              {index}
              isLoading={true}
              onRowClick={() => {}}
            />
          {/each}
        {:else}
          {#each processedChains() as chain, index (chain.slug)}
            <TableRow {chain} {index} {isLoading} onRowClick={handleRowClick} />
          {/each}
        {/if}
      </div>

      {#if !isLoading && processedChains().length === 0 && chains.length > 0}
        <div class="no-results">No chains found matching your filters</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .chart-container {
    width: 100%;
    padding-top: 90px;
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
    height: calc(100dvh - 90px);
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

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sticky-corner {
    z-index: 3;
    left: 0;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .logo-header {
    min-width: 0;
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
      padding-top: 100px;
    }

    .table-container {
      height: calc(100dvh - 100px);
    }

    .table-wrapper {
      margin: 0 0.5rem 0.5rem 0.5rem;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top: none;
      -webkit-overflow-scrolling: touch;
    }

    .grid-header {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }

    .type-header {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .chart-container {
      padding-top: 90px;
      align-items: baseline;
    }

    .table-container {
      height: calc(100dvh - 110px);
      margin-top: 20px;
    }

    .table-wrapper {
      margin: 0 0.5rem 0.5rem 0.5rem;
      border: none;
    }

    .grid-table {
      font-size: 0.8rem;
      min-width: 750px;
      grid-template-columns:
        50px 140px minmax(140px, 1.5fr) minmax(100px, 1fr)
        minmax(60px, 0.8fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(
          120px,
          1fr
        )
        minmax(40px, 0.6fr);
    }

    .grid-header {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .type-header {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
    }
  }
</style>
