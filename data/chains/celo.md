---
name: Celo
chainId: 42220
nativeCurrency: CELO
color: "#FCFF52"
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
  - name: Celo Node
    url: https://github.com/celo-org/celo-blockchain
    description: Main Celo blockchain repository
  - name: Github Organization
    url: https://github.com/celo-org
    description: Main Celo GitHub organization with core repositories
forums:
  - name: Forum
    url: https://forum.celo.org
    description: Official Celo community forum for governance and technical discussions
  - name: Discord
    url: https://discord.gg/celo
    description: Real-time community chat for developers and users
# SDKs and tools are inherited from evm-common.md
---

Mobile payments blockchain that migrated from L1 to become an OP Stack L2 in March 2025. Powers Africa's crypto economy with 7M+ MiniPay wallets and stablecoins you can send via phone numbers for under $0.01.
The key difference: Pay gas fees with stablecoins (cUSD, USDC, USDT) instead of native tokens, plus SocialConnect lets you send money to phone numbers — both preserved through the L2 migration.

**Best for:** Mobile payment apps in emerging markets, remittance platforms, stablecoin-based commerce, developers building for users without crypto knowledge.

**Technical:** OP Stack rollup with EigenDA, 1-second blocks, gas abstraction for stablecoin fee payments, part of Optimism Superchain.

- **Security & Data Availability**
  - Optimistic rollup with 7-day fraud proof window for withdrawals.
  - Settlement on Ethereum, data availability via EigenDA (cheaper than blobs).
  - No longer uses native IBFT consensus — now inherits Ethereum security.

- **Infra & Execution**
  - Pay gas fees in cUSD, cEUR, USDC, or USDT — not just native CELO.
  - SocialConnect maps phone numbers to wallet addresses for easy payments.
  - 1-second block times (improved from 5 seconds as L1).

- **Performance**
  - Processed 700M+ transactions across 150 countries before migration.
  - Sub-cent transaction costs maintained post-migration.
  - Full history preserved — no regenesis required during transition.

- **Use Cases**
  - **MiniPay**: Opera's wallet with 7M+ users in Africa, built on Celo
  - **Valora**: Multi-chain wallet with phone number payments, expanding to Brazil/Vietnam
  - **GoodDollar**: One of the largest UBI protocols globally
  - **Stablecoin payments**: cUSD, cEUR, cREAL for local currency transactions

- **Trade-offs**
  - Centralized sequencer like all OP Stack chains — censorship risk.
  - EigenDA dependency adds trust assumption vs pure Ethereum DA.
  - Lost instant finality from L1 days — now has optimistic rollup delays.
  - Smaller DeFi ecosystem vs Arbitrum/Base — focused on payments over trading.
