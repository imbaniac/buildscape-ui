<script lang="ts">
  import { formatNumberWithCommas } from "$lib/utils/formatters";
  import Tooltip from "../ui/Tooltip.svelte";
  import SkeletonLoader from "../ui/SkeletonLoader.svelte";
  import ResourcePanel from "./ResourcePanel.svelte";

  interface Props {
    chainDynamic: any;
    chainStatus: any;
    loadingStatus: boolean;
    brandColor?: string;
    maxBlockSize?: number;
    nativeCurrency?: string;
  }

  let {
    chainDynamic,
    chainStatus,
    loadingStatus,
    brandColor = "#8b5cf6",
    maxBlockSize,
    nativeCurrency = "ETH",
  }: Props = $props();

  // Only show skeleton on initial load, not on updates
  const showSkeleton = $derived(loadingStatus && !chainStatus && !chainDynamic);
</script>

<div class="network-status">
  {#if showSkeleton}
    <SkeletonLoader height="120px" />
  {:else}
    <ResourcePanel
      gasPrice={chainStatus?.gas_price_gwei || chainDynamic?.lastGas || 0}
      utilization={Math.round(
        chainStatus?.utilization_pct ||
          (chainDynamic?.utilization
            ? parseInt(chainDynamic.utilization)
            : 0)
      )}
      previousGasPrice={chainDynamic?.previousGas}
      {nativeCurrency}
      blockSize={chainStatus?.block_size_mb?.toFixed(2) || chainDynamic?.lastBlockSize || "0"}
      {maxBlockSize}
      lastBlock={formatNumberWithCommas(
        chainStatus?.current_block || chainDynamic?.lastBlock || 0
      )}
      networkStatus={chainStatus?.status || (loadingStatus ? "connecting" : "no_data")}
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
