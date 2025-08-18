# Buildscape Chain Data

This directory contains blockchain profile data for Buildscape.

## 📜 License

All content in this `/data` directory is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)**.

This means you are free to:

- ✅ Share — copy and redistribute the material
- ✅ Adapt — remix, transform, and build upon the material
- ✅ Use commercially — even for commercial purposes

Under these conditions:

- 📝 **Attribution** — You must credit Buildscape and contributors
- 🔄 **ShareAlike** — Modified versions must use the same CC BY-SA 4.0 license

## 🤝 Contributing

When contributing to this directory:

1. Your contributions will be licensed under CC BY-SA 4.0
2. Sign your commits with `git commit -s` (DCO)
3. Include accurate, up-to-date information
4. Follow the existing format and structure

## 📋 Attribution

When using this data, please include:

> Chain profile data by Buildscape (https://buildscape.org) and contributors, licensed under CC BY-SA 4.0

## 📁 Structure

```
/data/                    # Content files only (CC BY-SA 4.0)
├── chains/               # Blockchain profile markdown files
│   ├── ethereum.md       # Ethereum mainnet
│   ├── base.md           # Base L2
│   └── ...               # Other chains
├── wallets.md            # Wallet information
└── evm-common.md         # Common EVM tools
```

Note: Dynamic chain data is loaded automatically based on the `chainId` field in each chain's markdown frontmatter.

## ✏️ Format

Each chain profile uses markdown with YAML frontmatter:

```yaml
---
name: Chain Name
chainId: 1
logo: chainname.svg
technology:
  isEVM: true
  consensus: proof-of-stake
# ... other metadata
---
Chain description in markdown...
```

See existing files for examples.
