---
name: Gnosis
chainId: 100
nativeCurrency: xDAI
color: "#3e6957"
logo: gnosis.svg
parentOrganization: Gnosis
website: https://www.gnosischain.com
launchDate: 2021-12-01
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
  - https://docs.gnosischain.com
blockscanners:
  - name: Gnosisscan
    url: https://gnosisscan.io
    type: official
  - name: Blockscout
    url: https://gnosis.blockscout.com
    type: alternative
testnets:
  - name: Chiado
    chainId: 10200
    url: https://gnosis-chiado.blockscout.com
    description: Gnosis Chain testnet for dApp and smart contract testing with fast confirmations.
    faucets:
      - https://faucet.chiadochain.net/
    rpcs:
      - https://rpc.chiadochain.net
      - https://gnosis-chiado-rpc.publicnode.com
      - https://gnosis-chiado.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.gnosischain.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/gnosis
    type: public
  - name: PublicNode
    url: https://gnosis-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://gnosis.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/gnosis
    type: public
  - name: OnFinality
    url: https://gnosis.api.onfinality.io/public
    type: public
  - name: POKT Network
    url: https://gnosis-pokt.nodies.app
    type: public
  - name: BlastAPI
    url: https://gnosis-mainnet.public.blastapi.io
    type: public
  - name: Gateway.fm
    url: https://rpc.gnosis.gateway.fm
    type: private
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/gnosis/mainnet/public
    type: public
  - name: Blockscout Archive
    url: https://xdai-archive.blockscout.com
    type: public
  - name: Tatum
    url: https://gno-mainnet.gateway.tatum.io
    type: private
  - name: 0xRPC
    url: https://0xrpc.io/gno
    type: public
sourceCode:
  - name: Gnosis Chain
    url: https://github.com/gnosischain
    description: Main Gnosis Chain GitHub organization
forums:
  - name: Gnosis Forum
    url: https://forum.gnosis.io/
    description: Community forum for governance discussions and technical topics
  - name: Gnosis Discord
    url: https://discord.com/invite/gnosis
    description: Official Discord server for developers and community
# SDKs and tools are inherited from evm-common.md
---

The DAO infrastructure chain where Gnosis Safe was born and gas costs a fraction of a penny. First blockchain to use stable dollars (xDAI) as gas, making costs predictable.

**Unique Position**
Gnosis implemented encrypted transactions by default through Shutter Protocol — transactions are encrypted until after ordering, making front-running and MEV extraction impossible. The only chain where fairness is enforced cryptographically rather than economically. Built by and for DAO infrastructure with stable, predictable costs that enable governance and coordination tools.

**Primary Use Cases**

- DAO tooling and governance systems requiring cheap, reliable execution
- Multisig operations and treasury management
- Fair DEX trading without MEV extraction
- POAP and low-value NFT distribution
- Applications needing stable sub-cent transaction costs

**Ecosystem Character**
DAO-centric ecosystem where infrastructure trumps speculation. Home to Gnosis Safe development, DAO treasuries, and coordination tools. Community values stability and fairness over performance or growth. Real adoption in narrow but critical use cases like POAPs and DAO operations rather than broad consumer appeal.

**Trade-offs**

- Six-minute finality unsuitable for real-time applications
- Pure sidechain with no Ethereum security inheritance
- Limited throughput peaks around 80 TPS
- Ecosystem focused on infrastructure rather than consumer apps
- Slower innovation pace prioritizing stability

## Technical Details

**Architecture**
Ethereum sidechain using beacon chain PoS consensus with approximately 100,000 validators. Full EVM compatibility with xDAI as native gas token pegged to USD. Shutter Protocol encrypts transaction contents using threshold encryption until block production.

**Performance**
Typical throughput around 5 TPS with peaks up to 80 TPS during high activity. Five-second block times but six-minute finality due to consensus design. Gas costs remain stable at $0.001-0.01 regardless of network activity.

**Security & Trust Model**
Independent security model as sidechain without Ethereum guarantees. Validators stake GNO with slashing for misbehavior. Shutter Protocol prevents MEV through encryption but requires threshold of Shutter nodes (currently 4% of validators) to remain honest. Bridge security depends on validator honesty without cryptographic guarantees.

**Control & Governance**
GnosisDAO coordinates protocol development and validator operations but lacks direct control. Large validator set provides decentralization though governance remains somewhat centralized. No immediate upgrade capability but also no formal decentralization roadmap.
