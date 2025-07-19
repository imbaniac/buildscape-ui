---
name: Lisk
chainId: 1135
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
  - name: Lisk GitHub
    url: https://github.com/LiskHQ
    description: Lisk official GitHub organization
forums:
  - name: Lisk Forum
    url: https://lisk.chat/
    description: Official Lisk community forum
  - name: Lisk Discord
    url: https://lisk.chat/
    description: Lisk community Discord server
# SDKs and tools are inherited from evm-common.md
---

Lisk is an Ethereum Layer 2 built on the OP Stack, designed specifically for high-growth emerging markets in Africa, Southeast Asia, and other developing regions. It leverages Optimistic rollup technology to provide fast and affordable transactions while maintaining Ethereum's security.

As part of the Superchain ecosystem, Lisk focuses on real-world applications in emerging markets, offering builders the infrastructure to create solutions for local challenges. The network prioritizes accessibility and low costs to enable financial inclusion and digital innovation in underserved regions.

Built on proven technology from Optimism, Lisk combines the reliability of established L2 infrastructure with a focused mission to empower founders and developers in emerging economies, making it an ideal platform for building the next generation of decentralized applications in high-growth markets.