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

  function handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    onSearchChange(target.value);
  }

  function clearSearch() {
    searchQuery = "";
    onSearchChange("");
  }
</script>

<div class="chart-controls">
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
  <div class="controls-right">
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

  @media (max-width: 768px) {
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
  }

  @media (max-width: 480px) {
    .chart-controls {
      margin: 0.5rem 0.5rem 0 0.5rem;
    }
  }
</style>
