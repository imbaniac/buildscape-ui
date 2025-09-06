<script lang="ts">
  import ChartFilters from "./ChartFilters.svelte";
  import type { Chain, PeriodType } from "./types";

  interface Props {
    searchQuery: string;
    selectedPeriod: PeriodType;
    activeFilters: Map<string, Set<string>>;
    chains: Chain[];
    isLoading?: boolean;
    onSearchChange: (query: string) => void;
    onPeriodChange: (period: PeriodType) => void;
    onFilterChange: (category: string, values: Set<string>) => void;
  }

  let {
    searchQuery = $bindable(),
    selectedPeriod,
    activeFilters,
    chains,
    isLoading = false,
    onSearchChange,
    onPeriodChange,
    onFilterChange,
  }: Props = $props();

  const periods: PeriodType[] = ["1h", "24h", "7d", "30d"];

  // State for mobile controls visibility
  let showMobileControls = $state(false);

  // Calculate total active filters
  const activeFilterCount = $derived(() => {
    let count = 0;
    activeFilters.forEach((values) => {
      count += values.size;
    });
    // Count period as active if it's not the default
    if (selectedPeriod !== "24h") {
      count += 1;
    }
    return count;
  });

  function handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    onSearchChange(target.value);
  }

  function clearSearch() {
    searchQuery = "";
    onSearchChange("");
  }

  function toggleMobileControls() {
    showMobileControls = !showMobileControls;
  }
</script>

<div class="chart-controls" class:expanded={showMobileControls}>
  <div class="search-container">
    <span class="search-icon">🔍</span>
    <input
      type="search"
      placeholder="Search by name, chain ID, or currency..."
      value={searchQuery}
      oninput={handleSearchInput}
      class="chart-search"
    />
    {#if searchQuery}
      <button
        class="clear-button"
        onclick={clearSearch}
        aria-label="Clear search"
      >
        ×
      </button>
    {/if}
  </div>

  <!-- Mobile filter toggle button -->
  <button
    class="mobile-filter-btn"
    onclick={toggleMobileControls}
    aria-label="Toggle filters"
    aria-expanded={showMobileControls}
  >
    <span class="filter-icon">⚙️</span>
    {#if activeFilterCount() > 0}
      <span class="filter-badge">{activeFilterCount()}</span>
    {/if}
  </button>

  <div
    class="controls-right"
    class:mobile-expanded={showMobileControls}
    class:has-dropdown-open={showMobileControls}
  >
    <div class="period-selector">
      {#each periods as period (period)}
        <button
          class="period-btn"
          class:active={selectedPeriod === period}
          onclick={() => onPeriodChange(period)}
        >
          {period}
        </button>
      {/each}
    </div>
    <ChartFilters {activeFilters} {onFilterChange} {chains} {isLoading} />
  </div>
</div>

<style>
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

  /* Mobile filter button - hidden on desktop */
  .mobile-filter-btn {
    display: none;
    position: relative;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #525e72;
    border-radius: 4px;
    color: #9ca3b0;
    font-family: var(--font-ui);
    cursor: pointer;
    transition: all 0.2s ease;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-width: 50px;
    height: 100%;
  }

  .mobile-filter-btn:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: #7a8599;
    color: #f0e6d2;
  }

  .mobile-filter-btn[aria-expanded="true"] {
    background: rgba(0, 0, 0, 0.3);
    border-color: #7a8599;
    color: #f0e6d2;
  }

  .filter-icon {
    font-size: 1.2rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
  }

  .mobile-filter-btn[aria-expanded="true"] .filter-icon {
    transform: rotate(180deg);
  }

  .filter-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #4a7c59;
    color: #ffffff;
    font-size: 0.65rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .chart-controls {
      flex-wrap: wrap;
      padding: 0.75rem;
      margin: 0.5rem 0.5rem 0 0.5rem;
      gap: 0.75rem;
      min-height: auto;
      align-items: flex-start;
      overflow: visible;
    }

    .chart-controls.expanded {
      padding-bottom: 0.75rem;
    }

    .search-container {
      flex: 1;
      min-width: 0;
    }

    /* Show mobile filter button */
    .mobile-filter-btn {
      display: flex;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .mobile-filter-btn:active {
      transform: scale(0.98);
    }

    /* Hide controls by default on mobile */
    .controls-right {
      width: 100%;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Show controls when expanded */
    .controls-right.mobile-expanded {
      max-height: 500px;
      overflow: visible;
      opacity: 1;
      transform: translateY(0);
      margin-top: 0.75rem;
    }

    .period-selector {
      width: 100%;
      justify-content: center;
    }

    .chart-search {
      padding: 0.6rem 2.5rem 0.6rem 2.5rem;
      font-size: 0.95rem;
      height: 44px;
    }

    .search-icon {
      font-size: 1rem;
      left: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .chart-controls {
      margin: 0.5rem 0.5rem 0 0.5rem;
      gap: 0.5rem;
      padding: 0.6rem;
    }

    .mobile-filter-btn {
      padding: 0.6rem 0.8rem;
      min-width: 45px;
      height: 42px;
    }

    .filter-icon {
      font-size: 1rem;
    }

    .filter-badge {
      font-size: 0.6rem;
      padding: 1px 4px;
      min-width: 16px;
      height: 16px;
    }

    .chart-search {
      padding: 0.55rem 2.2rem 0.55rem 2.2rem;
      font-size: 0.9rem;
      height: 42px;
    }
  }
</style>
