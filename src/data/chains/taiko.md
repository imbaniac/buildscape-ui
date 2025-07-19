---
name: Taiko Alethia
chainId: 167000
color: "#E81899"
darkColor: "#AE1273"
logo: taiko.svg
parentOrganization: Taiko Labs
website: https://taiko.xyz
launchDate: 
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
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.taiko.xyz/
blockscanners:
  - name: Taikoscan
    url: https://taikoscan.io
    type: official
  - name: Taikoexplorer
    url: https://taikoexplorer.com
    type: alternative
testnets:
  - name: Hekla
    chainId: 167009
    url: https://hekla.taikoexplorer.com
    description: Taiko testnet for developers to test dApps and smart contracts before mainnet deployment.
    faucets:
      - 
    rpcs:
      - https://rpc.hekla.taiko.xyz
      - https://taiko-hekla.drpc.org
      - https://taiko-hekla-rpc.publicnode.com
rpcs:
  - name: Taiko RPC
    url: https://rpc.taiko.xyz
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/taiko
    type: public
  - name: Taiko Tools
    url: https://rpc.taiko.tools
    type: public
  - name: dRPC
    url: https://taiko.drpc.org
    type: public
  - name: 4everland
    url: https://taiko-mainnet.4everland.org/v1/37fa9972c1b1cd5fab542c7bdd4cde2f
    type: public
  - name: Tenderly
    url: https://taiko-mainnet.gateway.tenderly.co
    type: private
  - name: Stakely
    url: https://taiko-json-rpc.stakely.io
    type: public
  - name: PublicNode
    url: https://taiko-rpc.publicnode.com
    type: public
sourceCode:
  - name: Taiko Monorepo
    url: https://github.com/taikoxyz/taiko-mono
    description: Main Taiko protocol repository containing core contracts and infrastructure
forums:
  - name: Taiko Forum
    url: https://community.taiko.xyz/
    description: Official Taiko community forum for discussions and governance
# SDKs and tools are inherited from evm-common.md
---

Taiko is a type-1 zkEVM-equivalent rollup that achieves decentralization through its based sequencing design, where Ethereum validators handle transaction ordering. This approach eliminates the need for a centralized sequencer while maintaining full Ethereum compatibility and synchronous composability with the base layer.

As a based rollup, Taiko inherits Ethereum's security and decentralization properties directly. The protocol uses zero-knowledge proofs to ensure transaction validity while keeping costs low, making it suitable for applications that require high security guarantees without compromising on decentralization.

Taiko's vision of being "based, fearless, ownerless, and unstoppable" reflects its commitment to true decentralization, though the mainnet is still in development with testnets currently available for developers to experiment with the platform.