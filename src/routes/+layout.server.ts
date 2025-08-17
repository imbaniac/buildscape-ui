import type { LayoutServerLoad } from './$types';
import { parseFrontmatterAndContent } from '$lib/utils/markdown';
import type { WalletsByCategory } from '$lib/types';

// Import all markdown files at build time
const chainMdModules = import.meta.glob('/data/chains/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

const walletsModule = import.meta.glob('/data/wallets.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

const evmCommonModule = import.meta.glob('/data/evm-common.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

// Import logo assets
const logoAssets = import.meta.glob('/assets/chains/*', {
  eager: true,
  query: '?url',
  import: 'default'
});

// Helper to resolve logo URL
function resolveLogoUrl(logoFilename: string): string | undefined {
  for (const path in logoAssets) {
    if (path.endsWith('/' + logoFilename)) {
      return logoAssets[path] as string;
    }
  }
  return undefined;
}

// Parse all chains once on server startup
const parsedChains = (() => {
  const chains: Record<string, any> = {};
  
  for (const path in chainMdModules) {
    const raw = chainMdModules[path] as string;
    if (!raw) continue;
    
    const { frontmatter, content } = parseFrontmatterAndContent(raw);
    const slug = path.split('/').pop()?.replace('.md', '');
    if (!slug) continue;
    
    let logoUrl = undefined;
    if (frontmatter.logo) {
      logoUrl = resolveLogoUrl(frontmatter.logo);
    }
    
    chains[slug] = {
      ...frontmatter,
      slug,
      logoUrl,
      description: content,
      name: frontmatter.name || slug
    };
  }
  
  return chains;
})();

// Parse wallets once on server startup
const parsedWallets = (() => {
  const walletsRaw = walletsModule['/data/wallets.md'] as string;
  if (!walletsRaw) return {};
  
  const lines = walletsRaw.split('\n');
  const walletsByCategory: WalletsByCategory = {};
  let currentCategory = '';
  let inTable = false;
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = line.substring(3).trim();
      walletsByCategory[currentCategory] = [];
      inTable = false;
    } else if (line.includes('|---')) {
      inTable = true;
    } else if (inTable && line.startsWith('|') && !line.includes('Name')) {
      const parts = line
        .split('|')
        .map((p) => p.trim())
        .filter((p) => p);
      if (parts.length >= 2) {
        const walletName = parts[0];
        walletsByCategory[currentCategory].push({
          name: walletName,
          url: parts[1],
          logo: undefined, // Will be loaded on client
        });
      }
    }
  }
  
  return walletsByCategory;
})();

// Parse EVM common data once on server startup
const parsedEvmCommon = (() => {
  const evmCommonRaw = evmCommonModule['/data/evm-common.md'] as string;
  if (!evmCommonRaw) return null;
  
  const { frontmatter } = parseFrontmatterAndContent(evmCommonRaw);
  return frontmatter;
})();

export const load: LayoutServerLoad = async () => {
  // Return all pre-parsed markdown data
  // This will be available to all routes via $page.data
  return {
    chains: parsedChains,
    wallets: parsedWallets,
    evmCommon: parsedEvmCommon
  };
};