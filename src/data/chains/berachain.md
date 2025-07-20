---
name: Berachain
chainId: 80094
color: "#814625"
darkColor: "#6E3B1E"
logo: berachain.svg
parentOrganization: Berachain Foundation
website: https://www.berachain.com
launchDate: 2025-01-16
maxBlockSize: 30
technology:
  isL2: false
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://docs.berachain.com
blockscanners:
  - name: Berascan
    url: https://berascan.com
    type: official
  - name: Beratrail
    url: https://beratrail.io
    type: alternative
testnets:
  - name: Bepolia
    chainId: 80069
    url: https://bepolia.beratrail.io
    description: Canonical testnet that mirrors mainnet functionality with full Proof-of-Liquidity support.
    faucets:
      - https://bepolia.faucet.berachain.com/
      - https://faucet.quicknode.com/berachain/bepolia
      - https://faucet.trade/berachain-testnet-bera-faucet
    rpcs:
      - https://bepolia.rpc.berachain.com
      - https://berachain-bepolia.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.berachain.com
    type: public
  - name: PublicNode
    url: https://berachain-rpc.publicnode.com
    type: public
  - name: drpc
    url: https://berachain.drpc.org
    type: public
  - name: Berachain APIs
    url: https://rpc.berachain-apis.com
    type: public
sourceCode:
  - name: Berachain GitHub
    url: https://github.com/berachain
    description: Official Berachain GitHub organization
forums:
  - name: Berachain Discord
    url: https://discord.gg/berachain
    description: Official Discord community for developers and users
  - name: Berachain X (Twitter)
    url: https://x.com/berachain
    description: Official X account for announcements and updates
# SDKs and tools are inherited from evm-common.md
---

Berachain is an EVM-compatible Layer 1 blockchain built with the innovative Proof-of-Liquidity (PoL) consensus mechanism. Unlike traditional proof-of-stake chains, PoL incentivizes liquidity provision directly at the protocol level, creating a flywheel where validators secure the network while also deepening liquidity across the ecosystem.

The chain leverages BeaconKit, a modular framework built on the Cosmos SDK, enabling high throughput and native cross-chain communication. This dual approach gives developers the familiar EVM environment while benefiting from Cosmos ecosystem interoperability. Native features include BGT (governance token) emissions, validator-directed liquidity incentives, and built-in DeFi primitives.

While Berachain offers novel consensus mechanics and strong liquidity incentives, it's still establishing itself as a new L1 in a competitive landscape. The PoL model is innovative but unproven at scale, and the ecosystem is nascent compared to established chains. However, its focus on aligning security with liquidity could prove attractive for DeFi protocols seeking deeper, more stable liquidity pools.