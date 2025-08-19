<script lang="ts">
  interface RpcItem {
    name: string;
    url: string;
    type: string;
  }

  interface Props {
    rpcs: RpcItem[] | any[];
    brandColor?: string;
  }

  let { rpcs = [], brandColor = "#3b82f6" }: Props = $props();

  let copiedUrl = $state<string | null>(null);

  const isNewFormat =
    Array.isArray(rpcs) && rpcs.length > 0 && typeof rpcs[0] === "object";
  const officialRpcs = isNewFormat
    ? rpcs.filter((rpc: any) => rpc.type === "official")
    : [];
  const publicRpcs = isNewFormat
    ? rpcs.filter((rpc: any) => rpc.type === "public")
    : [];
  const privateRpcs = isNewFormat
    ? rpcs.filter((rpc: any) => rpc.type === "private")
    : [];

  async function copyRpcUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      copiedUrl = url;
      setTimeout(() => {
        copiedUrl = null;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
</script>

<div class="rpc-modern" style="--brand-color: {brandColor}">
  {#if officialRpcs.length}
    <div class="rpc-section">
      <h4 class="rpc-section-title">
        <span class="section-icon">⭐</span>
        Official RPCs
      </h4>
      <div class="rpc-cards-grid">
        {#each officialRpcs as rpc, i (`official-${i}-${rpc.url}`)}
          <div class="rpc-card compact official">
            <div class="rpc-content">
              <h5 class="rpc-name">{rpc.name}</h5>
              <code class="rpc-url">{rpc.url}</code>
            </div>
            <button
              class="rpc-copy-btn"
              onclick={() => copyRpcUrl(rpc.url)}
              title="Copy RPC URL"
            >
              {#if copiedUrl === rpc.url}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              {:else}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  ></path>
                </svg>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if publicRpcs.length}
    <div class="rpc-section">
      <h4 class="rpc-section-title">
        <span class="section-icon">🌐</span>
        Public RPCs
      </h4>
      <div class="rpc-cards-grid">
        {#each publicRpcs as rpc, i (`public-${i}-${rpc.url}`)}
          <div class="rpc-card compact">
            <div class="rpc-content">
              <h5 class="rpc-name">{rpc.name}</h5>
              <code class="rpc-url">{rpc.url}</code>
            </div>
            <button
              class="rpc-copy-btn"
              onclick={() => copyRpcUrl(rpc.url)}
              title="Copy RPC URL"
            >
              {#if copiedUrl === rpc.url}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              {:else}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  ></path>
                </svg>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if privateRpcs.length}
    <div class="rpc-section">
      <h4 class="rpc-section-title">
        <span class="section-icon">🔒</span>
        Private RPCs <span class="section-note">(API Key Required)</span>
      </h4>
      <div class="rpc-cards-grid">
        {#each privateRpcs as rpc, i (`private-${i}-${rpc.url}`)}
          <div class="rpc-card compact">
            <div class="rpc-content">
              <h5 class="rpc-name">{rpc.name}</h5>
              <code class="rpc-url">{rpc.url}</code>
            </div>
            <button
              class="rpc-copy-btn"
              onclick={() => copyRpcUrl(rpc.url)}
              title="Copy RPC URL"
            >
              {#if copiedUrl === rpc.url}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              {:else}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  ></path>
                </svg>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Modern RPC Design */
  .rpc-modern {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .rpc-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .rpc-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  }

  .section-icon {
    font-size: 1rem;
  }

  .section-note {
    font-size: 0.8125rem;
    font-weight: 400;
    color: #64748b;
    margin-left: 0.25rem;
  }

  /* RPC Cards Grid */
  .rpc-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rpc-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    transition: all 0.15s ease;
  }

  .rpc-card.compact {
    padding: 0.625rem 0.875rem;
  }

  .rpc-card.official {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  }

  .rpc-card:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }

  .rpc-card.official:hover {
    border-color: #f59e0b;
  }

  .rpc-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .rpc-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .rpc-url {
    font-size: 0.75rem;
    color: #64748b;
    font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace;
    word-break: break-all;
    line-height: 1.3;
  }

  .rpc-copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .rpc-copy-btn:hover {
    background: var(--brand-color);
    border-color: var(--brand-color);
    color: white;
  }

  .rpc-copy-btn:active {
    transform: scale(0.9);
  }

  .rpc-copy-btn svg {
    transition: color 0.15s ease;
  }

  @media (max-width: 640px) {
    .rpc-modern {
      gap: 1.5rem;
    }

    .rpc-section {
      gap: 0.5rem;
    }

    .rpc-section-title {
      font-size: 0.875rem;
    }

    .section-icon {
      font-size: 0.875rem;
    }

    .section-note {
      font-size: 0.75rem;
    }

    .rpc-cards-grid {
      gap: 0.375rem;
    }

    .rpc-card {
      padding: 0.75rem;
      gap: 0.75rem;
    }

    .rpc-card.compact {
      padding: 0.625rem 0.75rem;
    }

    .rpc-name {
      font-size: 0.8125rem;
    }

    .rpc-url {
      font-size: 0.6875rem;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .rpc-copy-btn {
      width: 1.5rem;
      height: 1.5rem;
    }

    .rpc-copy-btn svg {
      width: 12px;
      height: 12px;
    }
  }
</style>
