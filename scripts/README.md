# OG Image Generation

This script generates Open Graph images for all chains and the homepage map.

## Usage

```bash
# Generate all OG images
bun run generate-og

# Or run directly
bun scripts/generate-og-images.ts
```

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

## Automated Generation

For production, you should run this script:

- Daily via cron job or GitHub Actions
- After major data updates
- Before deployments

Example GitHub Action:

```yaml
name: Generate OG Images
on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight UTC
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run generate-og
      - uses: actions/upload-artifact@v4
        with:
          name: og-images
          path: static/og/
```

## Customization

### Colors

Chain colors are pulled from the chain's `color` and `darkColor` properties in the markdown files.

### Fonts

The script uses Inter font. To change fonts, update the font file and the `fontFamily` in the styles.

### Layout

Modify the element structure in `generateMapOG` and `generateChainOG` functions to change the layout.
