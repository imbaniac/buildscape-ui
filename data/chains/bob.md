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

Hybrid L2 that combines OP Stack rollup security with Bitcoin finality via Babylon staking. Operates as both a Superchain member and a Bitcoin Secured Network — BOB L2 actively inheriting security from both chains.
The key difference: Dual finality model where Ethereum provides fraud proofs while Bitcoin stakers validate state through Babylon — if validators sign conflicting chains, their BTC gets slashed on Bitcoin itself.

**Best for:** Bitcoin DeFi needing EVM compatibility, BTC liquid staking protocols, cross-chain apps wanting both Ethereum composability and Bitcoin security.

**Technical:** OP Stack rollup with Babylon BTC staking for finality, BitVM bridges in development, member of Optimism Superchain.

- **Security & Data Availability**  
  - OP rollup with standard 7-day fraud proof window on Ethereum.  
  - Bitcoin finality via Babylon — BTC stakers validate BOB state with slashing.  
  - ZK proofs being added for cryptographic state validity (Phase 2).

- **Infra & Execution**  
  - Bitcoin light client enables reading BTC state directly in contracts.  
  - BitVM bridge on testnet — trust-minimized BTC transfers without wrapping.  
  - Supports all major BTC LSTs (Babylon, Solv, Bedrock, PumpBTC).

- **Performance**  
  - Standard OP Stack performance with 2-second blocks.  
  - Bitcoin finality adds 10-60 minute confirmation for maximum security.  
  - Network fees contribute to BTC staking rewards, creating sustainable economics.

- **Use Cases**  
  - **BTC liquid staking hub**: Native integration with Babylon LST ecosystem
  - **Bitcoin DeFi**: Major protocols deployed for BTC-native yield
  - **Cross-chain infrastructure**: Part of both Superchain and Bitcoin networks
  - **Institutional BTC**: Secure Bitcoin yield without leaving the ecosystem

- **Trade-offs**  
  - Dual finality more complex than single-chain L2s.  
  - BitVM bridge still on testnet — wrapped tokens dominate for now.  
  - Centralized sequencer like all OP Stack chains.  
  - Higher complexity for developers navigating two security models. 