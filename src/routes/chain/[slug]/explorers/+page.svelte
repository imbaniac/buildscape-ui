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

  // SEO metadata
  const seoTitle = $derived(() => {
    if (!chainStatic?.name) return "Block Explorers | Blockchain Explorer";
    return `${chainStatic.name} Block Explorers - Transaction & Address Search`;
  });

  const seoDescription = $derived(() => {
    if (!chainStatic?.name) return "Browse blockchain explorers and block scanners";
    return `Access ${chainStatic.name} block explorers to search transactions, addresses, smart contracts, and on-chain data. View blocks, verify contracts, and track network activity.`;
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
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