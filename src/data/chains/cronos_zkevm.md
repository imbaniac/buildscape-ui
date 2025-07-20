---
name: Cronos zkEVM
chainId: 388
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

Cronos zkEVM is a Layer 2 scaling solution built on Ethereum using zero-knowledge proof technology. Developed by Crypto.com, it extends the Cronos ecosystem with a secure, scalable zkEVM rollup that inherits Ethereum's security while offering faster and cheaper transactions.

The chain maintains full EVM equivalence, allowing developers to deploy existing Ethereum smart contracts without modification. It leverages zero-knowledge proofs to batch and compress transactions, providing cryptographic guarantees of correctness while significantly reducing gas costs compared to Ethereum mainnet.

Cronos zkEVM benefits from the established Cronos ecosystem and Crypto.com's resources, providing strong infrastructure support and potential integration with Crypto.com's extensive user base. The zkEVM technology ensures that all state transitions are mathematically proven to be valid, offering the same security level as Ethereum itself while achieving higher throughput.