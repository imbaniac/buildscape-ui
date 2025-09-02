---
name: Sophon
chainId: 50104
nativeCurrency: SOPH
color: "#0096f7"
logo: sophon.svg
parentOrganization: Sophon Labs
website: https://www.sophon.xyz
launchDate: 2024-12-18
maxBlockSize:
technology:
  type: Validium
  layer: L2
  vm:
    type: zkEVM
    evmCompatible: true
  settlementLayer: Ethereum
  stack: ZK Stack
  dataAvailability: Avail
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

The entertainment chain backed by $500M from node sales, where apps pay your gas fees. Built for games and AI apps needing millions of free transactions.

**Unique Position**
Sophon's paymasters let applications sponsor all user gas fees, enabling pure Web2 experiences without wallets or crypto purchases. Keeps transaction data off Ethereum to achieve sub-cent costs, though this means trusting an external system (Avail) for withdrawals. The only L2 explicitly designed for entertainment apps with 27M+ wallets already onboarded through gaming partners.

**Primary Use Cases**

- Mobile games requiring completely free user transactions
- AI applications needing cheap compute verification
- Social platforms with high-frequency interactions
- Entertainment dapps targeting mainstream users
- Ticketing and event management systems

**Ecosystem Character**
Entertainment-focused ecosystem with gaming leading adoption through Beam and Mirai Labs partnerships. AI infrastructure growing through Aethir GPU marketplace and $40M Tactical Compute initiative. Community consists of game developers and entertainment companies rather than DeFi builders. Node sale participants locked until December 2025.

**Trade-offs**

- Validium architecture sacrifices Ethereum data availability for cost
- Withdrawal safety depends on Avail remaining online
- Centralized sequencer with vague decentralization timeline
- New ecosystem with limited native applications
- Guardian node liquidity locked limiting early trading

## Technical Details

**Architecture**
zkSync Stack Validium using Avail for data availability instead of Ethereum to minimize costs. Native account abstraction at protocol level enabling walletless interactions. Part of Elastic Chain ecosystem allowing interoperability with zkSync Era and other ZK Stack chains.

**Performance**
Sub-cent transaction costs optimized for gaming microtransactions and social interactions. Instant perceived finality for users with hourly ZK proof settlement to Ethereum. Scales to millions of transactions without Ethereum's data posting costs limiting throughput.

**Security & Trust Model**
ZK validity proofs ensure computational correctness before Ethereum settlement. However, Validium model means data availability depends on Avail rather than Ethereum. Withdrawal guarantees compromised if Avail goes offline or censors data. Additional trust assumptions beyond standard rollups.

**Control & Governance**
Centralized sequencer operated during bootstrap phase with decentralization roadmap undefined. Guardian nodes from $500M sale provide some stakeholder alignment but remain locked. Protocol development controlled by Sophon team with limited community input mechanisms.
