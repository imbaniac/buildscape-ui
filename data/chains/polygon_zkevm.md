---
name: Polygon zkEVM
chainId: 1101
nativeCurrency: ETH
color: "#8247E5"
logo: polygon.svg
parentOrganization: Polygon Labs
website: https://polygon.technology/polygon-zkevm
launchDate: 2023-03-27
maxBlockSize: 30
technology:
  type: ZK Rollup
  layer: L2
  vm:
    type: zkEVM
    evmCompatible: true
  settlementLayer: Ethereum
  stack: Polygon zkEVM
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
  - https://wiki.polygon.technology/docs/zkevm/
blockscanners:
  - name: PolygonScan zkEVM
    url: https://zkevm.polygonscan.com
    type: official
  - name: OKLink
    url: https://www.oklink.com/polygon-zkevm
    type: alternative
  - name: Blockscout
    url: https://zkevm.blockscout.com
    type: alternative
testnets:
  - name: Cardona
    chainId: 2442
    url: https://cardona-zkevm.polygonscan.com
    description: Public testnet for Polygon zkEVM, used for testing zkEVM smart contracts and dApps before mainnet deployment.
    faucets:
      - https://faucet.polygon.technology/
      - https://www.alchemy.com/faucets/polygon-zkevm-testnet
      - https://faucets.chain.link/polygon-zkevm-testnet
    rpcs:
      - https://rpc.cardona.zkevm-rpc.com
      - https://polygon-zkevm-cardona.public.blastapi.io
      - https://polygon-zkevm-cardona.drpc.org
      - https://polygon-zkevm-cardona-testnet.rpc.thirdweb.com
rpcs:
  - name: Polygon Labs
    url: https://zkevm-rpc.com
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
    url: https://rpc.ankr.com/polygon_zkevm
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://polygon-zkevm.drpc.org
    type: public
  - name: Blast
    url: https://polygon-zkevm-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://polygon-zkevm.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://polygon-zkevm.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/polygon-zkevm/mainnet/public
    type: public
  - name: LlamaNodes
    url: https://polygon-zkevm.llamarpc.com
    type: public
  - name: PublicNode
    url: https://polygon-zkevm.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/polygon/zkevm
    type: public
  - name: Unifra
    url: https://polygon-zkevm-mainnet.unifra.io
    type: public
  - name: ENVIO
    url: https://polygon-zkevm.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://polygon-zkevm.rpc.thirdweb.com/
    type: public
sourceCode:
  - name: zkEVM Node
    url: https://github.com/0xPolygonHermez/cdk-erigon
    description: Implementation of the Polygon zkEVM node
  - name: Polygon Hermez Organization
    url: https://github.com/0xPolygonHermez
    description: GitHub organization for Polygon zkEVM development
  - name: Polygon Organization
    url: https://github.com/0xpolygon
    description: Main GitHub organization for Polygon protocols
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

The enterprise zkEVM chain where you can withdraw to Ethereum in 30 minutes instead of waiting a week. Built for institutions that can't lock funds in 7-day optimistic delays.

**Unique Position**
Polygon zkEVM achieves near-perfect EVM equivalence using custom zkASM assembly language, enabling proof generation in minutes rather than hours. While Scroll focuses on pure bytecode and zkSync built a custom VM, Polygon balanced compatibility with performance. The only major zkEVM with fast L1 exits — crucial for enterprises and traders who need capital efficiency.

**Primary Use Cases**

- Enterprise blockchain deployments requiring quick fund mobility
- Existing DeFi protocols wanting ZK security with minimal changes
- High-value transactions needing fast finality and L1 exits
- Projects building custom chains using Polygon CDK
- Institutional trading requiring rapid cross-chain settlement

**Ecosystem Character**
Enterprise-focused ecosystem with major DeFi protocols deployed mostly for checkbox compliance rather than organic usage. Community consists more of Polygon Labs partners than grassroots developers. The "safe choice" for corporations entering blockchain — backed by Disney, Starbucks, and Meta partnerships.

**Trade-offs**

- Centralized sequencer with no clear decentralization timeline
- Lower adoption than expected despite technical superiority
- Competes with Polygon PoS for attention and resources
- Edge-case EVM incompatibilities despite equivalence claims
- Ecosystem fragmented across multiple Polygon products

## Technical Details

**Architecture**
ZK-rollup using custom zkASM assembly for near-perfect EVM equivalence while maintaining efficient proof generation. Uses FFLONK proving system (30% cheaper than PLONK) with Ethereum calldata for data availability.

**Performance**
Two-second block times with proof generation and finalization in minutes. Withdrawals complete in approximately 30 minutes — fastest among major zkEVMs. Fees track Ethereum prices but remain significantly lower.

**Security & Trust Model**
Validity proofs ensure state correctness before finalization on Ethereum. No fraud proof delay but relies on centralized sequencer for ordering. Uses Ethereum for data availability without fallback options. Security depends on proof system soundness and sequencer honesty.

**Control & Governance**
Polygon Labs controls sequencer operation and protocol upgrades through multisig. No permissionless proposer or verifier participation. Governance remains team-controlled despite decentralization rhetoric. Part of broader Polygon ecosystem with unclear resource allocation.
