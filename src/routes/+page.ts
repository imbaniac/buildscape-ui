export const load = ({ url }) => {
  const searchQuery = url.searchParams.get("q") || "";
  return {
    initialSearchQuery: searchQuery,
  };
};
