# OG Image Generation

This script generates Open Graph images for all chains and the homepage map.

## OG Image Storage

OG images are stored on the `og-assets` branch (not in main) to avoid git history bloat.
They are fetched automatically during build via the `prebuild` script.

## Local Development

OG images are optional for local development. To fetch them:

```bash
bun run fetch-og
```

## Generating New Images

```bash
# Generate all OG images locally
bun run generate-og
```

Images are generated automatically daily by GitHub Actions and pushed to the `og-assets` branch.

## Generated Images

- `/static/og/map.png` - Homepage OG image
- `/static/og/chain-[slug].png` - Individual chain OG images

## Integration with Real Metrics

Currently, the script uses placeholder metrics. To integrate real metrics:

1. Update the `generateAllOGImages` function in `generate-og-images.ts`:

```typescript
// Replace placeholder metrics with real data
const metrics = {
  tvl_usd: await fetchChainTVL(chain.chainId),
  tps: await fetchChainTPS(chain.chainId),
  gas_price_gwei: await fetchGasPrice(chain.chainId),
};
```

2. You can fetch metrics from your API or use the existing chain data loaders.

## Customization

### Colors

Chain colors are pulled from the chain's `color` and `darkColor` properties in the markdown files.

### Fonts

The script uses Inter font. To change fonts, update the font file and the `fontFamily` in the styles.

### Layout

Modify the element structure in `generateMapOG` and `generateChainOG` functions to change the layout.
