---
name: Taiko Alethia
chainId: 167000
nativeCurrency: ETH
color: "#E81899"
logo: taiko.svg
parentOrganization: Taiko Labs
website: https://taiko.xyz
launchDate: 2024-05-27
maxBlockSize: 30
technology:
  type: ZK Rollup
  layer: L2
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Ethereum
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

The L2 that can't be shut down — Ethereum itself runs it, not some company's servers. If other L2s are like hosted websites, Taiko is like BitTorrent.

**Unique Position**
Taiko has no central operator that can censor transactions or go offline. Ethereum's own network handles everything, so Taiko keeps running as long as Ethereum exists. Perfect Ethereum compatibility means all tools and contracts work unchanged.

**Primary Use Cases**

- Censorship-resistant applications requiring unstoppable operation
- DeFi protocols avoiding centralized sequencer risk
- Projects needing exact Ethereum behavior unchanged
- Gaming and trading apps using preconfirmations for speed
- Applications prioritizing decentralization over cost

**Ecosystem Character**
Decentralization-first community valuing permissionless operation over growth metrics. DeFi protocols like Ritsu and Meridian choose Taiko for sequencer resistance. Smaller ecosystem accepts trade-offs for true decentralization. Developer culture prioritizes correctness and censorship resistance over performance.

**Trade-offs**

- Smaller ecosystem with less liquidity than established L2s
- Based design limits MEV extraction compared to centralized sequencers
- Type-1 zkEVM slower to prove than optimized custom VMs
- Proving infrastructure still evolving toward full decentralization
- Higher costs than centralized L2s due to decentralized operation

## Technical Details

**Architecture**
Type-1 zkEVM with complete bytecode equivalence to Ethereum including opcodes and gas model. Based rollup design allows any Ethereum validator to propose blocks without permission. No separate consensus layer — inherits Ethereum's consensus directly. Preconfirmation system provides fast UX while maintaining decentralization.

**Performance**
Preconfirmations deliver approximately 2-second transaction acknowledgment before final settlement. Final confirmation follows Ethereum L1 cadence for maximum security. No artificial throughput limits but constrained by Ethereum blob space and proof generation capacity.

**Security & Trust Model**
Every block validated through ZK proofs with no fraud windows or optimistic assumptions. Based sequencing ensures no single entity controls transaction ordering. Posts all data to Ethereum via EIP-4844 blobs maintaining full availability. Permissionless proving allows anyone to validate state transitions.

**Control & Governance**
No centralized sequencer — Ethereum validators collectively sequence transactions. Permissionless block proposing and proving prevents gatekeeping. Taiko Labs provides development but cannot control network operation. Most decentralized L2 architecture currently operational.
