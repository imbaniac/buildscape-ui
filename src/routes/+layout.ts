import { browser } from '$app/environment';
import { overviewStore } from '$lib/stores/overviewStore';
import type { LayoutLoad } from './$types';

// Enable SSR for all pages by default
export const ssr = true;

export const load: LayoutLoad = async () => {
  // Only load on client side and if not already loaded
  // This is fine for the overview store as it's used for the interactive map
  // which is a client-side feature
  if (browser) {
    const currentState = overviewStore.getState();
    
    // Only load if we don't have data
    if (!currentState.data && !currentState.isLoading) {
      overviewStore.load();
    }
  }

  return {};
};