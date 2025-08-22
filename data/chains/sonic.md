---
name: Sonic
chainId: 146
nativeCurrency: S
color: "#fe9a4d"
logo: sonic.svg
parentOrganization: Sonic Labs
website: https://soniclabs.com
launchDate:
maxBlockSize:
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
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.soniclabs.com/
blockscanners:
  - name: Sonic Explorer
    url: https://explorer.soniclabs.com
    type: official
testnets:
  - name: Sonic Blaze Testnet
    chainId: 57054
    url: https://blaze.soniclabs.com
    description: Sonic's testnet for deploying and testing applications on the high-performance Sonic blockchain.
    faucets:
      - https://blaze.soniclabs.com/account
    rpcs:
      - https://rpc.blaze.soniclabs.com
      - https://sonic-testnet.drpc.org
rpcs:
  - name: Sonic Labs
    url: https://rpc.soniclabs.com
    type: official
  - name: Ankr
    url: https://rpc.ankr.com/sonic_mainnet
    type: public
  - name: dRPC
    url: https://sonic.drpc.org
    type: public
  - name: PublicNode
    url: https://sonic-rpc.publicnode.com
    type: public
  - name: OnFinality
    url: https://sonic.api.onfinality.io/public
    type: public
  - name: Stakely
    url: https://sonic-json-rpc.stakely.io
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/sonic-chain
    description: Main GitHub organization for Sonic development
forums:
  - name: Discord
    url: https://discord.com/invite/soniclabs
    description: Main community support and discussion channel
  - name: X (Twitter)
    url: https://x.com/soniclabs
    description: Official Sonic Labs announcements and updates
# SDKs and tools are inherited from evm-common.md
---

Fantom reborn as Sonic — the same DAG consensus tech pushed to the limit with 10,000 TPS capability and sub-second finality. Built by Andre Cronje's team, it's an independent L1 that rewards developers with 90% of the gas fees their apps generate.

**Key Difference:** Developer revenue sharing model where builders earn from their app's usage, not just from token speculation — creating Web2-like sustainable business models on-chain.

**Best for:** DeFi protocols wanting revenue streams, high-frequency trading apps, gaming that needs instant finality, developers migrating from Fantom.

**Technical:** DAG-based consensus L1 with 720ms finality, custom SonicVM for speed, FTM→S token migration at 1:1 ratio.

- **Use Cases**
  - **DeFi infrastructure**: Silo Finance (lending), Beethoven X/BEETS (DEX and staking), SpookySwap V3 (concentrated liquidity)
  - **Revenue-generating apps**: Fee Monetization returns 90% of gas to developers
  - **Fantom migrations**: Full compatibility for existing Fantom projects
  - **High-frequency applications**: Trading bots, gaming, real-time applications

- **Security & Data Availability**
  - DAG-based Lachesis consensus with asynchronous Byzantine Fault Tolerance.
  - Limited validator set (41 validators) — more centralized than major L1s.
  - No L2 rollup proofs or Ethereum anchoring — standalone L1 security model.

- **Infra & Execution**
  - Full EVM compatibility with standard Solidity/Vyper support.
  - Custom SonicVM and SonicDB optimize execution and state access.
  - Node sync 10x faster than Fantom Opera, RPC costs reduced by 96%.

- **Performance**
  - Theoretical 10,000 TPS capability with 720ms finality.
  - Transaction costs under $0.0001 in normal conditions.
  - Actual usage varies — network handles current demand without congestion.

- **Trade-offs**
  - Small validator set (41) creates centralization risk vs thousands on Ethereum.
  - Standalone L1 without Ethereum security — relies entirely on validator honesty.
  - Smaller ecosystem despite growth — competing with established L1s and L2s.
  - Token price volatility despite technical improvements — market confidence still building.
