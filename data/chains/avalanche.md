---
name: Avalanche C-Chain
chainId: 43114
nativeCurrency: AVAX
color: "#FF394A"
logo: avalanche.svg
parentOrganization: Ava Labs
website: https://www.avax.network
launchDate: 2020-09-21
maxBlockSize: 8
technology:
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
docs:
  - https://build.avax.network/docs
blockscanners:
  - name: Snowscan
    url: https://snowscan.xyz
    type: official
  - name: Avascan
    url: https://avascan.info
    type: alternative
  - name: Snowtrace (Routescan)
    url: https://snowtrace.io
    type: alternative
  - name: DexScreener
    url: https://dexscreener.com/avalanche
    type: analytics
testnets:
  - name: Fuji
    chainId: 43113
    url: https://testnet.snowscan.xyz
    description: Avalanche's primary testnet for C-Chain smart contract testing with fast finality.
    faucets:
      - https://core.app/tools/testnet-faucet
    rpcs:
      - https://api.avax-test.network/ext/bc/C/rpc
      - https://avalanche-fuji-c-chain-rpc.publicnode.com
      - https://endpoints.omniatech.io/v1/avax/fuji/public
      - https://avalanche-fuji.drpc.org
rpcs:
  - name: Avalanche Network
    url: https://api.avax.network/ext/bc/C/rpc
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/avalanche
    type: public
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Infura
    url: https://www.infura.io/
    type: private
  - name: PublicNode
    url: https://avalanche-c-chain-rpc.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/avax/c
    type: public
  - name: dRPC
    url: https://avalanche.drpc.org
    type: public
  - name: Blast
    url: https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc
    type: public
  - name: OnFinality
    url: https://avalanche.api.onfinality.io/public/ext/bc/C/rpc
    type: public
  - name: OmniaTech
    url: https://endpoints.omniatech.io/v1/avax/mainnet/public
    type: public
  - name: MeowRPC
    url: https://avax.meowrpc.com
    type: public
  - name: Zan Network
    url: https://api.zan.top/avax-mainnet/ext/bc/C/rpc
    type: public
  - name: Nodies
    url: https://avax-pokt.nodies.app/ext/bc/C/rpc
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: SubQuery Network
    url: https://avalanche.rpc.subquery.network/public
    type: public
  - name: Lava Network
    url: https://avax1.lava.build
    type: public
  - name: BlockPI
    url: https://avalanche.public.blockpi.network/v1/rpc/public
    type: public
  - name: NOWNodes
    url: https://nownodes.io/
    type: private
  - name: Allnodes
    url: https://avalanche.public-rpc.com
    type: public
  - name: Tenderly
    url: https://avalanche-mainnet.gateway.tenderly.co
    type: private
  - name: 0x RPC
    url: https://0xrpc.io/avax
    type: public
  - name: OwlRPC
    url: https://rpc.owlracle.info/avax/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
  - name: Simply Staking
    url: https://spectrum-01.simplystaking.xyz/avalanche-mn-rpc/ext/bc/C/rpc
    type: public
sourceCode:
  - name: Avalanche Go
    url: https://github.com/ava-labs/avalanchego
    description: Official Go implementation of the Avalanche protocol
  - name: Ava Labs Organization
    url: https://github.com/ava-labs
    description: Main Avalanche GitHub organization with core repositories
forums:
  - name: Avalanche Community Forum
    url: https://forum.avax.network/
    description: Official community forum for developers and users
  - name: Avalanche Developers Discord
    url: https://discord.com/invite/avax
    description: Discord community for developers and ecosystem participants
  - name: Avalanche Reddit
    url: https://www.reddit.com/r/Avax/
    description: Community discussions and ecosystem updates
# SDKs and tools are inherited from evm-common.md
---

The L1 where you can launch your own blockchain cheaper than deploying an L2. Games use it to let players pay fees with in-game tokens instead of crypto.

**Unique Position**
Avalanche's subnets are sovereign blockchains with custom gas tokens — no AVAX required for users. After Avalanche9000's 99.9% cost reduction, subnet deployment dropped from millions to thousands. Gaming projects dominate (Off The Grid, Maplestory) but surprisingly legitimate government use too: Wyoming's official stablecoin and India's land records run here. The only L1 successfully pivoting from "Ethereum killer" to practical subnet infrastructure.

**Primary Use Cases**

- Gaming projects needing custom chains with game-token gas fees
- DeFi protocols requiring sub-2-second finality
- Enterprise blockchain deployments (government, regulated finance)
- Projects wanting blockchain sovereignty without L1 costs
- High-frequency trading applications needing instant finality

**Ecosystem Character**
Split between gaming-focused subnets and traditional DeFi on C-Chain. Gaming dominates mindshare with titles like Off The Grid and Maplestory launching dedicated chains. Enterprise adoption is surprisingly real — Wyoming's official stablecoin and India's land records run here. Community prioritizes speed and customization over decentralization purity.

**Trade-offs**

- Three-chain architecture (X, P, C) creates unnecessary complexity
- Avalanche consensus less battle-tested than Nakamoto or classical BFT
- Subnet fragmentation dilutes liquidity and composability
- Still requires significant AVAX stake for primary network validation
- Gaming pivot hasn't delivered breakout success yet

## Technical Details

**Architecture**
Multi-chain network with three primary chains: X-Chain (assets), P-Chain (platform/subnets), C-Chain (EVM smart contracts). Uses novel Avalanche consensus with Snowman protocol for C-Chain linearization. Subnets are sovereign chains with custom VMs and gas tokens.

**Performance**
Achieves 1-2 second finality through probabilistic sampling consensus. Theoretical 4,500 TPS on C-Chain, though real-world usage rarely exceeds hundreds. Gas fees dropped 96% post-Avalanche9000, making transactions consistently sub-penny. Handles congestion better than most L1s due to rapid finality.

**Security & Trust Model**
Validators stake AVAX to secure all three primary chains simultaneously. Snowman consensus uses repeated sub-sampling for agreement without full communication. Security depends on honest majority assumption with lower communication overhead than traditional consensus. Subnets can define their own validator sets and security parameters.

**Control & Governance**
Ava Labs maintains significant influence over protocol development and upgrades. No on-chain governance mechanism — changes implemented through social consensus and validator adoption. Subnet validators were recently freed from 2,000 AVAX requirement, but primary network validation still requires substantial stake.
