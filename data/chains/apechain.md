---
name: ApeChain
color: "#0054FA"
chainId: 33139
nativeCurrency: APE
logo: apechain.svg
parentOrganization: ApeCoin DAO / Ape Foundation
website: https://apechain.com
launchDate: 2024-10-20
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  layer: L3
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Arbitrum One
  stack: Arbitrum Orbit
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
blockscanners:
  - name: ApeScan
    url: https://apescan.io
    type: official
testnets:
  - name: Curtis
    chainId: 33111
    url: https://explorer.curtis.apechain.com
    description: ApeChain testnet for deploying and testing applications before mainnet launch.
    faucets:
      - https://curtis.hub.caldera.xyz
    rpcs:
      - https://rpc.curtis.apechain.com
      - https://apechain-curtis.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.apechain.com
    type: official
  - name: dRPC
    url: https://apechain.drpc.org
    type: public
  - name: Histori
    url: https://node.histori.xyz/apechain-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
docs:
  - name: ApeChain Documentation
    url: https://docs.apechain.com
  - name: Developer Hub
    url: https://apechain.hub.caldera.xyz
forums:
  - name: ApeChain Forum
    url: https://forum.apecoin.com/
    description: Official community forum for ApeChain discussions and governance
  - name: ApeChain Discord
    url: https://discord.com/invite/apecoindao
    description: Community Discord server for real-time discussions
sourceCode:
  - name: YugaLabs Organization
    url: https://github.com/yuga-labs
    description: Main ApeChain GitHub organization
sdks:
tools:
# Additional SDKs and tools are inherited from evm-common.md
---

The Bored Ape ecosystem's own chain — an L3 on Arbitrum built for NFT culture and gaming. If you're not in the BAYC universe, this isn't for you, and that's the point.

**Unique Position**
ApeChain brings native yield to APE holders without staking contracts — tokens automatically generate yield just sitting in your wallet. While other chains chase broad adoption, ApeChain is unapologetically niche: APE as gas, deep Yuga Labs integration, and exclusive access to the Otherside metaverse. The chain where holding a jpeg gets you real utility.

**Primary Use Cases**

- BAYC/MAYC ecosystem participants seeking native yield and exclusive experiences
- Otherside metaverse development and NFT gaming projects
- Meme token experiments within the Ape community
- ApeCoin holders looking for yield without smart contract risks

**Ecosystem Character**
Tightly controlled playground for Yuga Labs IP and ApeCoin community. Dominated by metaverse gaming (Otherside), satirical trading games, and meme token experiments. The ecosystem embraces absurdity — where else would a toilet-themed runner game be a flagship app? Community is insular but engaged, treating chain activity as social signaling within NFT culture.

**Trade-offs**

- Completely tied to Yuga Labs ecosystem — if you're not in, you're out
- L3 architecture adds extra dependency on Arbitrum's infrastructure
- Centralized control via multisig, sequencer, and DAC
- Niche appeal limits broader DeFi and developer adoption
- Success depends entirely on BAYC/Yuga Labs cultural relevance

## Technical Details

**Architecture**
L3 built on Arbitrum Orbit, settling to Arbitrum One which settles to Ethereum. Uses APE as native gas token with automatic yield generation mechanism built into the chain itself.

**Performance**
Max speed 250ms block times with standard Orbit throughput capabilities. Gas costs significantly lower than L2s due to L3 batching, though adds latency from extra settlement layer. Handles gaming workloads well but untested under heavy DeFi-style congestion.

**Security & Trust Model**
Inherits Ethereum security through two layers of settlement (Arbitrum One → Ethereum). Data availability through centralized DAC rather than on-chain posting. Centralized sequencer operated by chain operators. Trust assumptions compound through L3 architecture — you trust both Arbitrum and ApeChain operators.

**Control & Governance**
Controlled by multisig with ApeCoin DAO-selected Security Council members. No on-chain upgrade delays or permissionless challenge mechanism. Sequencer revenue and MEV controlled by operators, not DAO. Despite "DAO" branding, governance is effectively centralized with advisory input.
