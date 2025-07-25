---
name: PulseChain
chainId: 369
nativeCurrency: PLS
color: "#6163F1"
darkColor: "#4243AF"
logo: pulsechain.svg
parentOrganization: PulseChain Foundation
website: https://pulsechain.com/
launchDate: 2023-05-13
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
  - https://hexpulse.info/docs/
blockscanners:
  - name: PulseScan
    url: https://ipfs.scan.pulsechain.com
    type: official
  - name: OtterScan
    url: https://otter.pulsechain.com
    type: alternative
testnets:
  - name: PulseChain Testnet v4
    chainId: 943
    url: https://scan.v4.testnet.pulsechain.com
    description: Test network for PulseChain development and smart contract testing
    faucets:
      - https://faucet.v4.testnet.pulsechain.com/
    rpcs:
      - https://rpc.v4.testnet.pulsechain.com
      - https://pulsechain-testnet-rpc.publicnode.com
      - https://rpc-testnet-pulsechain.g4mm4.io
rpcs:
  - name: Official RPC
    url: https://rpc.pulsechain.com
    type: public
  - name: PublicNode
    url: https://pulsechain-rpc.publicnode.com
    type: public
  - name: G4MM4
    url: https://rpc-pulsechain.g4mm4.io
    type: public
  - name: Evex Cloud
    url: https://evex.cloud/pulserpc
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/pulse/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: PulseChain
    url: https://gitlab.com/pulsechaincom
    description: PulseChain GitLab organization
forums:
  - name: PulseChain Telegram
    url: https://t.me/PulseChainCom
    description: Official PulseChain community channel
  - name: PulseChain Telegram Dev
    url: https://t.me/PulseDEV
    description: PulseChain dev community channel
# SDKs and tools are inherited from evm-common.md
---

An Ethereum fork with modified consensus and low-fee design, launched in 2023 by Richard Heart. Positioned as a high-throughput, low-cost alternative to Ethereum.

- **Consensus & Finality**  
  - Uses Proof-of-Staked-Authority with a limited validator set (~33 validators).  
  - Validators require large stakes and are not permissionlessly elected.  
  - Block time ~10s; finality is quick but relies entirely on validator honesty.

- **Infra & Execution**  
  - Full-state Ethereum fork — copied all balances, contracts, and NFTs at genesis.  
  - No rollup or proof system; no connection to Ethereum security.

- **Performance & Fees**  
  - Very low fees due to low network usage and no gas auction dynamics.  
  - Throughput is higher than Ethereum, but depends on validator performance and network activity.  
  - Lacks scalability techniques like rollups or blob-based DA.

- **Use Cases**  
  - Can be used for quick experimentation, forks of Ethereum dApps, or apps targeting low-fee environments without strict security needs.

- **Trade-offs**  
  - Validator set is small and permissioned — centralization and censorship risk.  
  - No fraud or validity proofs — chain security is weak.  
  - Governance is opaque and closely tied to founder.  
  - Ecosystem is small, with low adoption beyond speculative or founder-related projects.