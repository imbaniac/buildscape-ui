---
name: Etherlink
chainId: 42793
nativeCurrency: XTZ
color: "#38FF9C"
logo: etherlink.svg
parentOrganization: Tezos Foundation
website: https://etherlink.com
launchDate: 2024-05-15
maxBlockSize: 30
technology:
  type: Smart Rollup
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Tezos
  stack: Tezos Rollup
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.etherlink.com/
blockscanners:
  - name: Etherlink Explorer
    url: https://explorer.etherlink.com
    type: official
testnets:
  - name: Ghostnet
    chainId: 128123
    url: https://testnet.explorer.etherlink.com
    description: Etherlink testnet running on Tezos Ghostnet
    faucets:
      - https://faucet.etherlink.com
    rpcs:
      - https://node.ghostnet.etherlink.com
      - https://rpc.ankr.com/etherlink_testnet
rpcs:
  - name: Official RPC
    url: https://node.mainnet.etherlink.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/etherlink_mainnet
    type: public
sourceCode:
  - name: Etherlink on Tezos GitLab
    url: https://gitlab.com/tezos/tezos
    description: Part of the Tezos protocol implementation
forums:
  - name: Tezos Stack Exchange
    url: https://tezos.stackexchange.com/
    description: Q&A site for Tezos and Etherlink developers
  - name: Etherlink Discord
    url: https://discord.com/invite/etherlink
# SDKs and tools are inherited from evm-common.md
---

The only EVM rollup on Tezos, enshrined directly in the protocol rather than built externally. Uses XTZ for gas with sub-cent fees but remains isolated from mainstream EVM liquidity.

**Unique Position**
Etherlink is "enshrined" into Tezos protocol itself rather than deployed as a separate system, with fraud proofs settled by Tezos validators instead of Ethereum. The only way to access EVM on Tezos, bridging two historically separate ecosystems. XTZ as gas token provides natural integration with Tezos DeFi.

**Primary Use Cases**

- Tezos projects wanting EVM compatibility without leaving the ecosystem
- Gaming applications requiring sub-cent transaction costs
- DeFi protocols seeking alternative to congested Ethereum L2s
- Cross-chain applications bridging Tezos and EVM worlds
- Developers familiar with Tezos seeking broader tooling

**Ecosystem Character**
Small but incentivized ecosystem bootstrapped through Apple Farm rewards program. Gaming-heavy with multiple projects choosing Etherlink for cheap transactions. Community consists mainly of existing Tezos developers exploring EVM opportunities. Limited organic growth despite aggressive incentive programs.

**Trade-offs**

- Completely isolated from Ethereum L2 ecosystem and liquidity
- Requires bridges for any ETH-based assets
- Limited tooling support compared to Ethereum-based L2s
- Smaller developer community and ecosystem

## Technical Details

**Architecture**
Smart Rollup framework built directly into Tezos protocol as an enshrined rollup. Standard EVM implementation with modifications for Tezos integration. Uses XTZ as native gas token rather than ETH, maintaining Tezos economic alignment.

**Performance**
Sub-second soft confirmations with 16-second finality after Quebec upgrade. Sub-cent transaction costs consistently maintained through efficient rollup design. Calypso upgrade significantly improved contract execution performance.

**Security & Trust Model**
Fraud proofs settled by Tezos L1 validators providing permissionless challenge mechanism. Anyone can run a node and contest invalid state transitions. Inherits Tezos security guarantees rather than Ethereum's, creating different trust assumptions.

**Control & Governance**
Protocol upgrades follow Tezos on-chain governance model with baker voting. Tezos Foundation provides development funding and ecosystem support. More decentralized governance than most L2s through Tezos's established processes.
