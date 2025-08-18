---
name: Morph
chainId: 2818
nativeCurrency: ETH
color: "#14A800"
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

Optimistic rollup that only generates ZK proofs when challenged, reducing costs. Positioned for "consumer apps" but launched late 2024 with minimal traction.
The key difference: Responsive Validity Proof shortens withdrawals to 2-3 days (vs 7 for Optimism/Arbitrum) by using ZK proofs only during disputes.

**Best for:** Apps needing faster withdrawals than standard optimistic rollups without paying for constant ZK proving.

**Technical:** Optimistic zkEVM with RVP system, SP1 zkVM for disputes, planned decentralized sequencer.

- **Security & Data Availability**
  - Responsive Validity Proof (RVP) — optimistic by default, ZK proofs only when challenged.
  - Uses Ethereum calldata for DA; 2-3 day challenge window.
  - Planned decentralized sequencer with Tendermint/BLS (currently centralized).

- **Infra & Execution**
  - Modular architecture: separate Sequencer, Rollup, and zkEVM components.
  - Powered by Succinct's SP1 zkVM for proof generation.
  - Standard EVM compatibility.

- **Performance**
  - Lower costs than always-on zkEVMs.
  - Faster withdrawals than standard optimistic rollups.
  - Limited current throughput due to early adoption.

- **Use Cases**
  - **Live apps**: BulbaSwap (Uniswap fork), basic DeFi, NFT platforms
  - **Target market**: Consumer apps, though mostly theoretical so far
  - **Backing**: Bitget exchange partnership

- **Trade-offs**
  - Very early — launched October 2024 with low activity.
  - Sequencer still centralized despite decentralization claims.
  - Complex hybrid architecture without proven benefits yet.
  - Limited ecosystem compared to any established L2.
