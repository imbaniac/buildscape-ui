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

zkSync's entertainment chain backed by $500M from node sales — built for games, AI apps, and social platforms that need millions of cheap transactions. Uses Validium architecture trading Ethereum data availability for sub-cent costs.
The key difference: Apps can sponsor all user gas fees via paymasters, letting mainstream users interact without ever buying crypto or understanding blockchain — pure Web2 experience on Web3 rails.

**Best for:** Mobile games needing free transactions, AI apps requiring cheap compute verification, social platforms with high-frequency interactions, entertainment dapps targeting non-crypto users.

**Technical:** zkSync Stack Validium with Avail DA, native account abstraction, paymasters for gasless UX, part of Elastic Chain ecosystem.

- **Security & Data Availability**  
  - ZK validity proofs verify all state transitions before finalization.  
  - Validium model uses Avail for off-chain data availability — cheaper than rollups.  
  - No data posted to Ethereum — withdrawals depend on Avail being online.

- **Infra & Execution**  
  - Built on zkSync's ZK Stack with native account abstraction.  
  - Paymasters enable apps to sponsor all user gas fees.  
  - Part of Elastic Chain — interoperable with zkSync Era, Abstract, and other ZK chains.

- **Performance**  
  - Sub-cent transaction costs — optimized for gaming microtransactions.  
  - Instant perceived finality for users, ZK proofs settle to Ethereum hourly.  
  - Scales to millions of transactions without Ethereum data costs.

- **Use Cases**  
  - **Gaming partners**: Beam ecosystem games, Mirai Labs (27M+ wallets onboarded)
  - **AI infrastructure**: Aethir GPU marketplace (100K+ compute hours), $40M Tactical Compute initiative
  - **Entertainment apps**: OPEN Ticketing (7M+ tickets across 24K events)
  - **Social platforms**: Zentry ecosystem, high-frequency social interactions

- **Trade-offs**  
  - Validium model trades Ethereum data availability for cost — Avail dependency risk.  
  - Centralized sequencer during bootstrap phase — decentralization roadmap pending.  
  - New ecosystem — fewer native apps vs established L2s like Arbitrum.  
  - Guardian nodes locked until December 2025 — limited liquidity for early supporters.