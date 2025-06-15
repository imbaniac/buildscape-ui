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

## Architecture Overview

This is a SvelteKit application that visualizes EVM-compatible blockchain networks as an interactive "sea of islands" map.

### Core Components

1. **App.svelte** (`src/components/App.svelte`) - Main map container
   - Implements pan/zoom functionality with momentum scrolling
   - Manages island placement and interaction states
   - Uses SVG for scalable visualization

2. **Island.svelte** (`src/components/Island.svelte`) - Blockchain visualization
   - Renders each blockchain as an interactive island
   - Displays chain logo and name
   - Handles click events to show details

3. **Book.svelte** (`src/components/Book.svelte`) - Detail modal
   - Shows comprehensive chain information in tabbed interface
   - Renders markdown content from chain data files
   - Loads dynamic metrics on demand

### Data Architecture

- **Static Data**: Markdown files in `/src/data/chains/*.md` contain chain information with YAML frontmatter
- **Dynamic Data**: TypeScript files in `/src/data/chains/*.ts` export functions that fetch real-time metrics
- **Assets**: Chain logos in `/src/lib/assets/chains/` (SVG/PNG format)

### Key Technical Details

- Uses Svelte 5 runes syntax (`$state`, `$props`, `$derived`)
- TailwindCSS v4 (next generation) for styling
- Flowbite Svelte components for UI elements
- Dynamic imports via `import.meta.glob` for chain data
- Gray-matter for parsing markdown frontmatter

### Adding New Chains

1. Create markdown file in `/src/data/chains/[chainname].md` with required frontmatter
2. Add chain logo to `/src/lib/assets/chains/[chainname].svg`
3. Update island positions in `islandConstants.ts`
4. (Optional) Add dynamic data loader in `/src/data/chains/[chainname].ts`

