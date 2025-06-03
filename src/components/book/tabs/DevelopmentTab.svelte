<script lang="ts">
  import type { BookmarkTab, BookmarkField } from '$lib/types';
  
  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
  }
  
  let { chainStatic, bookmarks, activeTab, onTabChange }: Props = $props();
  
  let copiedUrl = $state<string | null>(null);
  let copiedRpc = $state<string | null>(null);
  
  const developmentTab = $derived(bookmarks.find((g: BookmarkTab) => g.id === 'development'));
  const activeField = $derived(
    developmentTab?.fields.find((f: BookmarkField) => f.field === activeTab) || 
    developmentTab?.fields[0]
  );
  
  async function copyRpcUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      copiedUrl = url;
      setTimeout(() => {
        copiedUrl = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
  
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
  
  async function addTestnetToWallet(testnet: any) {
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

{#if activeField}
  <div class="subtabs">
    {#each developmentTab?.fields || [] as field}
      <button
        class="subtab-button"
        class:active={activeTab === field.field || (activeTab === 'development' && field === activeField)}
        onclick={() => onTabChange(field.field)}
      >
        {field.label}
      </button>
    {/each}
  </div>
  
  {#if activeField.field === 'rpcs' && chainStatic.rpcs}
    {@const isNewFormat = Array.isArray(chainStatic.rpcs)}
    {@const officialRpcs = isNewFormat ? chainStatic.rpcs.filter((rpc: any) => rpc.type === 'official') : []}
    {@const publicRpcs = isNewFormat ? chainStatic.rpcs.filter((rpc: any) => rpc.type === 'public') : []}
    {@const privateRpcs = isNewFormat ? chainStatic.rpcs.filter((rpc: any) => rpc.type === 'private') : []}
    
    <div class="rpc-modern">
      {#if officialRpcs.length}
        <div class="rpc-section">
          <h4 class="rpc-section-title">
            <span class="section-icon">⭐</span>
            Official RPCs
          </h4>
          <div class="rpc-cards-grid">
            {#each officialRpcs as rpc}
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
      
      {#if publicRpcs.length}
        <div class="rpc-section">
          <h4 class="rpc-section-title">
            <span class="section-icon">🌐</span>
            Public RPCs
          </h4>
          <div class="rpc-cards-grid">
            {#each publicRpcs as rpc}
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
      
      {#if privateRpcs.length}
        <div class="rpc-section">
          <h4 class="rpc-section-title">
            <span class="section-icon">🔒</span>
            Private RPCs <span class="section-note">(API Key Required)</span>
          </h4>
          <div class="rpc-cards-grid">
            {#each privateRpcs as rpc}
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
  {:else if activeField.field === 'testnets'}
    <div class="testnets-modern">
      {#each chainStatic.testnets || [] as testnet}
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
          {#if testnetInfo.faucets?.length > 0}
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
          {#if testnetInfo.rpcs?.length > 0}
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
  {:else if activeField.field === 'sdks' || activeField.field === 'tools'}
    <div class="dev-resources">
      {#if !chainStatic[activeField.field] || chainStatic[activeField.field].length === 0}
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <p>No {activeField.field === 'sdks' ? 'SDKs' : 'tools'} available for this chain.</p>
        </div>
      {:else}
        {#each chainStatic[activeField.field] as item}
          <a href={item.url} target="_blank" class="dev-resource-card" class:official={item.source === 'official'}>
            <div class="resource-content">
              <div class="resource-header">
                <div class="resource-name-wrapper">
                  <h4 class="resource-name">{item.name}</h4>
                  {#if item.type}
                    <span class="resource-type" data-type={item.type.toLowerCase().replace('/', '-').replace('.', '')}>{item.type}</span>
                  {/if}
                </div>
                <svg class="resource-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17L17 7"/>
                  <path d="M7 7h10v10"/>
                </svg>
              </div>
              {#if item.description}
                <p class="resource-desc">{item.description}</p>
              {/if}
            </div>
          </a>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="links-list">
      {#each chainStatic[activeField.field] || [] as link}
        {#if typeof link === 'string'}
          <a href={link} target="_blank" class="link-item">
            <span class="link-icon">{activeField.icon}</span>
            <span>{link}</span>
          </a>
        {:else}
          <a href={link.url} target="_blank" class="link-item">
            <span class="link-icon">{activeField.icon}</span>
            <span>{link.name}</span>
          </a>
        {/if}
      {/each}
    </div>
  {/if}
{/if}

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
  
  .subtabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .subtab-button {
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .subtab-button:hover {
    background: #f1f5f9;
    color: #475569;
  }

  .subtab-button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

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
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
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
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
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

  /* Dev Resources (SDKs & Tools) */
  .dev-resources {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dev-resource-card {
    display: block;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
    position: relative;
  }

  .dev-resource-card:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }

  .dev-resource-card.official {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  }

  .dev-resource-card.official:hover {
    border-color: #f59e0b;
  }

  .resource-content {
    padding: 0.875rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .resource-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .resource-name-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .resource-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .official-badge {
    display: none;
  }

  .resource-desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .resource-type {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: #f8fafc;
    color: #64748b;
    border-radius: 4px;
    font-size: 0.6875rem;
    font-weight: 500;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    flex-shrink: 0;
  }
  
  /* Type-specific colors - subtle variations */
  .resource-type[data-type="js-ts"] {
    background: #fffbeb;
    color: #78350f;
  }
  
  .resource-type[data-type="python"] {
    background: #eff6ff;
    color: #1e40af;
  }
  
  .resource-type[data-type="rust"] {
    background: #fff7ed;
    color: #7c2d12;
  }
  
  .resource-type[data-type="go"] {
    background: #ecfdf5;
    color: #047857;
  }
  
  .resource-type[data-type="java"] {
    background: #fdf4ff;
    color: #6b21a8;
  }
  
  .resource-type[data-type="net"] {
    background: #f3f4f6;
    color: #4b5563;
  }
  
  .resource-type[data-type="react"] {
    background: #ecfeff;
    color: #0e7490;
  }
  
  .resource-type[data-type="free"],
  .resource-type[data-type="free-tier"] {
    background: #f0fdf4;
    color: #166534;
  }
  
  .resource-type[data-type="documentation"] {
    background: #f8fafc;
    color: #64748b;
  }

  .resource-arrow {
    color: #cbd5e1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .dev-resource-card:hover .resource-arrow {
    color: #64748b;
    transform: translate(1px, -1px);
  }
  
  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    color: #94a3b8;
  }
  
  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  
  .empty-state p {
    font-size: 0.9375rem;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s;
    font-size: 0.9375rem;
    line-height: 1.5;
    font-weight: 450;
  }

  a.link-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .link-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
</style>