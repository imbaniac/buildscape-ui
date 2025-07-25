import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  // Use a unique path that won't be blocked by ad blockers
  if (pathname.startsWith('/bscape-metrics')) {
    // Determine target hostname based on static or dynamic ingestion
    const hostname = pathname.startsWith('/bscape-metrics/static/')
      ? 'us-assets.i.posthog.com'
      : 'us.i.posthog.com';

    // Build external URL
    const url = new URL(event.request.url);
    url.protocol = 'https:';
    url.hostname = hostname;
    url.port = '443';
    url.pathname = pathname.replace('/bscape-metrics/', '');

    // Clone and adjust headers
    const headers = new Headers(event.request.headers);
    headers.set('host', hostname);

    try {
      // Proxy the request to PostHog
      const response = await fetch(url.toString(), {
        method: event.request.method,
        headers,
        body: event.request.body
      });

      return response;
    } catch (error) {
      console.error('PostHog proxy error:', error);
      return new Response('Proxy error', { status: 502 });
    }
  }

  const response = await resolve(event);
  return response;
};