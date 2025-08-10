<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import BookLayout from "../../../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../../../components/book/ChainDetailsPage.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // Get data from layout  
  const layoutData = $derived($page.data);
  const chainStatic = $derived(layoutData.chainStatic);
  const bookmarks = $derived(layoutData.bookmarks);
  const section = $derived($page.params.section);

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

  // SEO metadata
  const seoTitle = $derived(() => {
    if (!chainStatic?.name) return "Development | Blockchain Explorer";
    const sectionName = sectionNames[section] || "Development";
    return `${chainStatic.name} ${sectionName} - Developer Resources`;
  });

  const seoDescription = $derived(() => {
    if (!chainStatic?.name) return "Access blockchain development resources";
    
    const descriptions: Record<string, string> = {
      rpcs: `Access verified RPC endpoints for ${chainStatic.name}. Connect your dApps, wallets, and development tools to the blockchain network with reliable node providers.`,
      testnets: `Explore ${chainStatic.name} testnet environments for development and testing. Get testnet faucets, RPC endpoints, and deployment guides.`,
      sdks: `Find SDKs and libraries for ${chainStatic.name} development. Language-specific tools for smart contract deployment, transaction signing, and blockchain interaction.`,
      tools: `Discover development tools for building on ${chainStatic.name}. IDEs, testing frameworks, deployment tools, and infrastructure services for dApp development.`
    };
    
    return descriptions[section] || `Development resources and tools for ${chainStatic.name} blockchain.`;
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
  brandColor={getAccessibleBrandColor(chainStatic?.color || "#3b82f6")}
  currentPath={$page.url.pathname}
>
  {#snippet leftPage()}
    <ChainInfoPage {chainStatic} />
  {/snippet}

  {#snippet rightPage()}
    <ChainDetailsPage
      {chainStatic}
      {bookmarks}
      activeTab={section}
      activeGroup="development"
      currentPath={$page.url.pathname}
    />
  {/snippet}
</BookLayout>