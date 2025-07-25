---
name: Taiko Alethia
chainId: 167000
nativeCurrency: ETH
color: "#E81899"
darkColor: "#AE1273"
logo: taiko.svg
parentOrganization: Taiko Labs
website: https://taiko.xyz
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
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.taiko.xyz/
blockscanners:
  - name: Taikoscan
    url: https://taikoscan.io
    type: official
  - name: Taikoexplorer
    url: https://taikoexplorer.com
    type: alternative
testnets:
  - name: Hekla
    chainId: 167009
    url: https://hekla.taikoexplorer.com
    description: Taiko testnet for developers to test dApps and smart contracts before mainnet deployment.
    faucets: []
    rpcs:
      - https://rpc.hekla.taiko.xyz
      - https://taiko-hekla.drpc.org
      - https://taiko-hekla-rpc.publicnode.com
rpcs:
  - name: Taiko RPC
    url: https://rpc.taiko.xyz
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/taiko
    type: public
  - name: Taiko Tools
    url: https://rpc.taiko.tools
    type: public
  - name: dRPC
    url: https://taiko.drpc.org
    type: public
  - name: 4everland
    url: https://taiko-mainnet.4everland.org/v1/37fa9972c1b1cd5fab542c7bdd4cde2f
    type: public
  - name: Tenderly
    url: https://taiko-mainnet.gateway.tenderly.co
    type: private
  - name: Stakely
    url: https://taiko-json-rpc.stakely.io
    type: public
  - name: PublicNode
    url: https://taiko-rpc.publicnode.com
    type: public
sourceCode:
  - name: Taiko Monorepo
    url: https://github.com/taikoxyz/taiko-mono
    description: Main Taiko protocol repository containing core contracts and infrastructure
  - name: Github Organization
    url: https://github.com/taikoxyz
forums:
  - name: Taiko Forum
    url: https://community.taiko.xyz/
    description: Official Taiko community forum for discussions and governance
# SDKs and tools are inherited from evm-common.md
---

A Type-1 zkEVM rollup on Ethereum built around the “based rollup” model—designed to be permissionless and fully EVM-equivalent.

- **Security & Sequencing**  
  - Every block is validated via ZK proofs; no fraud windows or optimistic fallback.  
  - Based rollup design: any participant can propose and prove blocks, aiming for open participation.  
  - Finality occurs once proofs are verified on Ethereum.

- **Data Availability**  
  - Posts calldata directly to Ethereum using blob transactions (EIP‑4844).  
  - Fully inherits Ethereum’s DA guarantees — no reliance on off-chain data.

- **Infra & Execution**  
  - Bytecode-equivalent with Ethereum — supports full opcode set, gas model, and state hashing.  
  - Node roles include proposers and provers.  
  - Prover/sequencer roles are permissionless by design, but current rollout is partially centralized.

- **Performance**  
  - Throughput and latency depend on prover efficiency and blob availability.  
  - No artificial TPS cap, but constrained by Ethereum L1 bandwidth and proof speed.  
  - Block time is tied to Ethereum L1 (~12–20s), limiting UX flexibility.

- **Use Cases**  
  - Best for Ethereum-native dApps requiring exact EVM behavior, fast finality with ZK guarantees, and censorship resistance without trusting centralized sequencers.

- **Trade-offs**  
  - Decentralization of proposers and provers is not yet fully live.  
  - Finality lags behind UX due to ZK proof generation and L1 verification delay.  
  - Based rollup model limits block frequency to L1 cadence, which may reduce flexibility and MEV options.  
  - Still early in ecosystem maturity — infra, tooling, and ecosystem support are evolving.