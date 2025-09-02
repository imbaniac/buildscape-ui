# Adding a New Chain to Buildscape

This guide explains how to add a new blockchain to Buildscape's interactive map.

## Quick Start

**Easiest way**: [Submit a chain request issue](https://github.com/imbaniac/buildscape-ui/issues/new?template=add-chain.yml) and let maintainers handle it.

**DIY approach**: Follow this guide to add it yourself via PR.

## Required Files

To add a new chain, you need to create/modify three files:

1. **Chain data**: `/data/chains/[chainname].md`
2. **Chain logo**: `/assets/chains/[chainname].svg`
3. **Island position**: `/src/lib/positions.json`

## Step 1: Chain Data File

Create a markdown file at `/data/chains/[chainname].md` with this exact structure:

### File Naming Convention

- Use lowercase
- Replace spaces with underscores
- Examples: `arbitrum_one.md`, `polygon_pos.md`, `bnb.md`

### Required Frontmatter Fields

```yaml
---
name: Arbitrum One # Official chain name
chainId: 42161 # Official chain ID (verify on chainlist.org)
nativeCurrency: ETH # Native token symbol
color: "#2D374B" # Brand color in hex
logo: arbitrum_one.svg # Logo filename (must match file in /assets/chains/)
parentOrganization: Offchain Labs # Company/foundation maintaining the chain
website: https://arbitrum.io # Official website
launchDate: 2021-08-31 # Launch date in YYYY-MM-DD format
maxBlockSize: 30 # Block size in MB (usually 30)
technology:
  type: Optimistic Rollup # Technical implementation (see types below)
  layer: L2 # Network layer: L1, L2, L3, or Sidechain
  vm:
    type: ArbitrumVM # Virtual machine type (EVM, zkEVM, ArbitrumVM, etc.)
    evmCompatible: true # Whether it supports EVM bytecode
  settlementLayer: Ethereum # Where transactions settle (required for L2/L3/Sidechains)
  stack: Arbitrum Nitro # Tech stack if applicable (OP Stack, ZK Stack, etc.)
```

#### Technology Type Options

**For L2s:**

- `Optimistic Rollup` - Uses fraud proofs (Arbitrum, Optimism, Base)
- `ZK Rollup` - Uses zero-knowledge proofs (zkSync, Scroll, Linea)
- `Validium` - Off-chain data availability with ZK proofs
- `Optimium` - Optimistic rollup with off-chain data
- `AnyTrust` - Arbitrum's Data Availability Committee model

**For L1s/Sidechains:**

- `Proof of Stake` - Standard PoS consensus
- `Proof of Authority` - Authority-based consensus
- `DPoS` - Delegated Proof of Stake
- `Proof of Staked Authority` - Hybrid PoS/PoA (BNB Chain)
- Others common consensus mechanisms as needed

#### VM Types

Common virtual machine types:

- `EVM` - Standard Ethereum Virtual Machine
- `zkEVM` - Zero-knowledge EVM implementation
- `ArbitrumVM` - Arbitrum's VM with WASM support
- `AvalancheVM` - Avalanche's custom VM
- `FVM` - Filecoin Virtual Machine
- `BeraVM` - Berachain's EVM-compatible VM
- Custom VM types as needed

### Required Sections

After the frontmatter, include these sections:

```yaml
contractLanguages: # Programming languages supported
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io

docs: # Developer documentation
  - https://docs.example.org/

blockscanners: # Block explorers
  - name: Arbiscan
    url: https://arbiscan.io
    type: official
  - name: Blockscout
    url: https://arbitrum.blockscout.com
    type: alternative

testnets: # Test networks (if available)
  - name: Arbitrum Sepolia
    chainId: 421614
    url: https://sepolia.arbiscan.io
    description: Arbitrum testnet on Sepolia
    faucets:
      - https://faucet.arbitrum.io
    rpcs:
      - https://sepolia-rollup.arbitrum.io/rpc

rpcs: # RPC endpoints (10-20 recommended)
  - name: Arbitrum Foundation
    url: https://arb1.arbitrum.io/rpc
    type: official
  - name: Ankr
    url: https://rpc.ankr.com/arbitrum
    type: public
  - name: Alchemy
    url: https://www.alchemy.com/
    type: private

sourceCode: # GitHub repositories (optional)
  - name: Arbitrum Nitro
    url: https://github.com/OffchainLabs/nitro
    description: Core protocol implementation

forums: # Community channels (optional)
  - name: Arbitrum Discord
    url: https://discord.gg/arbitrum
    description: Main community hub
---
```

### Content Structure

After the frontmatter, write the chain description following this pattern:

```markdown
[1-2 sentence opener that captures what this chain is really about]

**Unique Position**
[What makes this chain different from competitors? 2-3 sentences]

**Primary Use Cases**

- [Specific use case 1]
- [Specific use case 2]
- [Specific use case 3]
- [Specific use case 4]

**Ecosystem Character**
[2-3 sentences about the community and dominant activity]

**Trade-offs**

- [Honest limitation 1]
- [Honest limitation 2]
- [Honest limitation 3]
- [Honest limitation 4]

## Technical Details

**Architecture**
[1-2 sentences about the core technology]

**Performance**
[2-3 sentences about speed, cost, throughput in relative terms]

**Security & Trust Model**
[3-4 sentences about validators, trust assumptions, security]

**Control & Governance**
[2-3 sentences about who controls what]
```

## Step 2: Chain Logo

Add the chain's logo to `/assets/chains/[chainname].svg`

### Requirements

- **Format**: SVG preferred, PNG accepted if SVG unavailable
- **Naming**: Must match the `logo` field in frontmatter
- **Dimensions**: Square aspect ratio
- **Background**: Transparent
- **Size**: Keep reasonable (under 100KB preferred)
- **Rights**: You must have permission to use the logo

### Examples

- `arbitrum_one.svg`
- `polygon.svg` (can differ from filename if specified)
- `zksync.png` (PNG fallback if needed)

## Step 3: Island Position

Add the chain's position to `/src/lib/positions.json`:

### Using Edit Mode (Recommended)

1. Run the project locally: `bun run dev`
2. Navigate to: `http://localhost:5173/?edit=true`
3. Find your new island (it may appear at 0,0)
4. Drag it to an empty ocean spot
5. Press 'e' to export positions
6. Copy the position from the console
7. Add to `/src/lib/positions.json`:

```json
{
  "ethereum": {
    "x": 0,
    "y": 0
  },
  "your_chain": {
    "x": 1234.56,
    "y": -789.01
  }
}
```

### Manual Positioning

If you can't test locally, add a placeholder position:

```json
"your_chain": {
  "x": 1000,
  "y": 1000
}
```

A maintainer will adjust it to avoid overlaps.

## Using AI to Generate Chain Data

We provide an AI prompt to help generate properly formatted chain data:

1. Open [prompts/generate-chain-data.md](../prompts/generate-chain-data.md)
2. Replace placeholders with your chain info
3. Use with Claude, GPT-4, or similar AI
4. **Important**: The AI must search for 2025 data to ensure accuracy
5. Review and verify all generated content

## Common Issues

### Chain Not Appearing

- Check that `chainId` in markdown matches the official chain ID
- Ensure the chain slug in `positions.json` matches the filename (without .md)
- Verify the logo file exists and matches the `logo` field

### Invalid Frontmatter

- All required fields must be present
- Dates must be in YYYY-MM-DD format
- `chainId` must be a number, not a string
- Colors must include the # symbol

### Logo Issues

- File must be in `/assets/chains/` directory
- Filename must match exactly (case-sensitive)
- SVG files should be valid (test in browser)

## Examples to Reference

Look at these well-formatted chains:

- `/data/chains/ethereum.md` - L1 with standard EVM
- `/data/chains/arbitrum_one.md` - L2 Optimistic rollup with ArbitrumVM
- `/data/chains/zksync.md` - L2 ZK rollup with custom VM (EraVM)
- `/data/chains/polygon_pos.md` - Sidechain with EVM
- `/data/chains/base.md` - L2 using OP Stack
- `/data/chains/apechain.md` - L3 on Arbitrum using Arbitrum Orbit

## Validation Checklist

Before submitting:

- [ ] Chain data file has all required frontmatter fields
- [ ] Chain ID verified on [chainlist.org](https://chainlist.org)
- [ ] At least 5 working RPC endpoints listed
- [ ] Logo file added and properly referenced
- [ ] Position added to positions.json
- [ ] Content follows the structure (no marketing fluff)
- [ ] Trade-offs section is honest about limitations
- [ ] All URLs are valid and working

## Need Help?

- **Simple way**: [Create an issue](https://github.com/imbaniac/buildscape-ui/issues/new?template=add-chain.yml) with the chain info
- **Questions**: Open a discussion or ask in issues
- **Updates**: Use the [edit chain template](https://github.com/imbaniac/buildscape-ui/issues/new?template=edit-chain.yml)
