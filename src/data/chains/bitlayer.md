---
name: Bitlayer
chainId: 200901
color: "#E46F1B"
darkColor: "#B65713"
logo: bitlayer.svg
parentOrganization: 
website: https://www.bitlayer.org
launchDate: 
maxBlockSize: 
technology:
  isL2: true
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
  - https://docs.bitlayer.org/
blockscanners:
  - name: BTRScan
    url: https://www.btrscan.com
    type: official
testnets:
  - name: Bitlayer Testnet
    chainId: 200810
    url: https://testnet.btrscan.com
    description: Bitlayer testnet for testing DApps and smart contracts on the Bitcoin Layer 2 network.
    faucets:
      - https://www.bitlayer.org/faucet
    rpcs:
      - https://testnet-rpc.bitlayer.org
      - https://rpc.ankr.com/bitlayer_testnet
      - https://testnet-rpc.bitlayer-rpc.com
rpcs:
  - name: Bitlayer Official
    url: https://rpc.bitlayer.org
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/bitlayer
    type: public
  - name: Bitlayer RPC
    url: https://rpc.bitlayer-rpc.com
    type: public
  - name: RockX
    url: https://rpc-bitlayer.rockx.com
    type: public
sourceCode:
  - name: Bitlayer GitHub
    url: https://github.com/bitlayer-org
    description: Bitlayer organization GitHub repositories
forums:
  - name: Bitlayer Documentation
    url: https://docs.bitlayer.org/
    description: Official documentation and developer resources
# SDKs and tools are inherited from evm-common.md
---

Bitlayer is a Bitcoin Layer 2 blockchain built on the BitVM paradigm, designed to be the gateway for Bitcoin DeFi. It provides EVM compatibility while leveraging Bitcoin's security, enabling developers to build decentralized applications that interact with Bitcoin assets.

The network uses BTC as its native currency (with 18 decimals for EVM compatibility) and focuses on providing infrastructure for Bitcoin DeFi applications. With a median gas fee of around $0.1, it offers an affordable environment for DApp development while maintaining the security guarantees of the Bitcoin network.

Bitlayer supports standard Ethereum development tools and languages like Solidity, making it easy for developers familiar with EVM chains to build on the platform. The network provides comprehensive developer resources including documentation, testnet access, and multisig wallet infrastructure.