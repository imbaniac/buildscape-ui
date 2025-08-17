<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import DevelopmentTab from "../../../../../components/book/tabs/DevelopmentTab.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getContext } from "svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // Get data from layout  
  const layoutData = $derived($page.data);
  const bookmarks = $derived(layoutData.bookmarks);
  const section = $derived($page.params.section);
  
  // Get chain static from context
  const dynamicData = getContext<{
    chainStatic: any;
  }>("chainDynamicData");
  
  // Use chainStatic from context, fallback to layoutData
  const chainStatic = $derived(dynamicData?.chainStatic || layoutData);

  // Map section to readable names
  const sectionNames: Record<string, string> = {
    rpcs: "RPC Endpoints",
    testnets: "Testnets",
    sdks: "SDKs & Libraries",
    tools: "Development Tools"
  };

  // SEO metadata - optimized for search queries
  const seoTitle = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "Development | Blockchain Explorer";
    
    // More targeted titles for search
    const titles: Record<string, string> = {
      rpcs: `${name} RPC Endpoints - Mainnet RPC URLs & Node Providers`,
      testnets: `${name} Testnet - Faucets & Test Network RPC`,
      sdks: `${name} SDKs & Libraries - Web3 Development Tools`,
      tools: `${name} Development Tools - Build & Deploy on ${name}`
    };
    
    return titles[section || ""] || `${name} Development Resources`;
  });

  const seoDescription = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    const chainId = chainStatic?.chainId || layoutData.chainId;
    if (!name) return "Access blockchain development resources";
    
    // Optimized descriptions with search keywords
    const descriptions: Record<string, string> = {
      rpcs: `Access ${name} RPC endpoints and mainnet RPC URLs. Connect to ${name} network with verified node providers. Chain ID: ${chainId}. Free and paid RPC services for Web3 development.`,
      testnets: `${name} testnet information, faucets for free test tokens, and testnet RPC endpoints. Deploy and test smart contracts on ${name} test network. Chain ID for testnet included.`,
      sdks: `${name} SDKs and libraries for Web3 development. JavaScript, Python, Go libraries for ${name} blockchain. Smart contract deployment and transaction tools.`,
      tools: `Development tools for building on ${name} blockchain. Smart contract tools, debugging, deployment services, and infrastructure for ${name} dApp development.`
    };
    
    return descriptions[section || ""] || `Development resources and tools for ${name} blockchain. Chain ID: ${chainId}.`;
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}/development/${section}`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
/>

<!-- Render only the DevelopmentTab content -->
<DevelopmentTab
  {chainStatic}
  {bookmarks}
  activeTab={section || "rpcs"}
  onTabChange={(tab) => goto(`/chain/${layoutData.slug}/development/${tab}`)}
/>