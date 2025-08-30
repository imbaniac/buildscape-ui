---
name: Filecoin
chainId: 314
nativeCurrency: FIL
color: "#0090FF"
logo: filecoin.svg
parentOrganization: Protocol Labs
website: https://filecoin.io
launchDate: 2020-10-15
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
docs:
  - https://docs.filecoin.io/
blockscanners:
  - name: Filfox
    url: https://filfox.info/en
    type: official
  - name: Filscan
    url: https://filscan.io
    type: alternative
  - name: Beryx
    url: https://beryx.zondax.ch
    type: alternative
  - name: Filscout
    url: https://filscout.io/en
    type: alternative
testnets:
  - name: Calibration
    chainId: 314159
    url: https://calibration.filfox.info/en
    description: Primary Filecoin testnet for smart contract and dApp testing with real network conditions.
    faucets:
      - https://faucet.calibnet.chainsafe-fil.io/
    rpcs:
      - https://api.calibration.node.glif.io/rpc/v1
      - https://filecoin-calibration.chainup.net/rpc/v1
      - https://rpc.ankr.com/filecoin_testnet
      - https://filecoin-calibration.chainstacklabs.com/rpc/v1
      - https://calibration.filfox.info/rpc/v1
      - https://filecoin-calibration.drpc.org
rpcs:
  - name: Glif
    url: https://api.node.glif.io
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/filecoin
    type: public
  - name: Chainup
    url: https://filecoin.chainup.net/rpc/v1
    type: public
  - name: dRPC
    url: https://filecoin.drpc.org
    type: public
  - name: Lava Network
    url: https://filecoin.lava.build
    type: public
  - name: Chainstacklabs
    url: https://filecoin-mainnet.chainstacklabs.com/rpc/v1
    type: public
  - name: Filfox
    url: https://filfox.info/rpc/v1
    type: public
  - name: FilUtils
    url: https://node.filutils.com/rpc/v1
    type: public
  - name: Chain.love
    url: https://api.chain.love/rpc/v1
    type: public
  - name: Infura (SFT Project)
    url: https://infura.sftproject.io/filecoin/rpc/v1
    type: private
sourceCode:
  - name: Filecoin Organization
    url: https://github.com/filecoin-project
    description: Main Filecoin GitHub organization with core repositories
  - name: Lotus — Filecoin Node
    url: https://github.com/filecoin-project/lotus
    description: Reference implementation of the Filecoin protocol
forums:
  - name: Filecoin Slack
    url: https://filecoin.io/slack
    description: Official Filecoin community Slack workspace
  - name: Filecoin Forum
    url: https://github.com/filecoin-project/community/discussions
    description: Community discussions and governance proposals
# SDKs and tools are inherited from evm-common.md
---

The blockchain that actually stores data, not just pointers. While every chain claims "decentralized storage," Filecoin enforces it cryptographically — storage providers must prove they hold your data every 24 hours or lose collateral.

**Unique Position**
Filecoin makes storage the consensus mechanism itself — miners earn FIL by proving they store real data, not by solving useless puzzles. The first useful proof-of-work where computational resources preserve humanity's data instead of burning electricity. Now with FVM smart contracts, it's becoming DeFi for data storage — lending against stored data, automated perpetual storage deals, and storage derivatives.

**Primary Use Cases**

- Permanent archival systems that can't be deleted or censored
- AI/ML training data requiring verifiable provenance
- DataDAOs managing collective storage resources
- NFT metadata that won't disappear when startups fail
- Cross-chain data availability for other blockchains

**Ecosystem Character**
Dominated by storage providers running industrial operations with petabytes of capacity. Developer ecosystem split between storage infrastructure builders and FVM DeFi experimenters. Community values data permanence over financial speculation. Strong presence of archival projects, scientific data repositories, and Web3 infrastructure providers.

**Trade-offs**

- Storage onboarding takes hours and requires specialized hardware
- Finality in minutes, not seconds — unsuitable for high-frequency operations
- Smart contract ecosystem nascent compared to EVM chains
- Consensus is probabilistic with timing variability
- Retrieval isn't guaranteed — storage providers can go offline

## Technical Details

**Architecture**
Layer 1 using Expected Consensus where block producers are selected based on storage power. Proof-of-Replication and Proof-of-Spacetime enforce actual data storage. FVM enables WASM and Solidity smart contracts for programmable storage.

**Performance**
FIL transfers confirm in roughly 30 seconds, storage deals seal in 1-2 hours. Fast Finality (F3) reduced finality from hours to minutes using GossiPBFT overlay. Storage capacity measured in exabytes with millions of active deals.

**Security & Trust Model**
Storage providers must prove data possession every 24 hours or lose FIL collateral. Secure against up to 20% adversarial storage power. Cryptographic proofs ensure data integrity without trusting individual providers. Economic incentives align with long-term data preservation.

**Control & Governance**
Protocol Labs maintains significant influence but governance increasingly decentralized through FIP process. Storage provider community has strong voice due to hardware investments. No single entity controls data storage or retrieval.
