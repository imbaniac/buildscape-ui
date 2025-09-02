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
  type: ZK Rollup
  layer: L2
  vm:
    type: zkEVM
    evmCompatible: true
  settlementLayer: Ethereum
  stack: Linea zkEVM
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

The L2 built into MetaMask by default, backed by ConsenSys (the company behind MetaMask, Infura, and half of Ethereum's infrastructure). Where banks experiment with DeFi.

**Unique Position**
Linea appears as a default network in MetaMask's 100M wallets, giving it instant distribution most L2s can't buy. ConsenSys's enterprise clients (Mastercard, Visa, JPMorgan) use it for their blockchain experiments. Comes with the entire ConsenSys toolkit built-in, though that also means ConsenSys controls everything.

**Primary Use Cases**

- Projects seeking MetaMask's massive user distribution
- Enterprise DeFi requiring institutional credibility
- Applications leveraging ConsenSys development tools
- Cross-chain protocols using MetaMask Portfolio integration
- MEV-sensitive applications using advanced bundle RPCs

**Ecosystem Character**
Corporate-friendly ecosystem attracting both crypto natives and traditional finance experiments. Surge Program with LXP rewards bootstrapping early adoption. Developer community split between those embracing ConsenSys tools and those wary of centralization. More institutional than grassroots compared to other zkEVMs.

**Trade-offs**

- ConsenSys controls sequencer, prover, and upgrades entirely
- Stage 0 maturity despite zkEVM security claims
- Corporate reputation alienates some crypto natives
- No clear technical differentiation from Scroll or zkSync
- Open-sourcing promised for 2025 but not guaranteed

## Technical Details

**Architecture**
Fully EVM-equivalent ZK rollup using validity proofs for all operations. Pure Ethereum data availability without custom layers or fallbacks. Advanced RPC support including eth_sendBundle for MEV protection and open-state tooling for sequencer transparency.

**Performance**
Two-second block times with near real-time proof generation. Throughput scales with prover capacity rather than artificial limits. Fees track Ethereum L1 gas prices through calldata posting. No congestion issues due to early-stage adoption.

**Security & Trust Model**
Validity proofs ensure computational integrity before Ethereum settlement. Full data availability on Ethereum L1 provides strong security guarantees. However, centralized sequencer and prover create single points of failure. No fraud proof fallback if ZK system fails.

**Control & Governance**
ConsenSys maintains complete control over all protocol components. No decentralized governance or community input mechanisms. Upgrade authority centralized with vague decentralization roadmap. Enterprise partnerships influence development priorities over community needs.
