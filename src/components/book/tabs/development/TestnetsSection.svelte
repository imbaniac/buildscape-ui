<script lang="ts">
  interface TestnetInfo {
    name: string;
    chainId?: number;
    url?: string;
    description?: string;
    faucets?: string[];
    rpcs?: string[];
  }

  interface Props {
    testnets: (TestnetInfo | string)[];
  }

  let { testnets = [] }: Props = $props();
  
  let copiedRpc = $state<string | null>(null);
  
  async function copyTestnetRpc(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      copiedRpc = url;
      setTimeout(() => {
        copiedRpc = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
  
  async function addTestnetToWallet(testnet: TestnetInfo) {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet like MetaMask');
      return;
    }
    
    if (!testnet.chainId) {
      alert('Chain ID is missing for this testnet');
      return;
    }
    
    if (!testnet.rpcs || testnet.rpcs.length === 0) {
      alert('No RPC endpoints available for this testnet');
      return;
    }
    
    try {
      const chainIdHex = '0x' + testnet.chainId.toString(16);
      
      // Try to switch to the network first
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        alert(`Switched to ${testnet.name}`);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Get the first RPC URL from the testnet data
          const rpcUrl = testnet.rpcs[0];
          
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chainIdHex,
                chainName: testnet.name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: testnet.url ? [testnet.url] : []
              }],
            });
            alert(`${testnet.name} has been added to your wallet`);
          } catch (addError: any) {
            if (addError.code === 4001) {
              // User rejected the request
              console.log('User rejected adding the network');
            } else {
              console.error('Failed to add network:', addError);
              alert('Failed to add network to wallet');
            }
          }
        } else if (switchError.code === 4001) {
          // User rejected the switch request
          console.log('User rejected switching network');
        } else {
          console.error('Failed to switch network:', switchError);
          alert('Failed to switch network');
        }
      }
    } catch (err) {
      console.error('Failed to add testnet:', err);
      alert('An unexpected error occurred');
    }
  }
  
  // Extract faucet name from URL
  function getFaucetName(url: string): string {
    try {
      const domain = new URL(url).hostname;
      
      // Special cases for known faucets
      if (domain.includes('alchemy.com')) return 'Alchemy';
      if (domain.includes('chain.link')) return 'Chainlink';
      if (domain.includes('quicknode.com')) return 'QuickNode';
      if (domain.includes('pk910.de')) return 'pk910';
      if (domain.includes('getblock.io')) return 'GetBlock';
      if (domain.includes('cloud.google.com')) return 'Google Cloud';
      if (domain.includes('learnweb3.io')) return 'LearnWeb3';
      if (domain.includes('faucet.omni.network')) return 'Omni Network';
      if (domain.includes('tokentool.bitbond.com')) return 'Bitbond';
      if (domain.includes('l2faucet.com')) return 'L2 Faucet';
      if (domain.includes('chainstack.com')) return 'Chainstack';
      if (domain.includes('circle.com')) return 'Circle';
      if (domain.includes('formo.so')) return 'Formo';
      if (domain.includes('triangle')) return 'Triangle';
      
      // Generic extraction
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return 'Faucet';
    }
  }
</script>

