---
name: Immutable zkEVM
chainId: 13371
nativeCurrency: IMX
color: "#210043"
logo: immutable_zkevm.svg
parentOrganization: Immutable
website: https://www.immutable.com
launchDate: 2024-01-30
maxBlockSize: 30
technology:
  type: ZK Rollup
  layer: L2
  vm:
    type: zkEVM
    evmCompatible: true
  settlementLayer: Ethereum
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

The L2 built specifically for games, where players never pay gas and studios get plug-and-play blockchain infrastructure. Chain that treats games as first-class citizens, not afterthoughts.

**Unique Position**
Immutable provides complete gaming infrastructure out of the box — Passport handles player wallets without seed phrases, Orderbook manages NFT marketplaces, and SDKs abstract blockchain complexity entirely. Studios pay gas so players never see crypto friction. Unlike general chains hoping to attract games, Immutable only does gaming.

**Primary Use Cases**

- Web3 games requiring seamless player experience
- NFT-heavy games with complex economies
- Studios wanting blockchain benefits without blockchain headaches
- Cross-game asset interoperability
- Mobile games needing compliant wallet solutions

**Ecosystem Character**
Gaming-first ecosystem where major titles like Gods Unchained and Illuvium set the tone. Developer community consists of game studios rather than DeFi builders. Infrastructure decisions prioritize gameplay over decentralization. The chain where "fun" beats "trustless" every time.

**Trade-offs**

- Completely centralized — Immutable controls sequencer and upgrades
- Data availability off-chain with no Ethereum fallback
- No permissionless exit if Immutable infrastructure fails
- Limited to gaming — no meaningful DeFi ecosystem
- IMX token has minimal utility despite gas and staking claims

## Technical Details

**Architecture**
ZK-rollup built on Polygon CDK with gaming-specific modifications. Uses validity proofs for state transitions but centralized data availability. Immutable Passport provides account abstraction for seedphrase-free onboarding.

**Performance**
Optimized for gaming patterns — item mints, trades, battle results. High throughput for NFT operations with batched proof generation. Gas-free for players through relayer network with studios covering costs. Sub-second perceived finality for gameplay despite longer proof generation.

**Security & Trust Model**
ZK proofs ensure state transition validity but require trusting Immutable for data availability and liveness. No forced exit mechanism if sequencer censors or fails. Instant upgradability without timelock creates rug risk. Security depends entirely on Immutable's reputation and business continuity.

**Control & Governance**
Immutable team has complete control over protocol operation and upgrades. No community governance or decentralization roadmap. Sequencer revenue and MEV captured by Immutable. Contract upgrades can happen instantly without warning.
