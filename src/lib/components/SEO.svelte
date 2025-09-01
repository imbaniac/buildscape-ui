<script lang="ts">
  interface Props {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    keywords?: string;
    noindex?: boolean;
    jsonLd?: Record<string, any>;
    includeOrganization?: boolean;
  }

  let {
    title = "Buildscape — The blockchain ecosystem, mapped",
    description = "Buildscape explains the purpose, technology, and use cases of each chain while providing real-time metrics for comparison. Navigate from Ethereum to emerging L2s with comprehensive guides, live data, and developer resources.",
    canonical = "",
    ogImage = "https://buildscape.org/og/map.png",
    ogType = "website",
    keywords = "",
    noindex = false,
    jsonLd,
    includeOrganization = false,
  }: Props = $props();
  
  // Organization structured data for Google to use square logo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Buildscape",
    "url": "https://buildscape.org",
    "logo": {
      "@type": "ImageObject",
      "url": "https://buildscape.org/web-app-manifest-512x512.png",
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://github.com/imbaniac/buildscape-ui"
    ],
    "description": "The blockchain ecosystem, mapped. Interactive explorer and analytics platform for 50+ blockchain networks."
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}

  <!-- Robots meta tag -->
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}

  <!-- Open Graph tags -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:type" content={ogType} />
  {#if canonical}
    <meta property="og:url" content={canonical} />
  {/if}
  <meta property="og:site_name" content="Buildscape" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@buildscape" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={title} />

  <!-- Additional meta tags -->
  <meta name="author" content="Buildscape" />
  <meta name="theme-color" content="#2c5f7c" />

  <!-- JSON-LD Structured Data -->
  {#if jsonLd}
    <script type="application/ld+json">
      {@html JSON.stringify(jsonLd)}
    </script>
  {/if}
  
  <!-- Organization Schema for Google Logo -->
  {#if includeOrganization}
    <script type="application/ld+json">
      {@html JSON.stringify(organizationSchema)}
    </script>
  {/if}
</svelte:head>
