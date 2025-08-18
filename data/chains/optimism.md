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

Ethereum rollup that pioneered the modular OP Stack, now powering multiple chains including Base. Unlike pure speed-focused competitors, Optimism emphasizes public goods funding and building an interconnected "Superchain" of compatible L2s.
The key difference: Optimism's open-source OP Stack enables other chains to join a unified ecosystem (Base, Mode, Frax) while funding builders through RetroPGF — $3.3B allocated to reward impactful contributions.

**Best for:** Projects wanting to build on or launch their own L2, public goods builders seeking retroactive funding, apps needing interoperability across OP Stack chains.

**Technical:** Optimistic rollup with 7-day fraud proof window, modular OP Stack architecture, and governance-driven public goods funding via RetroPGF.

- **Security & Data Availability**
  - Optimistic rollup: transactions execute off-chain, posted to Ethereum with ~7-day fraud proof window.
  - Fault proof system is active — state transitions can be challenged by any participant.
  - Posts full calldata to Ethereum using blob transactions (EIP-4844), no external DA layer.

- **Infra & Execution**
  - Uses op-geth and op-node stack with ~2s block times.
  - Modular OP Stack architecture enables other chains to deploy compatible L2s.
  - Sequencer is centralized; proposer and validator decentralization planned.

- **Performance**
  - Handles significant daily volume with established DeFi ecosystem.
  - Withdrawal finality requires 7-day challenge period.
  - Cost and throughput tied to Ethereum blob pricing and L1 congestion.

- **Use Cases**
  - **DeFi powerhouses**: Velodrome (native DEX, $130M+ TVL), Synthetix ($274M TVL), Aave V3 ($161M TVL)
  - **Superchain builders**: Base (Coinbase), Mode, Frax launching on OP Stack
  - **Public goods projects**: 643+ projects funded via RetroPGF, including dev tools and governance infra
  - **Cross-chain apps**: Projects leveraging Superchain interoperability

- **Trade-offs**
  - Sequencer centralization persists — censorship risk at the inclusion level.
  - 7-day withdrawal delay vs instant finality of zkEVMs.
  - Fault proofs rely on honest challengers — subject to liveness assumptions.
  - Superchain vision still developing — cross-chain communication limited.
