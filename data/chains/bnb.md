---
name: BNB Smart Chain
chainId: 56
nativeCurrency: BNB
color: "#f0b90b"
darkColor: "#C29507"
logo: bnb.svg
parentOrganization: BNB Chain
website: https://www.bnbchain.org
launchDate: 2020-09-01
maxBlockSize: 140
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
  - https://docs.bnbchain.org/docs/
blockscanners:
  - name: BscScan
    url: https://bscscan.com
    type: official
  - name: DexScreener
    url: https://dexscreener.com/bsc
    type: analytics
testnets:
  - name: BSC Testnet
    chainId: 97
    url: https://testnet.bscscan.com
    description: BNB Smart Chain testnet for testing dApps and smart contracts with fast block times.
    faucets:
      - https://testnet.bnbchain.org/faucet-smart
    rpcs:
      - https://bsc-testnet-rpc.publicnode.com
      - https://data-seed-prebsc-1-s1.bnbchain.org:8545
      - https://bsc-testnet.public.blastapi.io
rpcs:
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Ankr
    url: https://rpc.ankr.com/bsc
    type: public
  - name: NodeReal
    url: https://nodereal.io/
    type: private
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: PublicNode
    url: https://bsc-rpc.publicnode.com
    type: public
  - name: Binance RPC
    url: https://bsc-dataseed.bnbchain.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/bnb
    type: public
  - name: Blast
    url: https://bsc-mainnet.public.blastapi.io
    type: public
  - name: dRPC
    url: https://bsc.drpc.org
    type: public
  - name: LlamaNodes
    url: https://binance.llamarpc.com
    type: public
  - name: Nodies
    url: https://bsc-pokt.nodies.app
    type: public
  - name: OnFinality
    url: https://bnb.api.onfinality.io/public
    type: public
  - name: Meowrpc
    url: https://bsc.meowrpc.com
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/bsc/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://bnb.rpc.subquery.network/public
    type: public
sourceCode:
  - name: BNB Chain Organization
    url: https://github.com/bnb-chain
    description: Main BNB Chain GitHub organization with core repositories
forums:
  - name: BNB Chain Forum
    url: https://forum.bnbchain.org/
    description: Official community forum for BNB Chain discussions and governance
  - name: BNB Chain Discord
    url: https://discord.com/invite/bnbchain
    description: Community Discord server for real-time discussions
# SDKs and tools are inherited from evm-common.md
---

An EVM-compatible chain using Proof-of-Staked-Authority (PoSA), built for high-throughput applications with fast finality.

- **Consensus & Security**  
  - PoSA combines delegated staking with authority-based validator rotation  
  - 21 active validators, elected by BNB stake, produce blocks with ~3s time  
  - Finality typically achieved in ~6 seconds (2 blocks)  
  - Slashing applies for double-signing and liveness failures  
  - Validator set is permissioned—centralization risk is significant  

- **Performance & Fees**  
  - Typical throughput ~100–200 TPS, theoretical max ~2,000+ TPS under ideal conditions  
  - Fees generally low ($0.01–0.03), but can spike under load  
  - Ongoing upgrades aim for 0.75s block times and faster finality  

- **Infra & Architecture**  
  - C-Chain handles EVM smart contracts  
  - Tightly integrated with Binance ecosystem (wallets, bridges, exchange)  
  - Supports opBNB (an L2 on OP Stack) and subnets as part of multi-chain strategy  
  - Rust client and zk-rollup integrations are on the roadmap  

- **Governance**  
  - On-chain proposal system tied to validator and delegator voting  
  - Upgrades controlled by validator set, without enforced timelocks  

- **Trade-offs**  
  - Limited validator set → lower decentralization and higher censorship risk  
  - Close ties to Binance create centralized control concerns  
  - Infrastructure complexity increases with subnets, opBNB, and modular roadmap  