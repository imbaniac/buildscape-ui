---
name: Mantle
chainId: 5000
nativeCurrency: MNT
color: "#64B3AE"
darkColor: "#4B8782"
logo: mantle.svg
parentOrganization: Mantle Network
website: https://mantle.xyz
launchDate: 2023-07-14
maxBlockSize: 
technology:
  isL2: true
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.mantle.xyz/network
blockscanners:
  - name: MantleScan
    url: https://mantlescan.xyz
    type: official
  - name: Mantle Explorer
    url: https://explorer.mantle.xyz
    type: alternative
testnets:
  - name: Mantle Sepolia
    chainId: 5003
    url: https://explorer.sepolia.mantle.xyz
    description: Mantle's Sepolia testnet for testing dApps and smart contracts with fast confirmations.
    faucets:
      - https://faucet.sepolia.mantle.xyz
    rpcs:
      - https://rpc.sepolia.mantle.xyz
      - https://mantle-sepolia.drpc.org
rpcs:
  - name: Mantle RPC
    url: https://rpc.mantle.xyz
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/mantle
    type: public
  - name: PublicNode
    url: https://mantle-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://mantle.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/mantle
    type: public
  - name: OnFinality
    url: https://mantle.api.onfinality.io/public
    type: public
  - name: Blast
    url: https://mantle-mainnet.public.blastapi.io
    type: public
  - name: ZAN
    url: https://api.zan.top/mantle-mainnet
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/mantle/mainnet/public
    type: public
sourceCode:
  - name: Mantle GitHub
    url: https://github.com/mantlenetworkio
    description: Main Mantle Network GitHub organization
forums:
  - name: Mantle Forum
    url: https://forum.mantle.xyz
    description: Official Mantle community forum for discussions and governance
  - name: Mantle Discord
    url: https://discord.gg/0xMantle
    description: Official Discord server for the Mantle community
# SDKs and tools are inherited from evm-common.md
---

An Ethereum Layer 2 built with Optimistic Rollup architecture, integrating modular data availability (EigenDA) and transitioning toward ZK finality via OP Succinct.

- **Security & Data Availability**  
  - Runs as an optimistic rollup with fraud proofs; proof window still ~7 days.  
  - Posts calldata to Ethereum and now uses EigenDA for off-chain data availability with slashed validator nodes.  
  - Plans to enable zk-proof finality (~1 hour) via SP1 (ZKVM) integration.  

- **Infra & Execution**  
  - Modular architecture separates execution, data availability, and settlement layers.  
  - Sequencer is centralized, but roadmap includes gradual decentralization.  

- **Performance**  
  - High throughput (~2M txs per quarter reported).  
  - Low gas fees under normal L1 conditions; DA costs can rise with Ethereum congestion.  
  - Fast block inclusion; zk-based finality (when live) will reduce settlement delay drastically.  

- **Use Cases**  
  - Suitable for DeFi protocols and financial apps that need deep liquidity, fast confirmation, and modular infra without leaving the Ethereum trust boundary.  

- **Trade-offs**  
  - Still depends on centralized sequencer and token-governed upgrade path.  
  - DA decentralization (EigenDA) improves censorship resistance but introduces new validator assumptions.  
  - zk finality not yet live — current withdrawals require fraud proof challenge period.  
  - Not ideal for real-time apps or builders requiring full trust minimization today.