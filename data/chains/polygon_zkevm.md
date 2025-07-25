---
name: Polygon zkEVM
chainId: 1101
nativeCurrency: ETH
color: "#8247E5"
darkColor: "#5D2FB8"
logo: polygon.svg
parentOrganization: Polygon Labs
website: https://polygon.technology/polygon-zkevm
launchDate: 2023-03-27
maxBlockSize: 30
technology:
  type: ZK Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
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

A ZK-rollup using Polygon’s ZK Stack with full EVM equivalence and calldata-based data availability.

- **Security & Data Availability**  
  - Validity proofs verify state correctness before finalization.  
  - Uses Ethereum calldata for data availability; no alternative DA layer.  
  - Withdrawals are fast and final once proofs are accepted — no fraud window.

- **Infra & Execution**  
  - Bytecode-level EVM equivalence — most Ethereum contracts run without changes.  
  - Centralized sequencer; proposer decentralization planned but not yet implemented.  
  - Governance is multisig-controlled and not permissionless.

- **Performance & Fees**  
  - Block inclusion in ~2s; finalization shortly after proof generation.  
  - Throughput limited by prover performance and L1 calldata cost.  
  - Fees are low but increase with Ethereum gas spikes.

- **Use Cases**  
  - Suitable for teams needing EVM-equivalent ZK security: DeFi, protocol tooling, and Ethereum-aligned infra.

- **Trade-offs**  
  - Centralized sequencer can censor or reorder transactions.  
  - No fallback DA layer — full reliance on Ethereum calldata.  
  - Governance and infra still maturing — not production-decentralized.  
  - Despite EVM claims, edge-case incompatibilities may still require adjustments.