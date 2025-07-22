---
name: Celo
chainId: 42220
nativeCurrency: CELO
color: "#FCFF52"
darkColor: "#BCBF40"
logo: celo.svg
parentOrganization: Celo Foundation
website: https://celo.org
launchDate: 2020-04-22
maxBlockSize: 
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
  - https://docs.celo.org/
blockscanners:
  - name: Celoscan
    url: https://celoscan.io
    type: official
  - name: Blockscout
    url: https://explorer.celo.org
    type: alternative
testnets:
  - name: Alfajores
    chainId: 44787
    url: https://alfajores.celoscan.io
    description: Celo testnet for developers to test smart contracts and dApps before mainnet deployment.
    faucets:
      - https://celo.org/developers/faucet
      - https://cauldron.pretoriaresearchlab.io/alfajores-faucet
    rpcs:
      - https://alfajores-forno.celo-testnet.org
      - https://celo-alfajores.drpc.org
rpcs:
  - name: Celo Foundation
    url: https://forno.celo.org
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/celo
    type: public
  - name: Tatum
    url: https://celo-mainnet.gateway.tatum.io
    type: private
  - name: dRPC
    url: https://celo.drpc.org
    type: public
  - name: Stakely
    url: https://celo-json-rpc.stakely.io
    type: public
  - name: OnFinality
    url: https://celo.api.onfinality.io/public
    type: public
sourceCode:
  - name: Celo Blockchain
    url: https://github.com/celo-org/celo-blockchain
    description: Main Celo blockchain repository
  - name: Celo Organization
    url: https://github.com/celo-org
    description: Main Celo GitHub organization with core repositories
forums:
  - name: Celo Forum
    url: https://forum.celo.org
    description: Official Celo community forum for governance and technical discussions
  - name: Celo Discord
    url: https://discord.gg/celo
    description: Real-time community chat for developers and users
# SDKs and tools are inherited from evm-common.md
---

Ethereum Layer 2 using the OP Stack and EigenDA. Fully migrated from a standalone L1 in March 2025.

- **Consensus & Security**  
  - Operates as an optimistic rollup with a centralized sequencer and a 7-day fraud-proof window.  
  - Settlement and finality occur on Ethereum; no longer uses IBFT or native consensus.  
  - Data availability provided by EigenDA.  

- **Infra & Execution**  
  - Supports gas payments in CELO, cUSD, and cEUR.  
  - Block times reduced to ~1s post-migration.  

- **Mobile Optimizations**  
  - Retains lightweight mobile client architecture.  
  - Users interact via light clients with optional fees to full nodes.  

- **Governance**  
  - Protocol upgrades governed off-chain, likely coordinated through the Celo community and core contributors.  
  - Sequencer remains centralized; fraud-proof fallback ensures Ethereum-backed finality.  

- **Trade-offs**  
  - Centralized sequencer with standard OP Stack trust assumptions  
  - Migration removed deterministic finality of IBFT in favor of fraud-proof-based model  
  - Dependence on EigenDA adds an additional trust layer for data availability  