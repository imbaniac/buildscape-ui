---
name: Morph
chainId: 2818
color: "#14A800"
darkColor: "#108500"
logo: morph.svg
parentOrganization: Morph
website: https://morphl2.io
launchDate: 
maxBlockSize: 30
technology:
  type: Optimistic ZK-Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: Morph Stack
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
  - https://docs.morphl2.io/
blockscanners:
  - name: Morph Explorer
    url: https://explorer.morphl2.io
    type: official
testnets:
  - name: Morph Holesky
    chainId: 2810
    url: https://explorer-holesky.morphl2.io
    description: Morph Holesky testnet for deploying and testing applications on the Morph Layer 2 network.
    faucets:
      - https://morphfaucet.com/
    rpcs:
      - https://rpc-quicknode-holesky.morphl2.io
      - wss://rpc-quicknode-holesky.morphl2.io
      - https://rpc-holesky.morphl2.io
rpcs:
  - name: Morph
    url: https://rpc.morphl2.io
    type: official
  - name: Morph WebSocket
    url: wss://rpc.morphl2.io:8443
    type: official
  - name: QuickNode
    url: https://rpc-quicknode.morphl2.io
    type: public
  - name: QuickNode WebSocket
    url: wss://rpc-quicknode.morphl2.io
    type: public
sourceCode:
forums:
sdks:
tools:
---

Morph is an EVM-equivalent rollup that uses optimistic zk-rollup technology to provide a secure, decentralized, cost-efficient, and high-performing Layer 2 scaling solution. Built to enhance the Ethereum ecosystem, it focuses on improving user experience while maintaining full compatibility with existing Ethereum tooling.

As a relatively new entrant in the L2 space, Morph aims to combine the benefits of both optimistic and zero-knowledge rollup technologies. This hybrid approach promises faster finality than traditional optimistic rollups while potentially offering better performance than pure zk-rollups.

However, being a newer protocol means it has less battle-testing compared to established L2s. The ecosystem is still developing, so developers may find fewer integrations and tooling compared to more mature networks. As with any L2, it's important to understand the trust assumptions and bridge security when moving assets between Morph and Ethereum.