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

The L1 where apps earn money from their users' gas fees. If your DeFi protocol gets popular, you get paid — like running a SaaS business on-chain.

**Unique Position**
Sonic gives 90% of gas fees to the app that generated them, not validators. No token launches needed, no VCs required - just build something people use and get paid. Former Fantom ecosystem migrating over with established DeFi protocols providing initial liquidity.

**Primary Use Cases**

- DeFi protocols seeking direct revenue from usage
- High-frequency trading requiring sub-second finality
- Gaming applications needing instant response times
- Fantom projects migrating with 1:1 token conversion
- Developers wanting sustainable income streams

**Ecosystem Character**
Fantom community transitioning to Sonic with established protocols like SpookySwap and Beethoven X leading migration. Developer-centric culture focused on building sustainable applications rather than quick token launches. Smaller but committed ecosystem betting on technical superiority over marketing hype.

**Trade-offs**

- Only 41 validators compared to thousands on Ethereum
- Standalone L1 without Ethereum security guarantees
- Competing against both established L1s and cheaper L2s
- Market confidence still rebuilding after Fantom's decline
- Smaller ecosystem limits composability and liquidity

## Technical Details

**Architecture**
DAG-based Lachesis consensus with asynchronous Byzantine Fault Tolerance enabling parallel transaction processing. Custom SonicVM and SonicDB optimize execution and state access beyond standard EVM. Full compatibility maintained for Fantom migrations with 1:1 FTM to S token conversion.

**Performance**
Achieves 720ms finality with theoretical capacity of 10,000 TPS, though actual usage remains far below. Transaction costs under $0.0001 during normal operation. Node sync 10x faster than Fantom Opera with RPC costs reduced by 96% through optimization.

**Security & Trust Model**
DAG consensus allows asynchronous validation without waiting for block confirmation. Limited to 41 validators creating centralization concerns versus major networks. No connection to Ethereum security — entirely dependent on validator set honesty and economic incentives.

**Control & Governance**
Sonic Labs controls development with Andre Cronje's team leading technical direction. Validator set relatively small but permissionless to join with sufficient stake. Fee Monetization parameters controlled by protocol but developer registration permissionless.
