---
name: Optimism
chainId: 10
nativeCurrency: ETH
color: "#FF0420"
logo: optimism.svg
parentOrganization: Optimism Foundation
website: https://optimism.io
launchDate: 2021-12-16
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
  - https://docs.optimism.io/
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
  - name: Optimism Node
    url: https://github.com/ethereum-optimism/optimism
    description: Main repository for Optimism protocol implementation
  - name: Github Organization
    url: https://github.com/ethereum-optimism
    description: GitHub organization for Optimism development and OP Stack
forums:
  - name: Optimism Collective Governance
    url: https://gov.optimism.io/
    description: Official governance forum powered by Discourse for DAO discussions and proposals
  - name: Optimism Community Hub
    url: https://community.optimism.io/
    description: Resource hub for the Optimism community and governance documentation
  - name: Optimism Agora
    url: https://vote.optimism.io/
    description: Home of Token House governance and Retro Public Goods Funding (RPGF)
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

The idealistic L2 that open-sourced its stack for competitors to copy, now powering Base and the "Superchain" vision. More focused on funding public goods than winning the speed race.

**Unique Position**
Optimism gave away its competitive advantage by open-sourcing the OP Stack, enabling Coinbase to launch Base and others to join a unified ecosystem. While competitors optimize for metrics, Optimism funds builders through RetroPGF — over $3B allocated to reward actual impact. The L2 that prioritizes collective success over individual dominance.

**Primary Use Cases**

- Projects wanting to deploy on proven infrastructure with deep liquidity
- Builders seeking retroactive funding for public goods
- Applications needing future interoperability across OP Stack chains
- Teams wanting to launch their own L2 using battle-tested code
- DeFi protocols requiring established ecosystem and tooling

**Ecosystem Character**
Mission-driven community that values public goods over profit maximization. Home to innovative DeFi like Velodrome and Synthetix rather than copies. Developer culture emphasizes open source contribution and positive-sum thinking. The chain where idealism meets pragmatism — funding what matters while building what works.

**Trade-offs**

- Centralized sequencer remains single point of failure
- Seven-day withdrawal delays versus instant zkEVM finality
- Superchain interoperability still mostly theoretical
- Lost first-mover advantage by enabling competitors
- Governance token (OP) has limited utility beyond voting

## Technical Details

**Architecture**
Optimistic rollup using fraud proofs with 7-day challenge window for withdrawals. Modular OP Stack enables other chains to deploy compatible L2s creating the Superchain ecosystem. Posts transaction data to Ethereum using EIP-4844 blobs.

**Performance**
Two-second block times with throughput dependent on Ethereum blob space and pricing. Handles significant DeFi volume with mature infrastructure. Costs track Ethereum congestion but remain substantially lower than L1.

**Security & Trust Model**
Inherits Ethereum security through fraud proof system allowing any participant to challenge invalid states. Requires at least one honest challenger monitoring chain. Full data availability on Ethereum ensures trustless verification. Centralized sequencer can reorder but not censor permanently due to force inclusion.

**Control & Governance**
Optimism Foundation guides development with two-house governance system — Token House (OP holders) and Citizens' House (reputation-based). Sequencer operated by Foundation with decentralization roadmap but no firm timeline. Protocol upgrades require governance approval but implementation remains centralized.
