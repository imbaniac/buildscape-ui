---
name: Lisk
chainId: 1135
nativeCurrency: ETH
color: "#87672d"
logo: lisk.svg
parentOrganization: Lisk
website: https://lisk.com
launchDate: 2024-05-23
maxBlockSize: 30
technology:
  isL2: true
  isEVM: true
  rollupType: "Optimistic"
  rollupDA: "Ethereum"
  parentChain: "Ethereum"
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.lisk.com/
blockscanners:
  - name: Blockscout
    url: https://blockscout.lisk.com
    type: official
testnets:
  - name: Lisk Sepolia
    chainId: 4202
    url: https://sepolia-blockscout.lisk.com
    description: Lisk testnet on Sepolia for dApp and smart contract testing.
    faucets:
      - https://app.optimism.io/faucet
    rpcs:
      - https://rpc.sepolia-api.lisk.com
      - https://node.histori.xyz/lisk-sepolia/8ry9f6t9dct1se2hlagxnd9n2a
rpcs:
  - name: Lisk Official RPC
    url: https://rpc.api.lisk.com
    type: public
  - name: dRPC
    url: https://lisk.drpc.org
    type: public
  - name: Tenderly
    url: https://lisk.gateway.tenderly.co
    type: public
  - name: Histori
    url: https://node.histori.xyz/lisk-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: GitHub Organization
    url: https://github.com/LiskHQ
    description: Lisk official GitHub organization
forums:
  - name: Lisk Discord
    url: https://discord.com/invite/lisk
    description: Lisk community Discord server
# SDKs and tools are inherited from evm-common.md
---

Former JavaScript blockchain that pivoted to L2, now targeting Africa and Southeast Asia where sub-cent fees enable real financial inclusion. The L2 that went where others wouldn't.

**Unique Position**
While other L2s compete for Silicon Valley users, Lisk focuses on emerging markets where low fees genuinely matter for daily transactions. Transitioned from failed JavaScript L1 to OP Stack L2, bringing experience and treasury to underserved regions. The only L2 with dedicated African Blockchain Incubation Hub and local partnerships.

**Primary Use Cases**

- Financial inclusion applications for unbanked populations
- RWA tokenization through Backed and Obligate partnerships
- Remittance platforms requiring consistent sub-cent fees
- Local payment solutions in Africa and Southeast Asia
- Developers seeking grants for emerging market solutions

**Ecosystem Character**
Mission-driven ecosystem focused on real-world utility over speculation. Builder community concentrated in target regions rather than crypto hubs. Grant program dedicates 95% of 3.65M LSK directly to developers. Early-stage but purposeful growth through local partnerships and education initiatives.

**Trade-offs**

- Still rebuilding ecosystem after complete L1-to-L2 pivot
- Emerging market focus means slower initial growth metrics
- Competing with established OP Stack chains for developers
- Success depends on adoption in economically different regions
- Limited DeFi activity compared to speculation-driven L2s

## Technical Details

**Architecture**
OP Stack rollup providing full EVM compatibility after transitioning from custom JavaScript blockchain. Part of Optimism Superchain enabling cross-chain composability with other OP chains. Standard optimistic architecture optimized for consistent low-cost transactions.

**Performance**
Transaction fees consistently under $0.01 enabling microtransactions and daily use. Standard L2 throughput with minimal congestion due to early adoption phase. Performance metrics focused on reliability over maximum throughput for emerging market needs.

**Security & Trust Model**
Standard optimistic rollup with 7-day fraud proof window for withdrawals. Secured by Ethereum L1 through fraud proof mechanism. Centralized sequencer operated by Lisk team with decentralization roadmap. Fault proof implementation planned following OP Stack standards.

**Control & Governance**
Lisk Foundation controls sequencer and protocol development. Grant distribution managed centrally with focus on emerging market builders. Governance transition planned but prioritizing ecosystem growth first. Development decisions driven by regional adoption needs rather than token holder votes.
