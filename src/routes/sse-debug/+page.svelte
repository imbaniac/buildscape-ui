<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    sseConnection,
    chainsData,
    lastUpdate,
    dataMode,
  } from "$lib/stores/sse";

  // Debug state
  let events = $state<
    Array<{
      timestamp: Date;
      type: string;
      data: any;
      raw?: string;
    }>
  >([]);

  let stats = $state({
    totalEvents: 0,
    eventsPerMinute: 0,
    lastEventTime: null as Date | null,
    connectionUptime: 0,
    dataUpdateFrequency: [] as number[],
  });

  let eventSource = $state<EventSource | null>(null);
  let startTime = Date.now();
  let updateInterval: ReturnType<typeof setInterval>;

  function addEvent(type: string, data: any, raw?: string) {
    const now = new Date();
    events = [
      {
        timestamp: now,
        type,
        data,
        raw,
      },
      ...events.slice(0, 99),
    ]; // Keep last 100 events

    stats.totalEvents++;
    stats.lastEventTime = now;

    // Calculate update frequency
    if (stats.dataUpdateFrequency.length > 0) {
      stats.dataUpdateFrequency = [
        ...stats.dataUpdateFrequency.slice(-9),
        now.getTime(),
      ];
    } else {
      stats.dataUpdateFrequency = [now.getTime()];
    }
  }

  function calculateEventsPerMinute() {
    const oneMinuteAgo = Date.now() - 60000;
    const recentEvents = events.filter(
      (e) => e.timestamp.getTime() > oneMinuteAgo,
    );
    stats.eventsPerMinute = recentEvents.length;
  }

  function getAverageUpdateInterval() {
    if (stats.dataUpdateFrequency.length < 2) return "N/A";

    let totalDelta = 0;
    for (let i = 1; i < stats.dataUpdateFrequency.length; i++) {
      totalDelta +=
        stats.dataUpdateFrequency[i] - stats.dataUpdateFrequency[i - 1];
    }

    const avgMs = totalDelta / (stats.dataUpdateFrequency.length - 1);
    return (avgMs / 1000).toFixed(1) + "s";
  }

  function connectDirectSSE() {
    // Direct connection for debugging
    const url = "https://api.buildscape.org/events";

    eventSource = new EventSource(url);

    eventSource.onopen = () => {
      addEvent("connection", { status: "connected" });
    };

    eventSource.onerror = (error) => {
      addEvent("error", {
        message: "Connection error",
        readyState: eventSource?.readyState,
        error: error,
      });
    };

    eventSource.addEventListener("update", (event) => {
      addEvent("update", JSON.parse(event.data), event.data);
    });

    // Listen for any other event types
    eventSource.addEventListener("message", (event) => {
      addEvent("message", event.data, event.data);
    });

    eventSource.addEventListener("ping", (event) => {
      addEvent("ping", event.data);
    });

    eventSource.addEventListener("keep-alive", (event) => {
      addEvent("keep-alive", event.data);
    });
  }

  function disconnectDirectSSE() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      addEvent("connection", { status: "disconnected" });
    }
  }

  function clearEvents() {
    events = [];
    stats.totalEvents = 0;
    stats.dataUpdateFrequency = [];
  }

  onMount(() => {
    // Update stats every second
    updateInterval = setInterval(() => {
      calculateEventsPerMinute();
      stats.connectionUptime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
  });

  onDestroy(() => {
    disconnectDirectSSE();
    if (updateInterval) clearInterval(updateInterval);
  });

  // Format JSON with syntax highlighting
  function formatJSON(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  // Get chain by ID for focused debugging
  let selectedChainId = $state("");

  const selectedChainData = $derived(
    $chainsData.find((c) => c.chainId.toString() === selectedChainId),
  );
</script>

<div class="debug-container">
  <h1>SSE Debug Panel</h1>

  <!-- Connection Controls -->
  <div class="section">
    <h2>Connection Controls</h2>
    <div class="controls">
      <button onclick={connectDirectSSE} disabled={eventSource !== null}>
        Connect Direct SSE
      </button>
      <button onclick={disconnectDirectSSE} disabled={eventSource === null}>
        Disconnect
      </button>
      <button onclick={clearEvents}> Clear Events </button>
    </div>

    <div class="status">
      <span
        >Direct Connection: <strong
          >{eventSource ? "Connected" : "Disconnected"}</strong
        ></span
      >
      <span>Store Connection: <strong>{$sseConnection}</strong></span>
      <span
        >Ready State: <strong>{eventSource?.readyState ?? "N/A"}</strong></span
      >
    </div>
  </div>

  <!-- Statistics -->
  <div class="section">
    <h2>Statistics</h2>
    <div class="stats-grid">
      <div class="stat">
        <span>Total Events</span>
        <value>{stats.totalEvents}</value>
      </div>
      <div class="stat">
        <span>Events/min</span>
        <value>{stats.eventsPerMinute}</value>
      </div>
      <div class="stat">
        <span>Avg Update Interval</span>
        <value>{getAverageUpdateInterval()}</value>
      </div>
      <div class="stat">
        <span>Uptime</span>
        <value>{stats.connectionUptime}s</value>
      </div>
      <div class="stat">
        <span>Last Update</span>
        <value
          >{$lastUpdate
            ? new Date($lastUpdate).toLocaleTimeString()
            : "Never"}</value
        >
      </div>
      <div class="stat">
        <span>Data Mode</span>
        <value>{$dataMode || "Unknown"}</value>
      </div>
    </div>
  </div>

  <!-- Chain Data -->
  <div class="section">
    <h2>Current Chain Data ({$chainsData.length} chains)</h2>
    <div class="chain-selector">
      <select bind:value={selectedChainId}>
        <option value="">Select a chain to monitor</option>
        {#each $chainsData as chain (chain.chainId)}
          <option value={chain.chainId.toString()}
            >{chain.name} ({chain.chainId})</option
          >
        {/each}
      </select>
    </div>

    <!-- Debug info -->
    <div class="debug-info">
      <small
        >Selected ID: {selectedChainId || "none"} | Type: {typeof selectedChainId}</small
      >
    </div>

    {#if selectedChainData}
      <div class="chain-details">
        <h3>{selectedChainData.name}</h3>
        <div class="chain-grid">
          <div class="detail">
            <span>Status</span>
            <value class="status-{selectedChainData.status}"
              >{selectedChainData.status}</value
            >
          </div>
          <div class="detail">
            <span>Current Block</span>
            <value>{selectedChainData.currentBlock.toLocaleString()}</value>
          </div>
          <div class="detail">
            <span>Target Block</span>
            <value>{selectedChainData.targetBlock.toLocaleString()}</value>
          </div>
          <div class="detail">
            <span>Sync Progress</span>
            <value>{selectedChainData.syncProgress.toFixed(2)}%</value>
          </div>
          <div class="detail">
            <span>TPS</span>
            <value>{selectedChainData.tps.toFixed(2)}</value>
          </div>
          <div class="detail">
            <span>Gas Price</span>
            <value>{selectedChainData.gasPrice} gwei</value>
          </div>
        </div>

        <details>
          <summary>Full Data</summary>
          <pre>{formatJSON(selectedChainData)}</pre>
        </details>
      </div>
    {:else if selectedChainId}
      <div class="chain-details">
        <p>No data found for chain ID: {selectedChainId}</p>
      </div>
    {/if}

    <!-- Show all chains summary -->
    <details style="margin-top: 1rem;">
      <summary>All Chains Data ({$chainsData.length} chains)</summary>
      <div class="all-chains-grid">
        {#each $chainsData as chain (chain.chainId)}
          <div class="chain-summary">
            <strong>{chain.name} ({chain.chainId})</strong>
            <div>Block: {chain.currentBlock.toLocaleString()}</div>
            <div>TPS: {chain.tps.toFixed(2)}</div>
            <div>
              Status: <span class="status-{chain.status}">{chain.status}</span>
            </div>
          </div>
        {/each}
      </div>
    </details>
  </div>

  <!-- Event Log -->
  <div class="section">
    <h2>Event Log</h2>
    <div class="event-log">
      {#each events as event (event.timestamp.getTime())}
        <div class="event event-{event.type}">
          <div class="event-header">
            <span class="event-time"
              >{event.timestamp.toLocaleTimeString()}.{event.timestamp.getMilliseconds()}</span
            >
            <span class="event-type">{event.type}</span>
          </div>
          {#if event.raw}
            <details>
              <summary>Data Preview</summary>
              <pre class="event-data">{formatJSON(event.data)}</pre>
              <details>
                <summary>Raw Data</summary>
                <pre class="event-raw">{event.raw}</pre>
              </details>
            </details>
          {:else}
            <pre class="event-data">{formatJSON(event.data)}</pre>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .debug-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: monospace;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
  }

  .section {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #444;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #007bff;
    background: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .status {
    display: flex;
    gap: 2rem;
    font-size: 0.9rem;
  }

  .status strong {
    color: #007bff;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .stat span,
  .detail span {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .stat value {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

  .chain-selector {
    margin-bottom: 1rem;
  }

  .chain-selector select {
    width: 100%;
    padding: 0.5rem;
    font-family: monospace;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .chain-details {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .chain-details h3 {
    margin-top: 0;
  }

  .chain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .detail value {
    display: block;
    font-weight: bold;
  }

  .status-live {
    color: #28a745;
  }
  .status-syncing {
    color: #ffc107;
  }
  .status-error {
    color: #dc3545;
  }
  .status-stopped {
    color: #6c757d;
  }

  .event-log {
    max-height: 600px;
    overflow-y: auto;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }

  .event {
    border-bottom: 1px solid #f0f0f0;
    padding: 0.75rem;
  }

  .event:last-child {
    border-bottom: none;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .event-time {
    font-size: 0.8rem;
    color: #666;
  }

  .event-type {
    font-size: 0.8rem;
    padding: 0.125rem 0.5rem;
    border-radius: 3px;
    font-weight: bold;
  }

  .event-update .event-type {
    background: #d4edda;
    color: #155724;
  }

  .event-connection .event-type {
    background: #cce5ff;
    color: #004085;
  }

  .event-error .event-type {
    background: #f8d7da;
    color: #721c24;
  }

  .event-ping .event-type,
  .event-keep-alive .event-type {
    background: #fff3cd;
    color: #856404;
  }

  .event-data,
  .event-raw {
    font-size: 0.75rem;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 3px;
    overflow-x: auto;
    margin: 0;
  }

  details {
    margin-top: 0.5rem;
  }

  summary {
    cursor: pointer;
    font-size: 0.85rem;
    color: #007bff;
    user-select: none;
  }

  summary:hover {
    text-decoration: underline;
  }

  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .debug-info {
    margin-top: 0.5rem;
    color: #666;
  }

  .all-chains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .chain-summary {
    background: white;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    font-size: 0.85rem;
  }

  .chain-summary strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .chain-summary div {
    margin: 0.25rem 0;
    color: #666;
  }
</style>
