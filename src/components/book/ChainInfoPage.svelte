<script lang="ts">
  import NetworkStatus from "./metrics/NetworkStatus.svelte";
  import ActivityMetrics from "./metrics/ActivityMetrics.svelte";

  interface Props {
    chainStatic: any;
    chainDynamic: any;
    chainStatus: any;
    loadingDynamic: boolean;
    loadingStatus: boolean;
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    onSpanChange: (span: "1h" | "24h" | "7d" | "30d") => void;
  }

  let {
    chainStatic,
    chainDynamic,
    chainStatus,
    loadingDynamic,
    loadingStatus,
    metricsSpan,
    onSpanChange,
  }: Props = $props();

  async function addToWallet() {
    if (!window.ethereum) {
      alert("Please install a Web3 wallet like MetaMask");
      return;
    }

    try {
      const chainIdHex = "0x" + chainStatic.chainId.toString(16);

      // Try to switch to the network first
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        alert(`Switched to ${chainStatic.name}`);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Get the first RPC URL (prefer official)
          let rpcUrl;
          if (Array.isArray(chainStatic.rpcs)) {
            const officialRpc = chainStatic.rpcs.find(
              (rpc: any) => rpc.type === "official"
            );
            rpcUrl =
              officialRpc?.url ||
              chainStatic.rpcs[0]?.url ||
              chainStatic.rpcs[0];
          }

          if (!rpcUrl) {
            alert("No RPC URL available for this chain");
            return;
          }

          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: chainStatic.name,
                  nativeCurrency: {
                    name: chainStatic.nativeCurrency || "ETH",
                    symbol: chainStatic.nativeCurrency || "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [rpcUrl],
                  blockExplorerUrls: chainStatic.blockscanners?.[0]?.url
                    ? [chainStatic.blockscanners[0].url]
                    : [],
                },
              ],
            });
            alert(`${chainStatic.name} has been added to your wallet`);
          } catch (addError: any) {
            if (addError.code === 4001) {
              console.log("User rejected adding the network");
            } else {
              console.error("Failed to add network:", addError);
              alert("Failed to add network to wallet");
            }
          }
        } else if (switchError.code === 4001) {
          console.log("User rejected switching network");
        } else {
          console.error("Failed to switch network:", switchError);
          alert("Failed to switch network");
        }
      }
    } catch (err) {
      console.error("Failed to add to wallet:", err);
      alert("An unexpected error occurred");
    }
  }
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
    <div class="chain-subtitle">
      <span>Chain ID: {chainStatic.chainId}</span>
      <button class="add-wallet-btn" onclick={addToWallet} style="--brand-color: {chainStatic.color}">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-7" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
        </svg>
        Add to Wallet
      </button>
    </div>
  </div>

  {#if chainStatic.parentOrganization}
    <div class="author-attribution">
      <div class="author-line"></div>
      <span class="author-text">by {chainStatic.parentOrganization}</span>
      <div class="author-line"></div>
    </div>
  {/if}

  <div class="tech-stamps">
    <div class="stamp-container">
      <span class="tech-stamp {chainStatic.technology?.isL2 ? 'l2' : 'l1'}">
        <span class="stamp-label">Layer</span>
        <span class="stamp-value"
          >{chainStatic.technology?.isL2 ? "2" : "1"}</span
        >
      </span>
    </div>
    {#if chainStatic.technology?.settlementLayer}
      <div class="stamp-container">
        <span class="tech-stamp settlement">
          <span class="stamp-label">Settles on</span>
          <span class="stamp-value"
            >{chainStatic.technology.settlementLayer}</span
          >
        </span>
      </div>
    {/if}
    {#if chainStatic.technology?.type}
      <div class="stamp-container">
        <span class="tech-stamp type">
          <span class="stamp-value">{chainStatic.technology.type}</span>
        </span>
      </div>
    {/if}
    {#if chainStatic.technology?.isEVM}
      <div class="stamp-container">
        <span class="tech-stamp evm">
          <span class="stamp-value">EVM</span>
        </span>
      </div>
    {/if}
    {#if chainStatic.technology?.stack}
      <div class="stamp-container">
        <span class="tech-stamp stack">
          <span class="stamp-label">Stack</span>
          <span class="stamp-value">{chainStatic.technology.stack}</span>
        </span>
      </div>
    {/if}
  </div>

  <NetworkStatus {chainDynamic} {chainStatus} {loadingStatus} />

  <ActivityMetrics
    {metricsSpan}
    {onSpanChange}
    {loadingDynamic}
    {chainDynamic}
    brandColor={chainStatic.color}
  />
</div>

<style>
  .page-content {
    padding: 3rem;
    padding-right: 3.5rem;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
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
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.1rem;
    color: #64748b;
    font-weight: 500;
    justify-content: center;
  }

  .tech-stamps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .stamp-container {
    position: relative;
  }

  .tech-stamp {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: #fefefe;
    border: 2px solid #8b7355;
    border-radius: 2px;
    font-family: Georgia, "Times New Roman", serif;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transform: rotate(-1deg);
  }

  .tech-stamp:hover {
    transform: rotate(-1deg) scale(1.05);
  }

  /* Stamp texture effect */
  .tech-stamp::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(139, 115, 85, 0.03) 2px,
        rgba(139, 115, 85, 0.03) 4px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 2px,
        rgba(139, 115, 85, 0.03) 2px,
        rgba(139, 115, 85, 0.03) 4px
      );
    pointer-events: none;
  }

  .stamp-label {
    font-size: 0.5625rem;
    color: #8b7355;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.0625rem;
    line-height: 1;
  }

  .stamp-value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #3e2723;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
  }

  /* Individual stamp rotations for organic look */
  .stamp-container:nth-child(1) .tech-stamp {
    transform: rotate(-2deg);
  }
  .stamp-container:nth-child(2) .tech-stamp {
    transform: rotate(1deg);
  }
  .stamp-container:nth-child(3) .tech-stamp {
    transform: rotate(-1.5deg);
  }
  .stamp-container:nth-child(4) .tech-stamp {
    transform: rotate(2deg);
  }
  .stamp-container:nth-child(5) .tech-stamp {
    transform: rotate(-1deg);
  }

  .stamp-container:nth-child(1) .tech-stamp:hover {
    transform: rotate(-2deg) scale(1.05);
  }
  .stamp-container:nth-child(2) .tech-stamp:hover {
    transform: rotate(1deg) scale(1.05);
  }
  .stamp-container:nth-child(3) .tech-stamp:hover {
    transform: rotate(-1.5deg) scale(1.05);
  }
  .stamp-container:nth-child(4) .tech-stamp:hover {
    transform: rotate(2deg) scale(1.05);
  }
  .stamp-container:nth-child(5) .tech-stamp:hover {
    transform: rotate(-1deg) scale(1.05);
  }

  /* Special stamp colors */
  .tech-stamp.l1 {
    border-color: #d4a574;
  }

  .tech-stamp.l2 {
    border-color: #7b8fa6;
  }

  .tech-stamp.settlement {
    border-color: #7b8fa6;
  }

  .tech-stamp.evm,
  .tech-stamp.type,
  .tech-stamp.stack {
    border-color: #8b7355;
  }

  .add-wallet-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: transparent;
    color: #64748b;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    font-size: 0.8125rem;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto,
      sans-serif;
    cursor: pointer;
    transition: none;
  }

  .add-wallet-btn:hover {
    color: var(--brand-color);
    border-color: var(--brand-color);
    background: color-mix(in srgb, var(--brand-color) 10%, white);
  }

  .add-wallet-btn svg {
    flex-shrink: 0;
  }

  /* Book-style author attribution */
  .author-attribution {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 0 2rem;
  }

  .author-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  }

  .author-text {
    font-size: 0.9375rem;
    font-style: italic;
    color: #64748b;
    font-weight: 400;
    white-space: nowrap;
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0.025em;
  }

  @media (max-width: 1280px) {
    .page-content {
      padding: 2rem;
      padding-right: 2.5rem;
      gap: 1.25rem;
    }

    .chain-logo {
      width: 70px;
      height: 70px;
    }

    .chain-title {
      font-size: 2.25rem;
    }
  }

  @media (max-width: 1024px) {
    .page-content {
      gap: 2rem;
      padding-right: 2.5rem;
    }

    .add-wallet-btn {
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
    }

    .chain-title {
      font-size: 2rem;
    }

    .author-attribution {
      margin: 1.25rem 0;
      padding: 0 1rem;
    }

    .author-text {
      font-size: 0.875rem;
    }

    .tech-stamp {
      padding: 0.375rem 0.75rem;
    }

    .stamp-label {
      font-size: 0.5625rem;
    }

    .stamp-value {
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 900px) {
    .page-content {
      padding: 1.5rem;
      padding-right: 2rem;
    }

    .chain-logo {
      width: 65px;
      height: 65px;
    }

    .tech-stamps {
      justify-content: center;
    }
  }

  @media (max-width: 800px) {
    .page-content {
      padding: 1.5rem 1.25rem;
      gap: 1rem;
      overflow-x: hidden;
      height: calc(100vh - 50px);
    }

    .chain-header {
      margin-bottom: 0.75rem;
    }

    .chain-logo {
      width: 65px;
      height: 65px;
    }

    .chain-title {
      font-size: 2rem;
    }

    .chain-subtitle {
      font-size: 1rem;
    }

    .tech-stamps {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .page-content {
      padding: 1.25rem 1rem;
      gap: 0.75rem;
      overflow-x: hidden;
      height: calc(100vh - 50px);
    }

    .chain-header {
      margin-bottom: 0.5rem;
    }

    .chain-subtitle {
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.8125rem;
    }

    .add-wallet-btn {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      width: 100%;
      max-width: 200px;
    }

    .add-wallet-btn svg {
      width: 14px;
      height: 14px;
    }

    .chain-logo {
      width: 60px;
      height: 60px;
      margin-bottom: 0.75rem;
    }

    .chain-title {
      font-size: 1.75rem;
      margin-bottom: 0.375rem;
    }

    .author-attribution {
      margin: 0.75rem 0;
      padding: 0 1rem;
    }

    .author-text {
      font-size: 0.8125rem;
    }

    .tech-stamps {
      gap: 0.375rem;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .tech-stamp {
      padding: 0.375rem 0.625rem;
    }

    .stamp-label {
      font-size: 0.5rem;
      margin-bottom: 0.125rem;
    }

    .stamp-value {
      font-size: 0.75rem;
    }
  }
</style>
