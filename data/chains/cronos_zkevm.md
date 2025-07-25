---
name: Cronos zkEVM
chainId: 388
nativeCurrency: zkCRO
color: "#133750"
darkColor: "#0D2638"
logo: cronos_zkevm.svg
parentOrganization: Crypto.com
website: https://cronos.org/zkevm
launchDate: 2024-08-15
maxBlockSize: 30
technology:
  type: ZK Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: ZKsync
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs-zkevm.cronos.org
blockscanners:
  - name: Cronos zkEVM Explorer
    url: https://explorer.zkevm.cronos.org
    type: official
testnets:
  - name: Cronos zkEVM Testnet
    chainId: 240
    url: https://explorer.zkevm.cronos.org/testnet
    description: Public testnet for Cronos zkEVM, used for testing smart contracts and dApps before mainnet deployment.
    faucets:
      - https://zkevm.cronos.org/faucet
    rpcs:
      - https://testnet.zkevm.cronos.org
rpcs:
  - name: Cronos zkEVM Official
    url: https://mainnet.zkevm.cronos.org
    type: official
  - name: dRPC
    url: https://cronos-zkevm.drpc.org
    type: public
sourceCode:
  - name: Cronos zkEVM
    url: https://github.com/crypto-org-chain/cronos
    description: Cronos blockchain repositories and zkEVM implementation
forums:
  - name: Cronos Discord
    url: https://discord.gg/cronos
    description: Official Discord community for developers and users
  - name: Cronos Forum
    url: https://forum.cronos.org
    description: Community discussion forum
# SDKs and tools are inherited from evm-common.md
---

A Validium-style ZK rollup built using ZKsync’s ZK Stack, designed to scale the Cronos ecosystem with low-cost ZK execution and native yield features.

- **Architecture**  
  - Validium model: ZK proofs posted to Ethereum, but data availability is off-chain and controlled by the sequencer.  
  - Based on ZK Stack with native account abstraction and EVM compatibility.  
  - Gas token is **zkCRO**, backed by liquid-staked CRO.  

- **Security Model**  
  - State transitions verified via STARK proofs.  
  - No on-chain data availability — exit safety depends on sequencer honesty.  
  - Upgrades go through a delay window (typically 4–8 days), but can be bypassed via emergency governance paths.  

- **Performance**  
  - Benchmarked throughput >100 TPS with “hyperchain” parallelism.  
  - Real performance depends on sequencer and DA system.  
  - Fees are low (≈$0.001 per op), but sensitive to DA and proof generation delays.  

- **Features**  
  - Native account abstraction: supports sponsor-paid gas and smart wallets by default.  
  - Yield-bearing gas: zkCRO accrues staking yield while being used for transactions.  
  - Interoperability: part of ZK Stack ecosystem, enabling shared sequencers and bridges with other ZK chains.  

- **Trade-offs**  
  - Centralized DA is a major risk — sequencer failure or censorship can block withdrawals.  
  - Upgrade process is not trustless; emergency upgrades can override timelocks.  
  - Yield-bearing gas introduces financial exposure and complexity at the protocol level.  
  - Many features (hyperchain execution, zkCRO mechanics) are still early-stage and lightly tested.  