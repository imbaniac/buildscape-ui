<script lang="ts">
import "../app.css";
import { onMount, onDestroy } from 'svelte';
import { connectSSE, disconnectSSE } from '$lib/stores/sse';
import SEO from '$lib/components/SEO.svelte';

let { children } = $props();

// Connect to SSE when the app starts
onMount(() => {
  connectSSE();
});

// Disconnect when the app is destroyed
onDestroy(() => {
  disconnectSSE();
});
</script>

<SEO />

{@render children()}

