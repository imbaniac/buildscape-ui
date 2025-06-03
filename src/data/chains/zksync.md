---
name: ZKsync Era
chainId: 324
color: "#0C18EC"
darkColor: "#0E16A5"
logo: zksync.png
parentOrganization: Matter Labs
technology:
  type: ZK Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://era.zksync.io/docs/
blockscanners:
  - name: zkSync Explorer
    url: https://explorer.zksync.io
testnets:
  - name: zkSync Sepolia
    chainId: 300
    url: https://sepolia.explorer.zksync.io
    description: Primary testnet for zkSync Era, used for deploying and testing applications on the zkSync Layer 2 network.
    faucets:
      - https://www.alchemy.com/faucets/zksync-sepolia
      - https://faucets.chain.link/zksync-sepolia
      - https://faucet.quicknode.com/zksync/sepolia
      - https://learnweb3.io/faucets/zksync_sepolia/
      - https://faucet.chainstack.com/zksync-testnet-faucet
      - https://getblock.io/faucet/zksync-sepolia/
      - https://faucet.circle.com/
      - https://formo.so/faucets
    rpcs:
      - https://sepolia.era.zksync.dev
      - https://rpc.ankr.com/zksync_era_sepolia
rpcs:
  - name: zkSync Era
    url: https://mainnet.era.zksync.io
    type: official
  - name: Alchemy
    url: https://www.alchemy.com/
    type: private
  - name: Ankr
    url: https://rpc.ankr.com/zksync_era
    type: public
  - name: Blast
    url: https://zksync-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://zksync-era.blockpi.network/v1/rpc/public
    type: public
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: Chainbase
    url: https://chainbase.online/
    type: private
  - name: dRPC
    url: https://zksync.drpc.org
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Infura
    url: https://www.infura.io/
    type: private
  - name: NOWNodes
    url: https://nownodes.io/
    type: private
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Unifra
    url: https://unifra.io/
    type: private
  - name: 1RPC
    url: https://1rpc.io/zksync2-era
    type: public
  - name: LeoRPC
    url: https://zksync.leorpc.com/?api_key=FREE
    type: public
  - name: LlamaNodes
    url: https://zksync.llamarpc.com
    type: public
  - name: PublicNode
    url: https://zksync.publicnode.com
    type: public
  - name: Polkachu
    url: https://zksync-rpc.polkachu.com
    type: public
  - name: ENVIO
    url: https://zksync.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://zksync.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://zksync.croswap.com/rpc
    type: public
sourceCode:
  - https://github.com/matter-labs/zksync-era
forums:
  - https://community.zksync.io/
  - https://forum.zksync.io/
sdks:
  - name: zkSync SDK
    url: https://docs.zksync.io/zksync-era/sdk
    source: official
    description: Official SDK for zkSync Era with support for native account abstraction and paymaster features. Supports Typescript, Golang, Python, Java, Swift and Rust.
# Additional SDKs and tools are inherited from evm-common.md
---

zkSync Era is a Layer 2 zk-rollup that offers EVM compatibility with a few caveats. It uses validity proofs to batch transactions off-chain and post succinct proofs to Ethereum, providing strong security guarantees.

However, developers should be aware that zkSync Era introduces some non-standard behaviors: contract deployment requires bytecode to be passed in a separate field, and transactions use EIP-712 signatures with custom fields for fees and paymasters.

While most Solidity code works with minimal changes, tooling like Hardhat may need additional configuration. zkSync Era also supports native account abstraction, enabling features like gasless transactions and custom signature schemes.

The network is currently operated by a centralized sequencer, but plans exist to decentralize this component over time.

For developers seeking scalability without compromising on Ethereum’s security model, zkSync Era offers a compelling, though slightly unconventional, platform.