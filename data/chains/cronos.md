---
name: Cronos
chainId: 25
nativeCurrency: CRO
color: "#002D74"
logo: cronos.svg
parentOrganization: Crypto.com
website: https://cronos.org
launchDate: 2021-11-08
maxBlockSize: 30
technology:
  type: Proof of Authority
  layer: L1
  vm:
    type: EVM
    evmCompatible: true
  stack: Cosmos
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://docs.cronos.org
blockscanners:
  - name: Cronos Explorer
    url: https://explorer.cronos.org
    type: official
  - name: CronoScan
    url: https://cronoscan.com
    type: alternative
testnets:
  - name: Cronos Testnet
    chainId: 338
    url: https://explorer.cronos.org/testnet
    description: Official Cronos testnet for smart contract and dApp testing
    faucets:
      - https://cronos.org/faucet
    rpcs:
      - https://evm-t3.cronos.org
      - https://endpoints.omniatech.io/v1/cronos/testnet/public
      - https://cronos-testnet.drpc.org
rpcs:
  - name: Cronos Official
    url: https://evm.cronos.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/cro
    type: public
  - name: PublicNode
    url: https://cronos-evm-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://cronos.drpc.org
    type: public
  - name: ELK Finance
    url: https://cronos-rpc.elk.finance
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/cronos/mainnet/public
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/cro/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: Cronos Node
    url: https://github.com/crypto-org-chain/cronos
    description: Official Cronos blockchain implementation
  - name: Github Organization
    url: https://github.com/crypto-org-chain
    description: Official Cronos GitHub organization
forums:
  - name: Discord
    url: https://discord.com/invite/cronos
    description: Official Discord community for developers and users
# SDKs and tools are inherited from evm-common.md
---

Crypto.com's original Cosmos-based EVM chain where you can spend DeFi yields directly on your Visa card. The mature "v1" with established protocols, while zkEVM represents the experimental "v2".

**Unique Position**
Direct integration with Crypto.com's card and app enables spending on-chain yields via Visa without manual bridging. Built on Cosmos rather than Ethereum, providing IBC connectivity to the entire Cosmos ecosystem. The only major EVM chain where your DeFi positions directly connect to traditional payment rails.

**Primary Use Cases**

- DeFi users wanting established, battle-tested protocols
- Projects needing Cosmos ecosystem connectivity via IBC
- Crypto.com card holders maximizing yield strategies
- Applications requiring proven infrastructure over cutting-edge tech
- Cross-chain protocols bridging EVM and Cosmos worlds

**Ecosystem Character**
Mature DeFi ecosystem dominated by VVS Finance with significant TVL since 2021 launch. Community consists primarily of Crypto.com users and CRO holders rather than crypto natives. Conservative development approach prioritizing stability over innovation. Strong retail presence but limited institutional interest.

**Trade-offs**

- Only ~30 validators, all permissioned by Crypto.com
- Cosmos-based architecture causes EVM compatibility quirks
- Older technology stack compared to modern L2s
- Not an Ethereum L2 — completely separate security model
- Limited decentralization with full Crypto.com control

## Technical Details

**Architecture**
Cosmos SDK chain with Ethermint EVM module enabling Ethereum compatibility on Tendermint consensus. IBC protocol allows native bridging to all Cosmos chains. Not an Ethereum L2 but standalone chain with independent security model.

**Performance**
Few hundred TPS real-world throughput with stable low fees regardless of network activity. Five-second block times with instant finality through Tendermint. More predictable performance than Ethereum but slower than modern L2s.

**Security & Trust Model**
Tendermint Proof-of-Authority consensus with validators selected and controlled by Crypto.com. Instant finality after single block confirmation — no probabilistic security. All data stored on-chain unlike zkEVM's Validium approach, providing better data availability guarantees.

**Control & Governance**
Crypto.com maintains complete control over validator selection and protocol upgrades. No meaningful decentralization or community governance despite on-chain voting mechanisms. Development roadmap determined entirely by Crypto.com's business priorities.
