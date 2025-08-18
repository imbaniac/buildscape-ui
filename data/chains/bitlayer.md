---
name: Bitlayer
chainId: 200901
nativeCurrency: BTC
color: "#E46F1B"
logo: bitlayer.svg
parentOrganization:
website: https://www.bitlayer.org
launchDate:
maxBlockSize:
technology:
  isL2: true
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
  - https://docs.bitlayer.org/
blockscanners:
  - name: BTRScan
    url: https://www.btrscan.com
    type: official
testnets:
  - name: Bitlayer Testnet
    chainId: 200810
    url: https://testnet.btrscan.com
    description: Bitlayer testnet for testing DApps and smart contracts on the Bitcoin Layer 2 network.
    faucets:
      - https://www.bitlayer.org/faucet
    rpcs:
      - https://testnet-rpc.bitlayer.org
      - https://rpc.ankr.com/bitlayer_testnet
      - https://testnet-rpc.bitlayer-rpc.com
rpcs:
  - name: Bitlayer Official
    url: https://rpc.bitlayer.org
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/bitlayer
    type: public
  - name: Bitlayer RPC
    url: https://rpc.bitlayer-rpc.com
    type: public
  - name: RockX
    url: https://rpc-bitlayer.rockx.com
    type: public
sourceCode:
  - name: Bitlayer GitHub
    url: https://github.com/bitlayer-org
    description: Bitlayer organization GitHub repositories
forums:
  - name: Bitlayer Telegram
    url: https://t.me/bitlayerofficial
# SDKs and tools are inherited from evm-common.md
---

Bitcoin L2 built around BitVM — a way to lock BTC on Bitcoin and use it on an EVM chain without custodians. Currently the #2 Bitcoin L2 by TVL, though still using experimental technology that just hit mainnet in July 2025.
The key difference: BitVM bridge attempts trust-minimized BTC transfers using Bitcoin's script language for fraud proofs. Unlike wrapped tokens, aims to lock BTC on Bitcoin itself, but the mechanism is new and largely unproven at scale.

**Best for:** BTC holders wanting native yield without wrapping, DeFi protocols needing trust-minimized BTC, developers building high-performance Bitcoin apps.

**Technical:** Dual-layer architecture with PoS consensus and BitVM rollup, EVM-compatible, commits state to Bitcoin for security anchoring.

- **Security & Data Availability**
  - BitVM fraud proofs enable challenges on Bitcoin itself — one honest participant can prevent fraud.
  - State roots committed to Bitcoin blockchain for permanent verification.
  - Transitioning to full Bitcoin rollup (V2) for Bitcoin-equivalent security.

- **Infra & Execution**
  - BitVM Bridge mainnet live — trust-minimized BTC as YBTC with strict 1:1 peg.
  - Mining pool integration (Antpool, F2Pool, SpiderPool) for real-time processing.
  - EVM-compatible with sub-second finality in execution layer.

- **Performance**
  - V3 roadmap: Sub-millisecond trading engine, horizontal scaling for unlimited throughput.
  - Fast soft finality through PoS layer, Bitcoin finality after challenge period.
  - CEX-level UX targeted with ultra-low costs and sub-second interactions.

- **Use Cases**
  - **Native BTC DeFi**: First trust-minimized BTC bridge without custodians
  - **Ecosystem scale**: 200+ dApps deployed across DeFi, gaming, infrastructure
  - **Mining integration**: Direct support from major Bitcoin mining pools
  - **Cross-chain expansion**: Integrations with Sui, Arbitrum, Base, Cardano

- **Trade-offs**
  - BitVM still experimental — first mainnet implementation just launched.
  - PoS sequencer layer adds complexity vs pure Bitcoin security.
  - Challenge period needed for Bitcoin finality (7 days).
  - V2 rollup architecture not yet live — roadmap dependency.
