<script lang="ts">
  import { formatNumberWithCommas } from "$lib/utils/formatters";
  import SkeletonLoader from "../ui/SkeletonLoader.svelte";
  import ResourcePanel from "./ResourcePanel.svelte";

  interface Props {
    chainDynamic: any;
    chainStatus: any;
    loadingStatus: boolean;
    brandColor?: string;
    nativeCurrency?: string;
  }

  let {
    chainDynamic,
    chainStatus,
    loadingStatus,
    brandColor = "#8b5cf6",
    nativeCurrency = "ETH",
  }: Props = $props();

  // Only show skeleton on initial load, not on updates
  const showSkeleton = $derived(loadingStatus && !chainStatus && !chainDynamic);
</script>

<div class="network-status">
  {#if showSkeleton}
    <SkeletonLoader height="105px" />
  {:else}
    <ResourcePanel
      gasPrice={chainStatus?.gas_price_gwei || chainDynamic?.gas_price || 0}
      utilization={Math.round(
        chainStatus?.utilization_pct || chainDynamic?.utilization || 0,
      )}
      previousGasPrice={undefined}
      {nativeCurrency}
      blockTime={chainDynamic?.block_time}
      lastBlock={formatNumberWithCommas(
        chainStatus?.current_block || chainDynamic?.last_block || 0,
      )}
      networkStatus={chainStatus?.status ||
        (loadingStatus ? "connecting" : "no_data")}
      {brandColor}
    />
  {/if}
</div>

<style>
  .network-status {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    .network-status {
      margin-bottom: 1.25rem;
    }
  }
</style>
