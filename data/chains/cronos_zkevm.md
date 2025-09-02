---
name: Cronos zkEVM
chainId: 388
nativeCurrency: zkCRO
color: "#133750"
logo: cronos_zkevm.svg
parentOrganization: Cronos Labs / Crypto.com
website: https://cronos.org/zkevm
launchDate: 2024-08-15
maxBlockSize: 30
technology:
  type: ZK Rollup
  layer: L2
  vm:
    type: zkEVM
    evmCompatible: true
  settlementLayer: Ethereum
  stack: ZK Stack
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
  - https://docs-zkevm.cronos.org
blockscanners:
  - name: Cronos zkEVM Explorer
    url: https://explorer.zkevm.cronos.org
    type: official
testnets:
  - name: Cronos zkEVM Testnet
    chainId: 240
    url: https://explorer.zkevm.cronos.org/testnet
    description: Public testnet for Cronos zkEVM, used for testing smart contracts and dApps before mainnet deployment.
    faucets:
      - https://zkevm.cronos.org/faucet
    rpcs:
      - https://testnet.zkevm.cronos.org
rpcs:
  - name: Cronos zkEVM Official
    url: https://mainnet.zkevm.cronos.org
    type: official
  - name: dRPC
    url: https://cronos-zkevm.drpc.org
    type: public
sourceCode:
  - name: Cronos zkEVM
    url: https://github.com/crypto-org-chain/cronos
    description: Cronos blockchain repositories and zkEVM implementation
forums:
  - name: Cronos Discord
    url: https://discord.gg/cronos
    description: Official Discord community for developers and users
  - name: Cronos Forum
    url: https://forum.cronos.org
    description: Community discussion forum
# SDKs and tools are inherited from evm-common.md
---

Crypto.com's ZK L2 where gas fees earn staking rewards — even failed transactions contribute to your yield. The "v2" to original Cronos, trading security for ultra-low costs through off-chain data storage.

**Unique Position**
Your zkCRO gas token automatically generates CRO staking yields while sitting in your wallet, turning transaction fees from dead cost into productive capital. Built on ZK Stack as a Validium (off-chain data), achieving lowest possible fees at the expense of exit guarantees. The only L2 where paying for gas increases your staking position.

**Primary Use Cases**

- Crypto.com users seeking cheaper on-chain transactions
- DeFi protocols wanting sponsored gas for users
- Yield farmers maximizing zkCRO "triple yield" strategies
- Applications requiring account abstraction features
- Projects targeting Crypto.com's retail user base

**Ecosystem Character**
Early-stage ecosystem bootstrapped by Pioneer Program rewards and Crypto.com integration. Community primarily consists of existing CRO holders and Crypto.com users exploring DeFi. Limited organic development with most protocols incentivized deployments. Alpha mainnet status reflects experimental nature.

**Trade-offs**

- Validium architecture means sequencer controls your exit — major centralization risk
- Very early alpha stage with minimal battle-testing since August 2024
- Success entirely dependent on Crypto.com's continued relevance
- Yield-bearing gas token adds complexity and potential financial risks
- Off-chain data storage sacrifices security guarantees for cheap fees

## Technical Details

**Architecture**
ZK Validium built on ZKsync's ZK Stack with validity proofs to Ethereum but data stored off-chain. Native account abstraction enables gasless transactions and social recovery. Part of ZK Stack ecosystem allowing interoperability with other ZK chains through shared infrastructure.

**Performance**
Ultra-low fees achieved through off-chain data availability, significantly cheaper than rollups posting to Ethereum. Claims over 100 TPS capacity though real-world performance remains unproven in alpha. Sub-second soft confirmations with periodic batch settlements to Ethereum.

**Security & Trust Model**
ZK proofs ensure computational validity on Ethereum but data availability depends entirely on centralized sequencer. Exit safety compromised — if sequencer fails or censors, users cannot force withdrawal. Emergency governance can bypass normal upgrade delays, adding additional trust assumptions.

**Control & Governance**
Crypto.com controls sequencer operations with no decentralization roadmap announced. Protocol upgrades managed through emergency governance mechanisms allowing rapid changes. zkCRO yield parameters and reward distribution controlled centrally by Crypto.com team.
