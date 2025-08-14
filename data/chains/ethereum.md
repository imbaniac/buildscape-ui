---
name: Ethereum
chainId: 1
nativeCurrency: ETH
color: "#8A93B2"
logo: ethereum.svg
parentOrganization: Ethereum Foundation
website: https://ethereum.org
launchDate: 2015-07-30
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
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://ethereum.org/en/developers/docs/
blockscanners:
  - name: Etherscan
    url: https://etherscan.io
    type: official
  - name: Blockscout
    url: https://eth.blockscout.com
    type: alternative
  - name: OKLink
    url: https://www.oklink.com/eth
    type: alternative
  - name: DexScreener
    url: https://dexscreener.com/ethereum
    type: analytics
testnets:
  - name: Sepolia
    chainId: 11155111
    url: https://sepolia.etherscan.io
    description: Lightweight Ethereum testnet used for dApp and smart contract testing with fast confirmations.
    faucets:
      - https://www.alchemy.com/faucets/ethereum-sepolia
      - https://faucets.chain.link/sepolia
      - https://faucet.quicknode.com/ethereum/sepolia
      - https://sepolia-faucet.pk910.de/
      - https://getblock.io/faucet/ethereum-sepolia/
      - https://cloud.google.com/application/web3/faucet/ethereum
    rpcs:
      - https://ethereum-sepolia-rpc.publicnode.com
      - https://gateway.tenderly.co/public/sepolia
      - https://1rpc.io/sepolia
  - name: Holesky
    chainId: 17000
    url: https://holesky.etherscan.io
    description: Large-scale Ethereum testnet designed for validator testing, staking, and infrastructure simulation.
    faucets:
      - https://faucets.chain.link/holesky
      - https://holesky-faucet.pk910.de/
      - https://getblock.io/faucet/ethereum-holesky/
      - https://cloud.google.com/application/web3/faucet/ethereum
    rpcs:
      - https://ethereum-holesky.publicnode.com
      - https://holesky.gateway.tenderly.co
      - https://holesky.drpc.org
rpcs:
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
    url: https://rpc.ankr.com/eth
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: dRPC
    url: https://eth.drpc.org
    type: public
  - name: Blast
    url: https://eth-mainnet.public.blastapi.io
    type: public
  - name: BlockPI
    url: https://ethereum.blockpi.network/v1/rpc/public
    type: public
  - name: Allnodes
    url: https://ethereum.publicnode.com
    type: public
  - name: Tenderly
    url: https://tenderly.co/
    type: private
  - name: OnFinality
    url: https://eth.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/eth/mainnet/public
    type: public
  - name: SubQuery Network
    url: https://ethereum.rpc.subquery.network/public
    type: public
  - name: LlamaNodes
    url: https://eth.llamarpc.com
    type: public
  - name: LeoRPC
    url: https://eth.leorpc.com/?api_key=FREE
    type: public
  - name: Nodies
    url: https://nodies.app/
    type: private
  - name: Polkachu
    url: https://ethereum-rpc.polkachu.com
    type: public
  - name: PublicNode
    url: https://ethereum.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/eth
    type: public
  - name: Lava Network
    url: https://g.w.lavanet.xyz:443/gateway/eth/rpc-http/f7ee0000000000000000000000000000
    type: public
  - name: Unifra
    url: https://eth-mainnet-public.unifra.io
    type: public
  - name: BlockEden
    url: https://api.blockeden.xyz/eth/67nCBdZQSH9z3YqDDjdm
    type: public
  - name: ENVIO
    url: https://eth.rpc.hypersync.xyz/
    type: public
  - name: thirdweb
    url: https://eth.rpc.thirdweb.com/
    type: public
  - name: Croswap
    url: https://eth.croswap.com/rpc
    type: public
  - name: Cloudflare
    url: https://cloudflare-eth.com
    type: public
  - name: Flashbots
    url: https://rpc.flashbots.net
    type: public
  - name: MEV Blocker
    url: https://rpc.mevblocker.io
    type: public
  - name: Kolibrio
    url: https://eth.meowrpc.com
    type: public
  - name: Blink
    url: https://ethereum.blinklabs.xyz/
    type: public
  - name: Eden Network
    url: https://api.edennetwork.io/v1/rocket
    type: public
  - name: Flare Network
    url: https://ethereum-api.flare.network/
    type: public
  - name: merkle
    url: https://eth.merkle.io/
    type: public
  - name: Node RPC
    url: https://api.noderpc.xyz/rpc-mainnet/public
    type: public
  - name: NOWNodes
    url: https://public-eth.nownodes.io/
    type: public
sourceCode:
  - name: Go Ethereum (Geth)
    url: https://github.com/ethereum/go-ethereum
    description: Official Go implementation of the Ethereum protocol
  - name: Ethereum Organization
    url: https://github.com/ethereum
    description: Main Ethereum GitHub organization with core repositories
forums:
  - name: Ethereum Magicians
    url: https://ethereum-magicians.org/
    description: Fellowship for maximizing technical opportunities and collaboration across the Ethereum community
  - name: Ethereum Research Forum
    url: https://ethresear.ch/
    description: Semi-public forum for participating in Ethereum research with new findings and development opportunities
  - name: Ethereum Stack Exchange
    url: https://ethereum.stackexchange.com/
    description: Q&A site for users of Ethereum and related technologies
# SDKs and tools are inherited from evm-common.md
---

The chain that matters. While "Ethereum killers" come and go, Ethereum remains the settlement layer for crypto — where real value lives, DeFi was born, and L2s post their proofs. Post-EIP-4844, it's no longer trying to be fast or cheap; it's the neutral, credible base layer that everything else builds on.

**Best for:** Blue-chip DeFi, high-value transactions, NFT originals, being the canonical source of truth.

**Technical:** The original smart contract chain and backbone of web3, now optimized as a settlement layer for L2s.

- **Security**: Most decentralized L1 with thousands of validators, battle-tested since 2015.  
- **Ecosystem**: Largest by far — all major DeFi, most developers, deepest liquidity.  
- **Performance**: ~15 TPS on L1, but L2s handle volume. EIP-4844 blobs reduced L2 costs by 90%+.
- **Use Cases**:
  - **DeFi headquarters**: Uniswap, Aave, MakerDAO, Curve — the originals with deepest liquidity
  - **L2 settlement**: All major L2s (Arbitrum, Optimism, Base, zkSync) post proofs here
  - **Staking economy**: 30M+ ETH staked, Lido alone manages $34B+
  - **NFT bluechips**: CryptoPunks, BAYC, Art Blocks — provenance matters
  - **Institutional entry**: ETH ETFs, regulated custody, enterprise deployments
- **Trade-offs**:  
  - Gas fees still high for complex operations ($5-50+ during congestion)
  - Slow by design — 12-second blocks, conservative upgrades
  - Not for micropayments or high-frequency trading (use L2s)  