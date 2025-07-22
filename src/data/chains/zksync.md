---
name: ZKsync Era
chainId: 324
nativeCurrency: ETH
color: "#0C18EC"
darkColor: "#0E16A5"
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
  - name: DEX Guru
    url: https://zksync.dex.guru
    type: analytics
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
  - name: zkSync Era
    url: https://github.com/matter-labs/zksync-era
    description: Main repository for zkSync Era implementation
  - name: zkSync Era Documentation
    url: https://github.com/matter-labs/zksync-web-era-docs
    description: Documentation source code for zkSync Era
  - name: Matter Labs Organization
    url: https://github.com/matter-labs
    description: Main GitHub organization for zkSync development
forums:
  - name: zkSync Community
    url: https://community.zksync.io/
    description: Official community forum for zkSync discussions and support
  - name: zkSync Forum
    url: https://forum.zksync.io/
    description: Community governance and development discussions
sdks:
  - name: zkSync SDK
    url: https://docs.zksync.io/zksync-era/sdk
    source: official
    description: Official SDK for zkSync Era with support for native account abstraction and paymaster features. Supports Typescript, Golang, Python, Java, Swift and Rust.
# Additional SDKs and tools are inherited from evm-common.md
---

A Type-1 zkEVM rollup with bytecode-level compatibility, built by Matter Labs on Ethereum. Prioritizes scalability through ZK proofs and native L1 settlement.

- **Security & Data Availability**  
  - Validity proofs guarantee state correctness — no fraud windows.  
  - Posts calldata to Ethereum via blobs (EIP‑4844).  
  - Inherits Ethereum’s settlement and DA model; no off-chain fallback.

- **Execution & Sequencing**  
  - Full EVM bytecode equivalence — all Solidity contracts work with no opcode gaps.  
  - Sequencer is centralized today; roadmap includes ChonkyBFT for decentralized consensus.

- **Finality & Proof System**  
  - ZK proofs are generated per batch and verified on Ethereum.  
  - Proof generation takes minutes to an hour depending on congestion.  
  - No reorg risk after proof finalization.

- **Performance**  
  - ~1.8s block times.  
  - Real-world throughput averages ~10–20 TPS, peaking over 100+ during high-volume periods.  
  - Low per-op gas cost after “Boojum” upgrade — efficient for onchain interactions.

- **Use Cases**  
  - Best suited for DeFi, onchain tools, and governance-heavy dApps that demand strict correctness, Ethereum equivalence, and lower fees.

- **Trade-offs**  
  - Centralized sequencer — censorship and reordering risk until decentralization is live.  
  - Proof latency adds delay to finality (~several minutes).  
  - Performance depends on Ethereum blob space and proving capacity.  
  - Ecosystem still young — infra and monitoring tools catching up to older rollups.