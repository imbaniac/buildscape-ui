---
name: Fraxtal
chainId: 252
nativeCurrency: FRAX
color: "#3B82F6"
logo: fraxtal.svg
parentOrganization: Frax Finance
website: https://frax.com
launchDate: 2024-02-01
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
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
  - https://docs.frax.com/
blockscanners:
  - name: Fraxscan
    url: https://fraxscan.com
    type: official
testnets:
  - name: Fraxtal Testnet
    chainId: 2522
    url: https://holesky.fraxscan.com
    description: Fraxtal testnet for deploying and testing applications on the Fraxtal Layer 2 network.
    faucets: []
    rpcs:
      - https://rpc.testnet.frax.com
      - https://fraxtal-holesky-rpc.publicnode.com
rpcs:
  - name: Frax
    url: https://rpc.frax.com
    type: official
  - name: dRPC
    url: https://fraxtal.drpc.org
    type: public
  - name: Tenderly
    url: https://fraxtal.gateway.tenderly.co
    type: private
  - name: PublicNode
    url: https://fraxtal-rpc.publicnode.com
    type: public
  - name: Histori
    url: https://node.histori.xyz/fraxtal-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/FraxFinance
forums:
  - name: Discord
    url: https://discord.com/invite/fraxfinance
sdks:
tools:
---

The L2 where every transaction earns you points — like airline miles for crypto. Built by the FRAX stablecoin team with zero technical safeguards against rugpulls.

**Unique Position**
Fraxtal's Flox system gives FXTL points for every transaction, which will likely convert to tokens eventually. Gas paid in FRAX stablecoin means predictable dollar costs instead of volatile ETH. The only L2 where the team explicitly prioritizes user rewards over security — no fraud proofs, instant upgrades, complete centralized control.

**Primary Use Cases**

- Reward farming through normal DeFi activity
- FRAX ecosystem protocols seeking stablecoin integration
- Projects wanting to incentivize user engagement with multiplied points
- Traders seeking stable, predictable transaction costs
- Speculation on future FXTL token value

**Ecosystem Character**
Tightly coupled to FRAX Finance ecosystem with native protocols dominating activity. Community consists mainly of FRAX holders and yield farmers optimizing for FXTL accumulation. Apps compete to offer highest point multipliers. More mercenary than mission-driven — users are here for rewards, not ideology.

**Trade-offs**

- No fraud proofs whatsoever — pure trust in Frax team
- 3/5 multisig can instantly change or steal everything
- Data stored on IPFS/AWS instead of Ethereum
- FXTL points have no guaranteed value or conversion timeline
- Ecosystem entirely dependent on FRAX protocol's success

## Technical Details

**Architecture**
Modified OP Stack using FRAX as native gas token, removing ETH entirely. Flox reward system integrated at protocol level to distribute FXTL points per transaction. No fraud proof implementation despite using optimistic rollup framework.

**Performance**
Standard OP Stack throughput around 200 TPS with 2-second block times. Transactions cost fractions of a cent paid in stable FRAX. State posted to Ethereum hourly for eventual consistency.

**Security & Trust Model**
Completely centralized with no technical safeguards. Users must trust Frax team won't exploit multisig control, make critical errors, or abandon the project. Data availability depends on external services (IPFS/AWS) remaining operational. No permissionless validation or challenge mechanism exists.

**Control & Governance**
Frax Finance team has unilateral control through 3/5 multisig with no timelock. No community governance or decentralization roadmap published. Protocol changes can happen instantly without warning or user recourse.
