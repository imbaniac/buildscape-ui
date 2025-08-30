---
name: Blast
chainId: 81457
nativeCurrency: ETH
color: "#FCFC03"
logo: blast.svg
parentOrganization:
website: https://blast.io
launchDate: 2024-02-29
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: Custom
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
  - https://docs.blast.io/
blockscanners:
  - name: Blastscan
    url: https://blastscan.io
    type: official
  - name: Blast Explorer
    url: https://blastexplorer.io
    type: alternative
  - name: DexScreener
    url: https://dexscreener.com/blast
    type: analytics
testnets:
  - name: Blast Sepolia
    chainId: 168587773
    url: https://testnet.blastscan.io
    description: Blast's Sepolia testnet for deploying and testing applications on the Blast Layer 2 network.
    faucets:
      - https://faucets.chain.link/blast-sepolia
    rpcs:
      - https://sepolia.blast.io
      - https://blast-sepolia.blockpi.network/v1/rpc/private
      - https://rpc.ankr.com/blast_testnet_sepolia
rpcs:
  - name: Blast
    url: https://rpc.blast.io
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
    url: https://rpc.ankr.com/blast
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://blast.drpc.org
    type: public
  - name: Blast API
    url: https://blastl2-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://blast.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://blast.publicnode.com
    type: public
  - name: DIN
    url: https://blast.din.dev/rpc
    type: public
  - name: GasSwap
    url: https://blast.gasswap.org
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/blast/mainnet/public
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: PublicNode
    url: https://blast.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/blast
    type: public
  - name: Lava Network
    url: https://blast.lava.build
    type: public
  - name: thirdweb
    url: https://blast.rpc.thirdweb.com/
    type: public
sourceCode:
  - name: Blast Organization
    url: https://github.com/blast-io
forums:
  - name: Blast Discord
    url: https://discord.com/invite/blastdevelopers
    description: Main developer community support and discussion channel
  - name: Blast on X (Twitter)
    url: https://x.com/Blast_L2
    description: Official Blast announcements and updates
sdks:
tools:
---

The L2 where your balance automatically grows — ETH and stablecoins earn yield just sitting in your wallet. Also the L2 that lost most of its users after the airdrop ended.

**Unique Position**
Blast auto-invests all bridged assets into DeFi protocols, making yield generation the default rather than opt-in. Your ETH becomes staked ETH, your stables become T-Bills, but you just see larger balances over time. Created by the Blur NFT marketplace team who understood points-based user acquisition. The chain that proved native yield isn't enough without sustained incentives.

**Primary Use Cases**

- Passive investors wanting automatic yield on idle assets
- DeFi protocols building on top of baseline yield assumptions
- High-risk experiments leveraging native returns
- Points farmers during incentive campaigns
- Speculators betting on future airdrops or rewards

**Ecosystem Character**
Ghost town that was once buzzing with airdrop farmers. Fantasy.top remains one of few applications with genuine users. Community largely mercenary — arrived for points, left when rewards ended. Developers who stayed are building experimental DeFi leveraging native yield, but struggling to find users beyond yield tourists.

**Trade-offs**

- Your funds are actively risked in external protocols — not just bridged
- No fraud proofs live — complete trust in centralized sequencer
- Instant upgrades via multisig create rug pull risk
- Lost over 80% of activity post-airdrop
- Native yield adds smart contract risk on top of bridge risk

## Technical Details

**Architecture**
Heavily modified OP Stack that automatically deploys bridged assets into yield-generating protocols. ETH converts to liquid staking tokens, stablecoins to T-Bill protocols. Implements rebasing at protocol level so balances increase without user action.

**Performance**
Standard OP Stack performance with 2-second block times and high theoretical throughput. Can handle thousands of TPS but actual usage minimal post-incentives. Had billions in TVL at peak but lost most after airdrop farming ended.

**Security & Trust Model**
Optimistic rollup architecture but fraud proofs not implemented — users must trust sequencer completely. Bridged funds exposed to additional smart contract risk through automatic DeFi deployment. Contracts upgradeable instantly via multisig with no timelock. Multiple layers of risk: bridge, sequencer, DeFi protocols, upgrade mechanism.

**Control & Governance**
Fully controlled by Blast team with no decentralization roadmap. Centralized sequencer with exclusive ordering rights. Multisig can upgrade any contract immediately. No community governance or input mechanism. Yield strategies and protocol selection decided unilaterally by team.
