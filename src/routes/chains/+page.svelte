<script lang="ts">
  import {
    overviewStore,
    tvlLookupByChainId,
    tpsLookupByChainId,
  } from "$lib/stores/overviewStore";
  import ChartTable from "../../components/charts/ChartTable.svelte";
  import Header from "../../components/Header.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import BoatLoader from "../../components/BoatLoader.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // State for selected period
  let selectedPeriod = $state<"1h" | "24h" | "7d" | "30d">("24h");

  // Get dynamic data from stores
  const overviewStoreState = $derived($overviewStore);
  const tvlLookup = $derived($tvlLookupByChainId);
  const tpsLookup = $derived($tpsLookupByChainId);

  // Handle period change
  async function handlePeriodChange(period: "1h" | "24h" | "7d" | "30d") {
    selectedPeriod = period;
    await overviewStore.load(period);
  }

  // Combine static and dynamic data
  const chainsWithMetrics = $derived(() => {
    const combined = [];

    // Create a map of chain data from overview for quick lookup
    const overviewChainMap = new Map();
    if (overviewStoreState.data?.chains) {
      for (const chainData of overviewStoreState.data.chains) {
        overviewChainMap.set(chainData.chain_id, chainData);
      }
    }

    for (const [slug, chain] of Object.entries(data.chains)) {
      if (!chain.chainId) continue;

      const overviewData = overviewChainMap.get(chain.chainId);
      const tvl = overviewData?.tvl || tvlLookup.get(chain.chainId) || 0;
      const tps = overviewData?.tps || tpsLookup.get(chain.chainId) || 0;
      const transactions = overviewData?.transactions || 0;
      const activeAddresses = overviewData?.active_addresses || 0;
      const contracts = overviewData?.contracts || 0;
      const blockTime = overviewData?.block_time;

      combined.push({
        ...chain,
        slug,
        tvl,
        tps,
        transactions,
        activeAddresses,
        contracts,
        blockTime,
        // Use technology data from frontmatter if available, otherwise determine from patterns
        type:
          chain.technology?.isL2 === true
            ? "L2"
            : chain.technology?.isL2 === false
              ? "L1"
              : determineChainType(chain),
        technology: chain.technology || {},
      });
    }

    return combined;
  });

  function determineChainType(chain: any): string {
    // Fallback for chains without technology metadata
    const l2ChainIds = [10, 42161, 8453, 7777777, 534352, 59144, 424, 34443];
    const testnetKeywords = ["testnet", "goerli", "sepolia", "mumbai", "fuji"];

    if (l2ChainIds.includes(chain.chainId)) return "L2";
    if (
      chain.name &&
      testnetKeywords.some((keyword) =>
        chain.name.toLowerCase().includes(keyword),
      )
    )
      return "Testnet";
    if (chain.chainId === 1) return "L1";

    // Default to L1 for other mainnets
    return "L1";
  }
</script>

<SEO
  title="Blockchain Comparison Table - All EVM Chains"
  description="Compare all EVM blockchain networks side-by-side. View TVL, TPS, gas fees, and chain IDs in an interactive table."
  keywords="blockchain comparison, EVM chains table, chain comparison, TVL ranking, TPS comparison"
  canonical="https://buildscape.org/chains"
/>

{#if !overviewStoreState.data}
  <BoatLoader />
{:else}
  <div class="chains-page">
    <Header />
    <ChartTable
      chains={chainsWithMetrics()}
      isLoading={overviewStoreState.isLoading}
      {selectedPeriod}
      onPeriodChange={handlePeriodChange}
    />
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
