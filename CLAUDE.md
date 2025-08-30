# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run check
bun run check:watch  # Watch mode
```

DO NOT RUN local dev server. DO NOT run `bun run dev`
Ask user to run and verify changes

## Architecture Overview

This is a SvelteKit application that visualizes EVM-compatible blockchain networks as an interactive "sea of islands" map.

### Core Components

1. **+layout.svelte** (`src/routes/+layout.svelte`) - App layout and map initialization
   - Initializes PixiJS application and viewport
   - Manages render lifecycle and performance
   - Handles SSE connections and data loading

2. **+page.svelte** (`src/routes/+page.svelte`) - Main map UI
   - Manages search functionality and keyboard shortcuts
   - Tracks performance metrics in development mode
   - Handles edit mode for island positioning

3. **PixiMapRenderer** (`src/lib/pixi/PixiMapRenderer.ts`) - Map rendering engine
   - Manages island sprites and ocean background
   - Implements search highlighting and hover states
   - Uses texture atlas for optimized rendering

4. **RenderManager** (`src/lib/pixi/RenderManager.ts`) - Performance optimization
   - Implements render-on-demand with dirty flag system
   - Manages PIXI ticker lifecycle
   - Tracks FPS and render count metrics

5. **IslandAtlasManager** (`src/lib/pixi/IslandAtlasManager.ts`) - Texture optimization
   - Creates texture atlas for all islands
   - Reduces draw calls from ~300 to 1
   - Manages sprite creation from atlas

6. **PixiIslandRenderer** (`src/lib/pixi/PixiIslandRenderer.ts`) - Island generator
   - Creates procedural islands based on chain metrics
   - Pre-renders islands to textures for performance
   - Handles shield, banner, and logo rendering

7. **Book.svelte** (`src/components/Book.svelte`) - Chain detail modal
   - Shows comprehensive chain information in tabbed interface
   - Renders markdown content from chain data files
   - Loads dynamic metrics on demand

### Data Architecture

- **Static Data**: Markdown files in `/data/chains/*.md` contain chain information with YAML frontmatter (CC BY-SA 4.0 licensed)
- **Dynamic Data**: Loaded automatically via `chainId` from frontmatter using the chain data loader
- **Assets**: Chain logos in `/assets/chains/` (third-party trademarks - see LICENSE_ASSETS)
- **Positions**: Island positions stored in `/src/lib/positions.json`

### Key Technical Details

- Uses Svelte 5 runes syntax (`$state`, `$props`, `$derived`)
- PixiJS v8 for WebGL-accelerated graphics rendering
- pixi-viewport for smooth pan/zoom interactions
- CSS with CSS variables for styling (see app.css for design system)
- Component-scoped styles in Svelte components
- Dynamic imports via `import.meta.glob` for chain data
- Gray-matter for parsing markdown frontmatter

### Styling System

- **CSS Variables**: Design tokens defined in `app.css` for fonts and theming
- **Font System**:
  - Display: 'Cinzel' (headers, medieval feel)
  - Body: 'Crimson Text' (readable serif)
  - UI: 'Alegreya Sans' (interface elements)
  - Mono: 'Space Mono' (technical data)
- **Component Styles**: Scoped styles in `<style>` blocks within Svelte components
- **No CSS Framework**: Plain CSS with modern features (flexbox, grid, custom properties)

### Performance Optimizations

- **Texture Atlas**: All islands pre-rendered into a single texture atlas
- **Render-on-demand**: Only renders when scene changes (dirty flag system)
- **Ticker Management**: PIXI ticker stops when idle to save CPU/GPU
- **Sprite-based Rendering**: Islands are sprites from atlas, not containers
- **Zoom Limits**: Configurable min/max scale (0.05 to 3.0)

**Documentation:**

- User guide: `/docs/ADD_CHAIN.md`
- AI prompt: `/prompts/generate-chain-data.md`
- Issue templates: `.github/ISSUE_TEMPLATE/add-chain.yml` and `edit-chain.yml`

**Note:** Chains without positions in positions.json will be skipped during rendering

IMPORTANT: We're at MVP stage, our goal is to deliver initial version in good workable condition. We should keep things easy to support and fix quickly.
Buildscape UI is open-source, so we should have code in well structured state

NEVER RUN `bun run dev`, ask user to verify UI
NEVER RUN `bun run check` or `bun run lint` unless expicitely asked to — we have git hooks to run them when needed
