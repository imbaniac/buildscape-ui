---
name: Etherlink
chainId: 42793
nativeCurrency: XTZ
color: "#38FF9C"
darkColor: "#25B970"
logo: etherlink.svg
parentOrganization: Tezos Foundation
website: https://etherlink.com
launchDate: 2024-05-01
maxBlockSize: 30
technology:
  isL2: true
  parentChain: Tezos
  isEVM: true
  rollupType: Tezos Smart Rollup
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.etherlink.com/
blockscanners:
  - name: Etherlink Explorer
    url: https://explorer.etherlink.com
    type: official
testnets:
  - name: Ghostnet
    chainId: 128123
    url: https://testnet.explorer.etherlink.com
    description: Etherlink testnet running on Tezos Ghostnet
    faucets:
      - https://faucet.etherlink.com
    rpcs:
      - https://node.ghostnet.etherlink.com
      - https://rpc.ankr.com/etherlink_testnet
rpcs:
  - name: Official RPC
    url: https://node.mainnet.etherlink.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/etherlink_mainnet
    type: public
sourceCode:
  - name: Etherlink on Tezos GitLab
    url: https://gitlab.com/tezos/tezos
    description: Part of the Tezos protocol implementation
forums:
  - name: Tezos Stack Exchange
    url: https://tezos.stackexchange.com/
    description: Q&A site for Tezos and Etherlink developers
  - name: Etherlink Discord
    url: https://discord.com/invite/etherlink
# SDKs and tools are inherited from evm-common.md
---

An EVM-compatible rollup built on Tezos Smart Rollups, designed for fast, low-cost execution secured by Tezos L1.

- **Security**  
  - Settles on Tezos Layer 1 using fraud proofs and commitment publishing.  
  - Finality achieved in ~2 Tezos blocks (~8 seconds).  
  - Permissionless: anyone can run a node, post commitments, and challenge invalid state.  

- **Infra**  
  - Built with Tezos Smart Rollup framework.  
  - EVM execution environment supports most Solidity contracts and Ethereum tooling.  
  - Some differences in state hashing and RPC behavior compared to Ethereum.  

- **Performance**  
  - Sub-second soft confirmation (<500ms).  
  - Transaction fees are extremely low (~$0.001 per ERC-20 transfer).  
  - Good for high-frequency and cost-sensitive workloads.  

- **RPC & Nodes**  
  - Public RPC endpoints available but rate-limited (~1000 req/min).  
  - WebSocket support is limited; most subscriptions require polling.  
  - Full nodes can be self-hosted for better performance and no rate limits.  

- **Ecosystem**  
  - Integrated with Tezos-native DeFi, gaming, NFTs, identity, and RWA protocols.  
  - Bridges to Ethereum and other chains via external providers.  
  - Ecosystem still growing but active developer engagement and incentives.  

- **Trade-offs**  
  - Differences in RPC methods and state structure may cause compatibility issues with some Ethereum tooling.  
  - Sequencer is permissionless but could become a performance bottleneck.  
  - Requires custom handling for gas metering and state interactions due to Tezos-based infra.  