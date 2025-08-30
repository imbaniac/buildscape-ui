---
name: Mantle
chainId: 5000
nativeCurrency: MNT
color: "#64b3ae"
logo: mantle.svg
parentOrganization: Mantle Network
website: https://mantle.xyz
launchDate: 2023-07-14
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
docs:
  - https://docs.mantle.xyz/network
blockscanners:
  - name: MantleScan
    url: https://mantlescan.xyz
    type: official
  - name: Mantle Explorer
    url: https://explorer.mantle.xyz
    type: alternative
testnets:
  - name: Mantle Sepolia
    chainId: 5003
    url: https://explorer.sepolia.mantle.xyz
    description: Mantle's Sepolia testnet for testing dApps and smart contracts with fast confirmations.
    faucets:
      - https://faucet.sepolia.mantle.xyz
    rpcs:
      - https://rpc.sepolia.mantle.xyz
      - https://mantle-sepolia.drpc.org
rpcs:
  - name: Mantle RPC
    url: https://rpc.mantle.xyz
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/mantle
    type: public
  - name: PublicNode
    url: https://mantle-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://mantle.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/mantle
    type: public
  - name: OnFinality
    url: https://mantle.api.onfinality.io/public
    type: public
  - name: Blast
    url: https://mantle-mainnet.public.blastapi.io
    type: public
  - name: ZAN
    url: https://api.zan.top/mantle-mainnet
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/mantle/mainnet/public
    type: public
sourceCode:
  - name: Mantle GitHub
    url: https://github.com/mantlenetworkio
    description: Main Mantle Network GitHub organization
forums:
  - name: Mantle Forum
    url: https://forum.mantle.xyz
    description: Official Mantle community forum for discussions and governance
  - name: Mantle Discord
    url: https://discord.gg/0xMantle
    description: Official Discord server for the Mantle community
# SDKs and tools are inherited from evm-common.md
---

An L2 where projects get paid to deploy through a $3.9B treasury. Uses cheap data storage (EigenDA) for sub-cent fees and liquid staking (mETH) is built into everything.

**Unique Position**
Mantle deploys its massive BitDAO treasury to bootstrap liquidity and pay developers — the $200M EcoFund means free money for builders. Uses EigenDA instead of Ethereum for data, making fees 80% cheaper than other L2s. Every major protocol integrates mETH liquid staking, turning idle ETH into yield everywhere. Planning ZK upgrade to reduce withdrawals from 7 days to 1 hour, though keeps missing deadlines.

**Primary Use Cases**

- Projects seeking treasury-backed grants and liquidity
- Liquid staking strategies through mETH ecosystem
- DeFi protocols needing deep, subsidized liquidity pools
- Stablecoin integrations with institutional partners
- Applications betting on the optimistic-to-ZK transition

**Ecosystem Character**
Treasury-driven ecosystem where funding availability attracts builders more than technical features. Strong liquid staking focus with mETH becoming core primitive. Community expects sustainable growth through treasury deployment rather than token emissions. Institutional partnerships (Ethena, Ondo) signal serious DeFi ambitions.

**Trade-offs**

- Centralized sequencer with perpetually vague decentralization timeline
- ZK upgrade still on testnet — 7-day withdrawals remain
- Success entirely dependent on treasury management and DAO politics
- EigenDA dependency adds external trust assumptions
- Modular architecture increases complexity without proven benefits

## Technical Details

**Architecture**
Optimistic rollup with modular design separating execution, data availability, and settlement layers. Transitioning to ZK validity rollup using OP Succinct and SP1 zkVM for faster finality. MNT as native token with mETH/cmETH liquid staking derivatives integrated throughout.

**Performance**
Sub-cent transaction fees achieved through EigenDA's cheaper data availability. Standard optimistic rollup throughput until ZK upgrade completes. Post-upgrade promises 1-hour finality versus current 7-day withdrawal period, though mainnet timeline remains undefined.

**Security & Trust Model**
Currently standard optimistic rollup with 7-day fraud proof window. EigenDA for data availability reduces costs but adds validator trust assumptions beyond Ethereum. ZK upgrade will replace fraud proofs with validity proofs, eliminating challenge periods but requiring prover reliability.

**Control & Governance**
Mantle team controls centralized sequencer with no binding decentralization commitment. Treasury management through DAO governance, though large holders dominate decisions. Protocol upgrades controlled by team with community input through non-binding votes. EcoFund distribution decided by internal committee rather than open governance.
