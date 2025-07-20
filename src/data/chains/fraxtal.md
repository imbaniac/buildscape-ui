---
name: Fraxtal
chainId: 252
color: "#3B82F6"
darkColor: "#2960B9"
logo: fraxtal.svg
parentOrganization: Frax Finance
website: https://frax.com
launchDate: 2024-02-01
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
  - https://docs.frax.com/
blockscanners:
  - name: Fraxscan
    url: https://fraxscan.com
    type: official
testnets:
  - name: Fraxtal Testnet
    chainId: 2522
    url: https://holesky.fraxscan.com
    description: Fraxtal testnet for deploying and testing applications on the Fraxtal Layer 2 network.
    faucets: []
    rpcs:
      - https://rpc.testnet.frax.com
      - https://fraxtal-holesky-rpc.publicnode.com
rpcs:
  - name: Frax
    url: https://rpc.frax.com
    type: official
  - name: dRPC
    url: https://fraxtal.drpc.org
    type: public
  - name: Tenderly
    url: https://fraxtal.gateway.tenderly.co
    type: private
  - name: PublicNode
    url: https://fraxtal-rpc.publicnode.com
    type: public
  - name: Histori
    url: https://node.histori.xyz/fraxtal-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
forums:
sdks:
tools:
---

Fraxtal is an EVM-compatible Layer 2 blockchain built using the OP Stack framework. As part of the Frax Finance ecosystem, it's designed to support decentralized finance applications with low fees and fast transaction finality.

Built on the same battle-tested OP Stack as Base and Optimism, Fraxtal inherits the security model of optimistic rollups while settling transactions on Ethereum. The chain uses frxETH (Frax Ether) as its native currency, which is a liquid staking derivative of ETH developed by Frax Finance.

The network aims to provide a scalable platform for DeFi protocols, with particular focus on stablecoin operations and liquidity provision. However, as with other OP Stack chains, the sequencer is currently centralized, though there are plans for progressive decentralization following the broader OP Stack roadmap.

Developers familiar with Ethereum will find Fraxtal easy to work with, as it maintains full EVM compatibility and supports all standard Ethereum tooling.