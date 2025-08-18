---
# Common EVM SDKs and Tools
# This file contains SDKs and tools that work across all EVM-compatible chains
# Use the 'excludeChains' field to specify chains where a tool doesn't work

sdks:
  - name: Viem
    url: https://viem.sh/
    type: JS/TS
    description: Modular TypeScript library for Ethereum and EVM-compatible blockchain development.
  - name: Ethers.js
    url: https://ethers.org/
    type: JS/TS
    description: Lightweight JavaScript library for interacting with Ethereum and EVM-compatible blockchains.
  - name: Web3.js
    url: https://web3js.readthedocs.io/
    type: JS/TS
    description: Ethereum JavaScript API for interacting with nodes via HTTP, IPC or WebSocket.
  - name: thirdweb SDK
    url: https://portal.thirdweb.com/sdk
    type: JS/TS
    description: Comprehensive SDK for Web3 development, including wallet connectivity and blockchain interaction.
  - name: Wagmi
    url: https://wagmi.sh/
    type: React
    description: React Hooks library for Ethereum, facilitating wallet connections and contract interactions.
  - name: RainbowKit
    url: https://www.rainbowkit.com/
    type: React
    description: React library for adding wallet connection to dApps with a beautiful, customizable UI.
  - name: ConnectKit
    url: https://docs.family.co/connectkit
    type: React
    description: React library for connecting wallets to dApps with a modern, accessible interface.
  - name: Web3Modal
    url: https://web3modal.com/
    type: JS/TS
    description: Library for connecting wallets to dApps, supporting multiple chains and wallet providers.
  - name: Nethereum
    url: https://nethereum.com/
    type: .NET
    description: .NET integration library for Ethereum, supporting contract interaction and wallet management.
  - name: Rust Web3
    url: https://github.com/tomusdrw/rust-web3
    type: Rust
    description: Rust implementation of Web3 library for interacting with Ethereum nodes.
  - name: Alloy
    url: https://github.com/alloy-rs/alloy
    type: Rust
    description: High-performance, well-tested & documented Rust libraries for interacting with Ethereum and other EVM chains.
  - name: web3j
    url: https://web3j.io/
    type: Java
    description: Lightweight Java and Android library for working with Smart Contracts and integrating with Ethereum clients.
  - name: web3.py
    url: https://web3py.readthedocs.io/
    type: Python
    description: A Python library for interacting with Ethereum, its ecosystem, and EVM-compatible chains.
  - name: Alchemy SDK
    url: https://github.com/alchemyplatform/alchemy-sdk-js
    type: JS/TS
    description: Extended Ethereum SDK with enhanced APIs for NFTs, webhooks, and advanced queries.
  - name: QuickNode SDK
    url: https://github.com/quiknode-labs/qn-oss
    type: JS/TS
    description: SDK for QuickNode's enhanced Ethereum APIs and add-ons.
  - name: Moralis SDK
    url: https://github.com/MoralisWeb3/Moralis-JS-SDK
    type: JS/TS
    description: SDK for building Web3 applications with authentication, real-time data, and cross-chain support.
  - name: Go Ethereum
    url: https://goethereumbook.org/en/
    type: Go
    description: Complete guide and examples for Ethereum development in Go, including smart contract interaction and transaction handling.

tools:
  - name: Foundry
    url: https://getfoundry.sh/
    type: free
    description: Fast, Rust-based CLI toolkit for compiling, testing, deploying, and debugging smart contracts.
  - name: Hardhat
    url: https://hardhat.org/
    type: free
    description: JavaScript-based development environment and local Ethereum node for building and testing contracts.
  - name: Remix IDE
    url: https://remix.ethereum.org/
    type: free
    description: Web-based IDE for writing, compiling, and deploying Solidity smart contracts in-browser.
  - name: Tenderly
    url: https://tenderly.co/
    type: free-tier
    description: Dashboard for contract monitoring, real-time debugging, gas profiling, and simulating transactions.
  - name: Truffle Suite
    url: https://trufflesuite.com/
    type: free
    description: Development framework for compiling, testing, and deploying smart contracts with built-in asset pipeline.
  - name: Ganache
    url: https://trufflesuite.com/ganache/
    type: free
    description: Personal blockchain for Ethereum development, allowing you to deploy contracts and run tests locally.
  - name: OpenZeppelin Defender
    url: https://www.openzeppelin.com/defender
    type: free-tier
    description: Security operations platform for smart contract automation, monitoring, and incident response.
  - name: Sourcify
    url: https://sourcify.dev/
    type: free
    description: Decentralized source code verification service for smart contracts across multiple chains.
  - name: Slither
    url: https://github.com/crytic/slither
    type: free
    description: Static analysis framework for Solidity, detecting vulnerabilities and code quality issues.
  - name: MythX
    url: https://mythx.io/
    type: free-tier
    description: Security analysis service for Ethereum smart contracts, detecting vulnerabilities automatically.
  - name: The Graph
    url: https://thegraph.com/
    type: free-tier
    description: Indexing protocol for querying blockchain data, making it easy to build dApps with complex queries.
  - name: Brownie
    url: https://eth-brownie.readthedocs.io/
    type: free
    description: Python-based development and testing framework for smart contracts.
  - name: Cast (Foundry)
    url: https://book.getfoundry.sh/cast/
    type: free
    description: Command-line tool for performing Ethereum RPC calls, sending transactions, and interacting with smart contracts.
  - name: Scaffold-ETH
    url: https://github.com/scaffold-eth/scaffold-eth-2
    type: free
    description: Complete starter kit for building dApps with Hardhat, Next.js, RainbowKit, and Wagmi.
    # Example: If a tool doesn't support certain chains, list them here
    # excludeChains: ['polygon_zkevm', 'zksync']
---
