---
name: Taiko Alethia
chainId: 167000
nativeCurrency: ETH
color: "#E81899"
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

A zkEVM that lets Ethereum validators sequence your transactions directly — no middleman sequencer collecting fees or deciding transaction order. Every Ethereum validator can propose Taiko blocks, making censorship nearly impossible.
The key difference: "Based rollup" design where Ethereum L1 handles sequencing, making it the most decentralized L2 architecture. Preconfirmations solve the UX problem with 2-second transaction times.

**Best for:** Projects requiring unstoppable operation, DeFi protocols avoiding sequencer risk, developers wanting exact Ethereum behavior without modifications.

**Technical:** Type-1 zkEVM with based sequencing, permissionless proving, preconfirmations for fast UX, no separate consensus layer.

- **Security & Data Availability**
  - Every block validated via ZK proofs; no fraud windows or optimistic fallback.
  - Based rollup design: any Ethereum validator can propose blocks, ensuring open participation.
  - Posts calldata directly to Ethereum using blob transactions (EIP‑4844).

- **Infra & Execution**
  - Bytecode-equivalent with Ethereum — supports full opcode set, gas model, and state hashing.
  - Permissionless block proposing and proving — anyone can participate.
  - Preconfirmation system delivers fast transaction times while staying decentralized.

- **Performance**
  - Preconfirmations provide ~2 second transaction acknowledgment.
  - Final settlement follows Ethereum L1 cadence for maximum security.
  - No artificial TPS cap, constrained by Ethereum blob space and proof generation.

- **Use Cases**
  - **DeFi infrastructure**: Ritsu DEX with Rhythm AMM, Meridian Lend, Avalon Finance
  - **Bitcoin on Ethereum**: SolvBTC bringing native Bitcoin liquidity to L2
  - **Censorship-resistant apps**: Leverage based sequencing for unstoppable operation
  - **Gaming and high-frequency trading**: Preconfirmations enable responsive UX

- **Trade-offs**
  - Smaller ecosystem vs established L2s — less liquidity and fewer integrations.
  - Based design limits MEV extraction opportunities compared to centralized sequencers.
  - Type-1 zkEVM prioritizes compatibility over proof speed — slower than custom VMs.
  - Proving infrastructure still bootstrapping toward full decentralization.
