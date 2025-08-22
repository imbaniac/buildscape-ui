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

A blockchain by the FRAX stablecoin team where users automatically earn rewards just for making transactions. Like airline miles but for crypto activity. Less secure than major L2s — the Frax team controls everything with no safety checks.

**Key Difference:** Every transaction earns FXTL points that will likely convert to tokens.

**Best for:** Users who want rewards for normal DeFi activity, FRAX stablecoin holders, apps that want to incentivize usage.

**Technical:** OP Stack rollup without fraud proofs, FRAX as gas token, Flox reward system distributing FXTL points.

- **Use Cases**
  - **Reward farming**: Earn FXTL points just by using any app on the chain
  - **FRAX ecosystem**: Lending, swapping, and other FRAX protocol features
  - **Stable gas costs**: Gas in FRAX means predictable dollar costs
  - **Incentivized apps**: Projects can multiply user rewards

- **Security & Data Availability**
  - No fraud proofs — requires trusting Frax team won't steal or make errors.
  - Data stored off-chain (IPFS/AWS) to reduce costs.
  - 3/5 multisig can change anything instantly.

- **Infra & Execution**
  - Built on OP Stack, compatible with Ethereum apps.
  - Gas paid in FRAX stablecoin (pegged to $1).
  - State posted to Ethereum hourly.

- **Performance**
  - Very cheap transactions (under penny).
  - Normal speed for this type of chain.
  - ~200 TPS capacity.

- **Trade-offs**
  - Must trust Frax team completely — no technical safeguards.
  - FXTL points have uncertain value and conversion timeline.
  - Less established than Arbitrum/Optimism/Base.
  - Data storage depends on external services working.
