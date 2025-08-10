---
name: Sophon
chainId: 50104
nativeCurrency: SOPH
color: "#0096f7"
logo: sophon.svg
parentOrganization: 
website: https://www.sophon.xyz
launchDate: 
maxBlockSize: 
technology:
  isL2: true
  isEVM: true
  stack: ZKsync
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.sophon.xyz
blockscanners:
  - name: Sophon Block Explorer
    url: https://explorer.sophon.xyz
    type: official
testnets:
  - name: Sophon Testnet
    chainId: 531050104
    url: https://explorer.testnet.sophon.xyz
    description: Sophon test network for smart contract and dApp testing
    faucets:
      - https://faucet.sophon.xyz
    rpcs:
      - https://rpc.testnet.sophon.xyz
      - wss://rpc.testnet.sophon.xyz/ws
rpcs:
  - name: Official RPC
    url: https://rpc.sophon.xyz
    type: public
  - name: WebSocket RPC
    url: wss://rpc.sophon.xyz/ws
    type: public
sourceCode:
  - name: GitHub Organization
    url: https://github.com/sophon-labs
    description: Official Sophon GitHub organization
forums:
  - name: Discord
    url: https://discord.gg/sophon
    description: Official Sophon community Discord server
# SDKs and tools are inherited from evm-common.md
---

A consumer-focused ZK-validium built on zkSync’s Elastic Chain—optimized for high-throughput, low-cost apps like games and social platforms.

- **Security & Data Availability**  
  - ZK validity proofs verify all state transitions.  
  - Uses off-chain data availability via Avail (Validium model).  
  - No data is posted to Ethereum — withdrawals depend on off-chain providers being online and honest.

- **Sequencing & Proofs**  
  - Centralized sequencer handles transaction inclusion and proof generation.  
  - Proofs and state roots are submitted to Ethereum roughly once per hour.  
  - Guardian and staking model exists but decentralization is not yet production-grade.

- **Performance & Fees**  
  - Capable of handling hundreds of thousands of transactions per day.  
  - Fees remain very low (typically ~0.001 USD or less).  
  - Batch timing introduces hourly delay for finality.

- **Use Cases**  
  - Works for high-frequency consumer apps where cost and UX matter more than trust minimization — e.g., games, social, or AI-integrated apps.

- **Trade-offs**  
  - Off-chain DA creates dependency on third-party availability — if Avail or sequencer fails, withdrawals may be blocked.  
  - No fallback to Ethereum for data recovery.  
  - Centralized sequencer introduces censorship and liveness risk.  
  - Still early in ecosystem maturity — infra, tooling, and validator decentralization remain under development.