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


A Cosmos-based L1 with built-in EVM support. Aims to bridge Ethereum and Cosmos ecosystems with low fees and high IBC interoperability.

- **Consensus & Finality**  
  - Runs Tendermint BFT consensus with ~100 validators.  
  - Finality in ~6 seconds assuming >⅔ validator honesty.  
  - No fraud/validity proofs — finality is subjective under network partitions or validator failure.  

- **Infra & Execution**  
  - Dual runtime: Cosmos SDK for native modules and a parallel EVM layer.  
  - Solidity contracts run via the Kava EVM module (EVM 2.0+).  
  - Cosmos-native tooling (REST/gRPC) + EVM-compatible RPC/WebSocket.  

- **Performance**  
  - Block time ~6s.  
  - Throughput in the hundreds of TPS under normal conditions.  
  - Gas fees typically <$0.001 per tx.  

- **Interoperability**  
  - Full IBC support — assets and messages can move between Kava and other Cosmos chains.  
  - Internal bridging between Kava EVM and Cosmos modules.  
  - No native Ethereum L1 bridging — relies on third-party bridges.

- **Use Cases**  
  - Good fit for cross-chain DeFi products that need IBC access and familiar Solidity dev experience — e.g. lending markets, stablecoin strategies, Cosmos<>EVM DEXs.  

- **Trade-offs**  
  - No Ethereum-level decentralization — validator set is smaller and governance is team-aligned.  
  - EVM is isolated — lacks native composability with external Ethereum dApps.  
  - Tendermint finality is weaker than ZK/fraud-proof rollups.  
  - Ecosystem is relatively isolated despite IBC — limited external DeFi integration.