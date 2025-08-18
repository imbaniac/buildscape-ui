import { error, redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { CHAIN_TABS } from "$lib/constants/tabs";

function mergeEvmTools(
  chainStatic: any,
  evmCommonData: any,
  _chainSlug: string,
): any {
  // If not an EVM chain, return as-is
  if (!chainStatic.technology?.isEVM) {
    return chainStatic;
  }

  // Parse common EVM SDKs and tools
  const commonSdks = evmCommonData.sdks || [];
  const commonTools = evmCommonData.tools || [];

  // Get chain-specific overrides
  const overrideSdks = chainStatic.sdks || [];
  const overrideTools = chainStatic.tools || [];

  // Create maps for easy lookup
  const sdkOverrideMap = new Map(
    overrideSdks.map((sdk: any) => [sdk.name, sdk]),
  );
  const toolOverrideMap = new Map(
    overrideTools.map((tool: any) => [tool.name, tool]),
  );

  // Merge SDKs - chain overrides take precedence
  const mergedSdks = commonSdks.map((sdk: any) => {
    const override = sdkOverrideMap.get(sdk.name);
    if (override) {
      // Remove from override map so we know what's been processed
      sdkOverrideMap.delete(sdk.name);
      // Merge with override taking precedence
      return { ...sdk, ...override };
    }
    return sdk;
  });

  // Add any remaining chain-specific SDKs that weren't overrides
  for (const sdk of sdkOverrideMap.values()) {
    mergedSdks.push(sdk);
  }

  // Merge Tools - chain overrides take precedence
  const mergedTools = commonTools.map((tool: any) => {
    const override = toolOverrideMap.get(tool.name);
    if (override) {
      // Remove from override map so we know what's been processed
      toolOverrideMap.delete(tool.name);
      // Merge with override taking precedence
      return { ...tool, ...override };
    }
    return tool;
  });

  // Add any remaining chain-specific tools that weren't overrides
  for (const tool of toolOverrideMap.values()) {
    mergedTools.push(tool);
  }

  // Define sort order for SDKs and tools
  const sortOrder = (a: any, b: any) => {
    // First sort by category if it exists
    if (a.category && b.category && a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    // Then sort by name
    return a.name.localeCompare(b.name);
  };

  return {
    ...chainStatic,
    sdks: mergedSdks.sort(sortOrder),
    tools: mergedTools.sort(sortOrder),
  };
}

export const load: LayoutLoad = async ({ params, parent }) => {
  const { slug } = params;

  // Get chains and evmCommon from parent layout
  const parentData = await parent();
  const chains = (parentData as any).chains || {};
  const evmCommonData = (parentData as any).evmCommon || null;

  // First check if slug is actually a chain ID (numeric)
  if (/^\d+$/.test(slug)) {
    const chainIdNumber = parseInt(slug);
    // Find the chain by ID and redirect to its slug
    for (const [chainSlug, chain] of Object.entries(chains)) {
      if ((chain as any).chainId === chainIdNumber) {
        throw redirect(301, `/chain/${chainSlug}`);
      }
    }
    throw error(404, `Chain with ID ${slug} not found`);
  }

  // Otherwise, treat it as a slug
  const chainData = chains[slug];

  if (!chainData) {
    throw error(404, `Chain ${slug} not found`);
  }

  // Build complete chainStatic object from the pre-parsed data
  let chainStatic = { ...chainData };

  // Merge with common EVM tools if applicable
  if (evmCommonData) {
    chainStatic = mergeEvmTools(chainStatic, evmCommonData, slug);
  }

  // Return all data immediately - no streaming needed
  return {
    // All data is ready immediately
    slug,
    chainId: chainData.chainId,
    name: chainData.name || slug,
    logoUrl: chainData.logoUrl,
    color: chainData.color || "#3b82f6",
    bookmarks: CHAIN_TABS,
    technology: chainData.technology, // Needed for wallet tab visibility

    // Pass chainStatic directly, no streaming
    chainStatic,
  };
};

export const prerender = "auto";
export const ssr = true;
