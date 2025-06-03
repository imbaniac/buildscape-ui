<script lang="ts">
  import type { WalletsByCategory } from '$lib/types';
  
  interface Props {
    walletsByCategory: WalletsByCategory;
  }

  let { walletsByCategory }: Props = $props();
</script>

<div class="wallets-section">
  {#each Object.entries(walletsByCategory) as [category, wallets]}
    {#if wallets.length > 0}
      <div class="wallet-category">
        <h4 class="category-title">{category}</h4>
        <div class="wallets-grid">
          {#each wallets as wallet}
            <a href={wallet.url} target="_blank" class="wallet-item">
              {#if wallet.logo}
                <img src={wallet.logo} alt={wallet.name} class="wallet-logo" />
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
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
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

  .wallet-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 1024px) {
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

    .wallet-logo {
      width: 20px;
      height: 20px;
    }

    .wallet-icon {
      font-size: 0.875rem;
    }
  }
</style>