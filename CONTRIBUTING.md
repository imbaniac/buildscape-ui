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
4. (Optional) Fetch OG images: `bun run fetch-og`
5. Run tests (`bun run check`)
6. Commit with DCO sign-off (`git commit -s -m "feat: add amazing feature"`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## ✍️ Developer Certificate of Origin (DCO)

All commits must be signed off:

```bash
git commit -s -m "Your commit message"
```

This adds a `Signed-off-by` line to your commit, certifying that you have the right to submit the contribution.

## 🏝️ Adding or Editing Chains

We welcome contributions to add new chains or update existing ones!

### Quick Options

- **Add a chain**: [Submit a request](https://github.com/imbaniac/buildscape-ui/issues/new?template=add-chain.yml)
- **Edit a chain**: [Submit an update](https://github.com/imbaniac/buildscape-ui/issues/new?template=edit-chain.yml)
- **Contribute directly**: See our [detailed guide](docs/ADD_CHAIN.md)

### Resources

- 📖 [Complete chain addition guide](docs/ADD_CHAIN.md)
- 🤖 [AI prompt for generating chain data](prompts/generate-chain-data.md)
- 📝 [Example chains](data/chains/) for reference

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
