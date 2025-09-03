<script lang="ts">
  import TableCell from "./TableCell.svelte";
  import type { Chain } from "./types";

  interface Props {
    chain: Chain;
    index: number;
    isLoading?: boolean;
    onRowClick: (chain: Chain) => void;
  }

  let { chain, index, isLoading = false, onRowClick }: Props = $props();

  function handleClick() {
    onRowClick(chain);
  }

  // Only show skeleton for logo/name if chain has no real data (initial load)
  const showStaticSkeleton = $derived(isLoading && !chain.name);
</script>

<TableCell
  type="logo"
  {chain}
  {index}
  isLoading={showStaticSkeleton}
  onClick={handleClick}
/>
<TableCell
  type="name"
  {chain}
  {index}
  isLoading={showStaticSkeleton}
  onClick={handleClick}
/>
<TableCell type="tvl" {chain} {index} {isLoading} onClick={handleClick} />
<TableCell
  type="metric"
  {chain}
  {index}
  {isLoading}
  onClick={handleClick}
  metricType="tps"
  metricValue={chain.tps}
  showTpsLabel={true}
/>
<TableCell
  type="metric"
  {chain}
  {index}
  {isLoading}
  onClick={handleClick}
  metricType="blockTime"
  metricValue={chain.blockTime}
/>
<TableCell type="txCost" {chain} {index} {isLoading} onClick={handleClick} />
<TableCell
  type="metric"
  {chain}
  {index}
  {isLoading}
  onClick={handleClick}
  metricType="count"
  metricValue={chain.transactions}
/>
<TableCell
  type="metric"
  {chain}
  {index}
  {isLoading}
  onClick={handleClick}
  metricType="count"
  metricValue={chain.activeAddresses}
/>
<TableCell
  type="metric"
  {chain}
  {index}
  {isLoading}
  onClick={handleClick}
  metricType="count"
  metricValue={chain.contracts}
/>
<TableCell type="type" {chain} {index} {isLoading} onClick={handleClick} />
