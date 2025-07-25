---
name: Lisk
chainId: 1135
nativeCurrency: ETH
color: "#D1D7E1"
darkColor: "#8292AB"
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

An EVM-compatible Layer 2 built on the OP Stack, part of the Optimism Superchain. The legacy JavaScript-based SDK and sidechain model has been deprecated.

- **Consensus & Finality**  
  - Finality is probabilistic and subject to a challenge period (~7 days) on Ethereum L1.  
  - Sequencer currently centralized; decentralization planned via Superchain roadmap.

- **Security Model**  
  - Secured by Ethereum L1 with fraud-proof-based dispute resolution.  
  - Sequencer trust assumptions apply — censorship resistance depends on future upgrades.  
  - Shared infrastructure with the Superchain improves auditability and upgrade velocity.

- **Use Cases**  
  - Suitable for developers building general-purpose dApps on Ethereum L2: DeFi, gaming, identity, etc.  
  - Integrated into a broader Superchain vision with composability across OP Stack chains.

- **Trade-offs**  
  - Subject to standard optimistic rollup trade-offs (latency, challenge delays).  
  - Sequencer currently centralized; liveness and censorship resistance not yet trustless.  
  - Competes with other OP Stack chains — differentiation depends on ecosystem support and UX.