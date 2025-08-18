---
name: Immutable zkEVM
chainId: 13371
nativeCurrency: IMX
color: "#210043"
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
  - https://docs.immutable.com/
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
  - name: Github Organization
    url: https://github.com/immutable
    description: Immutable GitHub organization
forums:
  - name: Immutable Discord
    url: https://discord.com/invite/immutable-play
    description: Official Discord community for developers and players
# SDKs and tools are inherited from evm-common.md
---

L2 built specifically for games, with gas-free transactions for players and built-in gaming infrastructure. Unlike general-purpose chains trying to attract games, Immutable provides game-specific tools: player wallets (Passport), marketplace APIs, and SDKs that handle blockchain complexity.

**Best for:** Web3 games needing player-friendly UX, NFT-heavy games, studios wanting blockchain without the complexity.

**Technical:** A ZK-rollup built on Polygon's CDK, focused on gaming and NFT-specific infrastructure with EVM compatibility.

- **Security & Data Availability**
  - Uses ZK proofs for state correctness — transactions are verified before being finalized.
  - Data availability is off-chain and centralized; no Ethereum calldata fallback or DA guarantees.
  - Exit safety depends on sequencer honesty and uptime; no enforced fallback mechanisms.

- **Sequencer & Governance**
  - Sequencer is centralized and contract upgrades are not timelocked.
  - Governance and upgrade control sit with the Immutable team.
  - IMX is used for gas and staking, but validator decentralization does not yet exist.

- **Performance**
  - High transaction throughput optimized for gaming patterns (item trades, battles, rewards).
  - Gas-free for players through sponsored transactions (studios pay).
  - Fast block times and batch proofs for responsive gameplay.

- **Tooling & Dev Experience**
  - Integrated with gaming SDKs, onchain orderbook infra, and Immutable Passport (non-custodial auth).
  - Contract deployment and indexing flows are streamlined for game devs.

- **Use Cases**
  - **Major games**: Gods Unchained (migrating), Guild of Guardians, Illuvium, Space Nation
  - **Gaming infrastructure**: Immutable Passport (wallets), Orderbook (marketplace), game-specific SDKs
  - **Player features**: Gas-free transactions, simplified onboarding, cross-game asset trading
  - **Studio benefits**: Pre-built gaming stack, no blockchain expertise needed

- **Trade-offs**
  - Centralized sequencer and DA — not trust-minimized.
  - Exit mechanisms depend on uptime and behavior of the Immutable-run infra.
  - Contract upgrades can be immediate, introducing governance and stability risk.
  - Ecosystem is specialized; limited general-purpose DeFi or non-gaming infrastructure.
