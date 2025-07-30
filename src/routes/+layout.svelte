<script lang="ts">
import "../app.css";
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { afterNavigate, onNavigate } from '$app/navigation';
import { connectSSE, disconnectSSE } from '$lib/stores/sse';
import SEO from '$lib/components/SEO.svelte';
import { analytics } from '$lib/analytics';

let { children } = $props();

// Connect to SSE when the app starts
onMount(() => {
  connectSSE();
});

// Disconnect when the app is destroyed
onDestroy(() => {
  disconnectSSE();
});

// Enable view transitions only between map and chain pages
onNavigate((navigation) => {
  if (!document.startViewTransition) return;

  // Get the from and to paths
  const fromPath = navigation.from?.route?.id || '';
  const toPath = navigation.to?.route?.id || '';
  
  // Only apply transitions when:
  // 1. Going from map (root) to chain detail
  // 2. Going from chain detail back to map
  const isMapToChain = fromPath === '/' && toPath?.startsWith('/chain/[slug]');
  const isChainToMap = fromPath?.startsWith('/chain/[slug]') && toPath === '/';
  
  if (!isMapToChain && !isChainToMap) {
    // No transition for tab changes or other navigations
    return;
  }

  return new Promise((resolve) => {
    document.startViewTransition(() => {
      resolve();
    });
  });
});

// Track page views on client-side navigation
if (browser) {
  afterNavigate((navigation) => {
    if (navigation.to) {
      analytics.trackPageView(
        navigation.to.url.href,
        navigation.to.url.pathname
      );
    }
  });
}
</script>

<SEO />

{@render children()}

