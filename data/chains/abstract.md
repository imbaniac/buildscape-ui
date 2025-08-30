---
name: Abstract
chainId: 2741
nativeCurrency: ETH
color: "#36f197"
logo: abstract.svg
parentOrganization: Abstract Foundation
website: https://abs.xyz
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
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.abs.xyz/
blockscanners:
  - name: Abscan
    url: https://abscan.org
    type: official
  - name: Abstract Explorer
    url: https://explorer.mainnet.abs.xyz
    type: alternative
testnets:
  - name: Abstract Sepolia
    chainId: 11124
    url: https://sepolia.abscan.org
    description: Abstract testnet on Sepolia for testing dApps and smart contracts.
    faucets:
      - https://faucet.triangleplatform.com/abstract/testnet
    rpcs:
      - https://api.testnet.abs.xyz
rpcs:
  - name: Abstract Official RPC
    url: https://api.mainnet.abs.xyz
    type: public
  - name: dRPC
    url: https://abstract.drpc.org
    type: public
  - name: dRPC WebSocket
    url: wss://abstract.drpc.org
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/abstract-foundation
    description: Main Abstract GitHub organization
forums:
  - name: Discord
    url: https://discord.com/invite/abstractchain/
# SDKs and tools are inherited from evm-common.md
---

Pudgy Penguins' L2 betting that NFT plushies at Target translate into blockchain adoption. The Portal is their TikTok-style app store for non-crypto users.

**Unique Position**
Abstract isn't targeting crypto users at all — it's for Pudgy Penguin toy buyers who don't know what a blockchain is. The Portal curates simple apps like games and social features, accessed via email login through Abstract Global Wallet. Built on zkSync's infrastructure but focused entirely on mainstream consumer onboarding rather than DeFi or technical features.

**Primary Use Cases**

- Consumer applications requiring zero crypto knowledge
- Games and social apps needing sponsored transactions
- Projects leveraging Pudgy Penguins' mainstream brand recognition
- Applications requiring seamless fiat-to-crypto conversion
- NFT utilities bridging physical merchandise to digital experiences

**Ecosystem Character**
Early-stage ecosystem dominated by simple consumer apps and Pudgy-affiliated projects. The Portal serves as a curated app store meets streaming platform, claiming significant non-crypto user adoption. Community skews toward NFT collectors and consumer app developers rather than DeFi builders.

**Trade-offs**

- Completely unproven at scale — launched January 2025 with minimal battle-testing
- Success entirely dependent on Pudgy Penguins staying culturally relevant
- Built on zkSync's stack, inheriting all its limitations and dependencies
- Uses EigenDA instead of Ethereum for data availability — additional trust assumptions
- Consumer blockchain thesis has failed repeatedly (Flow, Immutable, etc.)

## Technical Details

**Architecture**
ZK rollup built on zkSync's ZK Stack, settling to Ethereum with validity proofs but using EigenDA for data availability to reduce costs. Features Abstract Global Wallet (AGW) for email/passkey authentication instead of traditional wallets.

**Performance**
Standard ZK rollup performance with focus on UX over raw throughput. Transaction costs optimized for consumer apps through sponsored gas and batching. Handles congestion through typical L2 queuing mechanisms, though untested under real load.

**Security & Trust Model**
Inherits Ethereum's security through ZK validity proofs, but data availability through EigenDA introduces additional trust assumptions. Account abstraction with AGW enables social recovery, reducing key loss risk but potentially enabling social engineering attacks. Proof generation and sequencing initially centralized.

**Control & Governance**
Abstract Foundation controls sequencer and protocol upgrades. No decentralized governance or timeline for progressive decentralization announced. The Portal curation and app approval process remains opaque, creating potential gatekeeping concerns.
