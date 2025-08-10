# Buildscape UI

Interactive visualization of blockchain networks as a "sea of islands" map.

## 🌊 Overview

Buildscape UI presents EVM-compatible blockchains as explorable islands in an interactive map, making it easy to discover and compare different networks at a glance.

## 📜 License

This project uses a dual-license approach:

| Path      | Content                         | License                    |
|-----------|---------------------------------|----------------------------|
| /src      | TypeScript/Svelte frontend      | MIT                        |
| /data     | Chain profile markdown files    | CC BY-SA 4.0               |
| /assets   | Chain & wallet logos            | Third-party trademarks ⚠️   |

See [LICENSE](LICENSE), [LICENSE_DATA](LICENSE_DATA), and [LICENSE_ASSETS](LICENSE_ASSETS) for details.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## 🏗️ Architecture

- **Frontend**: SvelteKit with Svelte 5 runes
- **Rendering**: PixiJS v8 with WebGL acceleration
- **Styling**: TailwindCSS v4 (next generation)
- **Data**: Markdown files with YAML frontmatter
- **Performance**: Optimized render-on-demand system with texture atlas

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Chain

1. Create a markdown file in `/data/chains/[chainname].md`
2. Add chain logo to `/src/lib/assets/chains/[chainname].svg`
3. Update island positions in the codebase
4. Submit a pull request

Note: Contributions to `/data` are licensed under CC BY-SA 4.0.

## ™️ Trademark

Buildscape™ is a trademark of Tymofii Reznichenko. See [NOTICE](NOTICE) for details.

## 🔗 Links

- [Live Site](https://buildscape.org)
- [Documentation](https://docs.buildscape.org)
- [GitHub](https://github.com/buildscape/buildscape-ui)