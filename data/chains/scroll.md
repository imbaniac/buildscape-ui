---
name: Scroll
chainId: 534352
nativeCurrency: ETH
color: "#edcca2"
logo: scroll.svg
parentOrganization:
website: https://scroll.io
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
  - https://docs.scroll.io
blockscanners:
  - name: Scrollscan
    url: https://scrollscan.com
    type: official
testnets:
  - name: Scroll Sepolia
    chainId: 534351
    url: https://sepolia.scrollscan.com
    description: Scroll testnet on Ethereum Sepolia for testing smart contracts and dApps on the zkEVM.
    faucets:
      - https://faucet.scroll.io
    rpcs:
      - https://sepolia-rpc.scroll.io
      - https://scroll-sepolia.drpc.org
      - https://rpc.ankr.com/scroll_sepolia_testnet
      - https://scroll-sepolia-rpc.publicnode.com
rpcs:
  - name: Scroll RPC
    url: https://rpc.scroll.io
    type: public
  - name: 1RPC
    url: https://1rpc.io/scroll
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/scroll
    type: public
  - name: dRPC
    url: https://scroll.drpc.org
    type: public
  - name: Blast
    url: https://scroll-mainnet.public.blastapi.io
    type: public
  - name: PublicNode
    url: https://scroll-rpc.publicnode.com
    type: public
  - name: OnFinality
    url: https://scroll.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/scroll/mainnet/public
    type: public
  - name: Unifra
    url: https://scroll-mainnet-public.unifra.io
    type: public
  - name: Chainstack
    url: https://scroll-mainnet.chainstacklabs.com
    type: public
  - name: IceCream Swap
    url: https://rpc-scroll.icecreamswap.com
    type: public
sourceCode:
  - name: Github Organzation
    url: https://github.com/scroll-tech
    description: Main Scroll GitHub organization with zkEVM repositories
forums:
  - name: Scroll Discord
    url: https://discord.com/invite/scroll
    description: Community Discord for discussions and support
# SDKs and tools are inherited from evm-common.md
---

Ethereum but cheaper and faster, using math proofs (zero-knowledge) to guarantee security.

**Key Difference:** Scroll prioritizes being identical to Ethereum — your existing code works without changes, unlike competitors that modified things for speed.

**Best for:** Moving existing Ethereum projects without modifications, DeFi apps that need Ethereum's exact behavior.

**Technical:** A zkEVM rollup with bytecode-level EVM equivalence and ZK-based finality, built for compatibility with existing Ethereum contracts.

- **Use Cases**
  - **DeFi migrations**: Uniswap, Aave, and other majors deployed without code changes
  - **NFT platforms**: Lower minting costs while keeping OpenSea compatibility
  - **DAO tooling**: Snapshot, Gnosis Safe work identically to mainnet
  - **Developer testing**: Same behavior as Ethereum, cheaper to experiment

- **Security & Data Availability**
  - Uses ZK validity proofs to confirm all state transitions before finalization.
  - Publishes calldata to Ethereum using EIP‑4844 blobs; no custom DA layer.
  - Withdrawals are finalized once proofs are verified — no fraud windows.

- **Infra & Execution**
  - Fully bytecode-equivalent — same opcodes and gas costs as Ethereum.
  - Centralized sequencer; decentralized proving and proposer layers are planned but not yet live.
  - Node stack includes dedicated proving infrastructure.

- **Performance**
  - Handles high daily tx volumes (~500k/day).
  - Proof submission adds latency — typically a few minutes after batch inclusion.
  - Throughput depends on prover capacity and L1 calldata constraints.

- **Trade-offs**
  - Sequencer is not decentralized — risk of transaction censorship or delays.
  - Prover infra is heavy and may bottleneck under load.
  - Finality is fast, but depends on timely proof generation and posting.
  - Ecosystem still early — infra and decentralization not yet fully mature.
