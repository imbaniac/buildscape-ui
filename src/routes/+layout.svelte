<script lang="ts">
import "../app.css";
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { afterNavigate } from '$app/navigation';
import { connectSSE, disconnectSSE } from '$lib/stores/sse';
import SEO from '$lib/components/SEO.svelte';
import { analytics } from '$lib/analytics';
import { page } from '$app/stores';
import CanvasMap from '../components/CanvasMap.svelte';

let { children } = $props();

// Determine if we're on a chain detail page
const isChainPage = $derived($page.route.id?.startsWith('/chain/[slug]') || false);

// Only get search params in browser to avoid prerendering issues
const searchQuery = $derived(browser ? ($page.url.searchParams.get('q') || '') : '');

// Only render canvas on valid routes (not on error pages)
const isValidRoute = $derived(
  $page.route.id === '/' || 
  $page.route.id?.startsWith('/chain/[slug]') || 
  false
);
const hasError = $derived($page.status >= 400);

// Connect to SSE when the app starts
onMount(() => {
  connectSSE();
});

// Disconnect when the app is destroyed
onDestroy(() => {
  disconnectSSE();
});

// Navigation handled by CSS transitions now

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

<!-- Canvas stays mounted but hidden when on chain pages -->
{#if browser && isValidRoute && !hasError}
  <div class="canvas-wrapper" class:canvas-hidden={isChainPage}>
    <CanvasMap initialSearchQuery={searchQuery} isPaused={isChainPage} />
  </div>
{/if}

<!-- For SSR, only render canvas on home page -->
{#if !browser && $page.route.id === '/' && !hasError}
  <CanvasMap initialSearchQuery={searchQuery} />
{/if}

<!-- Page content renders on top -->
<div class="page-content" class:chain-page={isChainPage}>
  {@render children()}
</div>

<style>
  .canvas-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .canvas-wrapper.canvas-hidden {
    display: none;
  }

  .page-content {
    position: relative;
    z-index: 2;
  }

  .page-content:not(.chain-page) {
    /* Home page doesn't need z-index since it's transparent */
    z-index: auto;
  }
</style>

