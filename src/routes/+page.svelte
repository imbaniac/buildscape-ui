<script lang="ts">
  import App from "../components/App.svelte";
  import SEO from "$lib/components/SEO.svelte";

  // Homepage-specific structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://buildscape.org/#website",
        url: "https://buildscape.org",
        name: "Buildscape",
        description:
          "Interactive map of blockchain networks with real-time metrics",
        publisher: {
          "@type": "Organization",
          name: "Buildscape",
          url: "https://buildscape.org",
        },
      },
    ],
  };
</script>

<SEO
  title="Buildscape - Interactive Blockchain Map | Compare 50+ Networks"
  description="Explore blockchain networks through an interactive map. Compare real-time TPS, gas fees, TVL across Ethereum, Base, Arbitrum, Optimism, and 50+ chains. Find RPCs, wallets, and developer resources."
  keywords="blockchain map, blockchain explorer, chain comparison, ethereum alternatives, layer 2 networks, l2 chains, blockchain metrics, tps comparison, gas fees, tvl ranking, rpc endpoints, evm chains, blockchain networks, crypto infrastructure"
  canonical="https://buildscape.org"
  {jsonLd}
/>

<main class="full-map-bg">
  <App />
</main>

<style>
  .full-map-bg {
    background-color: #87c1d3;
  }
</style>
