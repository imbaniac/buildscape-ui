---
name: Blast
chainId: 81457
nativeCurrency: ETH
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
  - name: Blast Organization
    url: https://github.com/blast-io
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

An OP Stack-based optimistic rollup with built-in native yield for ETH and stablecoins.

- **Security**:  
  - Centralized sequencer with full control over block production  
  - No live fraud proofs; withdrawal security depends on a challenge window that isn’t enforced  
  - Contracts are upgradeable without delay, controlled by a multisig—no permissionless governance  

- **Native Yield**:  
  - Bridged ETH is auto-staked in LST protocols  
  - Stablecoins are deployed into external yield strategies (e.g. T-Bill wrappers)  
  - Rebasing balances accrue passively to user wallets on L2  

- **Trade-offs**:  
  - No active fraud-proof system—state security depends on sequencer honesty  
  - Yield mechanism introduces dependency on external DeFi protocols  
  - Upgradeability without delay adds high governance and censorship risk  
  - Centralized control across all layers (sequencer, upgrades, bridge)  