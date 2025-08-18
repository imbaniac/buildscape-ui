<script lang="ts">
  import { page } from "$app/stores";
  import WalletsTab from "../../../../components/book/tabs/WalletsTab.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getContext } from "svelte";

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
    if (!name) return "Wallets | Blockchain Explorer";
    return `${name} Wallets - Connect MetaMask & Web3 Wallets`;
  });

  const seoDescription = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    const chainId = chainStatic?.chainId || layoutData.chainId;
    const nativeCurrency = chainStatic?.nativeCurrency || "ETH";

    if (!name) return "Find compatible cryptocurrency wallets";

    return `Connect wallets to ${name} blockchain. Add ${name} to MetaMask, Trust Wallet, and other Web3 wallets. Chain ID: ${chainId}, Native token: ${nativeCurrency}. Step-by-step wallet setup guides.`;
  });

  const seoKeywords = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "";

    return `${name} wallet, ${name} MetaMask, add ${name} to MetaMask, ${name} Trust Wallet, ${name} Web3 wallet, connect to ${name}, ${name} wallet setup, ${name} blockchain wallet, ${name} chain ID`;
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}/wallets`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
/>

<!-- Render only the WalletsTab content -->
<WalletsTab walletsByCategory={$page.data.wallets} />
