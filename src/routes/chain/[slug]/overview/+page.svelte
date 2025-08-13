<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import BookLayout from "../../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../../components/book/ChainDetailsPage.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import { getContext } from "svelte";

  // Get data from layout  
  const layoutData = $derived($page.data);
  const bookmarks = $derived(layoutData.bookmarks);
  
  // Get dynamic data from context (set by layout)
  const dynamicData = getContext<{
    chainStatic: any;
  }>("chainDynamicData");
  
  // Use chainStatic from context, fallback to layoutData
  const chainStatic = $derived(dynamicData?.chainStatic || layoutData);

  function handleClose() {
    goto("/");
  }

  // SEO metadata - same as root route
  const seoTitle = $derived(() => {
    if (!chainStatic?.name) return "Blockchain Explorer | Buildscape";

    const name = chainStatic.name;
    const isL2 = chainStatic.technology?.isL2;

    // L2s emphasize their L2 nature
    if (isL2) {
      return `${name} L2 - Blockchain Metrics, RPCs & Resources`;
    }

    // Default format focuses on key services
    return `${name} - Network Stats, RPCs & Developer Resources`;
  });

  const seoDescription = $derived(() => {
    if (!chainStatic?.name)
      return "Explore blockchain metrics and resources on Buildscape";

    const name = chainStatic.name;
    const chainId = chainStatic.chainId;
    const nativeCurrency = chainStatic.nativeCurrency || "ETH";
    const isEVM = chainStatic.technology?.isEVM;
    const isL2 = chainStatic.technology?.isL2;

    // Use actual description if available and truncate to ~160 chars for SEO
    if (chainStatic.description) {
      const cleanDesc = chainStatic.description
        .split("\n")[0] // First paragraph only
        .replace(/[*#]/g, "") // Remove markdown
        .trim();

      // If description is good length, enhance it with key facts
      if (cleanDesc.length > 50 && cleanDesc.length < 140) {
        return `${cleanDesc} Track metrics, access RPCs, and explore ecosystem.`;
      } else if (cleanDesc.length >= 140) {
        // Truncate long descriptions
        return cleanDesc.substring(0, 157) + "...";
      }
    }

    // Fallback to generated description
    let description = `${name} blockchain network (Chain ID: ${chainId}, Native token: ${nativeCurrency}).`;

    // Add technical details
    if (isEVM && isL2) {
      description += " EVM-compatible Layer 2 scaling solution.";
    } else if (isEVM) {
      description += " EVM-compatible blockchain.";
    } else if (isL2) {
      description += " Layer 2 scaling solution.";
    }

    // Add value proposition without specific numbers
    description += ` Track real-time metrics including TPS, gas fees, and TVL. Access verified RPC endpoints, connect wallets, and explore dApps.`;

    return description;
  });

  const seoKeywords = $derived(() => {
    if (!chainStatic?.name) return "";

    const name = chainStatic.name;
    const chainId = chainStatic.chainId;
    const nativeCurrency = chainStatic.nativeCurrency || "ETH";
    const isEVM = chainStatic.technology?.isEVM;
    const isL2 = chainStatic.technology?.isL2;

    const keywords = [
      name,
      `${name} blockchain`,
      `${name} network`,
      `${name} chain`,
      `chain id ${chainId}`,
      `chainid ${chainId}`,
      `${chainId} chain id`,
      `network ${chainId}`,
      `${name} rpc`,
      `${name} rpc url`,
      `${name} mainnet rpc`,
      `${name} node`,
      `${name} tvl`,
      `${name} tps`,
      `${name} gas fees`,
      `${name} gas price`,
      `${name} ${nativeCurrency}`,
      `${nativeCurrency} network`,
      `how to connect to ${name}`,
      `add ${name} to metamask`,
      `${name} metamask`,
      `${name} wallet`,
      `${name} docs`,
      `${name} documentation`,
      `${name} developer`,
      `${name} faucet`,
      `${name} testnet`,
      `${name} vs ethereum`,
      `is ${name} evm compatible`,
    ];

    if (isEVM) {
      keywords.push(`${name} evm`, "evm compatible");
    }

    if (isL2) {
      keywords.push(`${name} l2`, `${name} layer 2`, "layer 2 blockchain");
    }

    return keywords.join(", ");
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}/overview`}
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
      activeTab="overview"
      activeGroup="overview"
      currentPath={$page.url.pathname}
    />
  {/snippet}
</BookLayout>