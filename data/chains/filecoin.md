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

The blockchain that actually stores data, not just pointers. While every chain claims "decentralized storage," Filecoin enforces it cryptographically — storage providers must prove they hold your data every 24 hours or lose collateral. Now with FVM smart contracts, it's becoming DeFi for data storage.

**Best for:** Permanent storage deals, DataDAOs, archival systems, AI training data, NFT metadata that won't disappear.

**Technical:** A Layer 1 blockchain designed for decentralized, verifiable storage. Targeted for long-term data integrity, archival apps, and trustless file hosting.

- **Consensus & Finality**
  - Uses Expected Consensus: block producers are selected based on storage power, producing multiple blocks per epoch.
  - Finality reduced from ~7.5 hours to a few minutes with Fast Finality (F3) via GossiPBFT overlay.

- **Storage Proofs & Security**
  - Proof-of-Replication and Proof-of-Spacetime enforce actual data storage.
  - Providers prove data possession every 24 hours or lose FIL collateral.
  - Secure against up to ~20% adversarial storage power.

- **Performance & Infra**
  - FIL transfers confirm in ~30 seconds, storage deals seal in ~1.5 hours.
  - FVM launched 2023: 5,000+ contracts deployed, 3.2M+ transactions.
  - Supports WASM and Solidity smart contracts for storage automation.
  - IPC enables modular subnets with independent consensus.

- **Use Cases**
  - **Storage marketplace**: 1,300 PiB stored across 38M active deals, providers prove data possession daily
  - **FVM DeFi**: GLIF ($144M), stFIL staking, USDFC FIL-backed stablecoin
  - **DataDAOs**: Automated storage deals, perpetual storage via smart contracts
  - **AI/ML data**: Aethir, KiteAI using for verifiable training data storage
  - **Cross-chain storage**: Axelar integration lets 32 chains pay for Filecoin storage

- **Trade-offs**
  - Finality in minutes, not seconds
  - Storage onboarding is slow and hardware-intensive
  - Smart contract ecosystem is early and lacks mature infra
  - Consensus is probabilistic, introducing timing variability
