<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import BookLayout from "../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../components/book/ChainDetailsPage.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import { getContext } from "svelte";


  // Get data from layout
  const layoutData = $derived($page.data);
  const bookmarks = $derived(layoutData.bookmarks);
  
  // Get dynamic data from context (set by layout)
  const dynamicData = getContext<{
    chainStatic: any;
    chainDynamic: any;
    loadingDynamic: boolean;
    metricsSpan: "1h" | "24h" | "7d" | "30d";
    chainStatus: any;
    loadingStatus: boolean;
    setMetricsSpan: (span: "1h" | "24h" | "7d" | "30d") => void;
  }>("chainDynamicData");

  // Use derived values for cleaner template access
  const chainStatic = $derived(dynamicData.chainStatic);
  const chainDynamic = $derived(dynamicData.chainDynamic);
  const chainStatus = $derived(dynamicData.chainStatus);
  const loadingDynamic = $derived(dynamicData.loadingDynamic);
  const loadingStatus = $derived(dynamicData.loadingStatus);
  const metricsSpan = $derived(dynamicData.metricsSpan);
  const onSpanChange = dynamicData.setMetricsSpan;

  // Different title formats based on chain characteristics
  const seoTitle = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name) return "Blockchain Explorer | Buildscape";

    const isL2 = chainStatic?.technology?.isL2 || layoutData.technology?.isL2;

    // L2s emphasize their L2 nature
    if (isL2) {
      return `${name} L2 - Blockchain Metrics, RPCs & Resources`;
    }

    // Default format focuses on key services
    return `${name} - Network Stats, RPCs & Developer Resources`;
  });

  // Rich, intent-driven descriptions with actual chain description when available
  const seoDescription = $derived(() => {
    const name = chainStatic?.name || layoutData.name;
    if (!name)
      return "Explore blockchain metrics and resources on Buildscape";

    const chainId = chainStatic?.chainId || layoutData.chainId;
    const nativeCurrency = chainStatic?.nativeCurrency || "ETH";
    const isEVM = chainStatic?.technology?.isEVM || layoutData.technology?.isEVM;
    const isL2 = chainStatic?.technology?.isL2 || layoutData.technology?.isL2;

    // Use actual description if available and truncate to ~160 chars for SEO
    if (chainStatic?.description) {
      const cleanDesc = chainStatic.description
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
    if (!chainStatic?.name) return "";

    const name = chainStatic.name;
    const chainId = chainStatic.chainId;
    const nativeCurrency = chainStatic.nativeCurrency || "ETH";
    const isEVM = chainStatic.technology?.isEVM;
    const isL2 = chainStatic.technology?.isL2;

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
        "@id": `https://buildscape.org/chain/${layoutData.slug}#organization`,
        name: chainStatic?.parentOrganization || chainStatic?.name || "Unknown",
        url:
          chainStatic?.website ||
          `https://buildscape.org/chain/${layoutData.slug}`,
        ...(chainStatic?.logo && {
          logo: `https://buildscape.org/chains/${chainStatic.logo}`,
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the Chain ID for ${chainStatic?.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The Chain ID for ${chainStatic?.name} is ${chainStatic?.chainId}. This unique identifier is used when adding the network to wallets like MetaMask.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the native currency of ${chainStatic?.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The native currency of ${chainStatic?.name} is ${chainStatic?.nativeCurrency || "ETH"}. This is the token used to pay for transaction fees on the network.`,
            },
          },
          ...(chainStatic?.technology?.isEVM
            ? [
                {
                  "@type": "Question",
                  name: `Is ${chainStatic?.name} EVM compatible?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, ${chainStatic?.name} is EVM (Ethereum Virtual Machine) compatible. This means you can use Ethereum development tools and deploy Solidity smart contracts on this network.`,
                  },
                },
              ]
            : []),
          {
            "@type": "Question",
            name: `How do I add ${chainStatic?.name} to MetaMask?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `To add ${chainStatic?.name} to MetaMask: 1) Open MetaMask and go to Settings > Networks > Add Network. 2) Enter Chain ID: ${chainStatic?.chainId}, Currency Symbol: ${chainStatic?.nativeCurrency || "ETH"}, and an RPC URL from our verified list. 3) Click Save to add the network.`,
            },
          },
          ...(chainStatic?.technology?.isL2
            ? [
                {
                  "@type": "Question",
                  name: `What Layer 1 does ${chainStatic?.name} settle to?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${chainStatic?.name} is a Layer 2 scaling solution that settles to ${chainStatic?.technology?.settlementLayer || "Ethereum"}. This means it inherits security from the L1 while providing faster and cheaper transactions.`,
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
            name: chainStatic?.name || "Chain",
            item: `https://buildscape.org/chain/${layoutData.slug}`,
          },
        ],
      },
      // Article schema for better content understanding
      {
        "@type": "Article",
        "@id": `https://buildscape.org/chain/${layoutData.slug}#article`,
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
          chainStatic?.launchDate || new Date().toISOString().split("T")[0],
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://buildscape.org/chain/${layoutData.slug}`,
        },
        ...(chainStatic?.logoUrl && {
          image: {
            "@type": "ImageObject",
            url: `https://buildscape.org${chainStatic.logoUrl}`,
          },
        }),
      },
    ],
  });

  // Determine where to navigate back to based on navigation state
  const backPath = $derived(
    $page.state?.from === "/chains" ? "/chains" : 
    $page.state?.from === "/" ? "/" :
    "/"
  );

  function handleClose() {
    // Navigate back to where the user came from (map or table view)
    goto(backPath);
  }
</script>

<SEO
  title={seoTitle()}
  description={seoDescription()}
  keywords={seoKeywords()}
  canonical={`https://buildscape.org/chain/${layoutData.slug}`}
  ogImage={`https://buildscape.org/og/chain/${layoutData.slug}.png`}
  ogType="article"
  {jsonLd}
/>

<BookLayout
  onClose={handleClose}
  brandColor={getAccessibleBrandColor(layoutData.color || "#3b82f6")}
  currentPath={$page.url.pathname}
>
  {#snippet leftPage()}
    <ChainInfoPage
      chainStatic={chainStatic || { 
        name: layoutData.name, 
        chainId: layoutData.chainId,
        logoUrl: layoutData.logoUrl,
        color: layoutData.color,
        technology: layoutData.technology
      }}
    />
  {/snippet}

  {#snippet rightPage()}
    <ChainDetailsPage
      chainStatic={chainStatic || { 
        name: layoutData.name,
        chainId: layoutData.chainId,
        technology: layoutData.technology
      }}
      {bookmarks}
      activeTab="overview"
      activeGroup="overview"
      currentPath={$page.url.pathname}
    />
  {/snippet}
</BookLayout>
