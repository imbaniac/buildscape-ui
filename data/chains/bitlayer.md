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

A Bitcoin L2 where BTC can be used in EVM without traditional wrapping, backed by major mining pools like Antpool and F2Pool. The first production test of BitVM technology.

**Unique Position**
Bitlayer uses BitVM to lock BTC directly on Bitcoin while enabling EVM smart contracts, eliminating traditional wrapped token risks. Only needs one honest participant to prevent bridge theft, unlike multisigs requiring majority honesty. Mining pool partnerships provide unique Bitcoin ecosystem credibility, though actual integration remains unclear. First production BitVM deployment, making this either breakthrough or cautionary tale.

**Primary Use Cases**

- BTC holders seeking yield without multisig bridge risks
- DeFi protocols wanting native Bitcoin liquidity
- Mining operations leveraging their BTC holdings
- Cross-chain protocols needing trust-minimized bridges
- Bitcoin-native applications avoiding wrapped token complexity

**Ecosystem Character**
Claims 200+ dApps but liquidity concentrated in a handful like Macaron DEX. Mining pool partnerships (Antpool, F2Pool, SpiderPool) provide credibility but unclear actual integration. Community split between BitVM believers and skeptics watching TVL decline. Heavily Asian-focused through mining connections.

**Trade-offs**

- BitVM highly experimental — first production deployment at scale
- Dual PoS/rollup architecture adds complexity beyond pure BitVM
- Seven-day challenge period for Bitcoin finality
- V2 mainnet delayed to Q2 2025 showing technical challenges

## Technical Details

**Architecture**
Dual-layer system combining PoS consensus for execution with BitVM rollup for Bitcoin settlement. EVM-compatible execution layer with state commitments anchored to Bitcoin. BitVM enables fraud proofs using Bitcoin script, allowing challenges without soft fork.

**Performance**
Sub-second soft finality through PoS layer with eventual Bitcoin finality after challenge period. Targeting CEX-level performance with planned sub-millisecond trading engine. Current throughput limited but V3 roadmap promises horizontal scaling for unlimited TPS.

**Security & Trust Model**
BitVM fraud proofs allow any honest participant to prevent invalid state transitions on Bitcoin. State roots committed to Bitcoin for permanent verification and dispute resolution. However, PoS sequencer layer introduces additional trust assumptions beyond pure Bitcoin security. Bridge security depends on at least one honest challenger during dispute period.

**Control & Governance**
Mining pool partnerships provide ecosystem influence but not direct protocol control. PoS validator set controls execution layer consensus and ordering. BitVM bridge operated by designated operators with planned decentralization. Governance structure remains unclear with no formal DAO or voting mechanism announced.
