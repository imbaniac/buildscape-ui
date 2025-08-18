# Contributing to Buildscape UI

Thank you for your interest in contributing to Buildscape! We welcome contributions from the community.

## 📜 License Agreement

By contributing to this project, you agree that:

- Contributions to `/src` (code) will be licensed under the **MIT License**
- Contributions to `/data` (chain profiles) will be licensed under **CC BY-SA 4.0**

## 🛠️ Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun run check`)
5. Commit with DCO sign-off (`git commit -s -m "feat: add amazing feature"`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## ✍️ Developer Certificate of Origin (DCO)

All commits must be signed off:

```bash
git commit -s -m "Your commit message"
```

This adds a `Signed-off-by` line to your commit, certifying that you have the right to submit the contribution.

## 🏝️ Adding a New Chain

To add a new blockchain to Buildscape:

### 1. Create Chain Profile (`/data/chains/[chainname].md`)

```yaml
---
name: My Chain
chainId: 12345
logo: mychain.svg
urls:
  website: https://mychain.org
  explorer: https://explorer.mychain.org
technology:
  isEVM: true
  consensus: proof-of-stake
rpc:
  - https://rpc.mychain.org
  - wss://ws.mychain.org
---
Description of the chain in markdown format...
```

### 2. Add Chain Logo (`/assets/chains/[chainname].svg`)

- SVG format preferred (PNG accepted)
- Square aspect ratio
- Transparent background
- Reasonable file size
- **Important**: Ensure you have the right to use the logo
- Logos remain property of their respective projects

### 3. Update Island Position

Add your chain to the island positioning configuration in the codebase.

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 🔍 Code Style

- TypeScript for all code
- Follow existing patterns
- Run `bun run check` before committing

## ❓ Questions?

Feel free to open an issue for any questions about contributing!
