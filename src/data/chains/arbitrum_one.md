---
name: Arbitrum One
color: "#12AAFF"
darkColor: "#1C8CC9"
chainId: 42161
nativeCurrency: ETH
logo: arbitrum_one.svg
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
contractLanguages:
  primary:
    name: Solidity
    url: https://soliditylang.org
  others:
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
bookmarks:
  - Overview
  - Source
  - Forums
  - Docs
  - Blockscanners
  - Testnets
  - RPCs
  - SDKs
  - Tools
---

Arbitrum One is a Layer 2 Optimistic Rollup that batches transactions off-chain and posts all transaction data directly to Ethereum, offering a trustless extension of the L1 with lower fees and higher throughput.

It doesn’t rely on committees or off-chain data availability like Arbitrum Nova — instead, all data is published on-chain, which makes it more expensive but also more secure and decentralized.

Built on the Nitro stack, Arbitrum One is fully EVM-compatible and uses standard Ethereum tooling, with some improvements under the hood like calldata compression and improved cross-chain messaging. The trade-off is higher gas costs compared to AnyTrust-based chains, but for developers building DeFi apps or anything where state integrity matters, Arbitrum One sticks closer to Ethereum’s trust model.