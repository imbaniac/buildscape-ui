/**
 * Shared SEO utility functions for chain pages
 * Extracted to avoid duplication between base route and overview route
 */

export interface ChainSeoData {
  title: string;
  description: string;
  keywords: string;
  jsonLd: any;
}

/**
 * Generate SEO title for a chain
 */
export function generateSeoTitle(chainStatic: any, layoutData: any): string {
  const name = chainStatic?.name || layoutData?.name;
  if (!name) return "Blockchain Explorer | Buildscape";

  return `What is ${name}? — Chain overview & live metrics`;
}

/**
 * Generate SEO description for a chain
 */
export function generateSeoDescription(
  chainStatic: any,
  layoutData: any,
): string {
  const name = chainStatic?.name || layoutData?.name;
  if (!name) return "Explore blockchain metrics and resources on Buildscape";

  const chainId = chainStatic?.chainId || layoutData?.chainId;
  const nativeCurrency =
    chainStatic?.nativeCurrency || layoutData?.nativeCurrency || "ETH";
  const isEVM =
    chainStatic?.technology?.vm?.evmCompatible ||
    layoutData?.technology?.vm?.evmCompatible;
  const isL2 =
    chainStatic?.technology?.layer === "L2" ||
    layoutData?.technology?.layer === "L2";

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
}

/**
 * Generate SEO keywords for a chain
 */
export function generateSeoKeywords(chainStatic: any, layoutData: any): string {
  if (!chainStatic?.name && !layoutData?.name) return "";

  const name = chainStatic?.name || layoutData?.name;
  const chainId = chainStatic?.chainId || layoutData?.chainId;
  const nativeCurrency =
    chainStatic?.nativeCurrency || layoutData?.nativeCurrency || "ETH";
  const isEVM =
    chainStatic?.technology?.vm?.evmCompatible ||
    layoutData?.technology?.vm?.evmCompatible;
  const isL2 =
    chainStatic?.technology?.layer === "L2" ||
    layoutData?.technology?.layer === "L2";

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
}

/**
 * Generate structured data (JSON-LD) for a chain
 */
export function generateJsonLd(chainStatic: any, layoutData: any): any {
  const name = chainStatic?.name || layoutData?.name;
  const chainId = chainStatic?.chainId || layoutData?.chainId;
  const nativeCurrency =
    chainStatic?.nativeCurrency || layoutData?.nativeCurrency || "ETH";
  const slug = layoutData?.slug;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // WebSite schema
      {
        "@type": "WebSite",
        "@id": "https://buildscape.org/#website",
        name: "Buildscape",
        url: "https://buildscape.org",
      },
      // Organization schema for the blockchain entity
      {
        "@type": "Organization",
        "@id": `https://buildscape.org/chain/${slug}#organization`,
        name: chainStatic?.parentOrganization || name || "Unknown",
        url: chainStatic?.website || `https://buildscape.org/chain/${slug}`,
        ...(chainStatic?.logo && {
          logo: `https://buildscape.org/chains/${chainStatic.logo}`,
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the Chain ID for ${name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The Chain ID for ${name} is ${chainId}. This unique identifier is used when adding the network to wallets like MetaMask.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the native currency of ${name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The native currency of ${name} is ${nativeCurrency}. This is the token used to pay for transaction fees on the network.`,
            },
          },
          ...(chainStatic?.technology?.vm?.evmCompatible
            ? [
                {
                  "@type": "Question",
                  name: `Is ${name} EVM compatible?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, ${name} is EVM (Ethereum Virtual Machine) compatible. This means you can use Ethereum development tools and deploy Solidity smart contracts on this network.`,
                  },
                },
              ]
            : []),
          {
            "@type": "Question",
            name: `How do I add ${name} to MetaMask?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `To add ${name} to MetaMask: 1) Open MetaMask and go to Settings > Networks > Add Network. 2) Enter Chain ID: ${chainId}, Currency Symbol: ${nativeCurrency}, and an RPC URL from our verified list. 3) Click Save to add the network.`,
            },
          },
          ...(chainStatic?.technology?.layer === "L2"
            ? [
                {
                  "@type": "Question",
                  name: `What Layer 1 does ${name} settle to?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${name} is a Layer 2 scaling solution that settles to ${
                      chainStatic?.technology?.settlementLayer || "Ethereum"
                    }. This means it inherits security from the L1 while providing faster and cheaper transactions.`,
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
            name: name || "Chain",
            item: `https://buildscape.org/chain/${slug}`,
          },
        ],
      },
      // Article schema for better content understanding
      {
        "@type": "Article",
        "@id": `https://buildscape.org/chain/${slug}#article`,
        headline: generateSeoTitle(chainStatic, layoutData),
        description: generateSeoDescription(chainStatic, layoutData),
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
          "@id": `https://buildscape.org/chain/${slug}`,
        },
        ...(chainStatic?.logoUrl && {
          image: {
            "@type": "ImageObject",
            url: `https://buildscape.org${chainStatic.logoUrl}`,
          },
        }),
      },
    ],
  };
}

/**
 * Get all SEO data for a chain page
 */
export function getChainSeo(chainStatic: any, layoutData: any): ChainSeoData {
  return {
    title: generateSeoTitle(chainStatic, layoutData),
    description: generateSeoDescription(chainStatic, layoutData),
    keywords: generateSeoKeywords(chainStatic, layoutData),
    jsonLd: generateJsonLd(chainStatic, layoutData),
  };
}
