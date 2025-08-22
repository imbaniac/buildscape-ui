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

A Cosmos chain with EVM tacked on, trying to be the bridge between both ecosystems but mostly empty.

**Key Difference:** They pay you in KAVA tokens to deploy there — if you're in the top 100 protocols by TVL, you get monthly rewards.

**Best for:** Builders who want incentive tokens, projects needing both IBC and EVM but don't mind low activity.

**Technical:** Cosmos SDK chain with an EVM module, marketed as "co-chains" but it's really just both runtimes in one validator set.

- **Use Cases**
  - **Incentive farming**: Top protocols split 1M KAVA/month based on TVL
  - **Cross-chain experiments**: If you need both IBC and EVM access
  - **Testing ground**: Low activity means predictable performance
  - **Main apps**: Kinetix (DEX), Mare Finance (lending) — mostly farming rewards

- **Security & Data Availability**
  - Standard Tendermint consensus with ~100 validators
  - 6-second finality like any Cosmos chain
  - IBC enabled for Cosmos ecosystem
  - Native USDT and wBTC (though limited liquidity)

- **Infra & Execution**
  - Runs both Cosmos SDK modules and EVM in parallel
  - "Translator Module" is just internal message passing between runtimes
  - Standard EVM tooling works (MetaMask, etc.)
  - Recently added AI chatbot for transactions (basically a wrapper)

- **Performance**
  - Block times ~6 seconds, few hundred TPS max
  - Cheap fees (<$0.001) because barely anyone uses it
  - Current TVL ~$77M despite years of incentives
  - Most activity is farming the incentive program

- **Trade-offs**
  - Ghost chain problem — lots of incentives, little organic activity
  - "DeAI" pivot is just adding chatbots, not real innovation
  - Been around since 2019 but never gained real traction
  - Dependent on KAVA token value for incentives (down 95% from ATH)
