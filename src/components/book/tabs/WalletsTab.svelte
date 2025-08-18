<script lang="ts">
  import { onMount } from "svelte";
  import type { WalletsByCategory } from "$lib/types";

  interface Props {
    walletsByCategory: WalletsByCategory;
  }

  let { walletsByCategory }: Props = $props();

  // State for logo loading
  let logoLoadingStates = $state<Record<string, boolean>>({});
  let walletsWithLogos = $state<WalletsByCategory>({ ...walletsByCategory });

  // Import wallet logos (lazy)
  const walletLogos = import.meta.glob("/assets/wallets/*", {
    query: "?url",
    import: "default",
  });

  // Resolve wallet logo URL
  async function resolveWalletLogo(
    walletName: string,
  ): Promise<string | undefined> {
    // Normalize wallet name for matching
    let normalizedName = walletName.toLowerCase();

    // Extract the main name before parentheses if exists
    const parenIndex = normalizedName.indexOf("(");
    if (parenIndex > 0) {
      normalizedName = normalizedName.substring(0, parenIndex).trim();
    }

    // Replace spaces with underscores
    normalizedName = normalizedName.replace(/\s+/g, "_");

    for (const path in walletLogos) {
      const filename = path.split("/").pop()?.toLowerCase();
      if (filename?.startsWith(normalizedName + ".")) {
        try {
          const module = await walletLogos[path]();
          return module as string;
        } catch (error) {
          console.error(`Failed to load logo for ${walletName}:`, error);
          return undefined;
        }
      }
    }
    return undefined;
  }

  // Load all logos in parallel
  async function loadAllLogos() {
    const logoPromises: Promise<void>[] = [];

    for (const [category, categoryWallets] of Object.entries(
      walletsByCategory,
    )) {
      for (let i = 0; i < categoryWallets.length; i++) {
        const wallet = categoryWallets[i];
        const walletKey = `${category}-${wallet.name}`;

        // Mark as loading
        logoLoadingStates[walletKey] = true;

        // Create promise for this logo
        const logoPromise = resolveWalletLogo(wallet.name).then((logoUrl) => {
          // Update the wallet logo when loaded
          if (logoUrl) {
            walletsWithLogos[category][i].logo = logoUrl;
          }
          // Mark as loaded
          logoLoadingStates[walletKey] = false;
        });

        logoPromises.push(logoPromise);
      }
    }

    // Load all logos in parallel
    await Promise.all(logoPromises);
  }

  onMount(() => {
    // Load logos in parallel in the background
    loadAllLogos();
  });
</script>

{#if !walletsByCategory || Object.keys(walletsByCategory).length === 0}
  <div class="no-content">
    <p>No wallets available</p>
  </div>
{:else}
  <div class="wallets-section">
    {#each Object.entries(walletsWithLogos) as [category, wallets] (category)}
      {#if wallets.length > 0}
        <div class="wallet-category">
          <h4 class="category-title">{category}</h4>
          <div class="wallets-grid">
            {#each wallets as wallet (wallet.name)}
              {@const walletKey = `${category}-${wallet.name}`}
              <a href={wallet.url} target="_blank" class="wallet-item">
                {#if wallet.logo}
                  <img
                    src={wallet.logo}
                    alt={wallet.name}
                    class="wallet-logo"
                  />
                {:else if logoLoadingStates[walletKey]}
                  <div class="wallet-logo-skeleton"></div>
                {:else}
                  <span class="wallet-icon">👛</span>
                {/if}
                <span class="wallet-name">{wallet.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .wallets-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .wallet-category h4.category-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    font-family:
      -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  .wallet-category:first-child h4.category-title {
    margin-top: 0;
  }

  .wallets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .wallet-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 450;
  }

  .wallet-item:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .wallet-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .wallet-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
    padding: 2px;
  }

  .wallet-logo-skeleton {
    width: 24px;
    height: 24px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    flex-shrink: 0;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .wallet-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-content {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  @media (max-width: 1280px) {
    .wallets-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }

  @media (max-width: 640px) {
    .wallets-section {
      gap: 1.5rem;
    }

    .wallet-category h4.category-title {
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .wallets-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .wallet-item {
      padding: 0.75rem;
      font-size: 0.8125rem;
    }

    .wallet-logo,
    .wallet-logo-skeleton {
      width: 20px;
      height: 20px;
    }

    .wallet-icon {
      font-size: 0.875rem;
    }
  }
</style>
