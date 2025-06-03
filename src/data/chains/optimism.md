---
name: Optimism
chainId: 10
color: "#FF0420"
darkColor: "#CC0319"
logo: optimism.svg
parentOrganization: Optimism Foundation
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
  - https://community.optimism.io/docs/
blockscanners:
  - name: Etherscan
    url: https://optimistic.etherscan.io
    type: official
  - name: Blockscout
    url: https://optimism.blockscout.com
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/optimism
    type: alternative
  - name: DEX Guru
    url: https://optimism.dex.guru
    type: analytics
testnets:
  - name: OP Sepolia
    chainId: 11155420
    url: https://optimism-sepolia.blockscout.com
    description: Primary testnet for Optimism, used for deploying and testing applications on the Optimism Layer 2 network.
    faucets:
      - https://www.alchemy.com/faucets/optimism-sepolia
      - https://faucets.chain.link/optimism-sepolia
      - https://faucet.quicknode.com/optimism/sepolia
      - https://faucet.triangleplatform.com/optimism/sepolia
      - https://tokentool.bitbond.com/faucet/optimism-sepolia
      - https://getblock.io/faucet/op-sepolia/
      - https://www.l2faucet.com/optimism
    rpcs:
      - https://sepolia.optimism.io
      - https://optimism-sepolia.drpc.org
rpcs:
  - name: Optimism Foundation
    url: https://mainnet.optimism.io
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
    url: https://rpc.ankr.com/optimism
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://optimism.drpc.org
    type: public
  - name: Blast
    url: https://optimism-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://optimism.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://optimism.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://optimism.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/op/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://optimism.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://optimism.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://optimism.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://optimism-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://optimism.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/op
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/optm/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://optimism-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/optimism/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://optimism.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://optimism.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://optimism.croswap.com/rpc
    type: public
sourceCode:
  - https://github.com/ethereum-optimism/optimism
forums:
  - https://gov.optimism.io/
  - https://discord.gg/optimism
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

Optimism is a Layer 2 rollup built on top of Ethereum using the OP Stack, aiming to scale Ethereum by offering cheaper and faster transactions while inheriting its security. It’s EVM-equivalent, so contracts written for Ethereum work out of the box, but the network is still largely centralized—transaction ordering is handled by a single sequencer, and fraud proofs aren’t fully live yet.

What makes Optimism unique is its vision of a “Superchain”: multiple chains (like Base and Mode) built on the same stack and potentially governed collectively. That’s interesting for shared infrastructure, but also means changes to the protocol are influenced by a broader coalition, which may slow down or complicate decisions for individual developers.