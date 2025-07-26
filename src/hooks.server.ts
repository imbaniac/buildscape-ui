import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.startsWith("/ingest")) {
    // Determine target hostname based on path
    const hostname = pathname.startsWith("/ingest/static/")
      ? "us-assets.i.posthog.com"
      : "us.i.posthog.com";

    // Build external URL
    const url = new URL(event.request.url);
    url.protocol = "https:";
    url.hostname = hostname;
    url.port = "443";
    url.pathname = pathname.replace("/ingest", "");

    // Clone and adjust headers
    const headers = new Headers(event.request.headers);
    headers.set("host", hostname);

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: event.request.method,
      headers,
    };

    // Only add body for methods that support it
    if (event.request.method !== "GET" && event.request.method !== "HEAD") {
      fetchOptions.body = event.request.body;
      // Required for Node.js fetch when sending a body
      fetchOptions.duplex = "half" as any;
    }

    // Proxy the request to the external host
    const response = await fetch(url.toString(), fetchOptions);

    return response;
  }

  const response = await resolve(event);
  return response;
};
