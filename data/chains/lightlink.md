---
name: LightLink
chainId: 1890
nativeCurrency: ETH
color: "#35cbff"
logo: lightlink.svg
parentOrganization: Lightlink Foundation / Pellar Technology
website: https://lightlink.io
launchDate: 2023-01-01
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Ethereum
  stack: Optimium / OP Stack
  dataAvailability: Celestia
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.lightlink.io/
blockscanners:
  - name: Blockscout
    url: https://phoenix.lightlink.io
    type: official
testnets:
  - name: Pegasus Testnet
    chainId: 1891
    url: https://pegasus.lightlink.io
    description: LightLink's testnet environment for testing gasless transactions and Enterprise Mode features.
    faucets:
      - https://lightlink.io/bridge
    rpcs:
      - https://replicator.pegasus.lightlink.io/rpc/v1
      - https://replicator-01.pegasus.lightlink.io/rpc/v1
rpcs:
  - name: LightLink Phoenix
    url: https://replicator.phoenix.lightlink.io/rpc/v1
    type: official
  - name: LightLink Official
    url: https://phoenix.lightlink.io
    type: official
  - name: thirdweb
    url: https://1890.rpc.thirdweb.com
    type: public
sourceCode:
  - name: LightLink Network
    url: https://github.com/lightlink-network
    description: Organization containing Hummingbird protocol and other core components
  - name: Hummingbird Client
    url: https://github.com/lightlink-network/hummingbird-client
    description: Light client for interacting with the LightLink Protocol
forums:
  - name: Discord
    url: https://discord.com/invite/lightlinkchain
    description: Main community hub with weekly activities and developer support
  - name: Twitter/X
    url: https://twitter.com/LightLinkChain
    description: Official announcements and updates
  - name: The Beacon
    url: https://lightlink.io/beacon
    description: Community portal for rewards and engagement
  - name: Telegram
    url: https://t.me/lightlinkLL
    description: Alternative community channel
# SDKs and tools are inherited from evm-common.md
---

The L2 that discovered enterprises want blockchain without gas fees — so they built "Enterprise Mode" where businesses pay so users don't. A startup's answer to corporate blockchain adoption.

**Unique Position**
LightLink solves the actual problem preventing enterprise adoption: nobody wants to buy ETH to use your app. Their Enterprise Mode lets businesses run gasless dApps while maintaining EVM compatibility. Claims 10,000+ TPS through "Optimium architecture" — essentially optimistic rollups with Celestia for data availability instead of Ethereum. The only L2 explicitly targeting B2B use cases over DeFi degens.

**Primary Use Cases**

- Enterprise applications needing predictable, gasless user experiences
- Gaming platforms where users shouldn't think about gas
- B2B solutions requiring stable transaction costs
- Consumer apps targeting non-crypto native users
- High-frequency applications needing sub-second confirmations

**Ecosystem Character**
Early-stage ecosystem focused on enterprise partnerships rather than DeFi liquidity mining. Lamborghini's Web3 platform chose them, which says more about their B2B pitch than their tech. Community skews toward builders interested in gasless mechanics rather than yield farming. The chain where business requirements trump decentralization maximalism.

**Trade-offs**

- "Optimium" is just optimistic rollups with cheaper data availability — not revolutionary
- Celestia dependency introduces additional trust assumptions beyond Ethereum
- Limited ecosystem compared to established L2s
- Enterprise Mode creates two-tier system with different trust models
- Small team and limited funding versus VC-backed competitors

## Technical Details

**Architecture**
Optimistic rollup using proprietary "Optimium" stack — really just standard optimistic rollups posting data to Celestia instead of Ethereum. Hummingbird light client manages cross-layer communication. Claims architectural separation of consensus, execution, and data availability layers.

**Performance**  
Block times around 0.3-0.5 seconds with theoretical 10,000 TPS by cranking up gas limits. Real-world throughput limited by Celestia's data availability and optimistic rollup constraints. Gasless transactions in Enterprise Mode shift costs to businesses rather than eliminating them.

**Security & Trust Model**
Standard optimistic rollup security with 7-day challenge period, but data availability through Celestia instead of Ethereum reduces security guarantees. Must trust Celestia's validator set alongside Ethereum's. Enterprise Mode requires trusting businesses to pay for user transactions. Centralized sequencer with no clear decentralization roadmap.

**Control & Governance**
Pellar Technology maintains full control over protocol upgrades and sequencer operation. No token governance or community input mechanisms. Open-sourced codebase under MIT license but development remains centralized. Progressive decentralization mentioned without concrete milestones or timeline.
