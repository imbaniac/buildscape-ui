---
name: Blast
chainId: 81457
color: "#FCFC03"
darkColor: "#C6C600"
logo: blast.svg
parentOrganization: 
website: https://blast.io
launchDate: 2024-02-29
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: Custom
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
  - https://docs.blast.io/
blockscanners:
  - name: Blastscan
    url: https://blastscan.io
    type: official
  - name: Blast Explorer
    url: https://blastexplorer.io
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/blast
    type: alternative
  - name: DEX Guru
    url: https://blast.dex.guru
    type: analytics
  - name: DexScreener
    url: https://dexscreener.com/blast
    type: analytics
testnets:
  - name: Blast Sepolia
    chainId: 168587773
    url: https://testnet.blastscan.io
    description: Blast's Sepolia testnet for deploying and testing applications on the Blast Layer 2 network.
    faucets:
      - https://faucets.chain.link/blast-sepolia
    rpcs:
      - https://sepolia.blast.io
      - https://blast-sepolia.blockpi.network/v1/rpc/private
      - https://rpc.ankr.com/blast_testnet_sepolia
rpcs:
  - name: Blast
    url: https://rpc.blast.io
    type: official
  - name: Alchemy
    url: https://www.alchemy.com/
    type: private
  - name: Infura
    url: https://www.infura.io/
    type: private
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Ankr
    url: https://rpc.ankr.com/blast
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://blast.drpc.org
    type: public
  - name: Blast API
    url: https://blastl2-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://blast.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://blast.publicnode.com
    type: public
  - name: DIN
    url: https://blast.din.dev/rpc
    type: public
  - name: GasSwap
    url: https://blast.gasswap.org
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/blast/mainnet/public
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: PublicNode
    url: https://blast.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/blast
    type: public
  - name: Lava Network
    url: https://blast.lava.build
    type: public
  - name: thirdweb
    url: https://blast.rpc.thirdweb.com/
    type: public
sourceCode:
  - name: Blast Documentation
    url: https://docs.blast.io
    description: Official documentation for developers building on Blast
forums:
  - name: Blast Discord
    url: https://discord.com/invite/blastdevelopers
    description: Main developer community support and discussion channel
  - name: Blast on X (Twitter)
    url: https://x.com/Blast_L2
    description: Official Blast announcements and updates
sdks:
tools:
---

Blast is an optimistic rollup that aims to differentiate itself by offering native yield on ETH and stablecoins. ETH on Blast automatically earns ~4% yield from Ethereum staking rewards, while its native stablecoin USDB earns ~5% from T-Bill yields via MakerDAO's protocol. 

The key innovation is that yield is built into the protocol itself — ETH, not wrapped versions, automatically rebases on the L2. Smart contracts can choose to opt into this auto-rebasing functionality. Additionally, Blast returns gas revenue back to dApps programmatically, allowing developers to either keep the revenue or subsidize their users' gas fees.

However, there are important considerations. Blast's launch was controversial due to its early points program that required users to lock funds before the mainnet was live. The protocol's yield mechanism adds complexity and potential risks compared to standard L2s. The automatic rebasing could complicate integrations and accounting for some applications.

While Blast offers unique economic incentives for developers and users, it's important to understand these mechanisms thoroughly before building on the platform, as they represent a significant departure from standard L2 behavior.