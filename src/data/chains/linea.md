---
name: Linea
chainId: 59144
color: "#61dfff"
darkColor: "#50BBD6"
logo: linea.svg
parentOrganization: ConsenSys
website: https://linea.build
launchDate: 2023-07-11
maxBlockSize: 30
technology:
  type: zk Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: zkEVM
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
  - https://docs.linea.build/
blockscanners:
  - name: Lineascan
    url: https://lineascan.build
    type: official
  - name: Blockscout
    url: https://explorer.linea.build
    type: alternative
  - name: L2scan
    url: https://linea.l2scan.co
    type: alternative
testnets:
  - name: Linea Sepolia
    chainId: 59141
    url: https://sepolia.lineascan.build
    description: Linea's Sepolia testnet for deploying and testing zkEVM applications.
    faucets:
      - https://www.alchemy.com/faucets/linea-sepolia
      - https://faucet.quicknode.com/linea/sepolia
      - https://getblock.io/faucet/linea-sepolia/
    rpcs:
      - https://rpc.sepolia.linea.build
      - https://linea-sepolia.drpc.org
      - https://linea-sepolia-rpc.publicnode.com
rpcs:
  - name: Linea Official
    url: https://rpc.linea.build
    type: public
  - name: PublicNode
    url: https://linea-rpc.publicnode.com
    type: public
  - name: Drpc
    url: https://linea.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/linea
    type: public
  - name: Decubate
    url: https://linea.decubate.com
    type: public
  - name: Histori
    url: https://node.histori.xyz/linea-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
  - name: Owlracle
    url: https://rpc.owlracle.info/linea/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: Linea Monorepo
    url: https://github.com/Consensys/linea-monorepo
    description: Main repository for Linea zkEVM implementation
  - name: Linea Specification
    url: https://github.com/Consensys/linea-specification
    description: Specification of the constraint system underlying Linea's zk-EVM
forums:
  - name: Linea Discord
    url: https://discord.gg/linea
    description: Official Discord community for developers and users
  - name: Linea Community Forum
    url: https://community.linea.build/
    description: Official community forum for discussions and governance
# SDKs and tools are inherited from evm-common.md
---

Linea is a zkEVM Layer 2 built by ConsenSys that uses zero-knowledge proofs to scale Ethereum. It's EVM-equivalent, meaning developers can deploy existing Ethereum applications without modification, while benefiting from lower costs and faster transactions through zk-rollup technology.

As a product from ConsenSys (the company behind MetaMask and Infura), Linea benefits from deep integration with the ConsenSys ecosystem. This includes native MetaMask support, giving it immediate access to millions of users, and seamless integration with Infura's infrastructure.

The network uses lattice-based cryptography for its zero-knowledge proofs, which provides quantum resistance and efficient proof generation. While still relatively new, Linea focuses on developer experience and maintains full EVM compatibility to minimize migration friction.