---
name: Kava
chainId: 2222
nativeCurrency: KAVA
color: "#FF433E"
logo: kava.svg
parentOrganization: Kava Labs
website: https://www.kava.io
launchDate: 2019-11-15
maxBlockSize: 21
technology:
  isL2: false
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
  - https://docs.kava.io/docs/intro/
blockscanners:
  - name: Kavascan
    url: https://kavascan.com
    type: official
testnets:
  - name: Kava Testnet
    chainId: 2221
    url: http://testnet.kavascan.com
    description: EVM-compatible testnet for Kava network, providing development and testing environment.
    faucets:
      - https://faucet.kava.io
    rpcs:
      - https://evm.testnet.kava.io
      - https://kava-testnet.drpc.org
      - https://kava-evm-testnet.rpc.thirdweb.com
rpcs:
  - name: Kava Official
    url: https://evm.kava.io
    type: public
  - name: OnFinality
    url: https://kava.api.onfinality.io/public
    type: public
  - name: PublicNode
    url: https://kava-evm-rpc.publicnode.com
    type: public
  - name: Nodies
    url: https://kava-pokt.nodies.app
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/kava_evm
    type: public
  - name: dRPC
    url: https://kava.drpc.org
    type: public
  - name: Chainstack
    url: https://evm.kava.chainstacklabs.com
    type: public
  - name: Kava RPC
    url: https://evm.kava-rpc.com
    type: public
  - name: POKT Network
    url: https://kava-rpc.gateway.pokt.network
    type: public
  - name: thirdweb
    url: https://kava-evm.rpc.thirdweb.com
    type: public
sourceCode:
  - name: Kava Labs
    url: https://github.com/Kava-Labs
    description: Kava Labs GitHub organization
  - name: Kava Node
    url: https://github.com/Kava-Labs/kava
    description: Official Kava blockchain repository
forums:
  - name: Kava Reddit
    url: https://www.reddit.com/r/kava_platform/
  - name: Kava Twitter
    url: https://x.com/KAVA_CHAIN
# SDKs and tools are inherited from evm-common.md
---

A Cosmos chain with EVM bolted on, paying developers to deploy there despite minimal organic activity. The bridge between Cosmos and EVM that nobody crosses.

**Unique Position**
Kava runs both Cosmos SDK modules and EVM in parallel, offering IBC connectivity plus EVM compatibility in one validator set. Top 100 protocols by TVL receive monthly KAVA rewards, creating a pay-to-play ecosystem. The only chain where being empty is a feature — predictable performance for testing.

**Primary Use Cases**

- Farming monthly KAVA incentive rewards based on TVL
- Projects needing both IBC and EVM access simultaneously
- Testing ground with guaranteed low congestion
- Cross-chain experiments between Cosmos and Ethereum
- Developers wanting subsidized deployment costs

**Ecosystem Character**
Incentive-driven ecosystem where most activity involves farming rewards rather than organic usage. Small community of builders extracting value from the rewards program. Recent "DeAI" pivot adds chatbot wrappers without fundamental innovation. Ghost chain atmosphere with more incentives than users.

**Trade-offs**

- Minimal organic activity despite years of incentives
- Success entirely dependent on KAVA token value for rewards
- Been operational since 2019 without achieving meaningful adoption
- "Co-chain" architecture adds complexity without clear benefits
- AI features are superficial additions rather than core functionality

## Technical Details

**Architecture**
Cosmos SDK chain with parallel EVM module, marketed as "co-chains" but essentially both runtimes sharing one validator set. Translator Module handles message passing between Cosmos and EVM contexts. Standard EVM tooling compatibility through Ethermint integration.

**Performance**
Six-second block times with few hundred TPS maximum capacity. Sub-$0.001 fees due to minimal network usage. Predictable performance from low activity levels makes testing reliable. Current TVL around $77M mostly from incentive farming.

**Security & Trust Model**
Standard Tendermint consensus with approximately 100 validators providing reasonable decentralization. Six-second finality typical of Cosmos chains. IBC enabled for Cosmos ecosystem connectivity. Native USDT and wBTC support though with limited liquidity.

**Control & Governance**
Kava Labs controls development direction and incentive distribution. On-chain governance exists but major decisions driven by team. Validator set relatively decentralized compared to other Cosmos chains. Incentive program parameters adjusted centrally based on treasury sustainability.
