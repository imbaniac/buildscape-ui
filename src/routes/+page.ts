import type { PageLoad } from './$types';

// Enable prerendering for the homepage
export const prerender = true;
export const ssr = true;

export const load: PageLoad = ({ url }) => {
  const searchQuery = url.searchParams.get('q') || '';
  
  return {
    searchQuery
  };
};