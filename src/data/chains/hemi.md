---
name: Hemi
chainId: 43111
nativeCurrency: ETH
color: "#f04d06"
darkColor: "#B93B04"
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
  - https://docs.hemi.xyz/building-bitcoin-apps/hemi-virtual-machine-hvm
  - https://docs.hemi.xyz/building-bitcoin-apps/hemi-bitcoin-kit-hbk
blockscanners:
  - name: Hemi Explorer
    url: https://explorer.hemi.xyz
    type: official
testnets:
  - name: Hemi Sepolia
    chainId: 743111
    url: https://testnet.explorer.hemi.xyz
    description: Hemi testnet running on Sepolia for testing Bitcoin-Ethereum cross-chain applications.
    faucets:
      - 
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
forums:
  - 
# SDKs and tools are inherited from evm-common.md
---

A Bitcoin-anchored modular L2 with an EVM execution layer and direct access to Bitcoin block and UTXO state.

- **Architecture & Security**  
  - Uses Proof-of-Proof (PoP): periodically posts state commitments ("keystones") to Bitcoin for long-term finality.  
  - Sequencer is PoS-based and operates independently of Bitcoin, but keystone anchoring adds Bitcoin-aligned settlement guarantees.  
  - Not a rollup — no fraud or validity proofs; relies on Bitcoin for settlement anchoring and economic honesty.

- **Finality**  
  - Soft finality via sequencer (seconds).  
  - Superfinality depends on Bitcoin block confirmation (~10–60 min depending on keystone interval).  
  - Security only as strong as keystone anchoring frequency and sequencer assumptions.

- **Bitcoin Integration**  
  - Contracts can access Bitcoin UTXO set and block headers directly from within EVM logic.  
  - Supports asset movement through “Hemi Tunnels” — native BTC and ETH bridged into the environment.  
  - Allows for BTC-aware dApps and hybrid assets.

- **When to Use It**  
  - You need contracts that verify or react to Bitcoin state.  
  - You’re building BTC-denominated apps, UTXO-aware agents, or experimenting with Bitcoin-based DAOs.  
  - You want Bitcoin-linked settlement while retaining EVM programmability.

- **Trade-offs**  
  - Sequencer is centralized; PoP anchoring introduces latency and added complexity.  
  - No fraud proofs or trustless escape — relies on Bitcoin anchoring and honest majority.  
  - Early infra: limited tooling, documentation, and ecosystem maturity.  