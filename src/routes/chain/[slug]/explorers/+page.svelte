<script lang="ts">
  import { getContext } from "svelte";

  import { page } from "$app/stores";

  import SEO from "$lib/components/SEO.svelte";

  import ExplorersTab from "../../../../components/book/tabs/ExplorersTab.svelte";

  // Get data from layout
  const layoutData = $derived($page.data);

  // Get dynamic data from context (set by layout)
  const dynamicData = getContext<{
    chainStatic: any;
  }>("chainDynamicData");

  // Use chainStatic from context, fallback to layoutData
  const chainStatic = $derived(dynamicData?.chainStatic || layoutData);

  // SEO metadata - optimized for search queries
  const seoTitle = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "Block Explorers | Blockchain Explorer";
    return `${name} Block Explorers - Transaction & Address Lookup`;
  });

  const seoDescription = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    const chainId = chainStatic?.chainId || layoutData.chainId;

    if (!name) return "Browse blockchain explorers and block scanners";

    return `Explore ${name} blockchain with block explorers. View transactions, addresses, smart contracts on ${name}. Chain ID: ${chainId}. Track blocks, verify contracts, check gas prices and network statistics.`;
  });

  const seoKeywords = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "";

    return `${name} explorer, ${name} block explorer, ${name} blockchain explorer, ${name} transactions, ${name} address lookup, ${name} contract verification, ${name} scan, ${name} etherscan`;
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}/explorers`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
/>

<!-- Render only the ExplorersTab content -->
<ExplorersTab {chainStatic} />
