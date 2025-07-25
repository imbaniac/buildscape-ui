import { browser } from '$app/environment';
import type { PageLoad } from './$types';

// Enable prerendering for the homepage
export const prerender = true;
export const ssr = true;

export const load: PageLoad = ({ url }) => {
  // Only try to get search params in the browser to avoid prerendering issues
  const searchQuery = browser ? (url.searchParams.get('q') || '') : '';
  
  return {
    searchQuery
  };
};