<script lang="ts">
  interface Props {
    type?: 'metrics' | 'wallets' | 'details';
    class?: string;
  }

  let { type = 'details', class: className = '' }: Props = $props();
</script>

<div class="skeleton-loader {type} {className}">
  {#if type === 'metrics'}
    <div class="skeleton-metrics">
      <div class="skeleton-chart">
        <div class="skeleton-line" style="width: 100%; height: 200px;"></div>
      </div>
      <div class="skeleton-legend">
        <div class="skeleton-line" style="width: 60%;"></div>
        <div class="skeleton-line" style="width: 40%;"></div>
      </div>
    </div>
  {:else if type === 'wallets'}
    <div class="skeleton-wallets">
      {#each Array(3) as _}
        <div class="skeleton-wallet-category">
          <div class="skeleton-line" style="width: 120px; height: 24px; margin-bottom: 12px;"></div>
          <div class="skeleton-wallet-grid">
            {#each Array(4) as _}
              <div class="skeleton-wallet-item">
                <div class="skeleton-circle"></div>
                <div class="skeleton-line" style="width: 80px;"></div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="skeleton-details">
      <div class="skeleton-line" style="width: 80%; height: 24px; margin-bottom: 16px;"></div>
      <div class="skeleton-line" style="width: 100%;"></div>
      <div class="skeleton-line" style="width: 100%;"></div>
      <div class="skeleton-line" style="width: 75%;"></div>
      <div class="skeleton-line" style="width: 90%; margin-top: 16px;"></div>
      <div class="skeleton-line" style="width: 85%;"></div>
    </div>
  {/if}
</div>

<style>
  .skeleton-loader {
    padding: 1rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .skeleton-line {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    height: 16px;
    margin-bottom: 8px;
  }

  .skeleton-circle {
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 50%;
  }

  .skeleton-chart {
    margin-bottom: 1rem;
  }

  .skeleton-wallet-category {
    margin-bottom: 2rem;
  }

  .skeleton-wallet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .skeleton-wallet-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
</style>