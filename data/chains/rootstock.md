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


A Bitcoin sidechain with EVM-compatible smart contracts, secured via merged mining with Bitcoin miners.

- **Consensus & Security**  
  - Uses merged mining with Bitcoin (DECOR+ protocol).  
  - ~80% of Bitcoin hashpower participates, aligning security with Bitcoin PoW.  
  - Block time ~30 seconds; no rollup-level validity or fraud proofs.  
  - Security depends on miner participation and the integrity of a federation-controlled peg.

- **Peg Mechanism**  
  - BTC is bridged via a two-way peg (rBTC) controlled by the Powpeg federation.  
  - Peg is semi-centralized: validators use hardware-secured multisig to release assets.  
  - Peg-in and peg-out times are long (~24–36 hours).

- **Infra & Execution**  
  - EVM-equivalent via Rootstock Virtual Machine (RVM) — supports Solidity contracts.  
  - Gas is paid in rBTC (1:1 with BTC).  
  - No modular architecture or DA layer — single-chain state and execution.

- **Performance**  
  - ~10 TPS under normal conditions.  
  - Lower gas costs after recent upgrades, but still slower than most rollups or L2s.  
  - No sequencing or batching — each block is mined individually.

- **Use Cases**  
  - Useful for deploying Bitcoin-native DeFi, lending markets, or DEXs with BTC collateral and EVM logic.

- **Trade-offs**  
  - No trustless peg — bridge relies on federation security, not proofs.  
  - Throughput and latency are limited by Bitcoin mining constraints.  
  - Finality is slower and less deterministic than ZK or optimistic rollups.  
  - Ecosystem is niche — fewer devs, apps, and infra support compared to Ethereum L2s.