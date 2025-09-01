<script lang="ts">
  import { getContext } from "svelte";

  import { page } from "$app/stores";

  import SEO from "$lib/components/SEO.svelte";
  import { getChainSeo } from "$lib/utils/chainSeo";

  import OverviewTab from "../../../components/book/tabs/OverviewTab.svelte";

  // Get data from layout
  const layoutData = $derived($page.data);

  // Get dynamic data from context (set by layout)
  const dynamicData = getContext<{
    chainStatic: any;
  }>("chainDynamicData");

  // Use chainStatic from context
  const chainStatic = $derived(dynamicData?.chainStatic || layoutData);

  // Get SEO data from shared utility
  const seo = $derived(getChainSeo(chainStatic, layoutData));
</script>

<SEO
  title={seo.title}
  description={seo.description}
  keywords={seo.keywords}
  canonical={`https://buildscape.org/chain/${layoutData.slug}`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
  jsonLd={seo.jsonLd}
/>

<!-- Render only the OverviewTab content -->
<OverviewTab {chainStatic} />
