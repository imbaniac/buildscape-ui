---
name: ApeChain
color: "#0054FA"
chainId: 33139
nativeCurrency: APE
logo: apechain.svg
parentOrganization: Ape Foundation
website: https://apechain.com
launchDate: 2024-10-20
maxBlockSize: 30
techStack: Arbitrum Orbit
technology:
  type: Arbitrum Orbit
  settlementLayer: Ethereum
  isL3: true
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

The Bored Ape ecosystem's own chain — an L3 on Arbitrum built for NFT culture and gaming. Unlike general chains, ApeChain is unapologetically niche: APE as gas, native yield for holders, and deep integration with Yuga Labs' metaverse (Otherside). If you're not in the BAYC universe, this isn't for you.

**Key Difference:** APE tokens automatically generate yield just by holding them in your wallet — no staking
contracts or lockups needed.

**Best for:** Yuga ecosystem projects, APE token holders, Otherside metaverse, NFT-first gaming, meme token experiments.

**Technical:** A purpose-built L3 on Arbitrum Orbit for the ApeCoin ecosystem (Yuga Labs, Otherside, NFT/gaming projects).

- **Use Cases**:
  - **BAYC/MAYC holders**: Native yield on APE, exclusive games, metaverse access
  - **NFT gaming**: Otherside metaverse, ODK for Unreal Engine NFT integration
  - **Meme token launches**: Ape Express for quick token deployment
  - **APE staking**: Native yield without smart contract risks

- **Security**: Inherits Ethereum security via Arbitrum One → Orbit. Depends on DAC for data availability and centralized sequencer.
- **Token Utility**: APE as native gas, native yield for holders, gas-sponsored transactions for smooth onboarding.
- **Infra**: Runs as an Orbit chain with 250ms block time, but real throughput and latency depend on sequencer performance and app-level congestion.
- **Ecosystem**:
  - **Otherside**: Yuga's metaverse with 2,197-player record-breaking gaming sessions
  - **Dookey Dash Unclogged**: Toilet-themed arcade runner (yes, really)
  - **Top Trader**: Satirical trading game turning speculation into sport
  - **Ape Express**: Meme token creation toolkit for the APE community
- **Governance**: Controlled by a multisig with ApeCoin DAO-selected Security Council (no onchain upgrade delay).
- **Trade-offs**:
  - Centralized trust assumptions (sequencer, DAC, multisig upgrades)
  - Ecosystem is niche and tied closely to Yuga IP
  - L3 setup adds another dependency layer (on Arbitrum infra)
