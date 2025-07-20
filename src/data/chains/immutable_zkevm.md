---
name: Immutable zkEVM
chainId: 13371
color: "#131313"
darkColor: "#3C3C3C"
logo: immutable_zkevm.svg
parentOrganization: Immutable
website: https://www.immutable.com
launchDate: 
maxBlockSize: 
technology:
  isL2: true
  isEVM: true
  type: ZK Rollup
  parentChain: Ethereum
  stack: Polygon zkEVM
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
docs:
  - https://docs.immutable.com/docs/zkEVM/
blockscanners:
  - name: Immutable Explorer
    url: https://explorer.immutable.com
    type: official
testnets:
  - name: Immutable zkEVM Testnet
    chainId: 13473
    url: https://explorer.testnet.immutable.com
    description: Test environment for Immutable zkEVM with gaming-optimized features.
    faucets:
      - https://docs.immutable.com/docs/zkEVM/guides/faucet
    rpcs:
      - https://rpc.testnet.immutable.com
      - https://immutable-zkevm-testnet.drpc.org
rpcs:
  - name: Immutable
    url: https://rpc.immutable.com
    type: public
  - name: dRPC
    url: https://immutable-zkevm.drpc.org
    type: public
  - name: Tenderly
    url: https://immutable.gateway.tenderly.co
    type: private
  - name: Histori
    url: https://node.histori.xyz/immutable-mainnet
    type: public
sourceCode:
  - name: Immutable zkEVM
    url: https://github.com/immutable
    description: Immutable GitHub organization
forums:
  - name: Immutable Discord
    url: https://discord.gg/immutable
    description: Official Discord community for developers and players
  - name: Immutable Developer Hub
    url: https://www.immutable.com/developers
    description: Resources and documentation for building on Immutable
# SDKs and tools are inherited from evm-common.md
---

Immutable zkEVM is a gaming-dedicated blockchain built on Polygon's zkEVM technology. It's specifically designed to handle massive player bases and complex gameplay mechanics without compromising performance or speed, all while maintaining low gas costs.

As a purpose-built chain for gaming, Immutable zkEVM offers developers the security of Ethereum combined with the scalability needed for modern games. Gas fees are paid in IMX tokens, and the platform provides gaming-specific features like built-in royalty enforcement and seamless asset trading.

The ecosystem focuses heavily on developer experience, offering comprehensive SDKs, APIs, and tools specifically tailored for game development. While it excels at gaming use cases, it may not be the optimal choice for general-purpose DeFi applications.