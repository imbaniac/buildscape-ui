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
  isL2: false
  isEVM: true
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

Crypto.com's original EVM chain built on Cosmos, not Ethereum. The mature chain with established DeFi but older tech.
The key difference: Built on Cosmos SDK with IBC bridges to Cosmos ecosystem, while Cronos zkEVM is their new Ethereum L2 with ZK tech. Think of this as v1, zkEVM as v2.

**Best for:** DeFi users wanting established protocols, Cosmos ecosystem connectivity via IBC, projects needing proven infrastructure.

**Technical:** Cosmos SDK chain with Ethermint EVM, Tendermint consensus, ~30 permissioned validators, IBC enabled.

- **Security & Data Availability**  
  - Tendermint PoA consensus with ~30 validators selected by Crypto.com.  
  - 5-6 second finality, not decentralized — validators are permissioned.  
  - All data on-chain (unlike zkEVM's off-chain Validium).

- **Infra & Execution**  
  - Cosmos SDK with Ethermint-based EVM module.  
  - IBC enabled for Cosmos ecosystem bridges.  
  - Some EVM quirks due to Cosmos backend (WebSocket issues, event indexing).

- **Performance**  
  - Few hundred TPS real throughput.  
  - Low stable fees ($0.01-0.10).  
  - 5 second block times.

- **Use Cases**  
  - **Major DeFi**: VVS Finance (largest AMM), Tectonic (lending), MM Finance
  - **Established ecosystem**: $500M+ TVL, mature protocols since 2021
  - **Cosmos connectivity**: IBC bridges to entire Cosmos ecosystem
  - **Crypto.com integration**: Direct fiat onramps from exchange

- **Trade-offs**  
  - Centralized validators controlled by Crypto.com.  
  - Older tech stack compared to modern L2s.  
  - Cosmos-based quirks affect some Ethereum tooling.  
  - Not an Ethereum L2 — separate security model.