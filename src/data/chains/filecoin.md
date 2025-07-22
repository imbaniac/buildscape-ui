---
name: Filecoin
chainId: 314
nativeCurrency: FIL
color: "#0090FF"
darkColor: "#0068B9"
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
  - https://docs.filecoin.io/smart-contracts/fundamentals/basics/
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
  - name: Glif Explorer
    url: https://explorer.glif.io
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
      - https://faucet.calibration.fildev.network/
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
  - name: Filecoin
    url: https://github.com/filecoin-project
    description: Main Filecoin GitHub organization with core repositories
  - name: Lotus
    url: https://github.com/filecoin-project/lotus
    description: Reference implementation of the Filecoin protocol
  - name: FVM (Filecoin Virtual Machine)
    url: https://github.com/filecoin-project/FVM
    description: Filecoin Virtual Machine implementation
forums:
  - name: Filecoin Slack
    url: https://filecoin.io/slack
    description: Official Filecoin community Slack workspace
  - name: Filecoin Forum
    url: https://github.com/filecoin-project/community/discussions
    description: Community discussions and governance proposals
# SDKs and tools are inherited from evm-common.md
---

A Layer 1 blockchain designed for decentralized, verifiable storage. Targeted for long-term data integrity, archival apps, and trustless file hosting.

- **Consensus & Finality**  
  - Uses Expected Consensus: block producers are selected based on storage power, producing multiple blocks per epoch.  
  - Finality reduced from ~7.5 hours to a few minutes with Fast Finality (F3) via GossiPBFT overlay.  

- **Storage Proofs & Security**  
  - Enforces data storage via Proof-of-Replication and Proof-of-Spacetime.  
  - Storage providers must continuously prove they hold user data, or face penalties.  
  - Secure against up to ~20% adversarial storage power.  

- **Performance & Infra**  
  - FIL token transfers confirm in ~30 seconds.  
  - New storage deals require sealing (~1.5 hours), making the chain unsuitable for real-time use cases.  
  - Filecoin Virtual Machine supports smart contracts in WASM and early Solidity (FEVM).  
  - InterPlanetary Consensus (IPC) enables modular subnets with independent consensus.  

- **Use Case Fit**  
  - Designed for apps that need verifiable, censorship-resistant storage — e.g. decentralized backups, media hosting, proof-of-data for RWAs.  
  - Not built for high-frequency DeFi, fast trading, or low-latency apps.  

- **Trade-offs**  
  - Finality in minutes, not seconds  
  - Storage onboarding is slow and hardware-intensive  
  - Smart contract ecosystem is early and lacks mature infra  
  - Consensus is probabilistic, introducing timing variability  