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

An EVM-compatible hybrid rollup combining optimistic execution with optional ZK fallback and a decentralized sequencer set.

- **Security & Sequencing**  
  - Uses a decentralized sequencer network based on BLS and Tendermint consensus.  
  - Execution is optimistic by default; zero-knowledge proofs are used only when disputes are raised.  
  - Aims to reduce censorship risk and improve reliability vs. centralized rollups.

- **Data Availability & Settlement**  
  - Uses Ethereum calldata for DA and finality.  
  - Batches are posted on Ethereum; withdrawals are gated by fraud challenge windows.  
  - ZK fallback kicks in during disputes, offering stronger correctness guarantees.

- **Performance**  
  - Medium throughput, optimized with calldata batching.  
  - Fees are kept low through efficient compression and batching strategies.  
  - UX close to optimistic rollups; fallback to ZK introduces conditional latency.

- **Use Cases**  
  - Suitable for consumer-facing apps like marketplaces, social wallets, or payments where fast UX is critical but trust minimization is still desirable.

- **Trade-offs**  
  - Decentralized sequencer set is still maturing — not yet fully trustless.  
  - ZK fallback is reactive, not default — correctness still hinges on honest challengers.  
  - Complex infra with dual-layer architecture may increase dev and ops overhead.  
  - Ecosystem and dev tooling are early-stage compared to more established rollups.