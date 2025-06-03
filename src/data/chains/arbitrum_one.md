---
name: Arbitrum One
color: "#12AAFF"
darkColor: "#1C8CC9"
chainId: 42161
nativeCurrency: ETH
logo: arbitrum_one.svg
parentOrganization: Offchain Labs
technology:
  type: Optimistic Rollup
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
docs:
  - https://docs.arbitrum.io/welcome/get-started
blockscanners:
  - name: Arbiscan
    url: https://arbiscan.io
    type: official
  - name: Blockscout
    url: https://arbitrum.blockscout.com
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/arbitrum
    type: alternative
  - name: DEX Guru
    url: https://arbitrum.dex.guru
    type: analytics
  - name: DexScreener
    url: https://dexscreener.com/arbitrum
    type: analytics
testnets:
  - name: Sepolia
    chainId: 421614
    url: https://sepolia.arbiscan.io
    description: Arbitrum's Sepolia testnet for deploying and testing applications on the Arbitrum Layer 2 network.
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
    url: https://arb1.arbitrum.io/rpc
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
    url: https://rpc.ankr.com/arbitrum
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://arbitrum.drpc.org
    type: public
  - name: Blast
    url: https://arbitrum-one.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://arbitrum.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://arbitrum-one.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://arbitrum.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/arbitrum/one/public
    type: public
  - name: SubQuery Network
    url: https://arbitrum.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://arbitrum.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://arb.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://arbitrum-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://arbitrum.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/arb
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/arb1/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://arb-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/arbitrum/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://arbitrum.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://arbitrum.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://arb1.croswap.com/rpc
    type: public
sourceCode:
  - https://github.com/OffchainLabs/arbitrum
forums:
  - name: Governance Forum
    url: https://forum.arbitrum.foundation
  - name: Research Forum
    url: https://research.arbitrum.io
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
    url: https://www.quicknode.com/docs/arbitrum-one
    type: free-tier
    description: Developer toolkit with APIs, analytics, and dashboards for building apps on Arbitrum One.
  - name: Alchemy SDK
    url: https://www.alchemy.com/arbitrum
    type: free-tier
    description: SDK and developer portal for RPC access, enhanced APIs, contract tracing, and debugging tools for Arbitrum.
  - name: NodeReal SDK
    url: https://nodereal.io/
    type: free-tier
    description: Full-stack development platform with RPCs, APIs, and contract analytics for scaling on Arbitrum One.
---

Arbitrum One is a Layer 2 Optimistic Rollup that batches transactions off-chain and posts all transaction data directly to Ethereum, offering a trustless extension of the L1 with lower fees and higher throughput.

It doesn’t rely on committees or off-chain data availability like Arbitrum Nova — instead, all data is published on-chain, which makes it more expensive but also more secure and decentralized.

Built on the Nitro stack, Arbitrum One is fully EVM-compatible and uses standard Ethereum tooling, with some improvements under the hood like calldata compression and improved cross-chain messaging. The trade-off is higher gas costs compared to AnyTrust-based chains, but for developers building DeFi apps or anything where state integrity matters, Arbitrum One sticks closer to Ethereum’s trust model.