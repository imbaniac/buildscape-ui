---
name: Gnosis
chainId: 100
color: "#3e6957"
darkColor: "#2F5042"
logo: gnosis.svg
parentOrganization: Gnosis
website: https://www.gnosischain.com
launchDate: 2021-12-01
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
docs:
  - https://docs.gnosischain.com
blockscanners:
  - name: Gnosisscan
    url: https://gnosisscan.io
    type: official
  - name: Blockscout
    url: https://gnosis.blockscout.com
    type: alternative
  - name: DEX Guru
    url: https://gnosis.dex.guru
    type: analytics
testnets:
  - name: Chiado
    chainId: 10200
    url: https://gnosis-chiado.blockscout.com
    description: Gnosis Chain testnet for dApp and smart contract testing with fast confirmations.
    faucets:
      - https://gnosisfaucet.com
    rpcs:
      - https://rpc.chiadochain.net
      - https://gnosis-chiado-rpc.publicnode.com
      - https://gnosis-chiado.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.gnosischain.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/gnosis
    type: public
  - name: PublicNode
    url: https://gnosis-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://gnosis.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/gnosis
    type: public
  - name: OnFinality
    url: https://gnosis.api.onfinality.io/public
    type: public
  - name: POKT Network
    url: https://gnosis-pokt.nodies.app
    type: public
  - name: BlastAPI
    url: https://gnosis-mainnet.public.blastapi.io
    type: public
  - name: Gateway.fm
    url: https://rpc.gnosis.gateway.fm
    type: private
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/gnosis/mainnet/public
    type: public
  - name: Blockscout Archive
    url: https://xdai-archive.blockscout.com
    type: public
  - name: Tatum
    url: https://gno-mainnet.gateway.tatum.io
    type: private
  - name: 0xRPC
    url: https://0xrpc.io/gno
    type: public
sourceCode:
  - name: Gnosis Chain
    url: https://github.com/gnosischain
    description: Main Gnosis Chain GitHub organization
forums:
  - name: Gnosis Forum
    url: https://forum.gnosis.io/
    description: Community forum for governance discussions and technical topics
  - name: Gnosis Discord
    url: https://discord.gg/gnosischain
    description: Official Discord server for developers and community
# SDKs and tools are inherited from evm-common.md
---

Gnosis Chain is a community-owned EVM-compatible blockchain that prioritizes credible neutrality and low costs. Originally launched as xDai Chain, it uses xDAI (a stablecoin pegged to USD) as its native currency for gas fees, making transaction costs predictable and extremely low.

The chain achieves consensus through a unique beacon chain that uses GNO tokens for staking, with over 350,000 validators securing the network. With 5-second block times and transaction fees typically under $0.01, it's particularly suited for high-frequency applications like payments, gaming, and DAOs.

While Gnosis offers excellent stability and low costs, it has a smaller ecosystem compared to major L1s and L2s. The network is governed by GnosisDAO and has maintained 100% uptime since launch, making it a reliable choice for applications that need consistent, affordable execution.