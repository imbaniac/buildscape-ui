export const load = async ({ url, parent }) => {
  const searchQuery = url.searchParams.get("q") || "";
  const parentData = await parent();

  return {
    initialSearchQuery: searchQuery,
    chains: parentData.chains || {},
  };
};
