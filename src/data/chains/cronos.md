---
name: Cronos
chainId: 25
color: "#002D74"
darkColor: "#001d4a"
logo: cronos.svg
parentOrganization: Crypto.com
website: https://cronos.org
launchDate: 2021-11-08
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
docs:
  - https://docs.cronos.org
blockscanners:
  - name: Cronos Explorer
    url: https://explorer.cronos.org
    type: official
  - name: CronoScan
    url: https://cronoscan.com
    type: alternative
testnets:
  - name: Cronos Testnet
    chainId: 338
    url: https://explorer.cronos.org/testnet
    description: Official Cronos testnet for smart contract and dApp testing
    faucets:
      - https://cronos.org/faucet
    rpcs:
      - https://evm-t3.cronos.org
      - https://endpoints.omniatech.io/v1/cronos/testnet/public
      - https://cronos-testnet.drpc.org
rpcs:
  - name: Cronos Official
    url: https://evm.cronos.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/cro
    type: public
  - name: PublicNode
    url: https://cronos-evm-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://cronos.drpc.org
    type: public
  - name: ELK Finance
    url: https://cronos-rpc.elk.finance
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/cronos/mainnet/public
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/cro/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: Cronos Chain
    url: https://github.com/crypto-org-chain/cronos
    description: Official Cronos blockchain implementation
forums:
  - name: Cronos Discord
    url: https://discord.gg/cronos
    description: Official Discord community for developers and users
  - name: Cronos Forum
    url: https://forum.cronos.org
    description: Community discussion forum
# SDKs and tools are inherited from evm-common.md
---

Cronos is an EVM-compatible blockchain built on Cosmos SDK, designed to enable fast and low-cost DeFi and GameFi applications. Created by Crypto.com, it bridges the Ethereum ecosystem with the Cosmos network through IBC protocol.

The chain offers significantly lower transaction fees compared to Ethereum mainnet, making it attractive for DeFi applications and Web3 gaming through its dedicated Cronos Play initiative. It supports standard Ethereum tooling like MetaMask, Hardhat, and Truffle.

While Cronos provides good performance and lower costs, it has a smaller ecosystem compared to major L1s and operates with fewer validators than fully decentralized chains. The strong backing from Crypto.com provides ecosystem funding and exchange integration advantages.