---
name: Lisk
chainId: 1135
nativeCurrency: ETH
color: "#87672d"
logo: lisk.svg
parentOrganization: Lisk
website: https://lisk.com
launchDate: 2024-05-23
maxBlockSize: 30
technology:
  isL2: true
  isEVM: true
  rollupType: "Optimistic"
  rollupDA: "Ethereum"
  parentChain: "Ethereum"
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.lisk.com/
blockscanners:
  - name: Blockscout
    url: https://blockscout.lisk.com
    type: official
testnets:
  - name: Lisk Sepolia
    chainId: 4202
    url: https://sepolia-blockscout.lisk.com
    description: Lisk testnet on Sepolia for dApp and smart contract testing.
    faucets:
      - https://app.optimism.io/faucet
    rpcs:
      - https://rpc.sepolia-api.lisk.com
      - https://node.histori.xyz/lisk-sepolia/8ry9f6t9dct1se2hlagxnd9n2a
rpcs:
  - name: Lisk Official RPC
    url: https://rpc.api.lisk.com
    type: public
  - name: dRPC
    url: https://lisk.drpc.org
    type: public
  - name: Tenderly
    url: https://lisk.gateway.tenderly.co
    type: public
  - name: Histori
    url: https://node.histori.xyz/lisk-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: GitHub Organization
    url: https://github.com/LiskHQ
    description: Lisk official GitHub organization
forums:
  - name: Lisk Discord
    url: https://discord.com/invite/lisk
    description: Lisk community Discord server
# SDKs and tools are inherited from evm-common.md
---

Former JavaScript blockchain that pivoted to become an L2 focused on bringing crypto to emerging markets. The key difference: While other L2s fight for Silicon Valley users, Lisk targets Africa and Southeast Asia where low fees actually matter for daily use.

**Best for:** Building for emerging markets, RWA tokenization projects, developers needing grants and support.

**Technical:** OP Stack rollup optimized for low-cost transactions, part of the Optimism Superchain.

- **Security & Data Availability**  
  - Standard optimistic rollup with 7-day withdrawal period
  - Centralized sequencer with decentralization roadmap
  - Fault proofs implementation planned
  - Secured by Ethereum L1 via fraud proofs

- **Infra & Execution**  
  - Built on OP Stack, fully EVM-compatible
  - Part of Optimism Superchain for cross-chain composability
  - Transitioned from JavaScript L1 to EVM for broader compatibility
  - Transaction fees under $0.01

- **Performance**  
  - Standard L2 throughput and latency
  - Low congestion due to early-stage adoption
  - Growing through targeted incentive programs
  - African Blockchain Incubation Hub supporting local builders

- **Use Cases**  
  - **Emerging market solutions**: Focus on real problems in Africa/Southeast Asia
  - **RWA tokenization**: Partnerships with Backed and Obligate
  - **Builder programs**: 3.65M LSK grants with 95% going directly to developers
  - **Financial inclusion**: Low fees enable microtransactions and remittances

- **Trade-offs**  
  - Still building ecosystem after L1-to-L2 transition
  - Emerging markets focus means different growth trajectory
  - Competing with other OP Stack chains for developers
  - Success depends on adoption in target regions