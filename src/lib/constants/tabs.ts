import type { BookmarkTab } from "$lib/types";

export const CHAIN_TABS: BookmarkTab[] = [
  {
    name: "Overview",
    id: "overview",
    fields: [],
  },
  {
    name: "Resources",
    id: "resources",
    fields: [
      { field: "docs", label: "Documentation", icon: "📚" },
      { field: "forums", label: "Community Forums", icon: "💬" },
      { field: "sourceCode", label: "Source Code", icon: "📁" },
    ],
  },
  {
    name: "Explorers",
    id: "explorers",
    fields: [
      { field: "blockscanners", label: "Block Explorers", icon: "🔍" },
    ],
  },
  {
    name: "Dev",
    id: "development",
    fields: [
      { field: "rpcs", label: "RPC", icon: "🌐" },
      { field: "testnets", label: "Testnets", icon: "🧪" },
      { field: "sdks", label: "SDKs & Libraries", icon: "🛠️" },
      { field: "tools", label: "Tools", icon: "⚡" },
    ],
  },
  {
    name: "Wallets",
    id: "wallets",
    fields: [],
  },
];