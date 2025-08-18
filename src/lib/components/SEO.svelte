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
  }

  let {
    title = "Buildscape - Interactive Blockchain Map",
    description = "Explore 50+ blockchain networks with real-time metrics. Compare TPS, gas fees, TVL, and developer resources for Ethereum, Base, Arbitrum, and more.",
    canonical = "",
    ogImage = "https://buildscape.org/og/map.png",
    ogType = "website",
    keywords = "",
    noindex = false,
    jsonLd,
  }: Props = $props();
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
</svelte:head>
