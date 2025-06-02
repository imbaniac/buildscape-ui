---
name: Unichain
chainId: 130
color: "#F50FB4"
darkColor: "#C3008A"
logo: unichain.svg
parentOrganization: Uniswap Labs
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
  - https://docs.unichain.org/
blockscanners:
  - https://unichainscan.com
testnets:
  - UniTestnet
rpcs:
  public:
    - https://rpc.unichain.org
  private:
    - https://unichain-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/unichain/unichain
forums:
  - https://forum.unichain.org/
  - https://community.unichain.org/
sdks:
  - https://docs.unichain.org/sdk
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
---

Unichain is Uniswap Labs’ Layer 2 rollup built on the OP Stack, tailored specifically for DeFi applications. It offers 1-second block times at launch, with plans to reduce this to 250 milliseconds, aiming to improve UX for high-frequency trading and real-time market data.

A unique feature is its use of a Trusted Execution Environment (TEE) for block production, built with Flashbots, which enforces fair sequencing and limits MEV exploitation—something most other rollups haven’t implemented natively. While it starts with a single sequencer, it supports permissionless fault proofs from day one, and plans to introduce a dedicated validator network (UVN) where participants earn a share of protocol revenue.

Since it’s part of the OP Stack ecosystem, it benefits from shared infrastructure but also inherits its limitations—like centralized sequencing in early stages and upgrade dependencies from the broader Optimism governance process.

For developers building latency-sensitive or MEV-aware DeFi apps, these design choices offer more predictability and control than most general-purpose L2s.