---
name: Rootstock
chainId: 30
color: "#FF931E"
darkColor: "#D78123"
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

Rootstock is a Bitcoin sidechain that brings smart contract functionality to the Bitcoin ecosystem. It's secured by Bitcoin's mining power through merged mining, where over 50% of Bitcoin's hashrate also mines RSK blocks, making it one of the most secure smart contract platforms.

The network uses RBTC (Smart Bitcoin) as its native currency, which is pegged 1:1 to BTC through a two-way peg mechanism. This allows Bitcoin holders to use their BTC in DeFi applications while maintaining exposure to Bitcoin's value.

Rootstock achieves 15-30 second block times and can process around 100 transactions per second, significantly faster than Bitcoin's base layer. However, it inherits some of Bitcoin's conservative approach to changes, prioritizing security and stability over rapid innovation.</content>