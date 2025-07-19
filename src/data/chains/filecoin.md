---
name: Filecoin
chainId: 314
color: "#0090FF"
darkColor: "#0068B9"
logo: filecoin.svg
parentOrganization: Protocol Labs
website: https://filecoin.io
launchDate: 2020-10-15
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
docs:
  - https://docs.filecoin.io/
  - https://docs.filecoin.io/smart-contracts/fundamentals/basics/
blockscanners:
  - name: Filfox
    url: https://filfox.info/en
    type: official
  - name: Filscan
    url: https://filscan.io
    type: alternative
  - name: Beryx
    url: https://beryx.zondax.ch
    type: alternative
  - name: Glif Explorer
    url: https://explorer.glif.io
    type: alternative
  - name: Filscout
    url: https://filscout.io/en
    type: alternative
testnets:
  - name: Calibration
    chainId: 314159
    url: https://calibration.filfox.info/en
    description: Primary Filecoin testnet for smart contract and dApp testing with real network conditions.
    faucets:
      - https://faucet.calibration.fildev.network/
    rpcs:
      - https://api.calibration.node.glif.io/rpc/v1
      - https://filecoin-calibration.chainup.net/rpc/v1
      - https://rpc.ankr.com/filecoin_testnet
      - https://filecoin-calibration.chainstacklabs.com/rpc/v1
      - https://calibration.filfox.info/rpc/v1
      - https://filecoin-calibration.drpc.org
rpcs:
  - name: Glif
    url: https://api.node.glif.io
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/filecoin
    type: public
  - name: Chainup
    url: https://filecoin.chainup.net/rpc/v1
    type: public
  - name: dRPC
    url: https://filecoin.drpc.org
    type: public
  - name: Lava Network
    url: https://filecoin.lava.build
    type: public
  - name: Chainstacklabs
    url: https://filecoin-mainnet.chainstacklabs.com/rpc/v1
    type: public
  - name: Filfox
    url: https://filfox.info/rpc/v1
    type: public
  - name: FilUtils
    url: https://node.filutils.com/rpc/v1
    type: public
  - name: Chain.love
    url: https://api.chain.love/rpc/v1
    type: public
  - name: Infura (SFT Project)
    url: https://infura.sftproject.io/filecoin/rpc/v1
    type: private
sourceCode:
  - name: Filecoin
    url: https://github.com/filecoin-project
    description: Main Filecoin GitHub organization with core repositories
  - name: Lotus
    url: https://github.com/filecoin-project/lotus
    description: Reference implementation of the Filecoin protocol
  - name: FVM (Filecoin Virtual Machine)
    url: https://github.com/filecoin-project/FVM
    description: Filecoin Virtual Machine implementation
forums:
  - name: Filecoin Slack
    url: https://filecoin.io/slack
    description: Official Filecoin community Slack workspace
  - name: Filecoin Forum
    url: https://github.com/filecoin-project/community/discussions
    description: Community discussions and governance proposals
# SDKs and tools are inherited from evm-common.md
---

Filecoin is a decentralized storage network that combines blockchain technology with distributed file storage. Originally focused on storage, Filecoin launched the Filecoin Virtual Machine (FVM) in 2023, bringing full EVM compatibility and smart contract capabilities to the network.

The network operates on a unique proof-of-spacetime consensus mechanism, where storage providers earn FIL tokens by proving they're storing data over time. This creates a massive decentralized storage marketplace while also supporting traditional smart contract use cases.

While Filecoin offers unparalleled decentralized storage capabilities and EVM compatibility, developers should be aware that transaction costs can vary based on network storage demand, and the hybrid nature of storage and compute operations requires understanding both paradigms for optimal application design.