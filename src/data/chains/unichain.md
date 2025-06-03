---
name: Unichain
chainId: 130
color: "#F50FB4"
darkColor: "#C3008A"
logo: unichain.svg
parentOrganization: Uniswap Labs
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

Unichain is Uniswap Labs’ Layer 2 rollup built on the OP Stack, tailored specifically for DeFi applications. It offers 1-second block times at launch, with plans to reduce this to 250 milliseconds, aiming to improve UX for high-frequency trading and real-time market data.

A unique feature is its use of a Trusted Execution Environment (TEE) for block production, built with Flashbots, which enforces fair sequencing and limits MEV exploitation—something most other rollups haven’t implemented natively. While it starts with a single sequencer, it supports permissionless fault proofs from day one, and plans to introduce a dedicated validator network (UVN) where participants earn a share of protocol revenue.

Since it’s part of the OP Stack ecosystem, it benefits from shared infrastructure but also inherits its limitations—like centralized sequencing in early stages and upgrade dependencies from the broader Optimism governance process.

For developers building latency-sensitive or MEV-aware DeFi apps, these design choices offer more predictability and control than most general-purpose L2s.