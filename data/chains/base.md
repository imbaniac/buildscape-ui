---
name: Base
chainId: 8453
nativeCurrency: ETH
color: "#0052FF"
logo: base.svg
parentOrganization: Coinbase
website: https://base.org
launchDate: 2023-08-09
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Ethereum
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

Coinbase's L2 where you can go from buying crypto to using dApps without leaving their ecosystem. The corporate chain that doesn't pretend to be decentralized.

**Unique Position**
Base is Coinbase running blockchain infrastructure as a service — they control the sequencer, collect the fees, and can onboard users directly from their 100M+ person exchange. While other L2s chase decentralization theater, Base leverages Coinbase's regulatory clarity and fiat rails. The only L2 where your grandma might accidentally use blockchain through Coinbase Wallet.

**Primary Use Cases**

- Consumer apps needing seamless fiat-to-crypto onramps
- Projects targeting Coinbase's massive retail user base
- Builders wanting corporate stability over decentralization
- Social applications leveraging Base Passport identity
- DeFi protocols seeking Coinbase listing pipeline

**Ecosystem Character**
Mainstream-focused ecosystem prioritizing user experience over crypto purity. Home to consumer social apps, simplified DeFi, and experiments in onchain identity. The community accepts centralization as a feature for reliability and regulatory compliance. Where Silicon Valley VCs deploy their consumer crypto bets.

**Trade-offs**

- Completely centralized — Coinbase controls everything
- Success tied to Coinbase's business decisions and regulatory status
- No permissionless validation or decentralized governance
- Higher fees than newer L2s optimizing for cost
- Ecosystem growth dependent on Coinbase marketing and partnerships

## Technical Details

**Architecture**
Optimistic rollup built on OP Stack using Bedrock architecture, part of the Optimism Superchain ecosystem. Standard 7-day fraud proof window with withdrawal delays.

**Performance**
Transaction costs 10-100x cheaper than Ethereum mainnet depending on calldata usage. Real throughput limited by L1 data availability. Consistent 2-second block times with reliable sequencer operation.

**Security & Trust Model**
Inherits Ethereum security through optimistic fraud proofs, but challenge mechanism controlled by whitelist. Centralized sequencer operated exclusively by Coinbase with no failover. Must trust Coinbase for liveness, ordering fairness, and upgrade integrity.

**Control & Governance**
Coinbase has unilateral control over protocol upgrades, sequencer operation, and fee collection. No on-chain governance or community input mechanism. Security council exists but is Coinbase-appointed. Progressive decentralization mentioned but no concrete timeline provided.
