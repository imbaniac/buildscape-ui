import { browser } from '$app/environment';
import { overviewStore } from '$lib/stores/overviewStore';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  // Only load on client side and if not already loaded
  if (browser) {
    const currentState = overviewStore.getState();
    
    // Only load if we don't have data
    if (!currentState.data && !currentState.isLoading) {
      overviewStore.load();
    }
  }

  return {};
};