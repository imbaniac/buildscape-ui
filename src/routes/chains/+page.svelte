<script lang="ts">
  import { overviewStore, tvlLookupByChainId, tpsLookupByChainId } from '$lib/stores/overviewStore';
  import ChartTable from '../../components/charts/ChartTable.svelte';
  import Header from '../../components/Header.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import BoatLoader from '../../components/BoatLoader.svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  
  // Get dynamic data from stores
  const overviewStoreState = $derived($overviewStore);
  const tvlLookup = $derived($tvlLookupByChainId);
  const tpsLookup = $derived($tpsLookupByChainId);
  
  // Combine static and dynamic data
  const chainsWithMetrics = $derived(() => {
    const combined = [];
    
    for (const [slug, chain] of Object.entries(data.chains)) {
      if (!chain.chainId) continue;
      
      const tvl = tvlLookup.get(chain.chainId) || 0;
      const tps = tpsLookup.get(chain.chainId) || 0;
      
      combined.push({
        ...chain,
        slug,
        tvl,
        tps,
        // Use technology data from frontmatter if available, otherwise determine from patterns
        type: chain.technology?.isL2 === true ? 'L2' : 
              chain.technology?.isL2 === false ? 'L1' : 
              determineChainType(chain),
        technology: chain.technology || {}
      });
    }
    
    return combined;
  });
  
  function determineChainType(chain: any): string {
    // Fallback for chains without technology metadata
    const l2ChainIds = [10, 42161, 8453, 7777777, 534352, 59144, 424, 34443];
    const testnetKeywords = ['testnet', 'goerli', 'sepolia', 'mumbai', 'fuji'];
    
    if (l2ChainIds.includes(chain.chainId)) return 'L2';
    if (chain.name && testnetKeywords.some(keyword => 
      chain.name.toLowerCase().includes(keyword))) return 'Testnet';
    if (chain.chainId === 1) return 'L1';
    
    // Default to L1 for other mainnets
    return 'L1';
  }
</script>

<SEO 
  title="Blockchain Comparison Table - All EVM Chains"
  description="Compare all EVM blockchain networks side-by-side. View TVL, TPS, gas fees, and chain IDs in an interactive table."
  keywords="blockchain comparison, EVM chains table, chain comparison, TVL ranking, TPS comparison"
  canonical="https://buildscape.org/chains"
/>

{#if overviewStoreState.isLoading || !overviewStoreState.data}
  <BoatLoader />
{:else}
  <div class="chains-page">
    <Header />
    <ChartTable chains={chainsWithMetrics()} isLoading={false} />
  </div>
{/if}

<style>
  .chains-page {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>