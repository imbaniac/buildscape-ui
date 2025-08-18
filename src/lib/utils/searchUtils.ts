/**
 * Shared search utility for searching chains across the application
 */

export interface SearchableChain {
  name?: string;
  chainId?: number;
  nativeCurrency?: string;
  slug?: string;
  [key: string]: any;
}

/**
 * Search chains by name, chainId, or native currency
 * @param chains - Array of chains to search through
 * @param query - Search query string
 * @returns Array of matching chain keys/slugs
 */
export function searchChains<T extends SearchableChain>(
  chains: Record<string, T> | T[],
  query: string,
): string[] {
  if (!query || query.length < 3) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const matches: string[] = [];

  // Handle both Record and Array formats
  const entries = Array.isArray(chains)
    ? chains.map(
        (chain, index) => [chain.slug || index.toString(), chain] as const,
      )
    : Object.entries(chains);

  for (const [key, chain] of entries) {
    // Skip if no valid chain data
    if (!chain) continue;

    // Search by chain name (case insensitive)
    const chainName = chain.name?.toLowerCase() || key.toLowerCase();
    if (chainName.includes(lowerQuery)) {
      matches.push(key as string);
      continue;
    }

    // Search by chain ID (exact or partial match)
    if (chain.chainId !== undefined) {
      const chainIdStr = chain.chainId.toString();
      if (chainIdStr.includes(query)) {
        matches.push(key as string);
        continue;
      }
    }

    // Search by native currency (case insensitive)
    if (chain.nativeCurrency) {
      const currency = chain.nativeCurrency.toLowerCase();
      if (currency.includes(lowerQuery)) {
        matches.push(key as string);
        continue;
      }
    }
  }

  return matches;
}

/**
 * Debounce a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
