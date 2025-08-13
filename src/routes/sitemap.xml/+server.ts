import type { RequestHandler } from './$types';
import { parseFrontmatterAndContent } from '$lib/utils/markdown';

// Import all chain markdown files
const chainMdModules = import.meta.glob('/data/chains/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export const GET: RequestHandler = async ({ url }) => {
  const baseUrl = 'https://buildscape.org';
  
  // Get all chains
  const chains: { slug: string; chainId: number; priority: number; lastMod?: string }[] = [];
  
  for (const path in chainMdModules) {
    const raw = chainMdModules[path] as string;
    const { frontmatter } = parseFrontmatterAndContent(raw);
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    if (slug && frontmatter.chainId) {
      // Higher priority for major chains by TVL/usage
      const majorChains = ['ethereum', 'base', 'arbitrum_one', 'optimism', 'polygon_pos', 'bnb_smart_chain'];
      const secondaryChains = ['avalanche', 'polygon_zkevm', 'scroll', 'mantle', 'linea'];
      
      let priority = 0.6; // default for other chains
      if (majorChains.includes(slug)) {
        priority = 0.9;
      } else if (secondaryChains.includes(slug)) {
        priority = 0.8;
      }
      
      chains.push({
        slug,
        chainId: frontmatter.chainId,
        priority,
        lastMod: frontmatter.lastUpdated || undefined
      });
    }
  }
  
  // Define all pages with their properties
  const pages: Array<{
    url: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    lastMod?: string;
  }> = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/chains', changefreq: 'daily', priority: 0.9 },
    { url: '/map', changefreq: 'daily', priority: 0.8 },
  ];
  
  // Add all chain pages with their tab routes
  chains.forEach(chain => {
    // Overview page (main chain page)
    pages.push({
      url: `/chain/${chain.slug}/overview`,
      changefreq: 'hourly',
      priority: chain.priority * 0.9, // Slightly lower than RPC for overview
      lastMod: chain.lastMod
    });
    
    // Development - RPC page (highest priority for search)
    pages.push({
      url: `/chain/${chain.slug}/development/rpcs`,
      changefreq: 'daily',
      priority: chain.priority, // Keep original high priority for RPC pages
      lastMod: chain.lastMod
    });
    
    // Development - Testnets
    pages.push({
      url: `/chain/${chain.slug}/development/testnets`,
      changefreq: 'weekly',
      priority: chain.priority * 0.8,
      lastMod: chain.lastMod
    });
    
    // Development - SDKs
    pages.push({
      url: `/chain/${chain.slug}/development/sdks`,
      changefreq: 'weekly',
      priority: chain.priority * 0.8,
      lastMod: chain.lastMod
    });
    
    // Development - Tools
    pages.push({
      url: `/chain/${chain.slug}/development/tools`,
      changefreq: 'weekly',
      priority: chain.priority * 0.8,
      lastMod: chain.lastMod
    });
    
    // Explorers page
    pages.push({
      url: `/chain/${chain.slug}/explorers`,
      changefreq: 'weekly',
      priority: chain.priority * 0.85,
      lastMod: chain.lastMod
    });
    
    // Wallets page
    pages.push({
      url: `/chain/${chain.slug}/wallets`,
      changefreq: 'weekly',
      priority: chain.priority * 0.85,
      lastMod: chain.lastMod
    });
    
    // Resources page
    pages.push({
      url: `/chain/${chain.slug}/resources`,
      changefreq: 'monthly',
      priority: chain.priority * 0.7,
      lastMod: chain.lastMod
    });
  });
  
  // Sort pages by priority (highest first)
  pages.sort((a, b) => b.priority - a.priority);
  
  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => {
    // Use page-specific lastMod if available, otherwise use current date
    const lastMod = page.lastMod || new Date().toISOString();
    
    // Add image sitemap for chain pages that have logos
    const isChainPage = page.url.startsWith('/chain/');
    const imageTag = isChainPage ? `
    <image:image>
      <image:loc>${baseUrl}/og${page.url}.png</image:loc>
      <image:title>${page.url.split('/').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Blockchain</image:title>
    </image:image>` : '';
    
    return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${lastMod}</lastmod>${imageTag}
  </url>`;
  }).join('\n')}
</urlset>`;
  
  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      'X-Robots-Tag': 'noarchive'
    }
  });
};