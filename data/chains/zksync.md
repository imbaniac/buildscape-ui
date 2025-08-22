---
name: ZKsync Era
chainId: 324
nativeCurrency: ETH
color: "#0C18EC"
logo: zksync.svg
parentOrganization: Matter Labs
website: https://zksync.io
launchDate: 2024-03-24
maxBlockSize: 128
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
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
  - name: Rust / C++
    details: Experimental
docs:
  - https://era.zksync.io/docs/
blockscanners:
  - name: zkSync Explorer
    url: https://explorer.zksync.io
    type: official
  - name: Etherscan
    url: https://era.zksync.network
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/zksync
    type: alternative
  - name: DexScreener
    url: https://dexscreener.com/zksync
    type: analytics
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
  - name: zkSync Era Node
    url: https://github.com/matter-labs/zksync-era
    description: Main repository for zkSync Era implementation
  - name: Github Organization
    url: https://github.com/matter-labs
    description: Main GitHub organization for zkSync development
forums:
  - name: Discord
    url: https://join.zksync.dev/
  - name: Github Discussions
    url: https://github.com/ZKsync-Community-Hub/zksync-developers/discussions
sdks:
  - name: zkSync SDK
    url: https://docs.zksync.io/zksync-era/sdk
    source: official
    description: Official SDK for zkSync Era with support for native account abstraction and paymaster features. Supports Typescript, Golang, Python, Java, Swift and Rust.
# Additional SDKs and tools are inherited from evm-common.md
---

The hub of zkSync's Elastic Chain ecosystem — a Type-4 zkEVM that trades perfect Ethereum compatibility for faster proofs and native account abstraction. Every wallet is a smart account with Face ID login, no seed phrases needed.

**Key Difference:** Custom VM architecture enables native features impossible on other L2s — account abstraction at protocol level, paymasters for gasless transactions, and sub-penny proof costs.

**Best for:** Apps needing smart wallets with social logins, DeFi protocols wanting institutional adoption, developers building consumer apps requiring seamless UX.

**Technical:** Type-4 zkEVM with custom VM, native account abstraction, part of Elastic Chain ecosystem, ZK proofs with no fraud windows.

- **Use Cases**
  - **DeFi liquidity hub**: SyncSwap (40% of TVL), Mute.io, Maverick Protocol
  - **Institutional presence**: Deutsche Bank, UBS, Sygnum Bank deployed
  - **Cross-chain apps**: SpaceFi connecting Cosmos and Ethereum L2s
  - **Consumer-facing apps**: Leveraging native AA for Web2-like onboarding

- **Security & Data Availability**
  - ZK validity proofs guarantee state correctness — no 7-day fraud windows.
  - Posts calldata to Ethereum via EIP-4844 blobs.
  - Full Ethereum settlement with no off-chain data dependencies.

- **Infra & Execution**
  - Custom zkSync VM optimized for proof generation, not EVM bytecode.
  - LLVM compiler translates Solidity/Vyper to zkVM bytecode.
  - Native account abstraction — every account is a smart wallet by default.

- **Performance**
  - 1.8 second block times with instant perceived finality.
  - Proof costs under $0.0001 with Boojum upgrade.
  - Theoretical 100,000 TPS capability, currently handles peaks over 100 TPS.

- **Trade-offs**
  - Type-4 means code changes needed — not drop-in compatible like Arbitrum.
  - Centralized sequencer pending ChonkyBFT decentralization roadmap.
  - Smaller ecosystem vs Arbitrum/Optimism — fewer tools and integrations.
  - Custom VM means debugging is different from standard EVM development.
