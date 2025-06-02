import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import YAML from "yaml";
import type { BookmarkTab, WalletsByCategory } from "$lib/types";

const chainMdModules = import.meta.glob("/src/data/chains/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const chainTsModules = import.meta.glob("/src/data/chains/*.ts");

const logoAssets = import.meta.glob("/src/lib/assets/chains/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const walletLogos = import.meta.glob("/src/lib/assets/wallets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const bookmarksModule = import.meta.glob("/src/data/bookmarks.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const walletsModule = import.meta.glob("/src/data/wallets.md", {
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

function resolveWalletLogo(walletName: string): string | undefined {
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
      return walletLogos[path] as string;
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

function parseWallets(walletsContent: string): WalletsByCategory {
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
          logo: resolveWalletLogo(walletName),
        });
      }
    }
  }

  return walletsByCategory;
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

  // Parse bookmarks structure
  const bookmarksRaw = bookmarksModule["/src/data/bookmarks.md"] as string;
  const { frontmatter: bookmarksData } =
    parseFrontmatterAndContent(bookmarksRaw);

  // Parse wallets for EVM chains
  let walletsByCategory: WalletsByCategory = {};
  if (chainStatic.technology?.isEVM) {
    const walletsRaw = walletsModule["/src/data/wallets.md"] as string;
    walletsByCategory = parseWallets(walletsRaw);
  }

  // Get URL parameters
  const tab = url.searchParams.get("tab") || "overview";
  const span = url.searchParams.get("span") || "24h";

  return {
    slug,
    chainStatic,
    dynamicLoader,
    bookmarks: bookmarksData.tabs as BookmarkTab[],
    walletsByCategory,
    initialTab: tab,
    initialSpan: span as "1h" | "24h" | "7d" | "30d",
  };
};
