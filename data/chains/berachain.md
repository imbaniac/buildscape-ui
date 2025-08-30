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

The NFT meme chain that turned "Ooga Booga" into a novel consensus mechanism where your staked assets keep earning DeFi yields while securing the network.

**Unique Position**
Berachain invented Proof-of-Liquidity — validators must provide actual liquidity to earn rewards, not just stake tokens. Your LP positions secure the chain while still earning trading fees. The first blockchain where security literally equals liquidity, turning validation into a DeFi strategy. Born from Bong Bears NFTs but evolved into the most culturally-driven serious L1.

**Primary Use Cases**

- DeFi protocols wanting liquidity incentives built into consensus
- Liquidity mining maximalists seeking multiple reward streams
- Projects needing strong community culture and engagement
- Validators who want to earn from both validation and DeFi
- Meme projects that need actual utility beyond speculation

**Ecosystem Character**
Unique blend of degen meme culture and sophisticated DeFi mechanics. The "Ooga Booga" community embraces absurdity while building serious infrastructure. Native DeFi suite (BEX, BEND, BERP) creates immediate utility. Liquidity wars between protocols competing for BGT emissions drive constant engagement. Hit $3B TVL within weeks — fastest L1 adoption in recent memory.

**Trade-offs**

- Proof-of-Liquidity is experimental — unproven long-term security model
- Economic security depends on sustained DeFi activity and yields
- BGT non-transferability creates complex governance dynamics
- Tri-token system (BERA/BGT/HONEY) adds cognitive overhead
- Success requires maintaining both meme momentum and DeFi innovation

## Technical Details

**Architecture**
EVM-identical L1 built on Cosmos SDK with CometBFT consensus, using novel Proof-of-Liquidity where validators stake LP tokens instead of native assets. Features tri-token model: BERA (gas), BGT (non-transferable governance), HONEY (native stablecoin).

**Performance**
Sustains 1-2.5M daily transactions with sub-3 second block times and instant finality through Tendermint. Gas costs comparable to other Cosmos chains, significantly cheaper than Ethereum. Handles high load well — maintained performance despite explosive early growth.

**Security & Trust Model**
Proof-of-Liquidity requires validators to provide liquidity that remains productive in DeFi while securing consensus. Security scales with DeFi TVL rather than token price alone. Single-slot finality through CometBFT eliminates reorganization risk. Currently 69 active validators with combined billions in secured value.

**Control & Governance**
BGT governance token is non-transferable, earned only through liquidity provision and protocol participation. BeraHub manages BGT emissions and rewards distribution across protocols. Foundation maintains significant influence over protocol development but governance increasingly community-driven through BGT voting.
