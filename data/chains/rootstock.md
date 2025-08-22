---
name: Rootstock
chainId: 30
nativeCurrency: RBTC
color: "#FF931E"
logo: rootstock.svg
parentOrganization: IOV Labs
website: https://rootstock.io
launchDate: 2018-01-04
maxBlockSize: 6.8
technology:
  isL2: false
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://dev.rootstock.io/
blockscanners:
  - name: Rootstock Explorer
    url: https://explorer.rsk.co
    type: official
  - name: Blockscout
    url: https://rootstock.blockscout.com
    type: alternative
testnets:
  - name: Rootstock Testnet
    chainId: 31
    url: https://explorer.testnet.rsk.co
    description: Rootstock testnet for testing smart contracts and dApps on Bitcoin-merged mining architecture.
    faucets:
      - https://faucet.rsk.co/
    rpcs:
      - https://public-node.testnet.rsk.co
      - https://mycrypto.testnet.rsk.co
      - https://rootstock-testnet.drpc.org
rpcs:
  - name: Public Node
    url: https://public-node.rsk.co
    type: public
  - name: MyCrypto RSK
    url: https://mycrypto.rsk.co
    type: public
  - name: dRPC
    url: https://rootstock.drpc.org
    type: public
  - name: Blast API
    url: https://rootstock-mainnet.public.blastapi.io
    type: public
  - name: Node Histori
    url: https://node.histori.xyz/rsk-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: RSKj (Rootstock Node)
    url: https://github.com/rsksmart/rskj
    description: Official Java implementation of the Rootstock protocol
  - name: RSK Organization
    url: https://github.com/rsksmart
    description: Main Rootstock GitHub organization with core repositories
forums:
  - name: Rootstock Research Forum
    url: https://research.rsk.dev/
    description: Community forum for Rootstock development and research discussions
  - name: RSK Community Discord
    url: https://discord.gg/rootstock
    description: Official Discord server for Rootstock community
# SDKs and tools are inherited from evm-common.md
---

The original Bitcoin sidechain from 2018 — run Ethereum smart contracts secured by Bitcoin miners. Gets its security from 81% of Bitcoin's hashpower through merged mining, where miners earn both BTC and RBTC rewards simultaneously.

**Key Difference:** True sidechain architecture, not a rollup — runs parallel to Bitcoin with its own consensus. Bitcoin miners validate blocks but can't steal funds thanks to hardware-secured federation controlling the bridge.

**Best for:** Bitcoin purists wanting EVM without leaving Bitcoin security, projects needing stable proven infrastructure, DeFi protocols wanting BTC collateral without wrapped tokens.

**Technical:** EVM sidechain with merged mining (81% of Bitcoin hashpower), federation-controlled two-way peg, 30-second blocks.

- **Use Cases**
  - **Sovryn**: Bitcoin-native DEX and lending protocol
  - **Money On Chain**: Dollar On Chain (DOC) — 100% BTC-backed stablecoin
  - **Mining revenue**: Miners earn additional rewards without extra hardware

- **Security & Data Availability**
  - Merged mining with Bitcoin — 740+ exahashes/second securing the network.
  - DECOR+ protocol prevents mining centralization issues.
  - Powpeg federation uses hardware security modules (HSMs) for bridge control.

- **Infra & Execution**
  - Full EVM compatibility via RVM — deploy unchanged Solidity contracts.
  - Gas paid in RBTC (1:1 pegged to BTC).
  - Transaction fees down 60% in 2025, making it competitive with newer L2s.

- **Performance**
  - 300+ TPS capability (though typical usage much lower).
  - 30-second block times — slower than modern L2s but predictable.
  - Peg-in/out takes 24-36 hours — optimized for security over speed.

- **Trade-offs**
  - Federation-controlled bridge — not fully trustless like newer BitVM designs.
  - 30-second blocks feel slow vs sub-second modern L2s.
  - Smaller ecosystem than newer Bitcoin L2s despite being oldest.
  - Sidechain model less capital efficient than rollups.
