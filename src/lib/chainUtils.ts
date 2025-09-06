/**
 * Check if a chain was recently added to Buildscape (within 30 days)
 */
export function isNewChain(createdAt?: string): boolean {
  if (!createdAt) return false;

  const created = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return created > thirtyDaysAgo;
}
