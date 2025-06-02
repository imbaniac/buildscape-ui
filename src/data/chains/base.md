---
name: Base
chainId: 8453
color: "#0052FF"
darkColor: "#0041CC"
logo: base.svg
parentOrganization: Coinbase
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
contractLanguages:
  primary:
    name: Solidity
    url: https://soliditylang.org
  others:
    - name: Vyper
      url: https://vyper.readthedocs.io
docs:
  - https://docs.base.org/
blockscanners:
  - https://basescan.org
testnets:
  - Sepolia
rpcs:
  public:
    - https://mainnet.base.org
  private:
    - https://base-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/base-org
forums:
  - https://forum.base.org/
  - https://community.base.org/
sdks:
  - https://docs.base.org/developers/sdk
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
---

Base is Coinbase’s Layer 2 network built on the OP Stack, offering full EVM compatibility and lower fees by batching transactions off-chain and settling them on Ethereum. It’s designed to be developer-friendly, allowing for easy deployment of Ethereum smart contracts without significant modifications.

However, the network’s decentralization is a work in progress. Currently, the sequencer — the component responsible for ordering transactions — is operated by Coinbase, introducing a central point of control. While there are plans to transition to a more decentralized model over time, this centralization may be a concern for developers prioritizing trustless systems.

One notable detail is that Base, built on the OP Stack, shares its codebase with other chains like Optimism and Mode, meaning protocol changes can propagate across chains and are governed by shared upstream decisions — this can be good for interoperability, but may limit autonomy if Base wants to diverge technically.

For developers, Base offers a scalable solution with the backing of a major exchange, but it’s important to weigh the benefits against the current centralization aspects.