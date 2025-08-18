<script lang="ts">
  import { getContext } from "svelte";

  import { page } from "$app/stores";

  import SEO from "$lib/components/SEO.svelte";

  import ResourcesTab from "../../../../components/book/tabs/ResourcesTab.svelte";

  // Get data from layout
  const layoutData = $derived($page.data);
  const bookmarks = $derived(layoutData.bookmarks);

  // Get dynamic data from context (set by layout)
  const dynamicData = getContext<{
    chainStatic: any;
  }>("chainDynamicData");

  // Use chainStatic from context, fallback to layoutData
  const chainStatic = $derived(dynamicData?.chainStatic || layoutData);

  // SEO metadata - optimized for search queries
  const seoTitle = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "Resources | Blockchain Explorer";
    return `${name} Documentation & Resources - Developer Guides`;
  });

  const seoDescription = $derived(() => {
    const name = chainStatic?.name || layoutData.name;

    if (!name) return "Access blockchain resources and documentation";

    return `${name} documentation, developer guides, and resources. Access ${name} docs, community forums, GitHub repositories, whitepapers, and technical specifications for building on ${name}.`;
  });

  const seoKeywords = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "";

    return `${name} documentation, ${name} docs, ${name} developer guide, ${name} resources, ${name} GitHub, ${name} whitepaper, ${name} technical docs, ${name} community`;
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}/resources`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
/>

<!-- Render only the ResourcesTab content -->
<ResourcesTab {chainStatic} {bookmarks} />
