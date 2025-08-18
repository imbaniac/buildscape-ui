---
name: PulseChain
chainId: 369
nativeCurrency: PLS
color: "#6163F1"
logo: pulsechain.svg
parentOrganization: PulseChain Foundation
website: https://pulsechain.com/
launchDate: 2023-05-13
maxBlockSize: 30
technology:
  isL2: false
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://hexpulse.info/docs/
blockscanners:
  - name: PulseScan
    url: https://ipfs.scan.pulsechain.com
    type: official
  - name: OtterScan
    url: https://otter.pulsechain.com
    type: alternative
testnets:
  - name: PulseChain Testnet v4
    chainId: 943
    url: https://scan.v4.testnet.pulsechain.com
    description: Test network for PulseChain development and smart contract testing
    faucets:
      - https://faucet.v4.testnet.pulsechain.com/
    rpcs:
      - https://rpc.v4.testnet.pulsechain.com
      - https://pulsechain-testnet-rpc.publicnode.com
      - https://rpc-testnet-pulsechain.g4mm4.io
rpcs:
  - name: Official RPC
    url: https://rpc.pulsechain.com
    type: public
  - name: PublicNode
    url: https://pulsechain-rpc.publicnode.com
    type: public
  - name: G4MM4
    url: https://rpc-pulsechain.g4mm4.io
    type: public
  - name: Evex Cloud
    url: https://evex.cloud/pulserpc
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/pulse/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: PulseChain
    url: https://gitlab.com/pulsechaincom
    description: PulseChain GitLab organization
forums:
  - name: PulseChain Telegram
    url: https://t.me/PulseChainCom
    description: Official PulseChain community channel
  - name: PulseChain Telegram Dev
    url: https://t.me/PulseDEV
    description: PulseChain dev community channel
# SDKs and tools are inherited from evm-common.md
---

Ethereum's controversial "system state fork" — copied every wallet balance, NFT, and smart contract from Ethereum at launch. Created by Richard Heart, it promises cheaper fees but runs on just 33 validators instead of Ethereum's thousands.
The key difference: Complete Ethereum state duplication at genesis meant everyone got free copies of their ETH holdings as PLS, though most copied tokens have no real value or liquidity.

**Best for:** Experimenting with Ethereum forks cheaply, users holding pre-fork Ethereum assets wanting free copies, Richard Heart ecosystem participants.

**Technical:** Proof-of-Stake fork with 33 validators, 10-second blocks, no L2 scaling or Ethereum security connection.

- **Security & Data Availability**
  - Proof-of-Staked-Authority with ~33 validators controlling the network.
  - Validators are permissioned, not openly elected like Ethereum.
  - No fraud proofs, validity proofs, or Ethereum anchoring — standalone security model.

- **Infra & Execution**
  - Full Ethereum state fork — copied all ETH balances, ERC-20s, NFTs at May 2023 genesis.
  - Standard EVM execution without rollup tech or blob data availability.
  - Most copied assets (stablecoins, wrapped tokens) have no backing or bridge connectivity.

- **Performance**
  - 10-second block times vs Ethereum's 12 seconds.
  - Low fees primarily due to minimal usage, not technical innovation.
  - Lacks modern scaling: no rollups, blobs, or sharding technology.

- **Use Cases**
  - **PulseX DEX**: Main app with majority of chain's activity and liquidity
  - **HEX ecosystem**: Richard Heart's token projects concentrated here
  - **Copied DeFi forks**: Non-functional copies of Ethereum protocols without maintenance
  - **Speculative trading**: Low-liquidity tokens within the Heart ecosystem

- **Trade-offs**
  - Extreme centralization: 33 validators vs thousands on Ethereum or legitimate L2s.
  - No major exchange listings — trading limited to native DEXs.
  - Copied assets misleading: USDC/USDT copies have no backing or redemption.
  - SEC investigation history and founder controversies affect credibility.
