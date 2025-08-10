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

A performance-focused EVM Layer 1 chain built on a DAG-based consensus model, forked from Fantom. Prioritizes fast block times and cheap transactions over decentralization or formal security guarantees.

- **Consensus & Finality**  
  - DAG-based Proof-of-Stake consensus achieves ~700ms block times.  
  - Validator set is permissioned and centralized — participation requires significant stake.  
  - No cryptographic proofs (ZK or fraud); finality is based on validator honesty.

- **Execution & Infra**  
  - EVM-compatible with standard Solidity support.  
  - Uses custom SonicVM and SonicDB for faster execution and state access.  
  - Native bridging exists but lacks formal guarantees — no canonical message passing or trustless bridges.

- **Performance**  
  - Targets high TPS, but current usage is modest (~5–10 TPS).  
  - Sub-cent fees and low latency under normal load.  
  - Block production can vary; edge cases under high load or network instability may impact consistency.

- **Use Cases**  
  - Viable for low-stakes, latency-sensitive apps (e.g. gaming, trading UIs) that need EVM support without high security requirements.

- **Trade-offs**  
  - Centralized validator set — limited censorship resistance and protocol neutrality.  
  - No Ethereum anchoring or proof system — security assumptions are weak.  
  - DAG consensus introduces added complexity and limited ecosystem familiarity.  
  - Tooling and ecosystem still maturing — limited support outside core team.