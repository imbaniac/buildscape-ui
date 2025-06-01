<script lang="ts">
  import { Modal } from "flowbite-svelte";
  import { marked } from "marked";

  export let open: boolean;
  export let chainStatic: any = null;
  export let chainDynamic: any = null;
  export let metricsSpan: "1h" | "24h" | "7d" | "30d" = "24h";
  export let loadingDynamic: boolean = false;
  export let onClose: () => void;
  export let onMetricsSpanChange: (span: "1h" | "24h" | "7d" | "30d") => void;

  let activeTab = "Overview";
  $: if (open && chainStatic) {
    activeTab = chainStatic.bookmarks?.[0] || "Overview";
  }

  function handleClose() {
    onClose?.();
  }
  function handleMetricsSpanChange(span: "1h" | "24h" | "7d" | "30d") {
    onMetricsSpanChange?.(span);
  }
</script>

<Modal bind:open onclose={handleClose} size="lg" class="book-modal">
  {#if chainStatic}
    <div class="book-layout">
      <!-- Left Sidebar -->
      <aside class="book-sidebar">
        {#if chainStatic.logoUrl}
          <img
            src={chainStatic.logoUrl}
            alt={chainStatic.name + " logo"}
            class="chain-logo"
          />
        {/if}
        <h2 class="chain-title">{chainStatic.name}</h2>
        <div class="chain-id">Chain ID: {chainStatic.chainId}</div>
        <div class="contract-languages">
          <span
            >Contract Language: <a
              href={chainStatic.contractLanguages.primary.url}
              target="_blank">{chainStatic.contractLanguages.primary.name}</a
            ></span
          >
          {#if chainStatic.contractLanguages.others?.length}
            <span
              class="other-langs"
              title={chainStatic.contractLanguages.others
                .map((l: any) => l.name)
                .join(", ")}
            >
              +{chainStatic.contractLanguages.others.length} more
            </span>
          {/if}
        </div>
        <div class="metrics-section">
          <div class="metrics-header">Metrics</div>
          <div class="metrics-slider">
            {#each ["1h", "24h", "7d", "30d"] as spanOpt}
              <button
                class:active={metricsSpan === spanOpt}
                onclick={() =>
                  handleMetricsSpanChange(
                    spanOpt as "1h" | "24h" | "7d" | "30d"
                  )}>{spanOpt}</button
              >
            {/each}
          </div>
          {#if loadingDynamic}
            <div>Loading metrics...</div>
          {:else if chainDynamic}
            <div class="metrics-list">
              <div>Last Block: {chainDynamic.lastBlock}</div>
              <div>Last Gas: {chainDynamic.lastGas}</div>
              <div>Last Block Size: {chainDynamic.lastBlockSize}</div>
              <div>Tx/s: {chainDynamic.metrics.txPerSecond}</div>
              <div>Transactions: {chainDynamic.metrics.numTransactions}</div>
              <div>Users: {chainDynamic.metrics.uniqueUsers}</div>
              <div>
                Contracts Deployed: {chainDynamic.metrics.contractsDeployed}
              </div>
            </div>
          {:else}
            <div>No live data available</div>
          {/if}
        </div>
      </aside>
      <!-- Right Page (Tabs/Bookmarks) -->
      <section class="book-content">
        <div class="bookmarks">
          {#each chainStatic.bookmarks as tab, idx}
            <button
              class:active={activeTab === tab}
              onclick={() => (activeTab = tab)}>{tab}</button
            >
          {/each}
        </div>
        <div class="tab-content">
          {#if activeTab === "Overview"}
            <div class="prose">
              {@html marked.parse(chainStatic.description)}
            </div>
          {:else if activeTab === "Source"}
            <ul>
              {#each chainStatic.sourceCode as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Forums"}
            <ul>
              {#each chainStatic.forums as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Docs"}
            <ul>
              {#each chainStatic.docs as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Blockscanners"}
            <ul>
              {#each chainStatic.blockscanners as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Wallets"}
            <ul>
              {#each chainStatic.wallets as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Testnets"}
            <ul>
              {#each chainStatic.testnets as net}<li>{net}</li>{/each}
            </ul>
          {:else if activeTab === "RPCs"}
            <div>
              <div>Public:</div>
              <ul>
                {#each chainStatic.rpcs?.public as rpc}<li>{rpc}</li>{/each}
              </ul>
              <div>Private:</div>
              <ul>
                {#each chainStatic.rpcs?.private as rpc}<li>{rpc}</li>{/each}
              </ul>
            </div>
          {:else if activeTab === "SDKs"}
            <ul>
              {#each chainStatic.sdks as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else if activeTab === "Tools"}
            <ul>
              {#each chainStatic.tools as link}<li>
                  <a href={link} target="_blank">{link}</a>
                </li>{/each}
            </ul>
          {:else}
            <div>No data</div>
          {/if}
        </div>
      </section>
    </div>
  {/if}
</Modal>

<style>
  .book-layout {
    display: flex;
    min-width: 700px;
    min-height: 500px;
    max-width: 1000px;
    max-height: 80vh;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    overflow: hidden;
  }
  .book-sidebar {
    width: 280px;
    background: #f7fafc;
    padding: 32px 24px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .chain-logo {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
  }
  .chain-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .chain-id {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 16px;
  }
  .contract-languages {
    font-size: 1rem;
    margin-bottom: 24px;
  }
  .other-langs {
    margin-left: 8px;
    color: #888;
    cursor: pointer;
    border-bottom: 1px dotted #888;
  }
  .metrics-section {
    margin-top: 16px;
    width: 100%;
  }
  .metrics-header {
    font-weight: bold;
    margin-bottom: 8px;
  }
  .metrics-slider {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  .metrics-slider button {
    background: #e5e7eb;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    font-weight: 500;
  }
  .metrics-slider button.active {
    background: #2563eb;
    color: #fff;
  }
  .metrics-list {
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .book-content {
    flex: 1;
    padding: 32px 32px 32px 24px;
    overflow-y: auto;
    position: relative;
  }
  .bookmarks {
    position: absolute;
    right: 0;
    top: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .bookmarks button {
    background: #f3f4f6;
    border: none;
    border-radius: 8px 0 0 8px;
    padding: 8px 18px 8px 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    margin-left: 8px;
  }
  .bookmarks button.active {
    background: #2563eb;
    color: #fff;
  }
  .tab-content {
    margin-right: 120px;
    margin-top: 0;
  }
  @media (max-width: 900px) {
    .book-layout {
      flex-direction: column;
      min-width: 320px;
      min-height: 400px;
      max-width: 98vw;
      max-height: 98vh;
    }
    .book-sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
      flex-direction: row;
      justify-content: flex-start;
      padding: 16px 12px;
    }
    .book-content {
      padding: 16px 12px;
    }
    .bookmarks {
      flex-direction: row;
      top: unset;
      bottom: 0;
      right: 0;
      left: 0;
      margin: 0 auto;
      justify-content: center;
      position: static;
      gap: 4px;
    }
    .tab-content {
      margin-right: 0;
    }
  }
</style>
