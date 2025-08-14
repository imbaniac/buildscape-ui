<script lang="ts">
  import NetworkStatus from "./metrics/NetworkStatus.svelte";
  import ActivityMetrics from "./metrics/ActivityMetrics.svelte";
  import Tooltip from "./ui/Tooltip.svelte";
  import { tooltipTexts } from "$lib/tooltips";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import { formatTVL } from "$lib/utils/formatters";
  import { getContext } from "svelte";

  interface Props {
    chainStatic: any;
  }

  let { chainStatic }: Props = $props();

  // Get dynamic data directly from layout context
  const dynamicData = getContext<{
    chainDynamic: any;
    loadingDynamic: boolean;
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    chainStatus: any;
    loadingStatus: boolean;
    setMetricsSpan: (span: "1h" | "24h" | "7d" | "30d") => void;
  }>("chainDynamicData");

  // Use derived values for cleaner template access
  const chainDynamic = $derived(dynamicData.chainDynamic);
  const chainStatus = $derived(dynamicData.chainStatus);
  const loadingDynamic = $derived(dynamicData.loadingDynamic);
  const loadingStatus = $derived(dynamicData.loadingStatus);
  const metricsSpan = $derived(dynamicData.metricsSpan);
  const onSpanChange = dynamicData.setMetricsSpan;

  // Get accessible color for UI elements
  const accessibleColor = $derived(
    getAccessibleBrandColor(chainStatic?.color || "#3b82f6"),
  );

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
              (rpc: any) => rpc.type === "official",
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
    <h1 class="chain-title">
      {chainStatic.name}
      <sup class="footnote-ref">1</sup>
    </h1>
    <div class="chain-subtitle">
      <span>Chain ID: {chainStatic.chainId}</span>
      {#if chainStatic.website}
        <span class="separator">•</span>
        <a
          href={chainStatic.website}
          target="_blank"
          rel="noopener noreferrer"
          class="chain-website"
          style="color: {accessibleColor}"
        >
          Website
        </a>
      {/if}
      <span class="separator">•</span>
      <button
        class="add-wallet-btn-inline"
        onclick={addToWallet}
        style="--brand-color: {accessibleColor}"
      >
        <svg
          width="12"
          height="12"
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
      <span class="author-text">
        by {chainStatic.parentOrganization}{#if chainStatic.launchDate}<sup
            class="footnote-ref">2</sup
          >{/if}
      </span>
      <div class="author-line"></div>
    </div>
  {/if}

  <div class="tech-stamps">
    <div class="stamp-container">
      <Tooltip
        text={chainStatic.technology?.isL3
          ? tooltipTexts.layer3
          : chainStatic.technology?.isL2
            ? tooltipTexts.layer2
            : tooltipTexts.layer1}
      >
        <span
          class="tech-stamp {chainStatic.technology?.isL3
            ? 'l3'
            : chainStatic.technology?.isL2
              ? 'l2'
              : 'l1'}"
        >
          <span class="stamp-label">Layer</span>
          <span class="stamp-value"
            >{chainStatic.technology?.isL3
              ? "3"
              : chainStatic.technology?.isL2
                ? "2"
                : "1"}</span
          >
        </span>
      </Tooltip>
    </div>
    {#if chainStatic.technology?.settlementLayer}
      <div class="stamp-container">
        <Tooltip text={tooltipTexts.settlementLayer}>
          <span class="tech-stamp settlement">
            <span class="stamp-label">Settles on</span>
            <span class="stamp-value"
              >{chainStatic.technology.settlementLayer}</span
            >
          </span>
        </Tooltip>
      </div>
    {/if}
    {#if chainStatic.technology?.type}
      <div class="stamp-container">
        <Tooltip
          text={chainStatic.technology.type === "Optimistic Rollup"
            ? tooltipTexts.optimisticRollup
            : chainStatic.technology.type === "zk Rollup" ||
                chainStatic.technology.type === "ZK Rollup"
              ? tooltipTexts.zkRollup
              : chainStatic.technology.type === "Sidechain"
                ? tooltipTexts.sidechain
                : `${chainStatic.technology.type} technology`}
        >
          <span class="tech-stamp type">
            <span class="stamp-value">{chainStatic.technology.type}</span>
          </span>
        </Tooltip>
      </div>
    {/if}
    {#if chainStatic.technology?.isEVM}
      <div class="stamp-container">
        <Tooltip text={tooltipTexts.evm}>
          <span class="tech-stamp evm">
            <span class="stamp-value">EVM</span>
          </span>
        </Tooltip>
      </div>
    {/if}
    {#if chainStatic.technology?.stack}
      <div class="stamp-container">
        <Tooltip
          text={chainStatic.technology.stack === "OP Stack"
            ? tooltipTexts.opStack
            : chainStatic.technology.stack === "Arbitrum Nitro"
              ? tooltipTexts.arbitrumNitro
              : chainStatic.technology.stack === "ZK Stack"
                ? tooltipTexts.zkStack
                : `${chainStatic.technology.stack} technology stack`}
        >
          <span class="tech-stamp stack">
            <span class="stamp-label">Stack</span>
            <span class="stamp-value">{chainStatic.technology.stack}</span>
          </span>
        </Tooltip>
      </div>
    {/if}
  </div>

  <NetworkStatus
    {chainDynamic}
    {chainStatus}
    {loadingStatus}
    brandColor={chainStatic.color}
    maxBlockSize={chainStatic.maxBlockSize}
    nativeCurrency={chainStatic.nativeCurrency}
  />

  <ActivityMetrics
    {metricsSpan}
    {onSpanChange}
    {loadingDynamic}
    {chainDynamic}
    brandColor={accessibleColor}
  />

  <div class="footnotes">
    <div class="footnote">
      <sup>1</sup> Total Value Locked: {formatTVL(chainStatus?.tvl)}
    </div>
    {#if chainStatic.launchDate}
      <div class="footnote">
        <sup>2</sup> Live Since {new Date(
          chainStatic.launchDate,
        ).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
      </div>
    {/if}
  </div>

  <div class="data-disclaimer">
    <div class="disclaimer-ornament">◆ ◇ ◆</div>
    <div class="disclaimer-text">
      The reader is advised that data herein may not be current.<br />
      Independent verification is recommended.
    </div>
    <div class="disclaimer-ornament">◆ ◇ ◆</div>
  </div>
</div>

<style>
  .page-content {
    position: absolute;
    top: 2rem;
    right: 3rem;
    bottom: 1rem;
    left: 3rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background-color: #fafaf9;
  }

  .chain-header {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .chain-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    display: block;
  }

  .chain-title {
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b;
    line-height: 1.2;
    font-family: var(--font-display);
  }

  .chain-subtitle {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    color: #64748b;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    font-family: var(--font-ui);
  }

  .tech-stamps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
    /* Ensure stamps don't start at the very edge */
    justify-content: center;
  }

  .stamp-container {
    position: relative;
    z-index: 1;
  }

  .tech-stamp {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid #d4d4d8;
    border-radius: 2px;
    position: relative;
    box-shadow: 0 0.5px 2px rgba(0, 0, 0, 0.05);
    transform: rotate(-0.5deg);
    transition: transform 0.2s ease;
  }

  .tech-stamp:hover {
    transform: rotate(-0.5deg) scale(1.03);
  }

  /* Stamp texture effect */
  .tech-stamp::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(139, 115, 85, 0.02) 2px,
        rgba(139, 115, 85, 0.02) 4px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 2px,
        rgba(139, 115, 85, 0.02) 2px,
        rgba(139, 115, 85, 0.02) 4px
      );
    pointer-events: none;
  }

  .stamp-label {
    font-size: 0.5rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.0625rem;
    line-height: 1;
  }

  .stamp-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
    font-family: var(--font-ui);
  }

  /* Individual stamp rotations for organic look */
  .stamp-container:nth-child(1) .tech-stamp {
    transform: rotate(-1deg);
  }
  .stamp-container:nth-child(2) .tech-stamp {
    transform: rotate(0.5deg);
  }
  .stamp-container:nth-child(3) .tech-stamp {
    transform: rotate(-0.75deg);
  }
  .stamp-container:nth-child(4) .tech-stamp {
    transform: rotate(1deg);
  }
  .stamp-container:nth-child(5) .tech-stamp {
    transform: rotate(-0.5deg);
  }

  .stamp-container:nth-child(1) .tech-stamp:hover {
    transform: rotate(-1deg) scale(1.03);
  }
  .stamp-container:nth-child(2) .tech-stamp:hover {
    transform: rotate(0.5deg) scale(1.03);
  }
  .stamp-container:nth-child(3) .tech-stamp:hover {
    transform: rotate(-0.75deg) scale(1.03);
  }
  .stamp-container:nth-child(4) .tech-stamp:hover {
    transform: rotate(1deg) scale(1.03);
  }
  .stamp-container:nth-child(5) .tech-stamp:hover {
    transform: rotate(-0.5deg) scale(1.03);
  }

  /* Special stamp colors */
  .tech-stamp.l1 {
    border-color: #e2e8f0;
  }

  .tech-stamp.l2 {
    border-color: #cbd5e1;
  }

  .tech-stamp.settlement {
    border-color: #cbd5e1;
  }

  .tech-stamp.evm,
  .tech-stamp.type,
  .tech-stamp.stack {
    border-color: #d4d4d8;
  }

  .add-wallet-btn-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
    background: transparent;
    color: #64748b;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    font-family:
      -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    cursor: pointer;
    transition: color 0.2s;
  }

  .add-wallet-btn-inline:hover {
    color: var(--brand-color);
  }

  .add-wallet-btn-inline svg {
    flex-shrink: 0;
  }

  /* Footnotes */
  .footnotes {
    margin-top: 1.5rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .footnote {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.5;
  }

  .footnote sup {
    font-size: 0.625rem;
    margin-right: 0.25rem;
    color: #94a3b8;
  }

  /* Footnote references in main content */
  .footnote-ref {
    font-size: 0.6em;
    font-weight: 400;
    color: #94a3b8;
    vertical-align: super;
    margin-left: 0.125rem;
    font-style: normal;
  }

  /* Book-style author attribution */
  .author-attribution {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.75rem 0;
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
    letter-spacing: 0.025em;
    font-family: var(--font-body);
  }

  /* Mobile/Tablet view - single page */
  @media (max-width: 1280px) {
    .page-content {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      padding: 1.5rem;
      gap: 1rem;
      overflow: visible;
      height: auto; /* Let content determine height */
      display: flex;
      flex-direction: column;
    }

    .chain-header {
      margin-bottom: 0.5rem;
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

    .footnotes {
      padding-top: 1.5rem;
    }

    .footnote {
      font-size: 0.6875rem;
    }
  }

  /* Chain subtitle elements */
  .separator {
    color: #cbd5e1;
    margin: 0 0.5rem;
  }

  @media (max-width: 1280px) {
    .separator {
      margin: 0rem;
      line-height: 1px;
    }
  }

  .chain-website {
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .chain-website:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  /* Data disclaimer - Book style */
  .data-disclaimer {
    text-align: center;
    margin-top: auto;
    padding-top: 1.5rem;
    font-family: var(--font-body);
    color: #8b7355;
    line-height: 1.6;
  }

  .disclaimer-ornament {
    font-size: 0.625rem;
    letter-spacing: 0.25em;
    opacity: 0.6;
    margin: 0.25rem 0;
  }

  .disclaimer-text {
    font-size: 0.6875rem;
    font-style: italic;
    letter-spacing: 0.02em;
    line-height: 1.5;
    opacity: 0.85;
  }

  @media (max-width: 1280px) {
    .data-disclaimer {
      padding-top: 1rem;
    }
    
    .disclaimer-text {
      font-size: 0.625rem;
    }
    
    .disclaimer-ornament {
      font-size: 0.5625rem;
    }
  }
</style>
