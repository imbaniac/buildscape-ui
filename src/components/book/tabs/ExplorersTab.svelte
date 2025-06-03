<script lang="ts">
  interface Props {
    chainStatic: any;
  }

  let { chainStatic }: Props = $props();
  
  // Get display name and URL from explorer data
  function getExplorerInfo(explorer: string | { name: string; url: string }): { name: string; url: string } {
    if (typeof explorer === 'string') {
      // Legacy format - extract domain name
      try {
        const domain = new URL(explorer).hostname;
        return { name: domain.replace('www.', ''), url: explorer };
      } catch {
        return { name: explorer, url: explorer };
      }
    }
    return explorer;
  }
  
  // Get initials from name
  function getInitials(name: string): string {
    // Special cases for known explorers
    if (name.toLowerCase().includes('etherscan')) return 'ES';
    if (name.toLowerCase().includes('arbiscan')) return 'AS';
    if (name.toLowerCase().includes('polygonscan')) return 'PS';
    if (name.toLowerCase().includes('basescan')) return 'BS';
    if (name.toLowerCase().includes('blockscout')) return 'BS';
    if (name.toLowerCase().includes('oklink')) return 'OK';
    if (name.toLowerCase().includes('dex.guru') || name.toLowerCase().includes('dexguru')) return 'DG';
    if (name.toLowerCase().includes('explorer')) return 'EX';
    
    // Default: take first letters of words
    const words = name.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  // Get color based on name
  function getExplorerColor(name: string): { bg: string; text: string } {
    const lowerName = name.toLowerCase();
    
    // Assign colors based on explorer
    if (lowerName.includes('etherscan') || lowerName.includes('arbiscan') || lowerName.includes('polygonscan') || lowerName.includes('basescan')) {
      return { bg: '#21325B', text: '#FFFFFF' };
    }
    if (lowerName.includes('blockscout')) {
      return { bg: '#5C68F7', text: '#FFFFFF' };
    }
    if (lowerName.includes('oklink')) {
      return { bg: '#000000', text: '#FFFFFF' };
    }
    if (lowerName.includes('dex.guru') || lowerName.includes('dexguru')) {
      return { bg: '#0ECB81', text: '#FFFFFF' };
    }
    // Default gray
    return { bg: '#6B7280', text: '#FFFFFF' };
  }
</script>

<div class="explorers-grid">
  {#each chainStatic.blockscanners || [] as explorer}
    {@const info = getExplorerInfo(explorer)}
    {@const colors = getExplorerColor(info.name)}
    <a 
      href={info.url} 
      target="_blank" 
      class="explorer-tile"
    >
      <div class="explorer-icon" style="background-color: {colors.bg}; color: {colors.text};">
        {getInitials(info.name)}
      </div>
      <span class="explorer-name">{info.name}</span>
    </a>
  {/each}
</div>

<style>
  .explorers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .explorer-tile {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    text-decoration: none;
    color: #374151;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .explorer-tile:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: #fafbfc;
  }

  .explorer-tile:hover .explorer-icon {
    transform: scale(1.05);
  }

  .explorer-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    transition: transform 0.3s ease;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .explorer-name {
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: #1f2937;
  }

  @media (max-width: 768px) {
    .explorers-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .explorer-tile {
      padding: 1rem;
    }
    
    .explorer-icon {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 0.875rem;
    }
    
    .explorer-name {
      font-size: 0.875rem;
    }
  }
</style>