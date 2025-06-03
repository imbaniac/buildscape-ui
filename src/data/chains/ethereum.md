---
name: Ethereum
chainId: 1
color: "#8A93B2"
darkColor: "#6B7390"
logo: ethereum.svg
parentOrganization: Ethereum Foundation
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
  - https://github.com/ethereum/go-ethereum
forums:
  - https://ethereum-magicians.org/
  - https://ethereum.stackexchange.com/
# SDKs and tools are inherited from evm-common.md
---

Ethereum is the original smart contract blockchain and the de facto standard for decentralized application development. It’s fully decentralized, with thousands of validators securing the network via proof-of-stake, and it prioritizes protocol stability and neutrality over rapid iteration.

While Ethereum offers unmatched security and a massive ecosystem, it also comes with trade-offs: transaction fees can spike unpredictably during network congestion, and throughput is still limited despite recent upgrades like the Merge and Dencun. 

The protocol is relatively slow-moving due to its strong emphasis on backward compatibility and community consensus, which is great if you care about long-term reliability but frustrating if you’re hoping for fast L1 innovation.