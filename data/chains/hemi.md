---
name: Hemi
chainId: 43111
nativeCurrency: ETH
color: "#f04d06"
logo: hemi.svg
parentOrganization: Hemi Labs
website: https://hemi.xyz
launchDate: 2024-01-01
maxBlockSize:
technology:
  isL2: true
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://docs.hemi.xyz/
blockscanners:
  - name: Hemi Explorer
    url: https://explorer.hemi.xyz
    type: official
testnets:
  - name: Hemi Sepolia
    chainId: 743111
    url: https://testnet.explorer.hemi.xyz
    description: Hemi testnet running on Sepolia for testing Bitcoin-Ethereum cross-chain applications.
    faucets: []
    rpcs:
      - https://testnet.rpc.hemi.network/rpc
rpcs:
  - name: Hemi Public RPC
    url: https://rpc.hemi.network/rpc
    type: public
sourceCode:
  - name: Hemi GitHub
    url: https://github.com/hemilabs
    description: Hemi Labs GitHub organization with core repositories
forums: []
# SDKs and tools are inherited from evm-common.md
---

Bitcoin L2 with a full Bitcoin node running inside the EVM — smart contracts can read Bitcoin blocks, UTXOs, and transactions directly. Founded by early Bitcoin developer Jeff Garzik who worked with Satoshi, launched March 2025 with $440M TVL.

**Key Difference:** hVM (Hemi Virtual Machine) wraps an entire Bitcoin node inside an EVM, enabling native Bitcoin programmability without bridges or wrapped tokens — your contracts can trigger on Bitcoin events automatically.

**Best for:** Bitcoin DeFi protocols, native BTC staking without wrapping, cross-chain apps needing real Bitcoin state, developers wanting Bitcoin security with EVM tools.

**Technical:** Modular L2 with Proof-of-Proof consensus anchoring to Bitcoin, hVM for Bitcoin state access, Tunnels for trustless asset transfer.

- **Use Cases**
  - **DeFi ecosystem**: Sushi, DODO, Izumi (DEXs), LayerBank, ZeroLend (lending)
  - **Bitcoin native apps**: Native BTC staking with self-custody, Bitcoin MEV marketplaces
  - **Cross-chain infrastructure**: LayerZero, Pyth, RedStone oracles integrated
  - **Institutional products**: Pendle, Swell, Symbiotic yield strategies on Bitcoin

- **Security & Data Availability**
  - Proof-of-Proof (PoP) consensus posts "keystones" to Bitcoin for superfinality.
  - PoS sequencer for fast blocks, Bitcoin anchoring for long-term security.
  - Not a rollup — no fraud/validity proofs, relies on Bitcoin anchoring and honest majority.

- **Infra & Execution**
  - hVM: Full indexed Bitcoin node inside EVM — read blocks, UTXOs, transactions directly.
  - Bitcoin Kit (hBK) provides granular Bitcoin state access to smart contracts.
  - Automatic callbacks triggered by Bitcoin events — no oracles needed.

- **Performance**
  - Soft finality in seconds via sequencer.
  - Superfinality after Bitcoin confirmation (10-60 minutes).
  - Tunnels provide withdrawal proofs in 40 minutes — faster than optimistic rollups.

- **Trade-offs**
  - Not a true rollup — less security than fraud/ZK proof systems.
  - Centralized sequencer during bootstrap phase.
  - Newer ecosystem vs established Bitcoin L2s like Rootstock.
  - PoP finality slower than instant rollup confirmations.
