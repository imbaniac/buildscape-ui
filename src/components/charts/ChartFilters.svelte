<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";

  interface Props {
    activeFilters: Map<string, Set<string>>;
    onFilterChange: (category: string, values: Set<string>) => void;
    chains: any[];
  }

  let { activeFilters, onFilterChange, chains }: Props = $props();

  // Track which dropdowns are open
  let openDropdowns = $state<Set<string>>(new Set());

  // Extract unique values from chains for each filter category
  const filterOptions = $derived(() => {
    const options = {
      layer: new Set<string>(),
      technology: new Set<string>(),
    };

    chains.forEach((chain) => {
      // Layer type
      if (chain.type) {
        options.layer.add(chain.type);
      }

      // Technology type
      if (chain.technology?.type) {
        options.technology.add(chain.technology.type);
      }
    });

    return {
      layer: Array.from(options.layer).sort(),
      technology: Array.from(options.technology).sort(),
    };
  });

  // Filter configurations
  const filterConfigs = [
    { id: "layer", label: "Layer", icon: "🏛️" },
    { id: "technology", label: "Technology", icon: "⚡" },
  ];

  function toggleDropdown(filterId: string) {
    const newOpenDropdowns = new SvelteSet(openDropdowns);
    if (newOpenDropdowns.has(filterId)) {
      newOpenDropdowns.delete(filterId);
    } else {
      // Close other dropdowns
      newOpenDropdowns.clear();
      newOpenDropdowns.add(filterId);
    }
    openDropdowns = newOpenDropdowns;
  }

  function toggleFilter(category: string, value: string) {
    const currentValues = activeFilters.get(category) || new SvelteSet();
    const newValues = new SvelteSet(currentValues);

    if (newValues.has(value)) {
      newValues.delete(value);
    } else {
      newValues.add(value);
    }

    onFilterChange(category, newValues);
  }

  function clearFilters(category: string) {
    onFilterChange(category, new SvelteSet());
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".filter-dropdown")) {
      openDropdowns = new Set();
    }
  }

  $effect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<div class="filters-container">
  <span class="filter-label">Filter:</span>

  <div class="filter-dropdowns">
    {#each filterConfigs as config (config.id)}
      {@const allOptions = filterOptions()}
      {@const options = allOptions[config.id as keyof typeof allOptions] || []}
      {@const activeValues = activeFilters.get(config.id) || new Set()}
      {@const isOpen = openDropdowns.has(config.id)}

      {#if options.length > 0}
        <div class="filter-dropdown">
          <button
            class="filter-dropdown-btn"
            class:active={activeValues.size > 0}
            onclick={(e) => {
              e.stopPropagation();
              toggleDropdown(config.id);
            }}
          >
            <div class="filter-dropdown-content">
              <span class="filter-icon">{config.icon}</span>
              <span class="filter-text">{config.label}</span>
              {#if activeValues.size > 0}
                <span class="filter-count">{activeValues.size}</span>
              {/if}
            </div>
            <span class="dropdown-arrow" class:open={isOpen}>▼</span>
          </button>

          {#if isOpen}
            <div class="dropdown-menu">
              <div class="dropdown-header">
                <span class="dropdown-title">{config.label}</span>
                {#if activeValues.size > 0}
                  <button
                    class="clear-btn"
                    onclick={() => clearFilters(config.id)}
                  >
                    Clear
                  </button>
                {/if}
              </div>

              <div class="dropdown-options">
                {#each options as option (option)}
                  <label class="dropdown-option">
                    <input
                      type="checkbox"
                      checked={activeValues.has(option)}
                      onchange={() => toggleFilter(config.id, option)}
                    />
                    <span class="option-text">{option}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .filters-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-label {
    font-family: var(--font-ui);
    font-weight: 600;
    color: #9ca3b0;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }

  .filter-dropdowns {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-dropdown {
    position: relative;
    z-index: auto;
  }

  .filter-dropdown-btn {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.875rem;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid #525e72;
    border-radius: 6px;
    color: #9ca3b0;
    font-family: var(--font-ui);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    min-width: 160px;
    justify-content: space-between;
  }

  .filter-dropdown-btn:hover {
    background: rgba(0, 0, 0, 0.25);
    border-color: #7a8599;
    color: #c8cdd6;
  }

  .filter-dropdown-btn.active {
    background: linear-gradient(135deg, #4a7c59, #3a6c49);
    border-color: #3a6c49;
    color: #ffffff;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  .filter-dropdown-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .filter-icon {
    font-size: 1rem;
  }

  .filter-text {
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }

  .filter-count {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 100%;
    font-size: 0.6rem;
    text-align: center;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropdown-arrow {
    font-size: 0.6rem;
    margin-left: 0.2rem;
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    min-width: 200px;
    background: #2c3542;
    border: 1px solid #525e72;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #525e72;
    background: rgba(0, 0, 0, 0.2);
  }

  .dropdown-title {
    font-family: var(--font-ui);
    font-weight: 600;
    color: #f0e6d2;
    font-size: 0.9rem;
  }

  .clear-btn {
    background: none;
    border: none;
    color: #9ca3b0;
    font-family: var(--font-ui);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f0e6d2;
  }

  .dropdown-options {
    max-height: 250px;
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  .dropdown-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .dropdown-option:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .dropdown-option input[type="checkbox"] {
    accent-color: #4a7c59;
  }

  .option-text {
    color: #f0e6d2;
    font-family: var(--font-ui);
    font-size: 0.85rem;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .filters-container {
      width: 100%;
      gap: 0.5rem;
      justify-content: flex-start;
    }

    .filter-label {
      font-size: 0.75rem;
    }

    .filter-dropdowns {
      flex: 1;
      gap: 0.35rem;
    }

    .filter-dropdown-btn {
      padding: 0.4rem 0.65rem;
      font-size: 0.75rem;
      min-width: 130px;
    }

    .filter-icon {
      font-size: 0.85rem;
    }

    .filter-text {
      font-size: 0.7rem;
    }

    .filter-count {
      font-size: 0.6rem;
      padding: 0.05rem 0.2rem;
    }

    .dropdown-arrow {
      font-size: 0.5rem;
    }

    .dropdown-menu {
      left: 0;
      right: auto;
      min-width: 180px;
    }

    .dropdown-header {
      padding: 0.5rem 0.75rem;
    }

    .dropdown-title {
      font-size: 0.8rem;
    }

    .clear-btn {
      font-size: 0.7rem;
      padding: 0.15rem 0.4rem;
    }

    .dropdown-option {
      padding: 0.4rem 0.75rem;
    }

    .option-text {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .filters-container {
      gap: 0.35rem;
    }

    .filter-dropdowns {
      gap: 0.25rem;
    }

    .filter-dropdown-btn {
      padding: 0.35rem 0.5rem;
      font-size: 0.7rem;
    }

    .filter-text {
      font-size: 0.65rem;
      letter-spacing: 0.02em;
    }
  }
</style>
