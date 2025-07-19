---
name: Etherlink
chainId: 42793
color: "#38FF9C"
darkColor: "#25B970"
logo: etherlink.svg
parentOrganization: Tezos Foundation
website: https://etherlink.com
launchDate: 2024-05-01
maxBlockSize: 30
technology:
  isL2: true
  parentChain: Tezos
  isEVM: true
  rollupType: Smart Rollup
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.etherlink.com/
blockscanners:
  - name: Etherlink Explorer
    url: https://explorer.etherlink.com
    type: official
testnets:
  - name: Ghostnet
    chainId: 128123
    url: https://testnet.explorer.etherlink.com
    description: Etherlink testnet running on Tezos Ghostnet
    faucets:
      - https://faucet.etherlink.com
    rpcs:
      - https://node.ghostnet.etherlink.com
      - https://rpc.ankr.com/etherlink_testnet
rpcs:
  - name: Official RPC
    url: https://node.mainnet.etherlink.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/etherlink_mainnet
    type: public
sourceCode:
  - name: Etherlink on Tezos GitLab
    url: https://gitlab.com/tezos/tezos
    description: Part of the Tezos protocol implementation
forums:
  - name: Tezos Stack Exchange
    url: https://tezos.stackexchange.com/
    description: Q&A site for Tezos and Etherlink developers
# SDKs and tools are inherited from evm-common.md
---

Etherlink is a Layer 2 blockchain built on Tezos using Smart Rollup technology. It's EVM-compatible, allowing developers to deploy Solidity smart contracts while benefiting from Tezos' advanced rollup architecture. The network offers ultrafast soft confirmations in under 500ms and near-zero transaction costs.

As Tezos' premier EVM-compatible rollup, Etherlink bridges the gap between Ethereum's ecosystem and Tezos' innovative consensus mechanism. It provides a fast and affordable environment for DeFi applications, NFTs, and other decentralized services while maintaining strong security guarantees through its non-custodial design.

The chain features decentralized governance inherited from Tezos and focuses on being "fast, fair, and (nearly) free" - making it an attractive option for developers looking to escape high gas fees without compromising on security or decentralization.