---
name: Aurora
chainId: 1313161554
color: "#5DEB5A"
darkColor: "#47A945"
logo: aurora.svg
parentOrganization: Aurora Labs
website: https://aurora.dev
launchDate: 2021-05-13
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
docs:
  - https://docs.aurora.dev/
blockscanners:
  - name: Aurora Explorer
    url: https://explorer.aurora.dev
    type: official
  - name: Aurorascan
    url: https://aurorascan.dev
    type: alternative
testnets:
  - name: Aurora Testnet
    chainId: 1313161555
    url: https://explorer.testnet.aurora.dev
    description: Aurora testnet for testing dApps and smart contracts on the NEAR-based EVM.
    faucets: []
    rpcs:
      - https://testnet.aurora.dev
      - https://aurora-testnet.drpc.org
      - https://endpoints.omniatech.io/v1/aurora/testnet/public
rpcs:
  - name: Aurora Labs
    url: https://mainnet.aurora.dev
    type: public
  - name: 1RPC
    url: https://1rpc.io/aurora
    type: public
  - name: dRPC
    url: https://aurora.drpc.org
    type: public
  - name: Tatum
    url: https://aurora-mainnet.gateway.tatum.io
    type: private
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/aurora/mainnet/public
    type: public
  - name: Histori
    url: https://node.histori.xyz/aurora-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/aurora/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: Aurora Engine
    url: https://github.com/aurora-is-near/aurora-engine
    description: Aurora Engine - EVM implementation on NEAR Protocol
  - name: Aurora Organization
    url: https://github.com/aurora-is-near
    description: Main Aurora GitHub organization with core repositories
forums:
  - name: Aurora Forum
    url: https://forum.aurora.dev/
    description: Official Aurora community forum for discussions and support
# SDKs and tools are inherited from evm-common.md
---

Aurora is an EVM-compatible blockchain built on the NEAR Protocol, designed to provide an Ethereum-like experience with the scalability benefits of NEAR. It operates as a smart contract on NEAR, offering developers familiar Ethereum tooling while leveraging NEAR's sharded architecture for lower fees and faster finality.

The platform achieves sub-second finality and transaction fees typically under $0.01 by utilizing NEAR's underlying consensus mechanism. Aurora maintains full Ethereum compatibility, supporting existing Solidity contracts and MetaMask integration without modifications.

While Aurora offers impressive performance and cost benefits, it's worth noting that it's not a traditional L2 but rather an EVM environment within NEAR's ecosystem. This unique architecture means developers should understand both Ethereum and NEAR ecosystems for optimal results.