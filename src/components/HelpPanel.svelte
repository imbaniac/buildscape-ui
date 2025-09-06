<script lang="ts">
  import { onMount } from "svelte";

  let isOpen = $state(false);
  let activeTab = $state<"legend" | "shortcuts" | "contribute" | "about">(
    "legend",
  );

  function togglePanel() {
    isOpen = !isOpen;
  }

  function closePanel(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest(".help-panel") &&
      !target.closest(".help-button") &&
      isOpen
    ) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", closePanel);
    return () => document.removeEventListener("click", closePanel);
  });
</script>

<!-- Help Button -->
<button
  class="help-button"
  class:active={isOpen}
  onclick={togglePanel}
  aria-label="Help and information"
  title="Help & Legend"
>
  <span class="help-icon">?</span>
</button>

<!-- Help Panel -->
{#if isOpen}
  <div class="help-panel">
    <div class="panel-header">
      <h3 class="panel-title">Buildscape Guide</h3>
      <button
        class="close-button"
        onclick={() => (isOpen = false)}
        aria-label="Close help panel"
      >
        ×
      </button>
    </div>

    <div class="subtabs">
      <button
        class="subtab-button"
        class:active={activeTab === "legend"}
        onclick={() => (activeTab = "legend")}
      >
        Legend
      </button>
      <button
        class="subtab-button"
        class:active={activeTab === "shortcuts"}
        onclick={() => (activeTab = "shortcuts")}
      >
        Controls
      </button>
      <button
        class="subtab-button"
        class:active={activeTab === "contribute"}
        onclick={() => (activeTab = "contribute")}
      >
        Add/Edit Chain
      </button>
      <button
        class="subtab-button"
        class:active={activeTab === "about"}
        onclick={() => (activeTab = "about")}
      >
        About
      </button>
    </div>

    <div class="content">
      {#if activeTab === "legend"}
        <div class="help-section">
          <h4>Island Size</h4>
          <p>Total Value Locked (TVL) - larger islands hold more value</p>
        </div>

        <div class="help-section">
          <h4>Island Terrain</h4>
          <p>Activity Level measured in Transactions Per Second (TPS)</p>
          <div class="terrain-list">
            <div class="terrain-item">
              <span class="terrain-icon">🏜️</span>
              <div>
                <div class="terrain-label">Desert</div>
                <div class="terrain-desc">Low activity • Less than 0.5 TPS</div>
              </div>
            </div>
            <div class="terrain-item">
              <span class="terrain-icon">🌾</span>
              <div>
                <div class="terrain-label">Light Green</div>
                <div class="terrain-desc">Medium activity • 0.5 to 10 TPS</div>
              </div>
            </div>
            <div class="terrain-item">
              <span class="terrain-icon">🌿</span>
              <div>
                <div class="terrain-label">Green</div>
                <div class="terrain-desc">High activity • 10 to 50 TPS</div>
              </div>
            </div>
            <div class="terrain-item">
              <span class="terrain-icon">🌳</span>
              <div>
                <div class="terrain-label">Dark Green</div>
                <div class="terrain-desc">Very high activity • Over 50 TPS</div>
              </div>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h4>Vegetation</h4>
          <p>Tree density indicates transaction volume</p>
        </div>
      {/if}

      {#if activeTab === "shortcuts"}
        <div class="shortcuts-list">
          <div class="shortcut-row">
            <span class="shortcut-desc">Search chains</span>
            <div class="keys">
              <kbd>Cmd</kbd><span class="plus">+</span><kbd>F</kbd>
            </div>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-desc">Navigate results</span>
            <div class="keys">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </div>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-desc">View chain info</span>
            <div class="keys">
              <kbd>Click</kbd>
            </div>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-desc">Pan map</span>
            <div class="keys">
              <kbd>Drag</kbd>
            </div>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-desc">Zoom</span>
            <div class="keys">
              <kbd>Scroll</kbd>
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === "contribute"}
        <div class="contribute-grid">
          <div class="contribute-card primary">
            <div class="card-icon">➕</div>
            <div class="card-content">
              <h5>Add New Chain</h5>
              <p>Submit a blockchain that's not on the map</p>
              <a
                href="https://github.com/imbaniac/buildscape-ui/issues/new?template=add-chain.yml"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
              >
                Add Chain →
              </a>
            </div>
          </div>

          <div class="contribute-card">
            <div class="card-icon">✏️</div>
            <div class="card-content">
              <h5>Edit Chain Info</h5>
              <p>Fix incorrect or outdated data</p>
              <a
                href="https://github.com/imbaniac/buildscape-ui/issues/new?template=edit-chain.yml"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
              >
                Edit Info →
              </a>
            </div>
          </div>
        </div>

        <div class="contribute-footer">
          <p class="footer-text">Or contribute directly via pull request</p>
          <a
            href="https://github.com/imbaniac/buildscape-ui/blob/main/docs/ADD_CHAIN.md"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
          >
            View contribution guide →
          </a>
        </div>
      {/if}

      {#if activeTab === "about"}
        <div class="help-section">
          <p>
            Buildscape is an open-source interactive guide for exploring
            blockchain networks.
          </p>
          <p class="secondary-text">
            Navigate the sea of chains, discover new networks, and access key
            metrics all in one place.
          </p>
        </div>
        <div class="action-links">
          <a
            href="https://github.com/imbaniac/buildscape-ui"
            target="_blank"
            rel="noopener noreferrer"
            class="secondary-link"
          >
            GitHub Repository
          </a>
          <a
            href="https://github.com/imbaniac/buildscape-ui/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="secondary-link"
          >
            Report an Issue
          </a>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Help Button */
  .help-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(180deg, #3a4456 0%, #2c3542 100%);
    border: 1px solid #525e72;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: all 0.2s ease;
  }

  .help-button:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  }

  .help-button.active {
    background: linear-gradient(180deg, #4a7c59 0%, #3a6c49 100%);
  }

  .help-icon {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: #f0e6d2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Help Panel */
  .help-panel {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 420px;
    height: 520px;
    background: #fafaf8;
    border: 1px solid #525e72;
    border-radius: 8px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 3;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
    cursor: default;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Panel Header */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #4a5568, #3a4456);
    border-bottom: 1px solid #525e72;
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: #f0e6d2;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .close-button {
    background: transparent;
    border: none;
    color: #9ca3b0;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
    line-height: 1;
  }

  .close-button:hover {
    color: #f0e6d2;
  }

  /* Subtabs - matching Book component style */
  .subtabs {
    display: flex;
    gap: 0.5rem;
    padding: 1rem 1rem 0;
    background: #f5f5f3;
  }

  .subtab-button {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-family: var(--font-ui);
    font-weight: 600;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .subtab-button:hover {
    color: #475569;
  }

  .subtab-button.active {
    color: #4a7c59;
    border-bottom-color: #4a7c59;
  }

  /* Content Area */
  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    font-family: var(--font-body);
  }

  /* Help Sections */
  .help-section {
    margin-bottom: 24px;
  }

  .help-section:last-child {
    margin-bottom: 0;
  }

  .help-section h4 {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .help-section p {
    font-size: 14px;
    color: #4b5563;
    margin: 0 0 12px 0;
    line-height: 1.5;
  }

  .secondary-text {
    color: #6b7280;
    font-size: 13px;
  }

  /* Terrain List */
  .terrain-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }

  .terrain-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }

  .terrain-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .terrain-label {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
  }

  .terrain-desc {
    font-size: 12px;
    color: #6b7280;
  }

  /* Shortcuts List */
  .shortcuts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .shortcut-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }

  .shortcut-desc {
    font-size: 14px;
    color: #4b5563;
  }

  .keys {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .plus {
    color: #9ca3af;
    font-size: 12px;
    padding: 0 2px;
  }

  kbd {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-bottom: 2px solid #d1d5db;
    border-radius: 4px;
    padding: 4px 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    min-width: 28px;
    text-align: center;
  }

  /* Action Links */
  .action-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  .secondary-link {
    display: inline-block;
    padding: 10px 16px;
    border-radius: 6px;
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
    color: #4a7c59;
    border: 1px solid #e5e7eb;
    background: transparent;
  }

  .secondary-link:hover {
    background: rgba(74, 124, 89, 0.05);
    border-color: #4a7c59;
  }

  /* Contribute Section */
  .contribute-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .contribute-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .contribute-card:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: #d1d5db;
  }

  .contribute-card.primary {
    background: rgba(74, 124, 89, 0.08);
    border-color: rgba(74, 124, 89, 0.3);
  }

  .contribute-card.primary:hover {
    background: rgba(74, 124, 89, 0.12);
    border-color: rgba(74, 124, 89, 0.5);
  }

  .card-icon {
    font-size: 24px;
    line-height: 1;
    flex-shrink: 0;
  }

  .card-content {
    flex: 1;
  }

  .card-content h5 {
    font-family: var(--font-ui);
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .card-content p {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }

  .card-link {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: #4a7c59;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .card-link:hover {
    color: #3a6c49;
    text-decoration: underline;
  }

  .contribute-footer {
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }

  .footer-text {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px 0;
  }

  .text-link {
    font-size: 13px;
    color: #4a7c59;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .text-link:hover {
    color: #3a6c49;
    text-decoration: underline;
  }

  /* Mobile Styles */
  @media (max-width: 640px) {
    .help-button {
      bottom: 10px;
      right: 10px;
    }

    .help-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      border-radius: 0;
      border: none;
      max-height: none;
      animation: slideFadeIn 0.3s ease-out;
    }

    @keyframes slideFadeIn {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .panel-header {
      border-radius: 0;
    }

    .panel-title {
      font-size: 16px;
    }

    .subtabs {
      padding: 0.75rem 0.75rem 0;
    }

    .subtab-button {
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
    }

    .content {
      padding: 16px;
    }
  }
</style>
