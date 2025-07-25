import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  // Use a unique path that won't be blocked by ad blockers
  if (pathname.startsWith("/bscape-metrics")) {
    // Determine target hostname based on path
    let hostname = "us.i.posthog.com";

    if (pathname.startsWith("/bscape-metrics/static/")) {
      hostname = "us-assets.i.posthog.com";
    } else if (pathname.includes("/array/") || pathname.endsWith(".js")) {
      // Array.js and config.js files are served from assets domain
      hostname = "us-assets.i.posthog.com";
    }

    // Build external URL
    const url = new URL(event.request.url);
    url.protocol = "https:";
    url.hostname = hostname;
    url.port = "443";
    url.pathname = pathname.replace("/bscape-metrics/", "");

    // Clone and adjust headers
    const headers = new Headers(event.request.headers);
    headers.set("host", hostname);

    try {
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

      // Proxy the request to PostHog
      const response = await fetch(url.toString(), fetchOptions);

      // Create response headers, ensuring CORS headers are set
      const responseHeaders = new Headers(response.headers);

      // Ensure proper content-type for JS files
      if (pathname.endsWith(".js")) {
        responseHeaders.set("Content-Type", "application/javascript");
      }

      // Return the response with proper headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error("PostHog proxy error:", error);
      return new Response("Proxy error", { status: 502 });
    }
  }

  const response = await resolve(event);
  return response;
};
