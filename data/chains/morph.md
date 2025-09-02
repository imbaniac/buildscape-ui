---
name: Morph
chainId: 2818
nativeCurrency: ETH
color: "#14A800"
logo: morph.svg
parentOrganization: Morph
website: https://morphl2.io
launchDate: 2024-10-30
maxBlockSize: 30
technology:
  type: Optimistic ZK-Rollup
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Ethereum
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
  - https://docs.morphl2.io/docs/about-morph/user-navigation-page/
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
  - name: Morph Node
    url: https://github.com/morph-l2/morph/
  - name: Github Organization
    url: https://github.com/morph-l2
forums:
  - name: Discord
    url: https://discord.com/invite/MorphLayer
sdks:
tools:
---

The hybrid L2 that only generates expensive ZK proofs when someone disputes a transaction. Runs cheap like Optimism, withdraws fast like a zkEVM — in theory.

**Unique Position**
Morph combines optimistic and ZK rollups: normally runs cheap without proofs, but generates ZK proofs on-demand if challenged, enabling faster withdrawals than pure optimistic rollups (hours vs 7 days). Backed by Bitget exchange providing initial liquidity. The "best of both worlds" approach that adds complexity without proven demand.

**Primary Use Cases**

- Applications wanting faster withdrawals than 7-day optimistic delays
- Projects needing ZK security guarantees without constant proving costs
- Bitget ecosystem projects seeking L2 deployment
- Developers experimenting with hybrid rollup architectures
- Theoretical consumer apps (none materialized yet)

**Ecosystem Character**
Ghost town with aspirations. Mostly Uniswap forks and basic DeFi copied from other chains. Community consists primarily of team members and Bitget affiliates. Marketing emphasizes "consumer apps" but ecosystem shows no evidence of consumer interest. Classic case of technology in search of users.

**Trade-offs**

- Launched into an oversaturated L2 market with no clear differentiator
- Complex hybrid architecture adds technical debt without proven benefits
- Centralized sequencer despite decentralization roadmap claims
- Minimal ecosystem activity months after launch
- RVP system untested under real challenge scenarios

## Technical Details

**Architecture**
Hybrid optimistic-ZK design using Responsive Validity Proofs — optimistic by default with on-demand ZK proof generation during disputes. Powered by Succinct's SP1 zkVM for proof generation. Modular architecture separates sequencer, rollup, and zkEVM components.

**Performance**
Standard optimistic rollup performance with 2-3 day challenge windows. Theoretically cheaper than always-on zkEVMs but lacks volume to demonstrate cost benefits. Faster withdrawals than pure optimistic rollups when unchallenged.

**Security & Trust Model**
Relies on optimistic assumptions unless challenged, then generates ZK proofs for disputed states. Uses Ethereum calldata for data availability. Security depends on at least one honest challenger monitoring the chain — currently just the team.

**Control & Governance**
Fully centralized despite claims of planned decentralization via Tendermint/BLS consensus. Team controls sequencer, upgrades, and challenge mechanism. No clear governance structure or community participation mechanism.
