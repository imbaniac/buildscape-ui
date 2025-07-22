---
name: Immutable zkEVM
chainId: 13371
nativeCurrency: IMX
color: "#df9ef8"
darkColor: "#BA7CD1"
logo: immutable_zkevm.svg
parentOrganization: Immutable
website: https://www.immutable.com
launchDate: 
maxBlockSize: 
technology:
  isL2: true
  isEVM: true
  type: ZK Rollup
  parentChain: Ethereum
  stack: Polygon zkEVM
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
docs:
  - https://docs.immutable.com/docs/zkEVM/
blockscanners:
  - name: Immutable Explorer
    url: https://explorer.immutable.com
    type: official
testnets:
  - name: Immutable zkEVM Testnet
    chainId: 13473
    url: https://explorer.testnet.immutable.com
    description: Test environment for Immutable zkEVM with gaming-optimized features.
    faucets:
      - https://docs.immutable.com/docs/zkEVM/guides/faucet
    rpcs:
      - https://rpc.testnet.immutable.com
      - https://immutable-zkevm-testnet.drpc.org
rpcs:
  - name: Immutable
    url: https://rpc.immutable.com
    type: public
  - name: dRPC
    url: https://immutable-zkevm.drpc.org
    type: public
  - name: Tenderly
    url: https://immutable.gateway.tenderly.co
    type: private
  - name: Histori
    url: https://node.histori.xyz/immutable-mainnet
    type: public
sourceCode:
  - name: Immutable zkEVM
    url: https://github.com/immutable
    description: Immutable GitHub organization
forums:
  - name: Immutable Discord
    url: https://discord.gg/immutable
    description: Official Discord community for developers and players
  - name: Immutable Developer Hub
    url: https://www.immutable.com/developers
    description: Resources and documentation for building on Immutable
# SDKs and tools are inherited from evm-common.md
---

A ZK-rollup built on Polygon's CDK, focused on gaming and NFT-specific infrastructure with EVM compatibility.

- **Security & Data Availability**  
  - Uses ZK proofs for state correctness — transactions are verified before being finalized.  
  - Data availability is off-chain and centralized; no Ethereum calldata fallback or DA guarantees.  
  - Exit safety depends on sequencer honesty and uptime; no enforced fallback mechanisms.  

- **Sequencer & Governance**  
  - Sequencer is centralized and contract upgrades are not timelocked.  
  - Governance and upgrade control sit with the Immutable team.  
  - IMX is used for gas and staking, but validator decentralization does not yet exist.  

- **Performance**  
  - High transaction throughput (~500k daily txs as of mid-2025).  
  - Low, predictable fees — paid in IMX.  
  - Fast block times and batch proofs improve UX for gaming applications.  

- **Tooling & Dev Experience**  
  - Integrated with gaming SDKs, onchain orderbook infra, and Immutable Passport (non-custodial auth).  
  - Contract deployment and indexing flows are streamlined for game devs.  

- **Use Cases**  
  - Designed for game economies, onchain marketplaces, and NFT minting/trading at scale.  
  - Well-suited for projects needing fast finality, low fees, and built-in user onboarding tools.

- **Trade-offs**  
  - Centralized sequencer and DA — not trust-minimized.  
  - Exit mechanisms depend on uptime and behavior of the Immutable-run infra.  
  - Contract upgrades can be immediate, introducing governance and stability risk.  
  - Ecosystem is specialized; limited general-purpose DeFi or non-gaming infrastructure. 