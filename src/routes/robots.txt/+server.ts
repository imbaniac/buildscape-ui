import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const robotsTxt = `# Buildscape Robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://buildscape.org/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow access to API endpoints if any
Disallow: /api/
Disallow: /.well-known/

# Allow search engines to access everything else
Allow: /chain/
Allow: /chains
Allow: /map

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10`;

  return new Response(robotsTxt.trim(), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
};
