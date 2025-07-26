<script lang="ts">
import "../app.css";
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { afterNavigate } from '$app/navigation';
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

