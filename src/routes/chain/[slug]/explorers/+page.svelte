<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import BookLayout from "../../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../../components/book/ChainDetailsPage.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import { getContext } from "svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

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
      activeTab="explorers"
      activeGroup="explorers"
      currentPath={$page.url.pathname}
    />
  {/snippet}
</BookLayout>
