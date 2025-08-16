import type { PageLoad } from './$types';
import { parseFrontmatterAndContent } from '$lib/utils/markdown';

export const load: PageLoad = async () => {
  // Import all chain markdown files
  const chainMdModules = import.meta.glob('/data/chains/*.md', {
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
  
  // Load and process chain data
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
  
  return {
    chains
  };
};