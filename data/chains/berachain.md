---
name: Berachain
chainId: 80094
nativeCurrency: BERA
color: "#814625"
logo: berachain.svg
parentOrganization: Berachain Foundation
website: https://www.berachain.com
launchDate: 2025-01-16
maxBlockSize: 30
technology:
  isL2: false
  isEVM: true
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://docs.berachain.com
blockscanners:
  - name: Berascan
    url: https://berascan.com
    type: official
  - name: Beratrail
    url: https://beratrail.io
    type: alternative
testnets:
  - name: Bepolia
    chainId: 80069
    url: https://bepolia.beratrail.io
    description: Canonical testnet that mirrors mainnet functionality with full Proof-of-Liquidity support.
    faucets:
      - https://bepolia.faucet.berachain.com/
      - https://faucet.quicknode.com/berachain/bepolia
      - https://faucet.trade/berachain-testnet-bera-faucet
    rpcs:
      - https://bepolia.rpc.berachain.com
      - https://berachain-bepolia.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.berachain.com
    type: public
  - name: PublicNode
    url: https://berachain-rpc.publicnode.com
    type: public
  - name: drpc
    url: https://berachain.drpc.org
    type: public
  - name: Berachain APIs
    url: https://rpc.berachain-apis.com
    type: public
sourceCode:
  - name: Berachain GitHub
    url: https://github.com/berachain
    description: Official Berachain GitHub organization
forums:
  - name: Berachain Discord
    url: https://discord.com/invite/berachain
    description: Official Discord community for developers and users
  - name: Berachain X (Twitter)
    url: https://x.com/berachain
    description: Official X account for announcements and updates
# SDKs and tools are inherited from evm-common.md
---

The NFT meme chain that became a serious L1 with a novel twist: your staked assets keep earning DeFi yields.

**Key Difference:** Uses Proof-of-Liquidity, meaning validators must provide actual liquidity to earn rewards, not just lock tokens — creating the first chain where security literally equals liquidity.

**Best for:** Liquidity mining maximalists, DeFi protocols wanting built-in rewards, projects needing cultural momentum.

**Technical:** An EVM-identical L1 using Proof-of-Liquidity consensus with a tri-token system (BERA/BGT/HONEY) built on Cosmos SDK.

- **Use Cases**
  - **Native DeFi suite**: BEX (DEX with gas rebates), BEND (lending), BERP (20x leverage perps)
  - **Liquidity wars**: Kodiak, Infrared competing for BGT bribes and rewards
  - **Meme culture**: Originated from Bong Bears NFT, "Ooga Booga" community
  - **Cross-chain liquidity**: BeraHub manages BGT rewards across protocols

- **Security & Data Availability**
  - Proof-of-Liquidity: validators stake LP tokens instead of native tokens
  - Staked assets remain productive in DeFi while securing the network
  - 69 active validators with ~$38M in delegated BGT governance tokens
  - Built on CometBFT (Tendermint) with single-slot finality

- **Infra & Execution**
  - 100% EVM-identical — MetaMask, Hardhat, Foundry work without modifications
  - BeaconKit framework enables modular consensus and L2 integration
  - Native DeFi primitives built into protocol layer (BEX, BEND, BERP)
  - Tri-token model: BERA (gas), BGT (non-transferable governance), HONEY (stablecoin)

- **Performance**
  - 1-2.5M daily transactions sustained post-launch
  - Sub-3 second block times with instant finality
  - Gas costs comparable to other Cosmos chains
  - Hit $3B TVL within weeks of mainnet launch

- **Trade-offs**
  - PoL is experimental — economic security depends on sustained DeFi activity
  - BGT governance is non-transferable, creating complex delegation dynamics
  - Validator rewards tied to liquidity provision, not just validation
  - Young ecosystem despite rapid growth — infrastructure still maturing
