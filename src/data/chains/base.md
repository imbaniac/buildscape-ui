---
name: Base
chainId: 8453
color: "#0052FF"
darkColor: "#0041CC"
logo: base.svg
parentOrganization: Coinbase
website: https://base.org
launchDate: 2023-07-13
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
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
  - https://docs.base.org/
blockscanners:
  - name: Basescan
    url: https://basescan.org
    type: official
  - name: Blockscout
    url: https://base.blockscout.com
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/base
    type: alternative
  - name: DEX Guru
    url: https://base.dex.guru
    type: analytics
  - name: DexScreener
    url: https://dexscreener.com/base
    type: analytics
testnets:
  - name: Base Sepolia
    chainId: 84532
    url: https://base-sepolia.blockscout.com
    description: Base's Sepolia testnet for deploying and testing applications on the Base Layer 2 network.
    faucets:
      - https://www.alchemy.com/faucets/base-sepolia
      - https://faucets.chain.link/base-sepolia
      - https://faucet.quicknode.com/base/sepolia
      - https://learnweb3.io/faucets/base_sepolia/
      - https://faucet.omni.network/base-sepolia
      - https://tokentool.bitbond.com/faucet/base-sepolia
      - https://getblock.io/faucet/base-sepolia/
      - https://www.l2faucet.com/base
    rpcs:
      - https://sepolia.base.org
      - https://base-sepolia.drpc.org
rpcs:
  - name: Base
    url: https://mainnet.base.org
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
    url: https://rpc.ankr.com/base
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://base.drpc.org
    type: public
  - name: Blast
    url: https://base-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://base.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://base.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://base.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/base/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://base.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://base.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://base.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://base-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://base.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/base
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/base/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://arb-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/base/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://base.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://base.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://base.croswap.com/rpc
    type: public
sourceCode:
  - name: Base Organization
    url: https://github.com/base
    description: Main GitHub organization for Base development (moved from base-org in 2025)
  - name: Base Node
    url: https://github.com/base/node
    description: Everything required to run your own Base node
forums:
  - name: Base Community Discord
    url: https://discord.com/invite/buildonbase
    description: Main community support and discussion channel
  - name: Base on X (Twitter)
    url: https://x.com/base
    description: Official Base announcements and updates
  - name: Base on Warpcast
    url: https://warpcast.com/base
    description: Base community on the decentralized social network
sdks:
tools:
---

Base is Coinbase’s Layer 2 network built on the OP Stack, offering full EVM compatibility and lower fees by batching transactions off-chain and settling them on Ethereum. It’s designed to be developer-friendly, allowing for easy deployment of Ethereum smart contracts without significant modifications.

However, the network’s decentralization is a work in progress. Currently, the sequencer — the component responsible for ordering transactions — is operated by Coinbase, introducing a central point of control. While there are plans to transition to a more decentralized model over time, this centralization may be a concern for developers prioritizing trustless systems.

One notable detail is that Base, built on the OP Stack, shares its codebase with other chains like Optimism and Mode, meaning protocol changes can propagate across chains and are governed by shared upstream decisions — this can be good for interoperability, but may limit autonomy if Base wants to diverge technically.

For developers, Base offers a scalable solution with the backing of a major exchange, but it’s important to weigh the benefits against the current centralization aspects.