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

### Adding New Chains

1. Create markdown file in `/data/chains/[chainname].md` with required frontmatter (including `chainId`)
2. Add chain logo to `/assets/chains/[chainname].svg` (ensure you have rights to use the logo)
3. Dynamic data will be loaded automatically based on the `chainId` in frontmatter

# Claude Code Guidelines

## Implementation Best Practices

### 0 — Purpose

These rules ensure maintainability, safety, and developer velocity.
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

### 2 — While Coding

- **C-1 (MUST)** Follow TDD: scaffold stub -> write failing test -> implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency.
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (SHOULD NOT)** Extract a new function unless it will be reused elsewhere, is the only way to unit-test otherwise untestable logic, or drastically improves readability of an opaque block.

---

### 3 — Testing

- **T-1 (MUST)** For a simple function, colocate unit tests in same directory as source file.
- **T-2 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-3 (SHOULD)** Prefer integration tests over heavy mocking.
- **T-4 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-5 (SHOULD)** Test the entire structure in one assertion if possible

  ```ts
  expect(result).toBe([value]); // Good

  expect(result).toHaveLength(1); // Bad
  expect(result[0]).toBe(value); // Bad
  ```

---

## Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or, in a lot of cases, number of nesting if if-else as a proxy). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks / queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g. sql queries, redis, etc.)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:

- the refactored function is used in more than one place
- the refactored function is easily unit testable while the original function is not AND you can't test it any other way
- the original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don’t align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function’s output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (prettier, ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use `fast-check` library e.g.

```
import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getCharacterCount } from './string';

describe('properties', () => {
  test('concatenation functoriality', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (a, b) =>
          getCharacterCount(a + b) ===
          getCharacterCount(a) + getCharacterCount(b)
      )
    );
  });
});
```

7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:

```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN

When I type "qplan", this means:

```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
- summarize potentially breaking changes
```

## QCODE

When I type "qcode", this means:

```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
```

### QCHECK

When I type "qcheck", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
2. CLAUDE.md checklist Writing Tests Best Practices.
3. CLAUDE.md checklist Implementation Best Practices.
```

### QCHECKF

When I type "qcheckf", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
```

### QCHECKT

When I type "qcheckt", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Tests Best Practices.
```

### QUX

When I type "qux", this means:

```
Imagine you are a human UX tester of the feature you implemented.
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

### QGIT

When I type "qgit", this means:

```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- SHOULD use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- SHOULD NOT refer to Claude or Anthropic in the commit message.
- SHOULD structure commit message as follows:
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
- commit SHOULD contain the following structural elements to communicate intent:
fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```
