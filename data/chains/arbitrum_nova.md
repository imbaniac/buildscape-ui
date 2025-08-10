---
name: Arbitrum Nova
color: "#ff7801"
chainId: 42170
nativeCurrency: ETH
logo: arbitrum_nova.svg
parentOrganization: Offchain Labs
website: https://arbitrum.io
launchDate: 2022-08-09
maxBlockSize: 32
techStack: Arbitrum
technology:
  type: AnyTrust
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Rust / C / C++
    url: https://docs.arbitrum.io/stylus/stylus-content-map
    details: Compiled to WASM with Stylus
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
blockscanners:
  - name: NovaScout
    url: https://nova.arbiscan.io
    type: official
  - name: Blockscout
    url: https://arbitrum-nova.blockscout.com/
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/arbitrum-nova
    type: alternative
testnets:
  - name: Sepolia
    chainId: 421614
    url: https://sepolia.arbiscan.io
    description: Arbitrum's Sepolia testnet for deploying and testing applications on Arbitrum Nova.
    faucets: 
      - https://www.alchemy.com/faucets/arbitrum-sepolia
      - https://faucets.chain.link/arbitrum-sepolia
      - https://faucet.quicknode.com/arbitrum
      - https://sepolia-faucet.pk910.de/
    rpcs:
      - https://sepolia-rollup.arbitrum.io/rpc
      - https://arbitrum-sepolia-rpc.publicnode.com
      - https://arbitrum-sepolia.drpc.org
rpcs:
  - name: Offchain Labs
    url: https://nova.arbitrum.io/rpc
    type: official
  - name: Alchemy
    url: https://www.alchemy.com/
    type: private
  - name: Infura
    url: https://www.infura.io/
    type: private
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Ankr
    url: https://rpc.ankr.com/arbitrum_nova
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://arbitrum-nova.drpc.org
    type: public
  - name: Blast
    url: https://arbitrum-nova.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://arbitrum-nova.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://arbitrum-nova.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://arbitrum.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/arbitrum/nova/public
    type: public
  - name: SubQuery Network
    url: https://arbitrum-nova.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://arbitrum-nova.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://nova.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://arbitrum-nova-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://arbitrum-nova.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/arb-nova
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/arbn/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://arb-nova-mainnet.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/arbitrumnova/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://arbitrum-nova.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://arbitrum-nova.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://nova.croswap.com/rpc
    type: public
docs:
  - name: Arbitrum Nova – Get Started
    url: https://docs.arbitrum.io/welcome/get-started
  - name: Arbitrum Nova – Public Chains Overview
    url: https://docs.arbitrum.io/build-decentralized-apps/public-chains#arbitrum-nova
  - name: Arbitrum Nova – Web3 Libraries & Tools
    url: https://docs.arbitrum.io/build-decentralized-apps/reference/web3-libraries-tools
sourceCode:
  - name: Arbitrum Protocol
    url: https://github.com/OffchainLabs/arbitrum
    description: Main repository for Arbitrum protocol implementation
  - name: Arbitrum SDK
    url: https://github.com/OffchainLabs/arbitrum-sdk
    description: Official TypeScript SDK for asset bridging and cross-chain messaging
  - name: Offchain Labs Organization
    url: https://github.com/OffchainLabs
    description: Main GitHub organization for Arbitrum development
forums:
  - name: Arbitrum Governance Forum
    url: https://forum.arbitrum.foundation/
    description: Official governance forum for Arbitrum DAO discussions and proposals
  - name: Arbitrum Research Forum
    url: https://research.arbitrum.io/
    description: Community forum for researchers working to improve Arbitrum
sdks:
  - name: Arbitrum SDK
    url: https://github.com/OffchainLabs/arbitrum-sdk
    source: official
    type: JS/TS
    description: Official TypeScript SDK for asset bridging and cross-chain messaging on Arbitrum networks.
  - name: Arbitrum Python SDK
    url: https://pypi.org/project/arbitrum-sdk/
    type: Python
    description: Community-maintained Python SDK for interacting with Arbitrum chains, supporting asset bridging and messaging.
tools:
  - name: QuickNode SDK
    url: https://www.quicknode.com/docs/arbitrum-nova
    type: free-tier
    description: Developer toolkit with APIs, analytics, and dashboards for building apps on Arbitrum Nova.
  - name: Alchemy SDK
    url: https://www.alchemy.com/arbitrum-nova
    type: free-tier
    description: SDK and developer portal for RPC access, enhanced APIs, contract tracing, and debugging tools for Arbitrum Nova.
  - name: NodeReal SDK
    url: https://nodereal.io/blog/en/build-and-deploy-smart-contracts-to-arbitrum-nova-through-nodereal-api-service/
    type: free-tier
    description: Full-stack development platform with RPCs, APIs, and contract analytics for scaling on Arbitrum Nova.
# Additional SDKs and tools are inherited from evm-common.md
---

An L2 using Arbitrum’s AnyTrust protocol—optimized for cheap, high-frequency transactions (gaming, social, micro-payments).

- **Security**: Depends on a Data Availability Committee (DAC). Requires at least one honest DAC member to avoid fallback to on-chain. Sequencer is centralized.  
- **Infra**: Built on Arbitrum Nitro stack using AnyTrust. Fast block times (~250ms), but real throughput depends on sequencer and DAC performance.  
- **Cost**: Ultra-low fees (<$0.01), significantly cheaper than Arbitrum One.  
- **Ecosystem**: Small, focused on low-value, high-activity use cases—gaming, social apps. Low TVL, limited DeFi and liquidity.  
- **Governance**: Controlled by Arbitrum DAO. Upgrades can be fast-tracked by a Security Council. DAC membership is off-chain and permissioned.  
- **Trade-offs**:  
  - Relies on DAC trust assumptions (not fully decentralized)  
  - Centralized sequencer with censorship risk  
  - Ecosystem smaller and less composable than Arbitrum One  