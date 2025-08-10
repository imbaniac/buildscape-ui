import { error, redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import type { BookmarkTab } from "$lib/types";
import { parseFrontmatterAndContent } from "$lib/utils/markdown";

// Keep chain modules eager for now (they're small text files)
const chainMdModules = import.meta.glob("/data/chains/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Import the chain data loader factory
import { getDynamicDataFactory } from "$lib/utils/chainDataLoader";

// Keep logos eager (needed immediately for display)
const logoAssets = import.meta.glob("/assets/chains/*", {
  eager: true,
  query: "?url",
  import: "default",
});

// Keep bookmarks eager (small file)
const bookmarksModule = import.meta.glob("/data/bookmarks.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Keep EVM common eager (small file)
const evmCommonModule = import.meta.glob("/data/evm-common.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function resolveLogoUrl(logoFilename: string): string | undefined {
  for (const path in logoAssets) {
    if (path.endsWith("/" + logoFilename)) {
      return logoAssets[path] as string;
    }
  }
  return undefined;
}

function mergeEvmTools(
  chainStatic: any,
  evmCommonData: any,
  chainSlug: string,
): any {
  // If not an EVM chain, return as-is
  if (!chainStatic.technology?.isEVM) {
    return chainStatic;
  }

  // Parse common EVM SDKs and tools
  const commonSdks = evmCommonData.sdks || [];
  const commonTools = evmCommonData.tools || [];

  // Filter out items that exclude this chain
  const filterByChain = (item: any) => {
    if (!item.excludeChains) return true;
    return !item.excludeChains.includes(chainSlug);
  };

  // Mark common items as "common" source and filter by chain
  const markedCommonSdks = commonSdks.filter(filterByChain).map((sdk: any) => ({
    ...sdk,
    source: "common",
  }));

  const markedCommonTools = commonTools
    .filter(filterByChain)
    .map((tool: any) => ({
      ...tool,
      source: "common",
    }));

  // Chain-specific items take precedence
  const chainSdks = (chainStatic.sdks || []).map((sdk: any) => ({
    ...sdk,
    source: sdk.source || "chain",
  }));

  const chainTools = (chainStatic.tools || []).map((tool: any) => ({
    ...tool,
    source: tool.source || "chain",
  }));

  // Create maps for deduplication
  const sdkMap = new Map();
  const toolMap = new Map();

  // Add chain-specific items first (they take precedence)
  chainSdks.forEach((sdk: any) => {
    sdkMap.set(sdk.name.toLowerCase(), sdk);
  });
  chainTools.forEach((tool: any) => {
    toolMap.set(tool.name.toLowerCase(), tool);
  });

  // Add common items if not already present
  markedCommonSdks.forEach((sdk: any) => {
    const key = sdk.name.toLowerCase();
    if (!sdkMap.has(key)) {
      sdkMap.set(key, sdk);
    }
  });
  markedCommonTools.forEach((tool: any) => {
    const key = tool.name.toLowerCase();
    if (!toolMap.has(key)) {
      toolMap.set(key, tool);
    }
  });

  // Convert back to arrays, maintaining order: chain-specific first, then common
  const mergedSdks = Array.from(sdkMap.values());
  const mergedTools = Array.from(toolMap.values());

  // Sort: official/chain-specific first, then common
  const sortOrder = (a: any, b: any) => {
    if (a.source === "official" && b.source !== "official") return -1;
    if (a.source !== "official" && b.source === "official") return 1;
    if (a.source === "chain" && b.source === "common") return -1;
    if (a.source === "common" && b.source === "chain") return 1;
    return 0;
  };

  return {
    ...chainStatic,
    sdks: mergedSdks.sort(sortOrder),
    tools: mergedTools.sort(sortOrder),
  };
}

export const load: LayoutLoad = async ({ params }) => {
  const { slug } = params;

  // First check if slug is actually a chain ID (numeric)
  if (/^\d+$/.test(slug)) {
    const chainIdNumber = parseInt(slug);
    // Find the chain by ID and redirect to its slug
    for (const path in chainMdModules) {
      const raw = chainMdModules[path] as string;
      const { frontmatter } = parseFrontmatterAndContent(raw);
      if (frontmatter.chainId === chainIdNumber) {
        const chainSlug = path.split("/").pop()?.replace(".md", "") || "";
        throw redirect(301, `/chain/${chainSlug}`);
      }
    }
    throw error(404, `Chain with ID ${slug} not found`);
  }

  // Otherwise, treat it as a slug
  const mdPath = `/data/chains/${slug}.md`;

  if (!chainMdModules[mdPath]) {
    throw error(404, `Chain ${slug} not found`);
  }

  // CRITICAL DATA - Load immediately
  const raw = chainMdModules[mdPath] as string;
  const { frontmatter, content } = parseFrontmatterAndContent(raw);

  let logoUrl = undefined;
  if (frontmatter.logo) {
    logoUrl = resolveLogoUrl(frontmatter.logo);
  }

  let chainStatic = {
    ...frontmatter,
    logoUrl,
    description: content,
    name: frontmatter.name || slug,
  };

  // Merge with common EVM tools if applicable (still critical)
  const evmCommonRaw = evmCommonModule["/data/evm-common.md"] as string;
  if (evmCommonRaw) {
    const { frontmatter: evmCommonData } =
      parseFrontmatterAndContent(evmCommonRaw);
    chainStatic = mergeEvmTools(chainStatic, evmCommonData, slug);
  }

  // Parse bookmarks structure (critical for tab navigation)
  const bookmarksRaw = bookmarksModule["/data/bookmarks.md"] as string;
  const { frontmatter: bookmarksData } =
    parseFrontmatterAndContent(bookmarksRaw);

  // Get dynamic loader using chainId
  let dynamicLoader = null;
  if (chainStatic.chainId) {
    dynamicLoader = getDynamicDataFactory(chainStatic.chainId);
  }

  // Wallets will be loaded on-demand in WalletsTab component

  // Return all data
  return {
    slug,
    chainId: chainStatic.chainId,
    chainStatic,
    bookmarks: bookmarksData.tabs as BookmarkTab[],
    dynamicLoader,
  };
};

export const prerender = "auto";
export const ssr = true;
