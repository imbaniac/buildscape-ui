import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
  // Get chains from parent layout data
  const parentData = await parent();

  return {
    chains: (parentData as any).chains || {},
  };
};
