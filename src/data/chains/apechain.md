---
name: ApeChain
color: "#0054FA"
darkColor: "#0040C0"
chainId: 33139
nativeCurrency: APE
logo: apechain.svg
parentOrganization: Ape Foundation
website: https://apechain.com
launchDate: 2024-10-20
maxBlockSize: 30
techStack: Arbitrum Orbit
technology:
  type: Arbitrum Orbit
  settlementLayer: Ethereum
  isL3: true
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
blockscanners:
  - name: ApeScan
    url: https://apescan.io
    type: official
testnets:
  - name: Curtis
    chainId: 33111
    url: https://explorer.curtis.apechain.com
    description: ApeChain testnet for deploying and testing applications before mainnet launch.
    faucets: 
      - https://curtis.hub.caldera.xyz
    rpcs:
      - https://rpc.curtis.apechain.com
      - https://apechain-curtis.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.apechain.com
    type: official
  - name: dRPC
    url: https://apechain.drpc.org
    type: public
  - name: Histori
    url: https://node.histori.xyz/apechain-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
docs:
  - name: ApeChain Documentation
    url: https://docs.apechain.com
  - name: Developer Hub
    url: https://apechain.hub.caldera.xyz
sourceCode:
forums:
sdks:
tools:
# Additional SDKs and tools are inherited from evm-common.md
---

A purpose-built L3 on Arbitrum Orbit for the ApeCoin ecosystem (Yuga Labs, Otherside, NFT/gaming projects).

- **Security**: Inherits Ethereum security via Arbitrum One → Orbit. Depends on DAC for data availability and centralized sequencer.  
- **Token Utility**: $APE is the native gas token—used for tx fees and integrated into DAO governance.  
- **Infra**: Runs as an Orbit chain with 250ms block time, but real throughput and latency depend on sequencer performance and app-level congestion.  
- **Ecosystem**: Tailored for Yuga-related apps (Otherside, Magic Eden) and projects using $APE.  
- **Governance**: Controlled by a multisig with ApeCoin DAO-selected Security Council (no onchain upgrade delay).  
- **Trade-offs**:  
  - Centralized trust assumptions (sequencer, DAC, multisig upgrades)  
  - Ecosystem is niche and tied closely to Yuga IP  
  - L3 setup adds another dependency layer (on Arbitrum infra)  