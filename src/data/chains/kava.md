---
name: Kava
chainId: 2222
color: "#FF433E"
darkColor: "#C9332F"
logo: kava.svg
parentOrganization: Kava Labs
website: https://www.kava.io
launchDate: 2019-11-15
maxBlockSize: 21
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
  - https://docs.kava.io/docs/ethereum/
  - https://www.kava.io/developers#resources
blockscanners:
  - name: Kavascan
    url: https://kavascan.com
    type: official
testnets:
  - name: Kava Testnet
    chainId: 2221
    url: http://testnet.kavascan.com
    description: EVM-compatible testnet for Kava network, providing development and testing environment.
    faucets:
      - https://faucet.kava.io
    rpcs:
      - https://evm.testnet.kava.io
      - https://kava-testnet.drpc.org
      - https://kava-evm-testnet.rpc.thirdweb.com
rpcs:
  - name: Kava Official
    url: https://evm.kava.io
    type: public
  - name: OnFinality
    url: https://kava.api.onfinality.io/public
    type: public
  - name: PublicNode
    url: https://kava-evm-rpc.publicnode.com
    type: public
  - name: Nodies
    url: https://kava-pokt.nodies.app
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/kava_evm
    type: public
  - name: dRPC
    url: https://kava.drpc.org
    type: public
  - name: Chainstack
    url: https://evm.kava.chainstacklabs.com
    type: public
  - name: Kava RPC
    url: https://evm.kava-rpc.com
    type: public
  - name: POKT Network
    url: https://kava-rpc.gateway.pokt.network
    type: public
  - name: thirdweb
    url: https://kava-evm.rpc.thirdweb.com
    type: public
sourceCode:
  - name: Kava
    url: https://github.com/Kava-Labs/kava
    description: Official Kava blockchain repository
  - name: Kava Labs
    url: https://github.com/Kava-Labs
    description: Kava Labs GitHub organization
forums:
  - name: Kava Community
    url: https://community.kava.io/
    description: Official Kava community forum for governance and discussion
  - name: Kava Discord
    url: https://discord.com/invite/kava
    description: Community Discord server for real-time discussion
# SDKs and tools are inherited from evm-common.md
---

Kava is a decentralized blockchain that combines the speed and interoperability of Cosmos with the developer power of Ethereum. Built on the Cosmos SDK with Tendermint consensus, it provides an EVM-compatible execution environment while maintaining connectivity to the broader Cosmos ecosystem through IBC.

Kava offers single block finality and extremely low transaction fees (averaging $0.0001), making it an attractive platform for DeFi applications. The network supports full Solidity compatibility, allowing Ethereum developers to easily deploy their smart contracts.

As a hybrid Cosmos-EVM chain, Kava provides unique advantages: access to Cosmos liquidity and interoperability while maintaining full compatibility with Ethereum tools and standards. However, developers should be aware that while the EVM layer is fully compatible, accessing Cosmos-specific features requires understanding both ecosystems.