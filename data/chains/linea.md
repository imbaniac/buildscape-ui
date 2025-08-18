---
name: Linea
chainId: 59144
nativeCurrency: ETH
color: "#61dfff"
logo: linea.svg
parentOrganization: ConsenSys
website: https://linea.build
launchDate: 2023-07-11
maxBlockSize: 30
technology:
  type: zk Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: zkEVM
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
  - https://docs.linea.build/
blockscanners:
  - name: Lineascan
    url: https://lineascan.build
    type: official
  - name: Blockscout
    url: https://explorer.linea.build
    type: alternative
testnets:
  - name: Linea Sepolia
    chainId: 59141
    url: https://sepolia.lineascan.build
    description: Linea's Sepolia testnet for deploying and testing zkEVM applications.
    faucets:
      - https://www.alchemy.com/faucets/linea-sepolia
      - https://faucet.quicknode.com/linea/sepolia
      - https://getblock.io/faucet/linea-sepolia/
    rpcs:
      - https://rpc.sepolia.linea.build
      - https://linea-sepolia.drpc.org
      - https://linea-sepolia-rpc.publicnode.com
rpcs:
  - name: Linea Official
    url: https://rpc.linea.build
    type: public
  - name: PublicNode
    url: https://linea-rpc.publicnode.com
    type: public
  - name: Drpc
    url: https://linea.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/linea
    type: public
  - name: Decubate
    url: https://linea.decubate.com
    type: public
  - name: Histori
    url: https://node.histori.xyz/linea-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
  - name: Owlracle
    url: https://rpc.owlracle.info/linea/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: Linea Monorepo
    url: https://github.com/Consensys/linea-monorepo
    description: Main repository for Linea zkEVM implementation
  - name: Github Organization
    url: https://github.com/Consensys
forums:
  - name: Linea Discord
    url: https://discord.com/invite/linea
    description: Official Discord community for developers and users
  - name: Linea Community Forum
    url: https://community.linea.build/
    description: Official community forum for discussions and governance
# SDKs and tools are inherited from evm-common.md
---

ConsenSys's zkEVM with built-in MetaMask integration — the corporate answer to zkSync and Scroll. Unlike community-driven chains, Linea leverages ConsenSys's enterprise connections (Mastercard, JPMorgan) and direct access to MetaMask's 100M+ users. If you trust ConsenSys infrastructure, this is your zkEVM.

**Best for:** Projects wanting MetaMask distribution, enterprise DeFi, ConsenSys ecosystem tools (Truffle, Infura).

**Technical:** A fully EVM-equivalent ZK-rollup developed by ConsenSys, focused on Ethereum compatibility and zk-proven execution.

- **Security & Data Availability**
  - Validity proofs verify all EVM operations before finalization.
  - Uses Ethereum calldata for DA — no custom DA layer or fallback.
  - Settlement and availability fully rely on Ethereum L1.

- **Infra & Execution**
  - Supports advanced RPCs like `eth_sendBundle` for MEV mitigation.
  - Open-state tooling enables permissionless access to sequencer state.

- **Performance**
  - Block times ~2s; proof generation is near real-time.
  - Scales with prover capacity; fees remain low unless L1 gas spikes.
  - No known artificial throughput caps — performance depends on Ethereum calldata limits.

- **Use Cases**
  - **MetaMask integration**: Default network option, Portfolio dApp for cross-chain swaps
  - **Enterprise connections**: Backed by Mastercard, Visa, JPMorgan relationships
  - **ConsenSys stack**: Native Truffle, Infura, Diligence integration
  - **Growing DeFi**: Etherex DEX, Surge Program with LXP rewards

- **Trade-offs**
  - ConsenSys controls everything — sequencer, upgrades, prover (open-sourcing "planned" for 2025)
  - Corporate chain — some crypto natives distrust ConsenSys's centralized approach
  - Stage 0 maturity — far from decentralized despite zkEVM claims
  - Competing with Scroll/zkSync without clear technical differentiation
