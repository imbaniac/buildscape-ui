import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { BookmarkTab, WalletsByCategory } from "$lib/types";
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

// Lazy load wallet logos (not critical for initial render)
const walletLogos = import.meta.glob("/assets/wallets/*", {
  query: "?url",
  import: "default",
});

// Keep bookmarks eager (small file)
const bookmarksModule = import.meta.glob("/data/bookmarks.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Lazy load wallets (not critical for initial render)
const walletsModule = import.meta.glob("/data/wallets.md", {
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

async function resolveWalletLogo(
  walletName: string
): Promise<string | undefined> {
  // Normalize wallet name for matching
  let normalizedName = walletName.toLowerCase();

  // Extract the main name before parentheses if exists
  const parenIndex = normalizedName.indexOf("(");
  if (parenIndex > 0) {
    normalizedName = normalizedName.substring(0, parenIndex).trim();
  }

  // Replace spaces with underscores
  normalizedName = normalizedName.replace(/\s+/g, "_");

  for (const path in walletLogos) {
    const filename = path.split("/").pop()?.toLowerCase();
    if (filename?.startsWith(normalizedName + ".")) {
      const module = await walletLogos[path]();
      return module as string;
    }
  }
  return undefined;
}

async function parseWallets(
  walletsContent: string
): Promise<WalletsByCategory> {
  const lines = walletsContent.split("\n");
  const walletsByCategory: WalletsByCategory = {};
  let currentCategory = "";
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentCategory = line.substring(3).trim();
      walletsByCategory[currentCategory] = [];
      inTable = false;
    } else if (line.includes("|---")) {
      inTable = true;
    } else if (inTable && line.startsWith("|") && !line.includes("Name")) {
      const parts = line
        .split("|")
        .map((p) => p.trim())
        .filter((p) => p);
      if (parts.length >= 2) {
        const walletName = parts[0];
        walletsByCategory[currentCategory].push({
          name: walletName,
          url: parts[1],
          logo: await resolveWalletLogo(walletName),
        });
      }
    }
  }

  return walletsByCategory;
}

function mergeEvmTools(
  chainStatic: any,
  evmCommonData: any,
  chainSlug: string
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

export const load: PageLoad = async ({ params, url }) => {
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

  // Get URL parameters
  const tab = url.searchParams.get("tab") || "overview";
  const span = url.searchParams.get("span") || "24h";

  // NON-CRITICAL DATA - Load asynchronously
  const loadNonCriticalData = async () => {
    // Get dynamic loader using chainId
    let dynamicLoader = null;
    if (chainStatic.chainId) {
      dynamicLoader = getDynamicDataFactory(chainStatic.chainId);
    }

    // Parse wallets for EVM chains
    let walletsByCategory: WalletsByCategory = {};
    if (chainStatic.technology?.isEVM) {
      const walletsModulePath = "/data/wallets.md";
      if (walletsModule[walletsModulePath]) {
        const walletsRawModule = await walletsModule[walletsModulePath]();
        const walletsRaw = walletsRawModule as string;
        walletsByCategory = await parseWallets(walletsRaw);
      }
    }

    return {
      dynamicLoader,
      walletsByCategory,
    };
  };

  // Return critical data immediately, stream non-critical data
  return {
    slug,
    chainId: chainStatic.chainId,
    chainStatic,
    bookmarks: bookmarksData.tabs as BookmarkTab[],
    initialTab: tab,
    initialSpan: span as "1h" | "24h" | "7d" | "30d",
    // Stream non-critical data
    streamed: {
      nonCritical: loadNonCriticalData(),
    },
  };
};

export const prerender = "auto";
export const ssr = true;
