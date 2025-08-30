---
name: BOB
chainId: 60808
nativeCurrency: ETH
color: "#f25d00"
logo: bob.svg
parentOrganization: BOB
website: https://gobob.xyz
launchDate: 2024-05-01
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
  uniqueFeatures:
    - Bitcoin DeFi integration
    - Hybrid L2 architecture
    - BitVM and ZK-proof BTC deposits
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
  - https://docs.gobob.xyz/
blockscanners:
  - name: BOBscout
    url: https://explorer.gobob.xyz
    type: official
testnets:
  - name: BOB Sepolia
    chainId: 808813
    url: https://bob-sepolia.explorer.gobob.xyz
    description: BOB's Sepolia testnet for testing Bitcoin DeFi applications and cross-chain interactions.
    faucets: []
    rpcs:
      - https://bob-sepolia.rpc.gobob.xyz
      - wss://bob-sepolia.rpc.gobob.xyz
      - https://bob-testnet.drpc.org
rpcs:
  - name: BOB
    url: https://rpc.gobob.xyz
    type: official
  - name: dRPC
    url: https://bob.drpc.org
    type: public
  - name: Tenderly
    url: https://bob.gateway.tenderly.co
    type: private
  - name: Blast
    url: https://bob-mainnet.public.blastapi.io
    type: public
sourceCode:
  - name: BOB Documentation
    url: https://docs.gobob.xyz/
    description: Main documentation for BOB development
forums:
  - name: BOB on X (Twitter)
    url: https://x.com/gobob_xyz
    description: Official BOB announcements and updates
  - name: BOB Discord
    url: https://discord.gg/gobob
    description: Community support and discussion channel
sdks:
tools:
---

The L2 where Bitcoin holders stake BTC to secure the network and earn Ethereum DeFi yields. BOB brings actual Bitcoin security to EVM through Babylon staking — validators get their real BTC slashed on Bitcoin if they misbehave.

**Unique Position**
Unlike wrapped BTC on other chains, Bitcoin actively secures BOB through Babylon staking with on-chain slashing. The only L2 with dual finality from both Ethereum and Bitcoin, creating a unique security model. BitVM bridges (in development) will enable trust-minimized BTC transfers without traditional wrapping.

**Primary Use Cases**

- Bitcoin liquid staking protocols seeking EVM composability
- BTC holders wanting DeFi yields without wrapping risk
- Cross-chain applications needing both Bitcoin and Ethereum security
- Institutional Bitcoin strategies requiring native BTC collateral
- Bitcoin-secured synthetic assets and lending markets

**Ecosystem Character**
Bitcoin-first ecosystem focused on BTC yield generation rather than general DeFi. Early adopters include major BTC liquid staking protocols and Bitcoin-native teams. Community values Bitcoin security principles while leveraging Ethereum's DeFi infrastructure. Part of Optimism Superchain but culturally aligned with Bitcoin.

**Trade-offs**

- Dual finality system more complex than single-chain security models
- BitVM bridge still on testnet — currently relies on wrapped tokens
- Centralized sequencer inherited from OP Stack architecture
- Developer complexity from managing two different security assumptions
- Smaller ecosystem compared to established L2s

## Technical Details

**Architecture**
OP Stack rollup enhanced with Babylon BTC staking for additional finality. Bitcoin light client integrated directly into EVM enables reading Bitcoin state in smart contracts. Member of Optimism Superchain with standard fraud proof mechanics plus Bitcoin validation layer.

**Performance**
Standard OP Stack performance with two-second blocks and comparable throughput. Bitcoin finality adds 10-60 minute confirmation time for maximum security guarantees. Network fees contribute to BTC staking rewards, aligning incentives between users and validators.

**Security & Trust Model**
Dual security from Ethereum settlement (7-day fraud proofs) and Bitcoin finality through Babylon staking. BTC stakers validate BOB state transitions with slashing penalties enforced on Bitcoin itself. ZK proof integration planned for cryptographic validity without challenge periods.

**Control & Governance**
Centralized sequencer operated by BOB team following OP Stack standards. Protocol upgrades follow Optimism governance model with additional Bitcoin staker input mechanisms planned. BitVM development community-driven but implementation controlled by core team.
