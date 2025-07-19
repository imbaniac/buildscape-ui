---
name: BOB
chainId: 60808
color: "#f25d00"
darkColor: "#C14A00"
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

BOB is a hybrid Layer 2 blockchain built on the OP Stack that uniquely focuses on bringing Bitcoin DeFi capabilities to Ethereum. It positions itself as the "Gateway for Bitcoin DeFi," enabling trustless BTC deposits using BitVM and ZK-proofs while maintaining full EVM compatibility.

The network's key innovation lies in its ability to bridge Bitcoin liquidity to DeFi applications without traditional wrapped tokens. BOB enables native Bitcoin interactions through its hybrid architecture, allowing users to access yield opportunities across multiple chains with what they call "1-click Bitcoin DeFi."

Currently, BOB follows a phased rollout approach. Phase 1 launched as an optimistic Ethereum rollup, while Phase 2 is rolling out Bitcoin security features with staked Bitcoin backing. Future phases promise research into Bitcoin rollups and ZK implementations, potentially making it the first true Bitcoin L2.

Like other OP Stack chains, BOB benefits from shared infrastructure and interoperability within the Optimism ecosystem. However, its focus on Bitcoin integration sets it apart, though this specialization means the network's success heavily depends on Bitcoin DeFi adoption and the maturity of cross-chain infrastructure.

For developers, BOB offers unique opportunities to build applications that leverage both Bitcoin's security and Ethereum's programmability, but the nascent nature of Bitcoin DeFi infrastructure may present challenges.