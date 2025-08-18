<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";

  import type { ChainOverview } from "$lib/api/overview";
  import SEO from "$lib/components/SEO.svelte";
  import {
    overviewStore,
    tpsLookupByChainId,
    tvlLookupByChainId,
  } from "$lib/stores/overviewStore";
  import {
    type PeriodType,
    userPreferencesStore,
  } from "$lib/stores/userPreferencesStore";

  import BoatLoader from "../../components/BoatLoader.svelte";
  import ChartTable from "../../components/charts/ChartTable.svelte";
  import Header from "../../components/Header.svelte";

  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // State for selected period - initialized from user preferences
  let selectedPeriod = $state<PeriodType>(
    userPreferencesStore.getTablePeriod(),
  );

  // Reference to table wrapper for scroll preservation
  let tableWrapper = $state<HTMLDivElement>();

  // Get dynamic data from stores
  const overviewStoreState = $derived($overviewStore);
  const tvlLookup = $derived($tvlLookupByChainId);
  const tpsLookup = $derived($tpsLookupByChainId);

  // Handle period change
  async function handlePeriodChange(period: PeriodType) {
    selectedPeriod = period;
    userPreferencesStore.setTablePeriod(period); // Save to preferences
    await overviewStore.load(period);
  }

  // Load data for the saved period on mount
  onMount(() => {
    // Load data for the user's preferred period
    overviewStore.load(selectedPeriod);
  });

  // Combine static and dynamic data
  const chainsWithMetrics = $derived(() => {
    const combined = [];

    // Create a map of chain data from overview for quick lookup
    const overviewChainMap = new SvelteMap<number, ChainOverview>();
    if (overviewStoreState.data?.chains) {
      for (const chainData of overviewStoreState.data.chains) {
        overviewChainMap.set(chainData.chain_id, chainData);
      }
    }

    for (const [slug, chain] of Object.entries(data.chains)) {
      const typedChain = chain as any; // Type assertion for dynamic chain data
      if (!typedChain.chainId) continue;

      const overviewData = overviewChainMap.get(typedChain.chainId);
      const tvl = overviewData?.tvl || tvlLookup.get(typedChain.chainId) || 0;
      const tps = overviewData?.tps || tpsLookup.get(typedChain.chainId) || 0;
      const transactions = overviewData?.transactions || 0;
      const activeAddresses = overviewData?.active_addresses || 0;
      const contracts = overviewData?.contracts || 0;
      const blockTime = overviewData?.block_time;

      combined.push({
        ...typedChain,
        slug,
        tvl,
        tps,
        transactions,
        activeAddresses,
        contracts,
        blockTime,
        // Use technology data from frontmatter if available, otherwise determine from patterns
        type:
          typedChain.technology?.isL2 === true
            ? "L2"
            : typedChain.technology?.isL2 === false
              ? "L1"
              : determineChainType(typedChain),
        technology: typedChain.technology || {},
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

  // Export snapshot for automatic scroll preservation
  export const snapshot = {
    capture: () => {
      return {
        scrollTop: tableWrapper?.scrollTop ?? 0,
        scrollLeft: tableWrapper?.scrollLeft ?? 0,
      };
    },
    restore: async (value) => {
      if (value) {
        if (tableWrapper) {
          tableWrapper.scrollTop = value.scrollTop;
          tableWrapper.scrollLeft = value.scrollLeft;
        }
      }
    },
  };
</script>

<SEO
  title="Blockchain Comparison Table - Live Metrics & Rankings"
  description={`Compare ${Object.keys(data.chains).length}+ blockchain networks side-by-side. Sort by TVL, TPS, gas fees, and active users. Find chain IDs, RPC endpoints, and network stats for all major blockchains.`}
  keywords="blockchain comparison, chain comparison table, blockchain metrics, chain id lookup, tvl rankings, tps comparison, gas fees comparison, blockchain stats, network comparison, crypto chains"
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
      bind:tableWrapper
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
