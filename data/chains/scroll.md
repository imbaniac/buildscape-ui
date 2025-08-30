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

The "boring" L2 where everything works exactly like Ethereum but cheaper. No fancy features, no modified EVM, no account abstraction — just Ethereum with lower fees.

**Unique Position**
Scroll maintains perfect Ethereum compatibility (bytecode-level) while competitors like zkSync modified the EVM for extra features. This means all Ethereum tools, wallets, and contracts work unchanged but also no native account abstraction or paymasters. The safe choice for projects wanting zero surprises — if it works on Ethereum, it works on Scroll.

**Primary Use Cases**

- Migrating complex Ethereum projects without code changes
- DeFi protocols requiring exact Ethereum behavior
- NFT platforms maintaining OpenSea compatibility
- DAO tooling needing identical mainnet functionality
- Developer testing with guaranteed Ethereum parity

**Ecosystem Character**
Developer-focused ecosystem prioritizing reliability over innovation. Major protocols like Uniswap and Aave deployed unchanged, validating the compatibility promise. Community values technical correctness over marketing hype. Growing steadily through proven compatibility rather than incentive programs.

**Trade-offs**

- Centralized sequencer creates censorship and liveness risks
- Heavy prover infrastructure may bottleneck under load
- Slower innovation due to strict Ethereum compatibility
- Ecosystem maturity lags behind Arbitrum and Optimism
- No unique features beyond compatibility claim

## Technical Details

**Architecture**
zkEVM rollup with complete bytecode equivalence to Ethereum. Uses validity proofs to guarantee computational correctness before settlement. Publishes data to Ethereum via EIP-4844 blobs without custom availability layers. Proving infrastructure generates ZK proofs for all state transitions.

**Performance**
Proof generation adds minutes of latency after batch inclusion for final settlement. Throughput constrained by prover capacity and Ethereum calldata limits rather than artificial caps. Real-world performance limited by ZK proof generation speed, not network capacity.

**Security & Trust Model**
ZK validity proofs ensure all computations are correct before finalization. No fraud proof window — withdrawals final once proofs verify. Full data availability on Ethereum provides strong security guarantees. However, centralized sequencer remains single point of failure.

**Control & Governance**
Scroll team controls sequencer with vague decentralization promises. Proving and proposer decentralization planned but not implemented. Protocol upgrades managed centrally without community input. Development prioritizes technical goals over governance distribution.
