---
name: Unichain
chainId: 130
nativeCurrency: ETH
color: "#F50FB4"
logo: unichain.svg
parentOrganization: Uniswap Labs
website: https://unichain.org
launchDate: 2025-02-11
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
  - https://docs.unichain.org/
blockscanners:
  - name: UnichainScan
    url: https://uniscan.xyz/
    type: official
  - name: Blockscout
    url: https://unichain.blockscout.com/
    type: alternative
testnets:
  - name: Unichain Sepolia
    chainId: 1301
    url: https://sepolia.uniscan.xyz
    description: Primary testnet for Unichain, used for deploying and testing applications on the Unichain Layer 2 network.
    faucets:
      - https://faucet.quicknode.com/unichain/sepolia
      - https://faucets.chain.link/unichain-testnet
      - https://www.l2faucet.com/unichain
      - https://faucet.circle.com/
      - https://formo.so/faucets
    rpcs:
      - https://sepolia.unichain.org
      - https://endpoints.omniatech.io/v1/unichain/sepolia/public
      - https://unichain-sepolia.drpc.org
rpcs:
  - name: Unichain Foundation
    url: https://mainnet.unichain.org
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
    url: https://rpc.ankr.com/unichain
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://unichain.drpc.org
    type: public
  - name: Blast
    url: https://unichain-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://unichain.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://unichain.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://unichain.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/unichain/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://unichain.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://unichain.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://uni.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://unichain-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://unichain.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/unichain
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/unichain/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://unichain-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/unichain/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://unichain.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://unichain.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://unichain.croswap.com/rpc
    type: public
sourceCode:
  - name: Unichain Node
    url: https://github.com/Uniswap/unichain-node
    description: Everything required to run your own Unichain node
  - name: Uniswap Organization
    url: https://github.com/Uniswap
    description: Main GitHub organization for Uniswap and Unichain development
forums:
  - name: Uniswap Governance
    url: https://gov.uniswap.org/
    description: Uniswap governance forum that covers Unichain governance discussions
  - name: Uniswap Discord
    url: https://discord.com/invite/FCfyBSbCU5
    description: Community Discord server for Uniswap and Unichain discussions
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

Uniswap exchange built their own blockchain where MEV goes to liquidity providers instead of bots. The DEX that became an L2 to protect its users from sandwich attacks.

**Unique Position**
Unichain redistributes MEV value back to liquidity providers rather than letting bots extract it. TEE-based block building creates an encrypted mempool preventing sandwich attacks. The only L2 built specifically to optimize DEX trading with sub-second blocks and fair ordering. Direct integration with Uniswap's liquidity ensures deep markets from day one.

**Primary Use Cases**

- Providing liquidity to earn from MEV redistribution
- Trading with protection from sandwich attacks
- DeFi protocols seeking fast, fair transaction ordering
- Applications requiring sub-second block confirmations
- Uniswap ecosystem participants maximizing returns

**Ecosystem Character**
DeFi-native ecosystem centered around Uniswap with major protocols like Euler and Morpho joining early. Community values fairness and user protection over pure decentralization. Strong liquidity depth inherited from Uniswap creates immediate utility. More focused on solving real trading problems than technical purity.

**Trade-offs**

- Primarily benefits Uniswap ecosystem over broader DeFi
- TEE hardware security adds trust assumptions beyond cryptography
- Another OP Stack chain contributing to fragmentation
- Centralized sequencer with gradual decentralization planned
- MEV redistribution model may not work for all applications

## Technical Details

**Architecture**
OP Stack rollup with Flashbots TEE integration for transparent block building. Encrypted mempool prevents front-running while maintaining priority fee ordering. Stage 1 rollup with permissionless fault proofs already active. Working toward 250ms Flashblocks for near-instant trading.

**Performance**
One-second block times faster than most L2s with 250ms target upcoming. Gas costs comparable to other OP Stack chains. Significant protocol adoption driving consistent transaction volume. Liquidity depth from Uniswap ensures efficient price discovery.

**Security & Trust Model**
Standard optimistic rollup with 7-day withdrawal period for fraud proof challenges. TEE-based block building requires trust in hardware security modules. Permissionless fault proofs allow anyone to challenge invalid states. Centralized sequencer but decentralized validation network planned.

**Control & Governance**
Uniswap Labs operates centralized sequencer with decentralization roadmap. Protocol upgrades follow Uniswap governance model with UNI token holders voting. MEV redistribution parameters controlled by protocol rather than market. Development priorities align with Uniswap ecosystem needs.
