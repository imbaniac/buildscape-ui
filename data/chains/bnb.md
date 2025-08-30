---
name: BNB Smart Chain
chainId: 56
nativeCurrency: BNB
color: "#f0b90b"
logo: bnb.svg
parentOrganization: BNB Chain
website: https://www.bnbchain.org
launchDate: 2020-09-01
maxBlockSize: 140
technology:
  isL2: false
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
  - https://docs.bnbchain.org/docs/
blockscanners:
  - name: BscScan
    url: https://bscscan.com
    type: official
  - name: DexScreener
    url: https://dexscreener.com/bsc
    type: analytics
testnets:
  - name: BSC Testnet
    chainId: 97
    url: https://testnet.bscscan.com
    description: BNB Smart Chain testnet for testing dApps and smart contracts with fast block times.
    faucets:
      - https://testnet.bnbchain.org/faucet-smart
    rpcs:
      - https://bsc-testnet-rpc.publicnode.com
      - https://data-seed-prebsc-1-s1.bnbchain.org:8545
      - https://bsc-testnet.public.blastapi.io
rpcs:
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Ankr
    url: https://rpc.ankr.com/bsc
    type: public
  - name: NodeReal
    url: https://nodereal.io/
    type: private
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: PublicNode
    url: https://bsc-rpc.publicnode.com
    type: public
  - name: Binance RPC
    url: https://bsc-dataseed.bnbchain.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/bnb
    type: public
  - name: Blast
    url: https://bsc-mainnet.public.blastapi.io
    type: public
  - name: dRPC
    url: https://bsc.drpc.org
    type: public
  - name: LlamaNodes
    url: https://binance.llamarpc.com
    type: public
  - name: Nodies
    url: https://bsc-pokt.nodies.app
    type: public
  - name: OnFinality
    url: https://bnb.api.onfinality.io/public
    type: public
  - name: Meowrpc
    url: https://bsc.meowrpc.com
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/bsc/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://bnb.rpc.subquery.network/public
    type: public
sourceCode:
  - name: BNB Chain Organization
    url: https://github.com/bnb-chain
    description: Main BNB Chain GitHub organization with core repositories
forums:
  - name: BNB Chain Forum
    url: https://forum.bnbchain.org/
    description: Official community forum for BNB Chain discussions and governance
  - name: BNB Chain Discord
    url: https://discord.com/invite/bnbchain
    description: Community Discord server for real-time discussions
# SDKs and tools are inherited from evm-common.md
---

Binance's centralized chain where retail traders chase memecoins with penny fees. 21 validators, all Binance-controlled, but that's the point — centralization means your token might get listed.

**Unique Position**
BSC offers a direct pipeline from PancakeSwap success to Binance CEX listing that doesn't exist elsewhere. The only major chain where centralization is a feature, not a bug — Binance's control provides instant fiat ramps, regulatory clarity, and exchange integration. Retail traders choose cheap fees and CEX access over decentralization every time.

**Primary Use Cases**

- Memecoin trading with minimal fees
- Yield farming for retail traders
- Projects seeking Binance ecosystem access
- High-volume trading bots needing cheap execution
- Emerging market DeFi with fiat integration needs

**Ecosystem Character**
Retail-dominated ecosystem where PancakeSwap handles over 90% of DEX activity. Memecoin launchpads like GraFun and Four.Meme drive most innovation. Community accepts centralization in exchange for Binance benefits — low fees, CEX integration, and regulatory protection through Binance's compliance infrastructure.

**Trade-offs**

- Only 21 validators, all essentially controlled by Binance
- Censorship risk from both validators and Binance itself
- Regulatory exposure if Binance faces enforcement actions
- Limited innovation outside retail trading and yield farming
- Reputation damage in "serious DeFi" circles limits institutional adoption

## Technical Details

**Architecture**
Proof-of-Staked-Authority (PoSA) consensus combining delegated staking with authority-based validator rotation. EVM-compatible with modifications for faster finality and lower fees. Supports opBNB L2 on OP Stack and planning subnet architecture for application-specific chains.

**Performance**
Handles 100-200 TPS in practice with fees remaining under $0.05 even during peak memecoin trading. Max 0.75 seconds times with typical two-block finality. Pascal hard fork added account abstraction and MEV protection, improving user experience for retail traders.

**Security & Trust Model**
Validators elected through BNB staking but require Binance approval to join the active set. Slashing mechanisms exist for double-signing and downtime but rarely enforced given validator relationships. Security depends entirely on Binance's reputation rather than cryptographic guarantees.

**Control & Governance**
On-chain governance exists but effectively controlled by validator set aligned with Binance. Protocol upgrades happen without enforced timelocks, allowing rapid changes. BNB Chain team (Binance subsidiary) drives all major development decisions with community input largely theatrical.
