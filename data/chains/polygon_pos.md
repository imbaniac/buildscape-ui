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

The sidechain that onboarded millions to "L2s" before anyone knew the difference. Reddit, Nike, and Starbucks run here because fees are predictable pennies, not volatile gas auctions.

**Unique Position**
Polygon PoS isn't an L2 — it's a sidechain that trades Ethereum security for predictable sub-cent fees enterprises can actually budget. While purists complain about validator trust assumptions, Reddit Collectibles and major brands chose practicality over perfection. Planning to transform into zkEVM validium to join the AggLayer, finally getting real security after years of promises.

**Primary Use Cases**

- High-volume, low-value transactions like gaming and NFTs
- Enterprise deployments needing predictable cost structures
- NFT minting and distribution at scale
- DeFi applications prioritizing cheap fees over maximum security
- Bridge to Polygon's future zkEVM ecosystem

**Ecosystem Character**
Mass adoption chain where regular users outnumber crypto natives. Home to mainstream NFT projects and enterprise pilots rather than DeFi innovation. Community accepts security trade-offs for usability — the chain that proved people care more about cheap fees than decentralization. Transitioning from scrappy startup to enterprise infrastructure.

**Trade-offs**

- Sidechain, not L2 — no Ethereum security inheritance
- Validator collusion could compromise the network
- Checkpoints to Ethereum don't provide rollup-level guarantees
- Team-controlled governance despite decentralization rhetoric
- Future transition to zkEVM validium creates uncertainty

## Technical Details

**Architecture**
EVM-compatible sidechain using modified Tendermint consensus with POL staking. Checkpoints state to Ethereum periodically but doesn't inherit L1 security. Hybrid architecture combines Heimdall (consensus) and Bor (execution) layers.

**Performance**
Two-second block times with consistent sub-cent fees regardless of activity. Processes hundreds of TPS in practice with theoretical capacity much higher. Checkpoints to Ethereum every 30 minutes provide finality anchor but not security guarantees.

**Security & Trust Model**
Security depends on 100+ validators staking POL tokens with slashing for misbehavior. No cryptographic proofs — must trust 2/3 honest validator assumption. Checkpoints provide ordering but can't prevent invalid state transitions. Users trust validators won't collude to steal funds.

**Control & Governance**
Polygon Labs maintains significant control over protocol development and upgrades. Validator set appears decentralized but many run on similar infrastructure. Governance exists on paper but major decisions driven by team. Transition to zkEVM validium entirely team-orchestrated.
