---
name: Celo
chainId: 42220
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

Celo is a mobile-first blockchain platform designed to make financial tools accessible to anyone with a smartphone. Initially launched as an independent Layer 1 blockchain, Celo is transitioning to become an Ethereum Layer 2, bringing its focus on real-world use cases and mobile accessibility to the broader Ethereum ecosystem.

The platform emphasizes financial inclusion with features like stable value tokens (cUSD, cEUR, cREAL), phone number-based addressing, and gas fees payable in multiple currencies. Celo's carbon-negative blockchain and commitment to regenerative finance (ReFi) make it a popular choice for sustainable and impact-focused applications.

While Celo offers low fees and fast finality (5 seconds), developers should note that it uses a modified version of Ethereum's EVM with some unique features like the ability to pay gas fees in ERC-20 tokens, which may require adjustments to standard Ethereum tooling.