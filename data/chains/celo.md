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

The mobile payments blockchain that migrated from L1 to OP Stack L2, powering Africa's crypto economy with 7M+ users sending money via phone numbers. Pay gas with stablecoins, not native tokens — your grandma in Kenya doesn't need to understand crypto.

**Unique Position**
Celo lets users pay gas fees with stablecoins (cUSD, USDC, USDT) instead of native tokens, while SocialConnect maps phone numbers to wallets for seamless payments. Chain explicitly designed for emerging markets, with Opera's MiniPay wallet proving product-market fit across Africa. Successfully migrated from L1 to L2 preserving all unique features.

**Primary Use Cases**

- Mobile payment applications for emerging markets
- Remittance platforms requiring phone number transfers
- Stablecoin-based commerce without crypto complexity
- Universal Basic Income and cash transfer programs
- Financial inclusion initiatives in unbanked regions

**Ecosystem Character**
Payments-first ecosystem focused on real-world utility over DeFi speculation. MiniPay's 7M+ users actually spend stablecoins for daily needs rather than trading. Developer community prioritizes user experience and accessibility over technical complexity. Strong presence in Africa, Latin America, and Southeast Asia.

**Trade-offs**

- Centralized sequencer with potential censorship risk
- EigenDA for data availability adds trust assumptions beyond Ethereum
- Lost instant finality from L1 days — now has 7-day withdrawal delays
- Limited DeFi ecosystem compared to trading-focused L2s
- Smaller developer community outside payments use cases

## Technical Details

**Architecture**
OP Stack rollup with EigenDA for data availability, preserving unique features from L1 days. Gas abstraction allows fee payment in multiple stablecoins through meta-transactions. SocialConnect protocol enables phone number mapping without compromising privacy. Part of Optimism Superchain ecosystem.

**Performance**
One-second block times, faster than the five-second blocks as L1. Sub-cent transaction costs maintained through EigenDA's cheaper data availability. Processed 700M+ transactions across 150 countries before migration, with full history preserved through the transition.

**Security & Trust Model**
Optimistic rollup with standard 7-day fraud proof window for withdrawals to Ethereum. Settlement on Ethereum mainnet but data availability through EigenDA reduces costs at expense of additional trust assumptions. No longer uses IBFT consensus — now inherits Ethereum security model.

**Control & Governance**
Celo Foundation operates centralized sequencer following OP Stack standards. On-chain governance preserved from L1 with CELO holders voting on protocol changes. Roadmap includes progressive decentralization but no firm timeline for sequencer distribution.
