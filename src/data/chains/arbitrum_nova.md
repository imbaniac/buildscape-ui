---
name: Arbitrum Nova
color: "#ff7801"
darkColor: "#b34f00"
chainId: 42161
nativeCurrency: ETH
logo: arbitrum_nova.svg
parentOrganization: Offchain Labs
techStack: Arbitrum
technology:
  type: AnyTrust
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Rust / C / C++
    url: https://docs.arbitrum.io/stylus/stylus-content-map
    details: Compiled to WASM with Stylus
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.arbitrum.io/welcome/get-started
blockscanners:
  - https://www.arbiscan.io
  - https://arbitrum.blockscout.com
  - https://www.oklink.com/arbitrum-one
  - https://arbitrum.dex.guru
testnets:
  - name: Sepolia
    url: https://sepolia.arbiscan.io
    faucets: 
      - https://www.alchemy.com/faucets/arbitrum-sepolia
      - https://faucets.chain.link/arbitrum-sepolia
      - https://faucet.quicknode.com/arbitrum
      - https://sepolia-faucet.pk910.de/
rpcs:
  public:
    - https://arb1.arbitrum.io/rpc
  private:
    - https://arbitrum-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/OffchainLabs/arbitrum
forums:
  - name: Governance Forum
    url: https://forum.arbitrum.foundation
  - name: Research Forum
    url: https://research.arbitrum.io
sdks:
  - https://docs.arbitrum.io/sdk
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
---

Arbitrum Nova is a Layer 2 blockchain built on the AnyTrust protocol, designed for applications requiring high throughput and low transaction costs, such as gaming and social platforms.

Unlike Arbitrum One, which is a fully trustless Optimistic Rollup, Nova introduces a mild trust assumption through a Data Availability Committee (DAC). This committee, comprising entities like Google Cloud, QuickNode, and Reddit, ensures off-chain data availability, allowing Nova to post only data availability certificates (DACerts) to Ethereum, thereby reducing costs and increasing efficiency. In cases where the DAC fails, Nova can fall back to posting full data on-chain, maintaining operational integrity.

Both Nova and Arbitrum One utilize the Nitro technology stack, offering EVM compatibility and advanced features like calldata compression. Nova also supports Stylus, a WASM-based smart contract environment that runs alongside the EVM. This allows developers to write contracts in Rust, C, or C++ with near-native performance, while still maintaining full interoperability with Solidity-based contracts.

However, developers should note that while Nova provides cost and speed advantages, it does so with a trade-off in decentralization compared to Arbitrum One.