---
name: Hemi
chainId: 43111
nativeCurrency: ETH
color: "#f04d06"
logo: hemi.svg
parentOrganization: Hemi Labs
website: https://hemi.xyz
launchDate: 2025-03-12
maxBlockSize: 30
technology:
  type: Modular L2
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Bitcoin, Ethereum
  consensus: Proof-of-Proof (PoP)
  stack: OP Stack
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

Bitcoin L2 with a full Bitcoin node running inside the EVM — smart contracts can read Bitcoin blocks and UTXOs directly. Founded by Jeff Garzik, who worked with Satoshi on early Bitcoin development.

**Unique Position**
Hemi Virtual Machine (hVM) embeds an entire indexed Bitcoin node inside the EVM, enabling smart contracts to react to Bitcoin events without oracles or bridges. Your contracts can trigger automatically when specific Bitcoin transactions occur. The only L2 where Bitcoin isn't just security but programmable data — bringing Bitcoin DeFi without wrapped tokens or custodians.

**Primary Use Cases**

- Native Bitcoin DeFi without wrapping or bridging
- Smart contracts reacting to Bitcoin events in real-time
- Cross-chain applications needing trustless Bitcoin state
- Bitcoin MEV and arbitrage opportunities
- Self-custody BTC staking and yield strategies

**Ecosystem Character**
Early-stage ecosystem backed by serious Bitcoin credentials (Jeff Garzik's involvement matters). Mix of Bitcoin OGs intrigued by native programmability and DeFi builders seeking Bitcoin liquidity. Major DeFi protocols (Sushi, DODO) deployed early, betting on Bitcoin-native yields. Community values Bitcoin philosophy with EVM practicality.

**Trade-offs**

- Not a true rollup — uses Proof-of-Proof instead of fraud/validity proofs
- Centralized sequencer during bootstrap phase
- Finality requires waiting for Bitcoin confirmations (10-60 minutes)
- Newer and less proven than established Bitcoin L2s
- Security model weaker than cryptographic proof systems

## Technical Details

**Architecture**
Modular L2 using Proof-of-Proof (PoP) consensus that posts "keystones" to Bitcoin for finality. hVM provides full indexed Bitcoin node access within EVM environment. Tunnels enable asset transfer without traditional bridges.

**Performance**
Soft finality in seconds through PoS sequencer with superfinality after Bitcoin anchoring. Tunnel withdrawals complete in 40 minutes — faster than 7-day optimistic rollup delays. Standard EVM performance for smart contract execution.

**Security & Trust Model**
Dual-layer security with PoS for fast blocks and Bitcoin anchoring for long-term guarantees. Not a rollup — requires honest majority assumption rather than cryptographic proofs. Bitcoin provides timestamping and ordering but not full security inheritance.

**Control & Governance**
Currently centralized during bootstrap with plans for progressive decentralization. Sequencer operated by Hemi Labs with no permissionless participation yet. Governance structure not fully defined but Bitcoin-aligned philosophy suggests conservative approach.
