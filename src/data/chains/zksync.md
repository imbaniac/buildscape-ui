---
name: ZKsync Era
chainId: 324
color: "#0C18EC"
darkColor: "#0E16A5"
logo: zksync.png
parentOrganization: Matter Labs
technology:
  type: ZK Rollup
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
docs:
  - https://era.zksync.io/docs/
blockscanners:
  - https://explorer.zksync.io
testnets:
  - ZKsync Testnet
rpcs:
  public:
    - https://mainnet.era.zksync.io
  private:
    - https://zksync-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/matter-labs/zksync-era
forums:
  - https://community.zksync.io/
  - https://forum.zksync.io/
sdks:
  - https://era.zksync.io/docs/api/sdk.html
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
---

zkSync Era is a Layer 2 zk-rollup that offers EVM compatibility with a few caveats. It uses validity proofs to batch transactions off-chain and post succinct proofs to Ethereum, providing strong security guarantees.

However, developers should be aware that zkSync Era introduces some non-standard behaviors: contract deployment requires bytecode to be passed in a separate field, and transactions use EIP-712 signatures with custom fields for fees and paymasters.

While most Solidity code works with minimal changes, tooling like Hardhat may need additional configuration. zkSync Era also supports native account abstraction, enabling features like gasless transactions and custom signature schemes.

The network is currently operated by a centralized sequencer, but plans exist to decentralize this component over time.

For developers seeking scalability without compromising on Ethereum’s security model, zkSync Era offers a compelling, though slightly unconventional, platform.