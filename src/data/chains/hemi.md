---
name: Hemi
chainId: 43111
color: "#f04d06"
darkColor: "#B93B04"
logo: hemi.svg
parentOrganization: Hemi Labs
website: https://hemi.xyz
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
docs:
  - https://docs.hemi.xyz/
  - https://docs.hemi.xyz/building-bitcoin-apps/hemi-virtual-machine-hvm
  - https://docs.hemi.xyz/building-bitcoin-apps/hemi-bitcoin-kit-hbk
blockscanners:
  - name: Hemi Explorer
    url: https://explorer.hemi.xyz
    type: official
testnets:
  - name: Hemi Sepolia
    chainId: 743111
    url: https://testnet.explorer.hemi.xyz
    description: Hemi testnet running on Sepolia for testing Bitcoin-Ethereum cross-chain applications.
    faucets:
      - 
    rpcs:
      - https://testnet.rpc.hemi.network/rpc
rpcs:
  - name: Hemi Public RPC
    url: https://rpc.hemi.network/rpc
    type: public
sourceCode:
  - name: Hemi GitHub
    url: https://github.com/hemilabs
    description: Hemi Labs GitHub organization with core repositories
forums:
  - 
# SDKs and tools are inherited from evm-common.md
---

Hemi is a Layer 2 blockchain that creates a programmable bridge between Bitcoin and Ethereum. It features the Hemi Virtual Machine (hVM), which is essentially a full Bitcoin node wrapped inside an EVM, enabling developers to build applications that leverage both Bitcoin's security and Ethereum's programmability.

The network uses a unique Proof-of-Proof (PoP) consensus mechanism and enables non-custodial Bitcoin services, cross-chain exchanges, and Bitcoin-backed DeFi primitives. While it's EVM-compatible for smart contract development, its core innovation lies in providing deep Bitcoin network access within smart contracts.

As a newer L2, Hemi focuses on Bitcoin-Ethereum interoperability rather than pure scalability, making it particularly interesting for developers building cross-chain applications or wanting to create Bitcoin-native DeFi without wrapped tokens.