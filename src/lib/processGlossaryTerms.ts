import { glossary } from "./tooltips";

/**
 * Process markdown/HTML content to automatically detect and mark glossary terms
 */
export function processGlossaryTerms(content: string): string {
  // Create a sorted list of terms by length (longest first) to avoid partial matches
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

  // Build regex patterns for different term formats
  const termPatterns: { pattern: RegExp; term: string }[] = [];

  for (const term of terms) {
    // Handle different formats of the same term
    const variations: string[] = [];

    // Original term
    variations.push(term);

    // Handle L1/L2/L3 variations
    if (term === "layer1" || term === "l1") {
      variations.push("L1", "Layer 1", "layer 1");
    } else if (term === "layer2" || term === "l2") {
      variations.push("L2", "Layer 2", "layer 2", "L2s", "Layer 2s");
    } else if (term === "layer3" || term === "l3") {
      variations.push("L3", "Layer 3", "layer 3");
    }

    // Handle EIP formats
    if (term.startsWith("eip-")) {
      const eipNumber = term.substring(4);
      variations.push(`EIP-${eipNumber}`, `EIP ${eipNumber}`);
    }

    // Handle uppercase acronyms
    if (term === term.toLowerCase() && term.length <= 10) {
      variations.push(term.toUpperCase());
    }

    // Handle special cases
    if (term === "defi") {
      variations.push("DeFi", "Defi");
    } else if (term === "dao") {
      variations.push("DAO", "DAOs");
    } else if (term === "nft") {
      variations.push("NFT", "NFTs");
    } else if (term === "tps") {
      variations.push("TPS");
    } else if (term === "tvl") {
      variations.push("TVL");
    } else if (term === "mev") {
      variations.push("MEV");
    } else if (term === "pos") {
      variations.push("PoS", "Proof of Stake");
    } else if (term === "pow") {
      variations.push("PoW", "Proof of Work");
    } else if (term === "dex") {
      variations.push("DEX", "DEXs");
    } else if (term === "amm") {
      variations.push("AMM", "AMMs");
    } else if (term === "eth") {
      variations.push("ETH", "Ether");
    } else if (term === "evm") {
      variations.push("EVM", "Ethereum Virtual Machine");
    } else if (term === "zkrollup") {
      variations.push("ZK Rollup", "ZK-Rollup", "zkSync");
    } else if (term === "optimisticrollup") {
      variations.push("Optimistic Rollup", "Optimistic-Rollup");
    } else if (term === "fraud proof") {
      variations.push("fraud proofs", "Fraud Proof", "Fraud Proofs");
    } else if (term === "validity proof") {
      variations.push(
        "validity proofs",
        "Validity Proof",
        "Validity Proofs",
        "ZK proof",
        "ZK proofs",
      );
    } else if (term === "smart contract") {
      variations.push("smart contracts", "Smart Contract", "Smart Contracts");
    } else if (term === "dapp") {
      variations.push("dApp", "DApp", "dApps", "DApps");
    }

    // Create patterns for each variation
    for (const variation of variations) {
      // Escape special regex characters
      const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Create word boundary pattern to avoid partial matches
      const pattern = new RegExp(
        `\\b(${escapedVariation})\\b(?![^<]*>|[^<]*</span>|[^<]*</a>)`,
        "gi",
      );
      termPatterns.push({ pattern, term });
    }
  }

  // Process content
  let processedContent = content;
  const replacements = new Map<string, string>();
  let replacementId = 0;

  // First pass: identify and mark all terms with placeholders
  for (const { pattern, term } of termPatterns) {
    processedContent = processedContent.replace(pattern, (match) => {
      const placeholder = `__GLOSSARY_${replacementId}__`;
      replacements.set(
        placeholder,
        `<span class="glossary-term" data-term="${term}">${match}</span>`,
      );
      replacementId++;
      return placeholder;
    });
  }

  // Second pass: replace placeholders with actual markup
  for (const [placeholder, replacement] of replacements) {
    processedContent = processedContent.replace(placeholder, replacement);
  }

  return processedContent;
}

/**
 * Process content for use in Svelte components with proper term detection
 */
export function extractGlossaryTerms(content: string): {
  segments: Array<{ type: "text" | "term"; content: string; term?: string }>;
} {
  const processed = processGlossaryTerms(content);
  const segments: Array<{
    type: "text" | "term";
    content: string;
    term?: string;
  }> = [];

  // Parse the processed content to extract segments
  const regex =
    /<span class="glossary-term" data-term="([^"]+)">([^<]+)<\/span>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(processed)) !== null) {
    // Add text before the term
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: processed.substring(lastIndex, match.index),
      });
    }

    // Add the term
    segments.push({
      type: "term",
      content: match[2],
      term: match[1],
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < processed.length) {
    segments.push({
      type: "text",
      content: processed.substring(lastIndex),
    });
  }

  return { segments };
}
