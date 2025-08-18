---
name: Polygon PoS
chainId: 137
nativeCurrency: POL
color: "#6C00F6"
logo: polygon.svg
parentOrganization: Polygon Labs
website: https://polygon.technology
launchDate: 2020-05-30
maxBlockSize: 30
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
  - name: Polygon Bor
    url: https://github.com/maticnetwork/bor
    description: Official client for Polygon PoS chain
  - name: Polygon Organization
    url: https://github.com/0xpolygon
    description: Main GitHub organization for Polygon protocols (current)
  - name: Polygon Legacy Organization
    url: https://github.com/maticnetwork
    description: Previous GitHub organization (Polygon/Matic) with legacy repositories
forums:
  - name: Polygon Community Forum
    url: https://forum.polygon.technology/
    description: Official community forum for discussions, proposals, and support
  - name: Polygon Governance Hub
    url: https://governance.polygon.technology/
    description: Governance discussions
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

The original Polygon chain that kickstarted L2 adoption — now a mature sidechain transitioning to become a zkEVM validium. Still processes massive volume with ultra-low fees, but unlike true L2s, security depends on validators not Ethereum proofs. Planning to join AggLayer as a ZK chain.

**Best for:** High-volume, low-value transactions, NFT minting, GameFi, apps needing sub-cent fees over maximum security.

**Technical:** An EVM-compatible proof-of-stake sidechain optimized for low fees, high throughput, and broad dApp deployment.

- **Consensus & Finality**
  - Validators stake POL (formerly MATIC) to secure the network, ~100+ active validators.
  - Fast block times (~2 seconds) with checkpoints to Ethereum every ~30 minutes.
  - Not a rollup — security depends on validator honesty, not Ethereum proofs.

- **Infra & Execution**
  - No fraud or validity proofs; state is secured by periodic checkpoints submitted to Ethereum.
  - Runs on a hybrid system using Tendermint-based consensus and Ethereum-like execution.

- **Use Cases**
  - **NFT ecosystem**: OpenSea, Reddit Collectibles, major gaming NFTs
  - **DeFi**: Aave, QuickSwap, Balancer with deep liquidity
  - **Future**: Transitioning to zkEVM validium to join AggLayer with ZK security

- **Trade-offs**
  - No rollup-grade security — lacks fraud or zk-proof guarantees.
  - Validator collusion is possible; exit security relies on checkpointing regularity and honesty.
  - Governance and upgrades are team-led — not fully decentralized.
  - DA and sequencing are not trust-minimized — no fallback if validators fail.
