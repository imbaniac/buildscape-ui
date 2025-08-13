<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import BookLayout from "../../../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../../../components/book/ChainDetailsPage.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
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

  function handleClose() {
    goto("/");
  }

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

<BookLayout
  onClose={handleClose}
  brandColor={getAccessibleBrandColor(layoutData.color || "#3b82f6")}
  currentPath={$page.url.pathname}
>
  {#snippet leftPage()}
    <ChainInfoPage chainStatic={chainStatic || { 
      name: layoutData.name,
      chainId: layoutData.chainId,
      logoUrl: layoutData.logoUrl,
      color: layoutData.color,
      technology: layoutData.technology
    }} />
  {/snippet}

  {#snippet rightPage()}
    <ChainDetailsPage
      chainStatic={chainStatic || {
        name: layoutData.name,
        chainId: layoutData.chainId,
        technology: layoutData.technology
      }}
      {bookmarks}
      activeTab={section || "rpcs"}
      activeGroup="development"
      currentPath={$page.url.pathname}
    />
  {/snippet}
</BookLayout>