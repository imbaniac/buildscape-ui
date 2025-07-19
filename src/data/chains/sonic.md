---
name: Sonic
chainId: 146
color: "#141416"
darkColor: "#6A6A6A"
logo: sonic.svg
parentOrganization: Sonic Labs
website: https://soniclabs.com
launchDate: 
maxBlockSize: 
technology:
  isL2: false
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
  - https://docs.soniclabs.com/
blockscanners:
  - name: Sonic Explorer
    url: https://explorer.soniclabs.com
    type: official
testnets:
  - name: Sonic Blaze Testnet
    chainId: 57054
    url: https://blaze.soniclabs.com
    description: Sonic's testnet for deploying and testing applications on the high-performance Sonic blockchain.
    faucets:
      - https://blaze.soniclabs.com/account
    rpcs:
      - https://rpc.blaze.soniclabs.com
      - https://sonic-testnet.drpc.org
rpcs:
  - name: Sonic Labs
    url: https://rpc.soniclabs.com
    type: official
  - name: Ankr
    url: https://rpc.ankr.com/sonic_mainnet
    type: public
  - name: dRPC
    url: https://sonic.drpc.org
    type: public
  - name: PublicNode
    url: https://sonic-rpc.publicnode.com
    type: public
  - name: OnFinality
    url: https://sonic.api.onfinality.io/public
    type: public
  - name: Stakely
    url: https://sonic-json-rpc.stakely.io
    type: public
sourceCode:
  - name: Sonic Labs Organization
    url: https://github.com/sonic-chain
    description: Main GitHub organization for Sonic development
forums:
  - name: Sonic Labs Discord
    url: https://discord.com/invite/soniclabs
    description: Main community support and discussion channel
  - name: Sonic Labs on X (Twitter)  
    url: https://x.com/soniclabs
    description: Official Sonic Labs announcements and updates
# SDKs and tools are inherited from evm-common.md
---

Sonic is a high-performance EVM Layer-1 blockchain that claims to deliver up to 400,000 transactions per second with sub-second confirmation times. Built by Sonic Labs, it aims to solve the scalability trilemma by offering unprecedented speed without compromising on EVM compatibility.

The network features specialized components like SonicVM for 100% EVM compatibility, SonicDB for low-latency data access, and Sonic Gateway as a native bridge. With average transaction costs around $0.001, it's designed for applications requiring high throughput and low latency.

A unique aspect of Sonic is its developer incentive model, where developers can earn 90% of their application's fees. While the performance claims are impressive, as with any new blockchain, developers should verify these metrics under real-world conditions and assess the network's actual decentralization and security guarantees.