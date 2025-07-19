---
name: Avalanche C-Chain
chainId: 43114
color: "#FF394A"
darkColor: "#BE4446"
logo: avalanche.svg
parentOrganization: Ava Labs
website: https://www.avax.network
launchDate: 2020-09-21
maxBlockSize: 8
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
  - https://docs.avax.network/build/
blockscanners:
  - name: Snowscan
    url: https://snowscan.xyz
    type: official
  - name: Avascan
    url: https://avascan.info
    type: alternative
  - name: Snowtrace (Routescan)
    url: https://snowtrace.io
    type: alternative
  - name: DEX Guru
    url: https://avalanche.dex.guru
    type: analytics
  - name: DexScreener
    url: https://dexscreener.com/avalanche
    type: analytics
testnets:
  - name: Fuji
    chainId: 43113
    url: https://testnet.snowscan.xyz
    description: Avalanche's primary testnet for C-Chain smart contract testing with fast finality.
    faucets:
      - https://faucet.avax-test.network/
      - https://test.faucet.avax.network/
    rpcs:
      - https://api.avax-test.network/ext/bc/C/rpc
      - https://avalanche-fuji-c-chain-rpc.publicnode.com
      - https://endpoints.omniatech.io/v1/avax/fuji/public
      - https://avalanche-fuji.drpc.org
rpcs:
  - name: Avalanche Network
    url: https://api.avax.network/ext/bc/C/rpc
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/avalanche
    type: public
  - name: QuickNode
    url: https://www.quicknode.com/
    type: private
  - name: Infura
    url: https://www.infura.io/
    type: private
  - name: PublicNode
    url: https://avalanche-c-chain-rpc.publicnode.com
    type: public
  - name: 1RPC
    url: https://1rpc.io/avax/c
    type: public
  - name: dRPC
    url: https://avalanche.drpc.org
    type: public
  - name: Blast
    url: https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc
    type: public
  - name: OnFinality
    url: https://avalanche.api.onfinality.io/public/ext/bc/C/rpc
    type: public
  - name: OmniaTech
    url: https://endpoints.omniatech.io/v1/avax/mainnet/public
    type: public
  - name: MeowRPC
    url: https://avax.meowrpc.com
    type: public
  - name: Zan Network
    url: https://api.zan.top/avax-mainnet/ext/bc/C/rpc
    type: public
  - name: Nodies
    url: https://avax-pokt.nodies.app/ext/bc/C/rpc
    type: public
  - name: GetBlock
    url: https://getblock.io/
    type: private
  - name: Chainstack
    url: https://chainstack.com/
    type: private
  - name: SubQuery Network
    url: https://avalanche.rpc.subquery.network/public
    type: public
  - name: Lava Network
    url: https://avax1.lava.build
    type: public
  - name: BlockPI
    url: https://avalanche.public.blockpi.network/v1/rpc/public
    type: public
  - name: NOWNodes
    url: https://nownodes.io/
    type: private
  - name: Allnodes
    url: https://avalanche.public-rpc.com
    type: public
  - name: Tenderly
    url: https://avalanche-mainnet.gateway.tenderly.co
    type: private
  - name: 0x RPC
    url: https://0xrpc.io/avax
    type: public
  - name: OwlRPC
    url: https://rpc.owlracle.info/avax/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
  - name: Simply Staking
    url: https://spectrum-01.simplystaking.xyz/avalanche-mn-rpc/ext/bc/C/rpc
    type: public
sourceCode:
  - name: Avalanche Go
    url: https://github.com/ava-labs/avalanchego
    description: Official Go implementation of the Avalanche protocol
  - name: Ava Labs Organization
    url: https://github.com/ava-labs
    description: Main Avalanche GitHub organization with core repositories
forums:
  - name: Avalanche Community Forum
    url: https://forum.avax.network/
    description: Official community forum for developers and users
  - name: Avalanche Developers Discord
    url: https://discord.gg/avalanche
    description: Active Discord community for developers and ecosystem participants
  - name: Avalanche Reddit
    url: https://www.reddit.com/r/Avax/
    description: Community discussions and ecosystem updates
# SDKs and tools are inherited from evm-common.md
---

Avalanche is a high-performance blockchain platform designed for decentralized applications and custom blockchain deployments. The C-Chain is Avalanche's primary smart contract chain, offering full EVM compatibility with sub-second finality and low fees.

Built on a novel consensus mechanism combining Classical and Nakamoto consensus properties, Avalanche achieves over 4,500 TPS while maintaining decentralization through thousands of validators. The platform's unique subnet architecture allows developers to create custom blockchain networks with their own rules and validators.

While Avalanche excels at speed and throughput, it requires AVAX staking for validation and has higher hardware requirements than some other chains. The ecosystem prioritizes DeFi and institutional use cases, with strong support for regulated applications through subnet customization.