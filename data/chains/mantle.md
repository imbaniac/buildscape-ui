---
name: Mantle
chainId: 5000
nativeCurrency: MNT
color: "#64b3ae"
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

BitDAO's L2 with a massive treasury backing its ecosystem. Still an optimistic rollup but testing ZK upgrade for 1-hour withdrawals.
The key difference: $3.9B treasury (from BitDAO merger) funding ecosystem growth, plus first L2 using EigenDA for cheaper data storage and SP1 zkVM on testnet.

**Best for:** Projects wanting treasury-backed grants/incentives, DeFi needing deep liquidity pools, apps betting on the ZK transition.

**Technical:** Optimistic rollup transitioning to ZK validity rollup via OP Succinct/SP1, EigenDA for data availability, MNT token.

- **Security & Data Availability**  
  - Still optimistic rollup with 7-day withdrawal period on mainnet.  
  - First L2 using EigenDA for data availability (80% cheaper than posting to Ethereum).  
  - ZK upgrade with SP1 in testnet, mainnet timeline unclear.

- **Infra & Execution**  
  - Modular architecture: separate execution, DA, and settlement layers.  
  - Centralized sequencer (decentralization "on roadmap").  
  - MNT as native token, plus mETH/cmETH liquid staking derivatives.

- **Performance**  
  - Sub-cent transaction fees with EigenDA.  
  - Standard optimistic rollup throughput currently.  
  - After ZK upgrade: 1-hour finality vs 7 days.

- **Use Cases**  
  - **Treasury-backed DeFi**: $200M EcoFund investing in projects
  - **Liquid staking**: mETH ($335M+ staked), integrated yield products
  - **Stablecoin integrations**: Ethena USDe, Agora AUSD, Ondo USDy
  - **Bitcoin bridge**: fBTC for wrapped Bitcoin liquidity

- **Trade-offs**  
  - Centralized sequencer with vague decentralization timeline.  
  - ZK upgrade not live yet — still 7-day withdrawals.  
  - Success depends on treasury management and DAO governance.  
  - EigenDA adds external dependency and validator assumptions.