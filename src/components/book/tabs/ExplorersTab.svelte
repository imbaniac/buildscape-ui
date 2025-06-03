<script lang="ts">
  interface Explorer {
    name: string;
    url: string;
    type?: 'official' | 'alternative' | 'analytics';
  }
  
  interface Props {
    chainStatic: any;
  }

  let { chainStatic }: Props = $props();
  
  // Process explorers - ensure type is set
  function normalizeExplorers(explorers: any[]): Explorer[] {
    if (!explorers || explorers.length === 0) return [];
    
    return explorers.map(explorer => ({
      ...explorer,
      type: explorer.type || detectExplorerType(explorer.url)
    }));
  }
  
  // Get display name from domain
  function getExplorerName(domain: string): string {
    const knownExplorers: Record<string, string> = {
      'etherscan.io': 'Etherscan',
      'arbiscan.io': 'Arbiscan',
      'basescan.org': 'Basescan',
      'polygonscan.com': 'PolygonScan',
      'zkevm.polygonscan.com': 'PolygonScan zkEVM',
      'optimistic.etherscan.io': 'Optimism Etherscan',
      'blockscout.com': 'Blockscout',
      'arbitrum.blockscout.com': 'Blockscout',
      'nova.arbiscan.io': 'NovaScout',
      'era.zksync.network': 'Etherscan',
      'dexscreener.com': 'DexScreener',
      'oklink.com': 'OKLink',
      'dex.guru': 'DEX Guru',
      'dexguru.com': 'DEX Guru',
      'explorer.zksync.io': 'zkSync Explorer',
      'unichainscan.com': 'UnichainScan',
      'uniscan.xyz': 'UnichainScan',
      'unichain.blockscout.com': 'Blockscout',
      'celoscan.io': 'Celoscan',
      'avascan.info': 'Avascan',
      'snowtrace.io': 'Snowtrace',
      'bscscan.com': 'BscScan',
      'ftmscan.com': 'FTMScan',
      'moonscan.io': 'Moonscan',
      'gnosisscan.io': 'GnosisScan'
    };
    
    // Check if domain contains any known explorer
    for (const [key, name] of Object.entries(knownExplorers)) {
      if (domain.includes(key)) return name;
    }
    
    // Fallback to formatted domain
    return domain
      .split('.')[0]
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Detect explorer type based on URL
  function detectExplorerType(url: string): 'official' | 'alternative' | 'analytics' {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Official explorers
    if (domain.includes('etherscan.io') || 
        domain.includes('arbiscan.io') ||
        domain.includes('basescan.org') ||
        domain.includes('polygonscan.com') ||
        domain.includes('optimistic.etherscan.io') ||
        domain.includes('explorer.zksync.io') ||
        domain.includes('unichainscan.com') ||
        domain.includes('uniscan.xyz')) {
      return 'official';
    }
    
    // Analytics platforms
    if (domain.includes('dex.guru') || 
        domain.includes('dexguru') ||
        domain.includes('dune.com') ||
        domain.includes('nansen.ai')) {
      return 'analytics';
    }
    
    return 'alternative';
  }
  
  // Get icon for explorer type
  function getExplorerIcon(name: string, type: string): string {
    // Specific explorer icons
    if (name.toLowerCase().includes('dex')) return '📊';
    if (name.toLowerCase().includes('oklink')) return '🔗';
    
    // Type-based icons
    switch (type) {
      case 'official': return '⭐';
      case 'analytics': return '📊';
      default: return '🔍';
    }
  }
  
  // Get explorer logo/avatar style
  function getExplorerStyle(name: string): { background: string; color: string } {
    const lowerName = name.toLowerCase();
    
    // Etherscan family
    if (lowerName.includes('etherscan') || 
        lowerName.includes('arbiscan') || 
        lowerName.includes('basescan') ||
        lowerName.includes('polygonscan') ||
        lowerName.includes('optimism etherscan')) {
      return { background: '#21325B', color: '#FFFFFF' };
    }
    
    // Blockscout
    if (lowerName.includes('blockscout')) {
      return { background: '#5C68F7', color: '#FFFFFF' };
    }
    
    // OKLink
    if (lowerName.includes('oklink')) {
      return { background: '#000000', color: '#FFFFFF' };
    }
    
    // DEX Guru
    if (lowerName.includes('dex guru') || lowerName.includes('dexguru')) {
      return { background: '#0ECB81', color: '#FFFFFF' };
    }
    
    // zkSync
    if (lowerName.includes('zksync')) {
      return { background: '#8C8DFC', color: '#FFFFFF' };
    }
    
    // Unichain
    if (lowerName.includes('unichain') || lowerName.includes('uniscan')) {
      return { background: '#FF007A', color: '#FFFFFF' };
    }
    
    // Default gradient
    const colors = [
      { background: '#3B82F6', color: '#FFFFFF' }, // Blue
      { background: '#8B5CF6', color: '#FFFFFF' }, // Purple
      { background: '#EC4899', color: '#FFFFFF' }, // Pink
      { background: '#F59E0B', color: '#FFFFFF' }, // Amber
      { background: '#10B981', color: '#FFFFFF' }, // Emerald
    ];
    
    // Use name hash to consistently assign colors
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  
  const explorers = normalizeExplorers(chainStatic.blockscanners || []);
  const officialExplorers = explorers.filter(e => e.type === 'official');
  const alternativeExplorers = explorers.filter(e => e.type === 'alternative');
  const analyticsExplorers = explorers.filter(e => e.type === 'analytics');
</script>

<div class="explorers-modern">
  {#if officialExplorers.length > 0}
    <div class="explorer-section">
      <h4 class="section-title">
        <span class="section-icon">⭐</span>
        Official Explorers
      </h4>
      <div class="explorer-cards">
        {#each officialExplorers as explorer}
          {@const style = getExplorerStyle(explorer.name)}
          <a href={explorer.url} target="_blank" class="explorer-card official">
            <div class="explorer-logo" style="background: {style.background}; color: {style.color};">
              {explorer.name.slice(0, 2).toUpperCase()}
            </div>
            <div class="explorer-info">
              <h5 class="explorer-name">{explorer.name}</h5>
              <span class="explorer-url">{new URL(explorer.url).hostname}</span>
            </div>
            <svg class="explorer-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if alternativeExplorers.length > 0}
    <div class="explorer-section">
      <h4 class="section-title">
        <span class="section-icon">🔍</span>
        Alternative Explorers
      </h4>
      <div class="explorer-cards">
        {#each alternativeExplorers as explorer}
          {@const style = getExplorerStyle(explorer.name)}
          <a href={explorer.url} target="_blank" class="explorer-card">
            <div class="explorer-logo" style="background: {style.background}; color: {style.color};">
              {explorer.name.slice(0, 2).toUpperCase()}
            </div>
            <div class="explorer-info">
              <h5 class="explorer-name">{explorer.name}</h5>
              <span class="explorer-url">{new URL(explorer.url).hostname}</span>
            </div>
            <svg class="explorer-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if analyticsExplorers.length > 0}
    <div class="explorer-section">
      <h4 class="section-title">
        <span class="section-icon">📊</span>
        Analytics Platforms
      </h4>
      <div class="explorer-cards">
        {#each analyticsExplorers as explorer}
          {@const style = getExplorerStyle(explorer.name)}
          <a href={explorer.url} target="_blank" class="explorer-card analytics">
            <div class="explorer-logo" style="background: {style.background}; color: {style.color};">
              {explorer.name.slice(0, 2).toUpperCase()}
            </div>
            <div class="explorer-info">
              <h5 class="explorer-name">{explorer.name}</h5>
              <span class="explorer-url">{new URL(explorer.url).hostname}</span>
            </div>
            <svg class="explorer-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if explorers.length === 0}
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <p>No explorers available for this chain.</p>
    </div>
  {/if}
</div>

<style>
  /* Modern Explorers Design */
  .explorers-modern {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .explorer-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-title {
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
  
  /* Explorer Cards */
  .explorer-cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .explorer-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
    position: relative;
  }
  
  .explorer-card:hover {
    transform: translateX(2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
  }
  
  .explorer-card.official {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  }
  
  .explorer-card.official:hover {
    border-color: #f59e0b;
  }
  
  .explorer-card.analytics {
    border-color: #a78bfa;
    background: linear-gradient(135deg, #f3f4ff 0%, #ffffff 100%);
  }
  
  .explorer-card.analytics:hover {
    border-color: #8b5cf6;
  }
  
  /* Explorer Logo */
  .explorer-logo {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.15s ease;
  }
  
  .explorer-card:hover .explorer-logo {
    transform: scale(1.05);
  }
  
  /* Explorer Info */
  .explorer-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .explorer-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .explorer-url {
    font-size: 0.75rem;
    color: #64748b;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Arrow Icon */
  .explorer-arrow {
    color: #cbd5e1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  
  .explorer-card:hover .explorer-arrow {
    color: #64748b;
    transform: translate(2px, -2px);
  }
  
  /* Empty State */
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
  
  /* Responsive */
  @media (max-width: 640px) {
    .explorer-card {
      padding: 0.875rem;
    }
    
    .explorer-logo {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 0.75rem;
    }
    
    .explorer-name {
      font-size: 0.875rem;
    }
  }
</style>