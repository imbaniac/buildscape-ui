---
name: Cronos zkEVM
chainId: 388
nativeCurrency: zkCRO
color: "#133750"
logo: cronos_zkevm.svg
parentOrganization: Crypto.com
website: https://cronos.org/zkevm
launchDate: 2024-08-15
maxBlockSize: 30
technology:
  type: ZK Rollup
  settlementLayer: Ethereum
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

Crypto.com's new Ethereum L2 using ZK tech, launched 2024 as the "v2" to original Cronos. Keeps data off-chain to save costs.
The key difference: This is an Ethereum L2 Validium with ZK proofs, while original Cronos is a Cosmos chain. Cheaper but riskier than Cronos v1, with yield-bearing zkCRO gas.

**Best for:** Crypto.com users wanting cheaper transactions, DeFi apps needing sponsored gas, yield farmers chasing zkCRO rewards.

**Technical:** ZK Validium on ZK Stack with off-chain data availability, zkCRO (liquid staked CRO) as gas token, native account abstraction.

- **Security & Data Availability**  
  - ZK proofs posted to Ethereum, but transaction data kept off-chain (Validium).  
  - Exit safety depends entirely on sequencer — if it fails, funds stuck.  
  - Emergency governance can bypass upgrade delays.

- **Infra & Execution**  
  - Built on ZKsync's ZK Stack with native account abstraction.  
  - zkCRO gas token earns CRO staking yield while used for fees.  
  - Part of ZK Stack ecosystem enabling bridges to other ZK chains.

- **Performance**  
  - Very low fees due to off-chain data storage.  
  - Claims >100 TPS but real performance untested.  
  - Alpha mainnet since August 2024.

- **Use Cases**  
  - **DeFi apps**: Fulcrom Finance (derivatives), VVS Finance, H2 Finance
  - **Crypto.com integration**: Natural bridge for exchange users
  - **Yield farming**: zkCRO "triple yield" opportunities
  - **Pioneer program**: 5M+ ZK tokens in rewards pool

- **Trade-offs**  
  - Validium = major centralization risk — sequencer controls your exit.  
  - Very early (alpha) with limited battle-testing.  
  - Success tied to Crypto.com ecosystem relevance.  
  - Yield-bearing gas adds protocol complexity and financial risk.  