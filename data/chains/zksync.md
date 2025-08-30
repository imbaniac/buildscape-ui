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

The L2 where apps can pay your gas fees and you login with Face ID instead of seed phrases. Powers the Elastic Chain ecosystem connecting Abstract, Sophon, and dozens of other chains.

**Unique Position**
zkSync rebuilt the EVM from scratch to enable features impossible elsewhere — every wallet is a smart account by default, apps can sponsor all user fees, and social recovery replaces seed phrases. Code needs modifications (Type-4 zkEVM) but you get native account abstraction that other L2s can only fake with workarounds. Hub of the Elastic Chain where specialized chains interconnect.

**Primary Use Cases**

- Consumer apps requiring Web2-like onboarding
- DeFi protocols seeking institutional adoption
- Applications needing smart wallets with social recovery
- Cross-chain protocols leveraging Elastic Chain
- Projects prioritizing UX over perfect EVM compatibility

**Ecosystem Character**
Innovation-focused ecosystem willing to adapt code for better features. Strong DeFi presence with SyncSwap dominating liquidity. Institutional interest from Deutsche Bank, UBS, and Sygnum Bank. Developer community embraces native AA despite compatibility challenges. More experimental than conservative Ethereum culture.

**Trade-offs**

- Type-4 zkEVM requires code modifications unlike drop-in competitors
- Custom VM creates different debugging experience
- Centralized sequencer with perpetually delayed decentralization
- Smaller ecosystem compared to Arbitrum and Optimism
- Tool compatibility issues due to architectural differences

## Technical Details

**Architecture**
Custom zkSync VM optimized for proof generation rather than EVM bytecode execution. LLVM compiler translates Solidity/Vyper to zkVM bytecode with some incompatibilities. Native account abstraction makes every account a smart wallet without additional contracts. Part of Elastic Chain ecosystem enabling interoperability.

**Performance**
Block times with 1 second target and instant perceived finality for users. Proof generation costs under $0.0001 after Boojum upgrade optimization. Theoretical capacity of 100,000 TPS though current peaks around 100 TPS. No fraud proof delays — withdrawals final once proofs verify.

**Security & Trust Model**
ZK validity proofs guarantee computational correctness without challenge periods. Posts all data to Ethereum via EIP-4844 blobs ensuring availability. No off-chain data dependencies maintaining Ethereum security guarantees. However, centralized sequencer creates liveness and censorship risks.

**Control & Governance**
Matter Labs controls centralized sequencer with ChonkyBFT decentralization promised. Protocol upgrades managed centrally despite governance token distribution. Elastic Chain coordination requires cross-chain governance mechanisms. Development priorities favor innovation over stability.
