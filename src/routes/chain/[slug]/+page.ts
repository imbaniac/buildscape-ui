import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import YAML from 'yaml';

const chainMdModules = import.meta.glob('/src/data/chains/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const chainTsModules = import.meta.glob('/src/data/chains/*.ts');

const logoAssets = import.meta.glob('/src/lib/assets/chains/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

function resolveLogoUrl(logoFilename: string): string | undefined {
  for (const path in logoAssets) {
    if (path.endsWith('/' + logoFilename)) {
      return logoAssets[path] as string;
    }
  }
  return undefined;
}

function parseFrontmatterAndContent(raw: string): {
  frontmatter: any;
  content: string;
} {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw);
  if (match) {
    const frontmatter = YAML.parse(match[1]);
    const content = match[2].trim();
    return { frontmatter, content };
  }
  return { frontmatter: {}, content: raw.trim() };
}

export const load: PageLoad = async ({ params, url }) => {
  const { slug } = params;
  const mdPath = `/src/data/chains/${slug}.md`;
  
  if (!chainMdModules[mdPath]) {
    throw error(404, `Chain ${slug} not found`);
  }

  const raw = chainMdModules[mdPath] as string;
  const { frontmatter, content } = parseFrontmatterAndContent(raw);
  
  let logoUrl = undefined;
  if (frontmatter.logo) {
    logoUrl = resolveLogoUrl(frontmatter.logo);
  }

  const chainStatic = {
    ...frontmatter,
    logoUrl,
    description: content,
    name: frontmatter.name || slug,
  };

  // Get dynamic loader if available
  const tsPath = `/src/data/chains/${slug}.ts`;
  let dynamicLoader = null;
  if (chainTsModules[tsPath]) {
    const mod = await chainTsModules[tsPath]();
    dynamicLoader = (mod as any).default;
  }

  // Get URL parameters
  const tab = url.searchParams.get('tab') || (chainStatic.bookmarks?.[0] || 'Overview');
  const span = url.searchParams.get('span') || '24h';

  return {
    slug,
    chainStatic,
    dynamicLoader,
    initialTab: tab,
    initialSpan: span as '1h' | '24h' | '7d' | '30d',
  };
};