---
name: Optimism
chainId: 10
color: "#FF0420"
darkColor: "#CC0319"
logo: optimism.svg
parentOrganization: Optimism Foundation
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://community.optimism.io/docs/
blockscanners:
  - https://optimistic.etherscan.io
testnets:
  - Sepolia
  - Goerli
rpcs:
  public:
    - https://mainnet.optimism.io
  private:
    - https://optimism-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/ethereum-optimism/optimism
forums:
  - https://gov.optimism.io/
  - https://discord.gg/optimism
sdks:
  - https://github.com/ethereum-optimism/optimism/tree/develop/packages/sdk
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
---

Optimism is a Layer 2 rollup built on top of Ethereum using the OP Stack, aiming to scale Ethereum by offering cheaper and faster transactions while inheriting its security. It’s EVM-equivalent, so contracts written for Ethereum work out of the box, but the network is still largely centralized—transaction ordering is handled by a single sequencer, and fraud proofs aren’t fully live yet.

What makes Optimism unique is its vision of a “Superchain”: multiple chains (like Base and Mode) built on the same stack and potentially governed collectively. That’s interesting for shared infrastructure, but also means changes to the protocol are influenced by a broader coalition, which may slow down or complicate decisions for individual developers.