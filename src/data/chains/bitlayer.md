---
name: Bitlayer
chainId: 200901
nativeCurrency: BTC
color: "#E46F1B"
darkColor: "#B65713"
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
  - name: Bitlayer Documentation
    url: https://docs.bitlayer.org/
    description: Official documentation and developer resources
# SDKs and tools are inherited from evm-common.md
---

A Bitcoin-aligned Layer 2 that uses a PoS-based sequencer and posts rollup state to Bitcoin via BitVM-like fraud proofs.

- **Security**:  
  - PoS sequencers bonded with BTC and selected from validators staking BTR.  
  - Rollup periodically posts state roots to Bitcoin; challenges rely on a one-honest-participant assumption.  
- **Finality**:  
  - Fast soft-finality within the PoS layer (not trustless).  
  - Bitcoin-level finality only after ~7-day challenge window.  
- **BTC Support**:  
  - Native BTC is bridged and used as gas. Claims 1:1 backing, but bridging depends on external trust assumptions.  
- **Infra**:  
  - Modular architecture combining PoS execution, a rollup bridge, and BitVM-style challenge mechanics.  
- **Trade-offs**:  
  - Security depends on off-chain watchers and PoS validator honesty  
  - PoS sequencer introduces centralization risk (collateral, rotation, governance)  
  - Fraud proof mechanism (BitVM-based) is experimental and not yet proven at scale  
  - Bridged BTC custody model introduces additional trust assumptions  