---
name: Polygon zkEVM
chainId: 1101
color: "#8247E5"
darkColor: "#5D2FB8"
logo: polygon.svg
parentOrganization: Polygon Labs
website: https://polygon.technology/polygon-zkevm
technology:
  type: ZK Rollup
  settlementLayer: Ethereum
  isL2: true
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

Polygon zkEVM is a zero-knowledge rollup that combines the security of Ethereum with the scalability and low costs of Layer 2s, while maintaining full EVM equivalence. Unlike Polygon PoS, zkEVM is a true Layer 2 that inherits Ethereum's security through cryptographic proofs rather than relying on its own validator set.

The key innovation is its use of zero-knowledge proofs to validate state transitions: every transaction batch is accompanied by a cryptographic proof that can be quickly verified on Ethereum, ensuring that all state changes are correct without needing to re-execute transactions. This provides the same security guarantees as Ethereum itself, but with much higher throughput and lower costs.

For developers, Polygon zkEVM offers a seamless experience—existing Ethereum tools, contracts, and wallets work out of the box without modification. The network uses the same opcodes and produces the same bytecode as Ethereum, making it truly EVM-equivalent rather than just EVM-compatible. This means you can deploy your existing Solidity contracts without any changes and they'll behave exactly as they would on Ethereum mainnet.

The trade-off is slightly higher costs compared to Polygon PoS (though still much lower than Ethereum), as generating and verifying zero-knowledge proofs requires computational resources. However, for applications that need strong security guarantees and trust-minimized bridging to Ethereum, zkEVM provides an excellent solution.