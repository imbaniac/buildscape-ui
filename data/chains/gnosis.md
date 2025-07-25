---
name: Gnosis
chainId: 100
nativeCurrency: xDAI
color: "#3e6957"
darkColor: "#2F5042"
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


An Ethereum sidechain with full EVM compatibility, Proof-of-Stake consensus, and low gas costs. Prioritizes accessibility and stability over throughput or trust-minimization.

- **Consensus & Finality**  
  - Uses its own Beacon-style PoS validator set (~100k validators).  
  - ~5s block times, finality after ~6.5 minutes.  
  - No fraud or validity proofs — not a rollup. Finality relies entirely on honest validator majority.

- **Performance**  
  - ~5 TPS typical, peaks around 80 TPS.  
  - Finality slower than L2s.  
  - Gas fees consistently low (~$0.001–0.01 per tx).

- **Use Cases in Practice**  
  - Gnosis Safe infra, DAO tools, multisigs, stablecoin treasuries.  
  - Long-lived production contracts that benefit from cheap gas and stable execution.  
  - Bridges, token registries, dashboards with moderate activity.  

- **When to Use It**  
  - You want low-cost EVM execution and don’t need Ethereum-level security or fast finality.  
  - You’re deploying DAO infra, governance systems, or tools that interact with Gnosis Safe.  
  - You need a stable, cheap environment for contracts that don’t require high throughput or deep composability.

- **Trade-offs**  
  - Finality is slow (~6 min) and not anchored to Ethereum.  
  - Not suitable for high-frequency apps (games, DeFi protocols, real-time UX).  
  - Validator set is large but governance is still GnosisDAO-coordinated.  
  - No fraud/fault proofs or trustless bridge guarantees.