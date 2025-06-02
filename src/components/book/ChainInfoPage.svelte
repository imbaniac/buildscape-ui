<script lang="ts">
  import NetworkStatus from './metrics/NetworkStatus.svelte';
  import ActivityMetrics from './metrics/ActivityMetrics.svelte';
  
  interface Props {
    chainStatic: any;
    chainDynamic: any;
    loadingDynamic: boolean;
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    onSpanChange: (span: "1h" | "24h" | "7d" | "30d") => void;
  }

  let { chainStatic, chainDynamic, loadingDynamic, metricsSpan, onSpanChange }: Props = $props();
</script>

<div class="page-content">
  <div class="chain-header">
    {#if chainStatic.logoUrl}
      <img
        src={chainStatic.logoUrl}
        alt={chainStatic.name + " logo"}
        class="chain-logo"
      />
    {/if}
    <h1 class="chain-title">{chainStatic.name}</h1>
    <div class="chain-subtitle">Chain ID: {chainStatic.chainId}</div>
  </div>
  
  <div class="chain-metadata">
    {#if chainStatic.parentOrganization}
      <div class="metadata-org">Built by {chainStatic.parentOrganization}</div>
    {/if}
    <div class="metadata-tech">
      {#if chainStatic.technology?.isL2}
        <span class="tech-tag l2">L2</span>
      {:else}
        <span class="tech-tag l1">L1</span>
      {/if}
      {#if chainStatic.technology?.type}
        <span class="tech-tag">{chainStatic.technology.type}</span>
      {/if}
      {#if chainStatic.technology?.stack}
        <span class="tech-tag">{chainStatic.technology.stack}</span>
      {/if}
      {#if chainStatic.technology?.isEVM}
        <span class="tech-tag evm">EVM Compatible</span>
      {/if}
    </div>
    {#if chainStatic.technology?.settlementLayer}
      <div class="metadata-settlement">Settles on {chainStatic.technology.settlementLayer}</div>
    {/if}
  </div>

  {#if chainDynamic}
    <NetworkStatus {chainDynamic} />
  {/if}

  <ActivityMetrics 
    {metricsSpan}
    {onSpanChange}
    {loadingDynamic}
    {chainDynamic}
  />
</div>

<style>
  .page-content {
    padding: 3rem;
    padding-right: 3.5rem;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .chain-header {
    text-align: center;
    margin-bottom: 0;
  }

  .chain-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    display: block;
  }

  .chain-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1a202c;
  }

  .chain-subtitle {
    font-size: 1.1rem;
    color: #64748b;
    font-weight: 500;
  }

  .chain-metadata {
    margin-top: 0.75rem;
    padding: 0.75rem 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .metadata-org {
    font-size: 0.875rem;
    color: #475569;
    font-weight: 500;
  }

  .metadata-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #475569;
    white-space: nowrap;
  }

  .tech-tag.l1 {
    background: #fef3c7;
    border-color: #fcd34d;
    color: #92400e;
  }

  .tech-tag.l2 {
    background: #dbeafe;
    border-color: #60a5fa;
    color: #1e40af;
  }

  .tech-tag.evm {
    background: #e0e7ff;
    border-color: #a5b4fc;
    color: #3730a3;
  }

  .metadata-settlement {
    font-size: 0.8125rem;
    color: #64748b;
    font-style: italic;
  }

  @media (max-width: 1024px) {
    .page-content {
      gap: 2rem;
      padding-right: 2.5rem;
    }

    .chain-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 640px) {
    .page-content {
      padding: 1.5rem;
      padding-right: 2rem;
    }

    .chain-logo {
      width: 60px;
      height: 60px;
    }

    .chain-title {
      font-size: 1.75rem;
    }
  }
</style>