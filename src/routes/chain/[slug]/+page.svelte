<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  import BookLayout from "../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../components/book/ChainDetailsPage.svelte";
  import { sseConnection } from "$lib/stores/sse";
  import {
    getChainData,
    initializeChainDataFeed,
    cleanupChainDataFeed,
  } from "$lib/stores/chainDataStore";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import SEO from "$lib/components/SEO.svelte";
  import type { PageData } from "./$types";
  import type { BookmarkTab, BookmarkField } from "$lib/types";

  let { data }: { data: PageData } = $props();

  let activeTab = $state(data.initialTab);
  let activeGroup = $state(data.initialTab);
  let metricsSpan = $state<"1h" | "24h" | "7d" | "30d">(data.initialSpan);
  let chainDynamic = $state<any>(null);
  let loadingDynamic = $state(false);

  // Non-critical data states
  let dynamicLoader = $state<any>(null);
  let walletsByCategory = $state<any>({});
  let loadingNonCritical = $state(true);

  // Get real-time chain data from SSE store
  const chainDataStore = data.chainStatic?.chainId
    ? getChainData(data.chainStatic.chainId.toString())
    : null;

  // Derive chain status from store
  const chainStatus = $derived(chainDataStore ? $chainDataStore : null);
  const loadingStatus = $derived(!chainStatus);

  $effect(() => {
    const currentTab = $page.url.searchParams.get("tab") || "overview";
    const currentSpan = $page.url.searchParams.get("span") || "24h";

    // Only update URL if values have actually changed
    if (currentTab !== activeTab || currentSpan !== metricsSpan) {
      const url = new URL($page.url);
      url.searchParams.set("tab", activeTab);
      url.searchParams.set("span", metricsSpan);
      goto(url.toString(), { replaceState: true, noScroll: true });
    }
  });

  function handleTabClick(tabId: string, groupId: string) {
    activeTab = tabId;
    activeGroup = groupId;
  }

  $effect(() => {
    // Update activeGroup based on activeTab
    const group = data.bookmarks.find(
      (g: BookmarkTab) =>
        g.id === activeTab ||
        g.fields.some((f: BookmarkField) => f.field === activeTab)
    );
    if (group) {
      activeGroup = group.id;
    }
  });

  async function loadDynamic(span: "1h" | "24h" | "7d" | "30d") {
    if (!dynamicLoader) return;

    loadingDynamic = true;
    try {
      chainDynamic = await dynamicLoader(span);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
    } finally {
      loadingDynamic = false;
    }
  }

  // Handle streamed non-critical data
  $effect(() => {
    if (data.streamed?.nonCritical) {
      data.streamed.nonCritical.then((nonCritical) => {
        dynamicLoader = nonCritical.dynamicLoader;
        walletsByCategory = nonCritical.walletsByCategory;
        loadingNonCritical = false;

        // Once dynamic loader is available, load the dynamic data
        if (dynamicLoader) {
          loadDynamic(metricsSpan);
        }
      });
    }
  });

  function handleClose() {
    goto("/");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  onMount(() => {
    // Initialize chain data feed for this specific chain
    if (data.chainStatic?.chainId) {
      initializeChainDataFeed(data.chainStatic.chainId.toString());
    }

    // Dynamic data will be loaded once the loader is available via the effect

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  onDestroy(() => {
    // Clean up polling for this specific chain
    if (data.chainStatic?.chainId) {
      cleanupChainDataFeed(data.chainStatic.chainId.toString());
    }
  });

  // React to metricsSpan changes
  let previousSpan = metricsSpan;
  $effect(() => {
    if (metricsSpan !== previousSpan) {
      previousSpan = metricsSpan;
      loadDynamic(metricsSpan);
    }
  });

  // Different title formats based on chain characteristics
  // Note: Avoiding dynamic metrics in titles since Google crawls infrequently
  const seoTitle = $derived(() => {
    if (!data.chainStatic?.name) return "Blockchain Explorer | Buildscape";

    const name = data.chainStatic.name;
    const isL2 = data.chainStatic.technology?.isL2;

    // L2s emphasize their L2 nature
    if (isL2) {
      return `${name} L2 - Blockchain Metrics, RPCs & Resources`;
    }

    // Default format focuses on key services
    return `${name} - Network Stats, RPCs & Developer Resources`;
  });

  // Rich, intent-driven descriptions with actual chain description when available
  const seoDescription = $derived(() => {
    if (!data.chainStatic?.name)
      return "Explore blockchain metrics and resources on Buildscape";

    const name = data.chainStatic.name;
    const chainId = data.chainStatic.chainId;
    const nativeCurrency = data.chainStatic.nativeCurrency || "ETH";
    const isEVM = data.chainStatic.technology?.isEVM;
    const isL2 = data.chainStatic.technology?.isL2;

    // Use actual description if available and truncate to ~160 chars for SEO
    if (data.chainStatic.description) {
      const cleanDesc = data.chainStatic.description
        .split("\n")[0] // First paragraph only
        .replace(/[*#]/g, "") // Remove markdown
        .trim();

      // If description is good length, enhance it with key facts
      if (cleanDesc.length > 50 && cleanDesc.length < 140) {
        return `${cleanDesc} Track metrics, access RPCs, and explore ecosystem.`;
      } else if (cleanDesc.length >= 140) {
        // Truncate long descriptions
        return cleanDesc.substring(0, 157) + "...";
      }
    }

    // Fallback to generated description
    let description = `${name} blockchain network (Chain ID: ${chainId}, Native token: ${nativeCurrency}).`;

    // Add technical details
    if (isEVM && isL2) {
      description += " EVM-compatible Layer 2 scaling solution.";
    } else if (isEVM) {
      description += " EVM-compatible blockchain.";
    } else if (isL2) {
      description += " Layer 2 scaling solution.";
    }

    // Add value proposition without specific numbers
    description += ` Track real-time metrics including TPS, gas fees, and TVL. Access verified RPC endpoints, connect wallets, and explore dApps.`;

    return description;
  });

  // Comprehensive keywords covering all search intents
  const seoKeywords = $derived(() => {
    if (!data.chainStatic?.name) return "";

    const name = data.chainStatic.name;
    const chainId = data.chainStatic.chainId;
    const nativeCurrency = data.chainStatic.nativeCurrency || "ETH";
    const isEVM = data.chainStatic.technology?.isEVM;
    const isL2 = data.chainStatic.technology?.isL2;

    const keywords = [
      // Brand/name variations
      name,
      `${name} blockchain`,
      `${name} network`,
      `${name} chain`,

      // Chain ID searches (very common)
      `chain id ${chainId}`,
      `chainid ${chainId}`,
      `${chainId} chain id`,
      `network ${chainId}`,

      // Technical searches
      `${name} rpc`,
      `${name} rpc url`,
      `${name} mainnet rpc`,
      `${name} node`,

      // Metrics searches
      `${name} tvl`,
      `${name} tps`,
      `${name} gas fees`,
      `${name} gas price`,

      // Currency searches
      `${name} ${nativeCurrency}`,
      `${nativeCurrency} network`,

      // How-to searches
      `how to connect to ${name}`,
      `add ${name} to metamask`,
      `${name} metamask`,
      `${name} wallet`,

      // Developer searches
      `${name} docs`,
      `${name} documentation`,
      `${name} developer`,
      `${name} faucet`,
      `${name} testnet`,

      // Comparison searches
      `${name} vs ethereum`,
      `is ${name} evm compatible`,
    ];

    // Add EVM-specific keywords
    if (isEVM) {
      keywords.push(`${name} evm`, "evm compatible");
    }

    // Add L2-specific keywords
    if (isL2) {
      keywords.push(`${name} l2`, `${name} layer 2`, "layer 2 blockchain");
    }

    return keywords.join(", ");
  });

  // Enhanced structured data following SEO best practices
  const jsonLd = $derived({
    "@context": "https://schema.org",
    "@graph": [
      // WebSite schema for search functionality
      {
        "@type": "WebSite",
        "@id": "https://buildscape.org/#website",
        name: "Buildscape",
        url: "https://buildscape.org",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://buildscape.org/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      // Organization schema for the blockchain entity
      {
        "@type": "Organization",
        "@id": `https://buildscape.org/chain/${data.slug}#organization`,
        name:
          data.chainStatic?.parentOrganization ||
          data.chainStatic?.name ||
          "Unknown",
        url:
          data.chainStatic?.website ||
          `https://buildscape.org/chain/${data.slug}`,
        ...(data.chainStatic?.logo && {
          logo: `https://buildscape.org/chains/${data.chainStatic.logo}`,
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the Chain ID for ${data.chainStatic?.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The Chain ID for ${data.chainStatic?.name} is ${data.chainStatic?.chainId}. This unique identifier is used when adding the network to wallets like MetaMask.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the native currency of ${data.chainStatic?.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The native currency of ${data.chainStatic?.name} is ${data.chainStatic?.nativeCurrency || "ETH"}. This is the token used to pay for transaction fees on the network.`,
            },
          },
          ...(data.chainStatic?.technology?.isEVM
            ? [
                {
                  "@type": "Question",
                  name: `Is ${data.chainStatic?.name} EVM compatible?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, ${data.chainStatic?.name} is EVM (Ethereum Virtual Machine) compatible. This means you can use Ethereum development tools and deploy Solidity smart contracts on this network.`,
                  },
                },
              ]
            : []),
          {
            "@type": "Question",
            name: `How do I add ${data.chainStatic?.name} to MetaMask?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `To add ${data.chainStatic?.name} to MetaMask: 1) Open MetaMask and go to Settings > Networks > Add Network. 2) Enter Chain ID: ${data.chainStatic?.chainId}, Currency Symbol: ${data.chainStatic?.nativeCurrency || "ETH"}, and an RPC URL from our verified list. 3) Click Save to add the network.`,
            },
          },
          ...(data.chainStatic?.technology?.isL2
            ? [
                {
                  "@type": "Question",
                  name: `What Layer 1 does ${data.chainStatic?.name} settle to?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${data.chainStatic?.name} is a Layer 2 scaling solution that settles to ${data.chainStatic?.technology?.settlementLayer || "Ethereum"}. This means it inherits security from the L1 while providing faster and cheaper transactions.`,
                  },
                },
              ]
            : []),
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://buildscape.org",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blockchains",
            item: "https://buildscape.org/chains",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: data.chainStatic?.name || "Chain",
            item: `https://buildscape.org/chain/${data.slug}`,
          },
        ],
      },
      // Article schema for better content understanding
      {
        "@type": "Article",
        "@id": `https://buildscape.org/chain/${data.slug}#article`,
        headline: seoTitle(),
        description: seoDescription(),
        author: {
          "@type": "Organization",
          name: "Buildscape",
          url: "https://buildscape.org",
        },
        publisher: {
          "@type": "Organization",
          name: "Buildscape",
          url: "https://buildscape.org",
          logo: {
            "@type": "ImageObject",
            url: "https://buildscape.org/logo.png",
          },
        },
        datePublished:
          data.chainStatic?.launchDate ||
          new Date().toISOString().split("T")[0],
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://buildscape.org/chain/${data.slug}`,
        },
        ...(data.chainStatic?.logoUrl && {
          image: {
            "@type": "ImageObject",
            url: `https://buildscape.org${data.chainStatic.logoUrl}`,
          },
        }),
      },
    ],
  });
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${data.slug}`}
  ogImage={`https://buildscape.org/og/chain/${data.slug}.png`}
  ogType="article"
  {jsonLd}
/>

<!-- SSE Connection Status Indicator -->
{#if $sseConnection !== "connected"}
  <div
    class="sse-status-indicator"
    class:connecting={$sseConnection === "connecting"}
    class:error={$sseConnection === "error" ||
      $sseConnection === "disconnected"}
  >
    <span class="status-dot"></span>
    <span class="status-text">
      {#if $sseConnection === "connecting"}
        Connecting...
      {:else}
        Connection lost
      {/if}
    </span>
  </div>
{/if}

<BookLayout
  onClose={handleClose}
  brandColor={getAccessibleBrandColor(data.chainStatic?.color || "#3b82f6")}
>
  {#snippet leftPage()}
    <ChainInfoPage
      chainStatic={data.chainStatic}
      {chainDynamic}
      {chainStatus}
      {loadingDynamic}
      {loadingStatus}
      {metricsSpan}
      onSpanChange={(span) => (metricsSpan = span)}
    />
  {/snippet}

  {#snippet rightPage()}
    <ChainDetailsPage
      chainStatic={data.chainStatic}
      bookmarks={data.bookmarks}
      {walletsByCategory}
      {activeTab}
      {activeGroup}
      onTabClick={handleTabClick}
    />
  {/snippet}
</BookLayout>

<style>
  .sse-status-indicator {
    position: fixed;
    top: 1rem;
    right: 5rem; /* Position to the left of the close button */
    z-index: 15;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 9999px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    font-size: 0.75rem;
    transition: opacity 0.2s ease;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .sse-status-indicator.connecting .status-dot {
    background-color: #eab308; /* Yellow */
  }

  .sse-status-indicator.error .status-dot {
    background-color: #ef4444; /* Red */
  }

  .status-text {
    color: #64748b;
    font-weight: 500;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 800px) {
    .sse-status-indicator {
      top: 0.75rem;
      right: 4rem;
      font-size: 0.7rem;
      padding: 0.25rem 0.625rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
    }
  }
</style>
