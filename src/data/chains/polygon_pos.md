---
name: Polygon PoS
chainId: 137
color: "#6C00F6"
darkColor: "#4700A8"
logo: polygon.svg
parentOrganization: Polygon Labs
technology:
  type: Sidechain
  settlementLayer: Ethereum
  isL2: false
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
  - https://docs.polygon.technology/
blockscanners:
  - name: PolygonScan
    url: https://polygonscan.com
    type: official
  - name: OKLink
    url: https://www.oklink.com/polygon
    type: alternative
  - name: Blockscout
    url: https://polygon.blockscout.com
    type: alternative
  - name: DEX Guru
    url: https://polygon.dex.guru
    type: analytics
  - name: DexScreener
    url: https://dexscreener.com/polygon
    type: analytics
testnets:
  - name: Amoy
    chainId: 80002
    url: https://amoy.polygonscan.com
    description: Sepolia-based testnet for Polygon PoS, replacing Mumbai; used for testing dApps and smart contracts on the PoS chain.
    faucets:
      - https://www.alchemy.com/faucets/polygon-amoy
      - https://faucets.chain.link/amoy
      - https://faucet.quicknode.com/polygon/amoy
      - https://tokentool.bitbond.com/faucet/polygon-amoy
      - https://getblock.io/faucet/polygon-amoy/
      - https://faucet.polygon.technology/
    rpcs:
      - https://rpc-amoy.polygon.technology
      - https://polygon-amoy-bor-rpc.publicnode.com
rpcs:
  - name: Polygon Labs
    url: https://polygon-rpc.com
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
    url: https://rpc.ankr.com/polygon
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://polygon.drpc.org
    type: public
  - name: Blast
    url: https://polygon-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://polygon.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://polygon-bor.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://polygon.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/matic/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://polygon.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://polygon.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://pol.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://polygon-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://polygon.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/matic
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/polygon1/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://polygon-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/polygon/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://polygon.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://polygon.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://polygon.croswap.com/rpc
    type: public
sourceCode:
  - https://github.com/maticnetwork/bor
forums:
  - https://forum.polygon.technology/
  - https://community.polygon.technology/
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

Polygon PoS is a sidechain to Ethereum that offers fast and low-cost transactions, but with a distinct trust model: it relies on its own validator set and uses periodic checkpoints to Ethereum for finality, rather than inheriting Ethereum’s security directly like rollups do. This is why it’s technically not a Layer 2—because a true L2 relies on Ethereum for data availability and dispute resolution, while Polygon PoS operates independently and only posts snapshots to Ethereum.

It’s fully EVM-compatible, so deploying Ethereum contracts requires no changes, but developers should note that Polygon’s consensus is based on a relatively small set of validators coordinated through a PoS mechanism, and governance remains heavily influenced by the Polygon Foundation via a multi-sig. State sync to Ethereum happens via a bridge, but it’s not trust-minimized—security relies on the bridge and validator honesty rather than fraud or validity proofs.

While this makes it performant and cheap, it’s a different trust trade-off compared to rollups, and developers building high-value or security-critical apps should factor that in.