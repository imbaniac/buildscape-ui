<script lang="ts">
  interface Props {
    searchQuery: string;
    searchResults: string[];
    currentResultIndex: number;
    isActive: boolean;
    hasSearched: boolean;
    onSearch: (query: string) => void;
    onNavigate: (direction: "prev" | "next") => void;
    onActivate: () => void;
    onClear: () => void;
  }

  let {
    searchQuery = $bindable(),
    searchResults,
    currentResultIndex,
    isActive,
    hasSearched,
    onSearch,
    onNavigate,
    onActivate,
    onClear,
  }: Props = $props();

  let inputElement = $state<HTMLInputElement>();

  function handleKeyDown(event: KeyboardEvent) {
    // Handle arrow keys only when we have search results AND certain conditions are met
    if (searchResults.length > 0 && inputElement) {
      const cursorPosition = inputElement.selectionStart || 0;
      const textLength = inputElement.value.length;

      // Only intercept arrow keys if:
      // - ArrowLeft when cursor is at position 0
      // - ArrowRight when cursor is at the end
      // - ArrowUp/Down always navigate search results
      if (event.key === "ArrowLeft" && cursorPosition === 0) {
        event.preventDefault();
        onNavigate("prev");
        return;
      } else if (event.key === "ArrowRight" && cursorPosition === textLength) {
        event.preventDefault();
        onNavigate("next");
        return;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onNavigate("prev");
        return;
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        onNavigate("next");
        return;
      }
    }

    if (event.key === "Tab" && searchResults.length > 0) {
      event.preventDefault();
      onNavigate(event.shiftKey ? "prev" : "next");
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClear();
      inputElement?.blur();
    } else if (event.key === "Enter") {
      event.preventDefault();
      // Don't blur on Enter - keep focus for navigation
    }
    // Allow Home/End keys to work normally for text navigation
    // No need to handle them - they'll work by default
  }

  $effect(() => {
    if (isActive && inputElement) {
      // Use setTimeout to ensure focus happens after any other state updates
      setTimeout(() => inputElement?.focus(), 0);
    }
  });

  // Handle clicks outside to deactivate search
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".search-bar")) {
      inputElement?.blur();
      // Only clear if there are no results
      if (searchResults.length === 0 && searchQuery) {
        onClear();
      }
    }
  }

  $effect(() => {
    if (isActive) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  });
</script>

<div
  class="search-bar"
  class:active={isActive || searchQuery.length > 0}
  onpointerdown={(e) => e.stopPropagation()}
>
  <span class="search-icon">🔍</span>

  <input
    bind:this={inputElement}
    type="search"
    placeholder="Search islands..."
    bind:value={searchQuery}
    oninput={() => onSearch(searchQuery)}
    onfocus={onActivate}
    onkeydown={handleKeyDown}
    aria-label="Search for blockchain islands"
    aria-describedby={searchResults.length > 0 ? "search-results" : undefined}
  />

  {#if searchResults.length > 0}
    <span id="search-results" class="results-count">
      {currentResultIndex + 1} / {searchResults.length}
    </span>
    <button
      class="nav-button"
      onclick={(e) => {
        e.stopPropagation();
        onNavigate("prev");
      }}
      aria-label="Previous result (← or ↑)"
      title="Previous (← or ↑)"
      disabled={searchResults.length <= 1}
    >
      ‹
    </button>
    <button
      class="nav-button"
      onclick={(e) => {
        e.stopPropagation();
        onNavigate("next");
      }}
      aria-label="Next result (→ or ↓)"
      title="Next (→ or ↓)"
      disabled={searchResults.length <= 1}
    >
      ›
    </button>
  {:else if hasSearched && searchQuery.length > 3}
    <span class="no-results"> No results found </span>
  {/if}

  {#if searchQuery}
    <button class="clear-button" onclick={onClear} aria-label="Clear search">
      ×
    </button>
  {/if}
</div>

<style>
  .search-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(44, 95, 124, 0.4); /* Very transparent ocean blue */
    backdrop-filter: blur(8px) saturate(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(1.1);
    border: 1px solid rgba(127, 195, 230, 0.2); /* Very light ocean border */
    border-radius: 24px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    z-index: 1;
    width: 380px;
    height: 50px;
    opacity: 0.6;
  }

  .search-bar:hover:not(.active) {
    opacity: 0.8;
    background: rgba(44, 95, 124, 0.6);
    border-color: rgba(127, 195, 230, 0.25);
  }

  .search-bar.active {
    opacity: 1;
    background: rgba(44, 95, 124, 0.85);
    border-color: rgba(127, 195, 230, 0.35);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .search-icon {
    color: rgba(127, 195, 230, 0.8);
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .search-bar.active .search-icon {
    color: #7fc3e6;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #ffffff;
    min-width: 0;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    -webkit-appearance: none; /* Remove iOS default styling */
    appearance: none;
    border-radius: 0;
  }

  input:focus {
    outline: none;
    box-shadow: none;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .search-bar.active input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  /* Remove default search input styling */
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

  .results-count {
    font-size: 12px;
    color: #a8d5e8;
    flex-shrink: 0;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    padding: 3px 10px;
    border-radius: 12px;
    font-family: "Lato", "Inter", sans-serif;
  }

  .no-results {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
    font-weight: 400;
    font-style: italic;
    padding: 3px 10px;
    font-family: "Lato", "Inter", sans-serif;
  }

  .nav-button,
  .clear-button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #7fc3e6;
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .nav-button:hover:not(:disabled),
  .clear-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #a8d5e8;
  }

  .nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .clear-button {
    color: rgba(255, 255, 255, 0.4);
    font-size: 20px;
    line-height: 1;
    font-family: Arial, sans-serif;
    padding: 0;
  }

  .search-bar.active .clear-button {
    color: rgba(255, 255, 255, 0.6);
  }

  .clear-button:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .search-bar {
      bottom: calc(20px + env(safe-area-inset-bottom, 0px));
      width: calc(100% - 40px);
      max-width: 380px;
      /* Better visibility on mobile */
      opacity: 0.75;
      background: rgba(44, 95, 124, 0.6);
    }

    .search-bar.active {
      opacity: 1;
      background: rgba(44, 95, 124, 0.9);
    }

    /* Slightly smaller on mobile to fit better */
    input {
      font-size: 16px; /* Still 16px to prevent zoom */
    }

    /* Larger touch targets for mobile */
    .nav-button,
    .clear-button {
      width: 32px;
      height: 32px;
      font-size: 20px;
    }

    .nav-button {
      margin: 0 2px; /* Add a bit of spacing between buttons */
    }
  }

  /* When keyboard is visible on mobile */
  @supports (height: 100dvh) {
    @media (max-width: 640px) and (max-height: 500px) {
      .search-bar {
        position: absolute;
        bottom: 10px;
      }
    }
  }
</style>
