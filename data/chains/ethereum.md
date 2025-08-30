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

The chain that matters. While "Ethereum killers" come and go, Ethereum remains the settlement layer for crypto — where real value lives, DeFi was born, and L2s post their proofs.

**Unique Position**
Post-EIP-4844, Ethereum no longer competes on speed or cost but serves as the neutral, credible base layer everything else builds upon. The only chain with genuine decentralization, institutional adoption, and battle-tested security since 2015. When things go wrong elsewhere, Ethereum is where value flees for safety.

**Primary Use Cases**

- Blue-chip DeFi protocols requiring maximum security and liquidity
- L2 settlement layer for rollup proof verification
- High-value transactions where security trumps cost
- NFT originals where provenance and permanence matter
- Institutional deployments requiring regulatory clarity

**Ecosystem Character**
The original and largest smart contract ecosystem where innovation happens first. Developer-centric culture values decentralization and credible neutrality over performance. Community consists of builders, researchers, and institutions rather than retail speculators. The canonical source of truth for crypto.

**Trade-offs**

- Gas fees remain high for complex operations during congestion
- Deliberately slow — 12-second blocks prioritize security over speed
- Not suitable for micropayments or high-frequency trading
- Conservative upgrade process means slow feature adoption
- L1 usage increasingly expensive as it transitions to settlement layer

## Technical Details

**Architecture**
Proof-of-Stake consensus with thousands of independent validators ensuring decentralization. EVM remains the standard all other chains copy or modify. EIP-4844 blob storage optimizes for L2 data availability rather than L1 execution.

**Performance**
L1 processes approximately 15 TPS with L2s handling scaling via rollups. Blob storage reduced L2 costs by over 90% while maintaining security guarantees. Twelve-second block times with probabilistic finality growing stronger over time.

**Security & Trust Model**
Most decentralized blockchain with over 1 million validators and no single point of control. Battle-tested since 2015 through multiple attacks and market cycles. Economic security from billions in staked ETH creates strongest crypto-economic guarantees.

**Control & Governance**
Protocol development through rough consensus among client teams and researchers. No central authority — upgrades require overwhelming community support. Ethereum Foundation provides funding but no control over protocol direction.
