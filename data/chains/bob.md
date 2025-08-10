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

A hybrid L2 using the OP Stack, designed to eventually settle on Bitcoin. Currently operates as an optimistic rollup on Ethereum.

- **Security**  
  - Runs as an OP rollup on Ethereum — no connection to Bitcoin for finality today.  
  - Fraud proofs and settlement rely on Ethereum challenge window (7 days).  
  - Plans to move to Bitcoin-based settlement with merged mining and BitVM-style challenge proofs, but not implemented yet.

- **Infra**  
  - Implements a Bitcoin light client to read BTC state inside contracts.  
  - Native BTC support and bridging under development — not fully live or trustless yet.

- **Design Goals**  
  - Long-term vision is Bitcoin-aligned smart contract infra.  
  - Current architecture inherits OP Stack’s centralization risks (sequencer, upgrade keys).  
  - Future plans introduce more complexity: PoW-based validator layer, Bitcoin settlement, and BTC-denominated gas.

- **Trade-offs**  
  - Present-day security is fully Ethereum-based — no actual Bitcoin finality.  
  - BTC interoperability is partial; bridge and validator coordination not trust-minimized yet.  
  - Hybrid architecture adds operational and conceptual overhead for devs.  
  - Builders relying on Bitcoin-native guarantees will need to wait for later phases. 