<div class="testnets-modern">
  {#each testnets as testnet}
    {@const testnetInfo = typeof testnet === 'string' ? { name: testnet } : testnet}
    <div class="testnet-card">
      <!-- Header with name and chain ID -->
      <div class="testnet-header">
        <div class="testnet-title">
          <h4 class="testnet-name">{testnetInfo.name}</h4>
          {#if testnetInfo.chainId}
            <span class="testnet-chainid">Chain ID: {testnetInfo.chainId}</span>
          {/if}
        </div>
        <div class="testnet-actions">
          {#if testnetInfo.url}
            <a href={testnetInfo.url} target="_blank" class="explorer-btn">
              <svg class="explorer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Explorer</span>
            </a>
          {/if}
          <button 
            class="wallet-btn"
            title="Add to wallet"
            onclick={() => addTestnetToWallet(testnetInfo)}
            disabled={!testnetInfo.chainId}
          >
            <svg class="wallet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="7" width="18" height="13" rx="2"/>
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <circle cx="16" cy="13" r="1" fill="currentColor"/>
            </svg>
            <span>Add to Wallet</span>
          </button>
        </div>
      </div>
      
      <!-- Description if available -->
      {#if testnetInfo.description}
        <p class="testnet-desc">{testnetInfo.description}</p>
      {/if}
      
      <!-- Faucets Section -->
      {#if testnetInfo.faucets && testnetInfo.faucets.length > 0}
        <div class="testnet-section">
          <h5 class="section-label">
            <span class="section-icon">💧</span>
            Get Test Tokens
          </h5>
          <div class="faucet-pills">
            {#each testnetInfo.faucets.slice(0, 4) as faucetUrl}
              <a href={faucetUrl} target="_blank" class="faucet-pill">
                {getFaucetName(faucetUrl)}
              </a>
            {/each}
            {#if testnetInfo.faucets.length > 4}
              <div class="more-faucets">
                <button class="more-btn">+{testnetInfo.faucets.length - 4} more</button>
                <div class="more-menu">
                  {#each testnetInfo.faucets.slice(4) as faucetUrl}
                    <a href={faucetUrl} target="_blank" class="faucet-item">
                      {getFaucetName(faucetUrl)}
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
      
      <!-- RPCs Section -->
      {#if testnetInfo.rpcs && testnetInfo.rpcs.length > 0}
        <div class="testnet-section">
          <h5 class="section-label">
            <span class="section-icon">🔗</span>
            RPC Endpoints
          </h5>
          <div class="testnet-rpcs">
            {#each testnetInfo.rpcs as rpcUrl}
              <div class="testnet-rpc-card">
                <code class="testnet-rpc-url">{rpcUrl}</code>
                <button 
                  class="rpc-copy-btn"
                  onclick={() => copyTestnetRpc(rpcUrl)}
                  title="Copy RPC URL"
                >
                  {#if copiedRpc === rpcUrl}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  {:else}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  {/if}
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  /* Modern Testnets Design */
  .testnets-modern {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    overflow-x: hidden;
    padding: 0.25rem 0;
  }
  
  .testnet-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1.5rem;
    transition: all 0.2s ease;
    overflow: hidden;
  }
  
  .testnet-card:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
  }
  
  .testnet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .testnet-title {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;
    flex: 1;
  }
  
  .testnet-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .testnet-chainid {
    display: inline-flex;
    align-items: center;
    font-size: 0.8125rem;
    color: #64748b;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    font-weight: 500;
  }
  
  .testnet-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-shrink: 0;
  }
  
  .explorer-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    text-decoration: none;
  }
  
  .explorer-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
  }
  
  .explorer-icon {
    width: 16px;
    height: 16px;
  }
  
  .wallet-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .wallet-btn:hover:not(:disabled) {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }
  
  .wallet-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .wallet-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .wallet-icon {
    width: 16px;
    height: 16px;
  }
  
  .testnet-desc {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 1.25rem 0;
    line-height: 1.5;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  /* Sections */
  .testnet-section {
    margin-top: 1.25rem;
  }
  
  .testnet-section:first-of-type {
    margin-top: 0;
  }
  
  .section-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .section-icon {
    font-size: 1rem;
  }
  
  .faucet-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }
  
  .faucet-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    transition: all 0.15s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .faucet-pill:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
  }
  
  .more-faucets {
    position: relative;
    display: inline-flex;
  }
  
  .more-btn {
    padding: 0.5rem 0.875rem;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .more-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }
  
  .more-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04);
    min-width: 180px;
    max-height: 240px;
    overflow-y: auto;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: all 0.2s ease;
  }
  
  .more-faucets:hover .more-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .more-menu .faucet-item {
    display: block;
    padding: 0.625rem 1rem;
    color: #475569;
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.15s ease;
    border-bottom: 1px solid #f1f5f9;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .more-menu .faucet-item:last-child {
    border-bottom: none;
  }
  
  .more-menu .faucet-item:hover {
    background: #f8fafc;
    color: #1e293b;
  }
  
  /* RPC Section */
  .testnet-rpcs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .testnet-rpc-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.625rem 0.875rem;
    transition: all 0.15s ease;
    min-width: 0;
  }
  
  .testnet-rpc-card:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  .testnet-rpc-url {
    font-size: 0.75rem;
    color: #475569;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
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
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }
  
  .rpc-copy-btn:active {
    transform: scale(0.9);
  }
  
  .rpc-copy-btn svg {
    transition: color 0.15s ease;
  }

  @media (max-width: 640px) {
    .testnets-modern {
      gap: 1rem;
    }

    .testnet-card {
      padding: 1rem;
    }

    .testnet-header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }

    .testnet-name {
      font-size: 1rem;
    }

    .testnet-chainid {
      font-size: 0.75rem;
    }

    .testnet-actions {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .explorer-btn,
    .wallet-btn {
      justify-content: center;
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
    }

    .explorer-icon,
    .wallet-icon {
      width: 14px;
      height: 14px;
    }

    .testnet-desc {
      font-size: 0.8125rem;
      margin-bottom: 1rem;
    }

    .testnet-section {
      margin-top: 1rem;
    }

    .section-label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .section-icon {
      font-size: 0.875rem;
    }

    .faucet-pills {
      gap: 0.5rem;
    }

    .faucet-pill {
      font-size: 0.75rem;
      padding: 0.25rem 0.625rem;
    }

    .more-btn {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }

    .testnet-rpc-card {
      padding: 0.5rem 0.75rem;
      gap: 0.5rem;
    }

    .testnet-rpc-url {
      font-size: 0.6875rem;
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