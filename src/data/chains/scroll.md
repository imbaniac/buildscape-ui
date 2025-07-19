---
name: Scroll
chainId: 534352
color: "#edcca2"
darkColor: "#C5AA86"
logo: scroll.svg
parentOrganization: 
website: https://scroll.io
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
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.scroll.io
blockscanners:
  - name: Scrollscan
    url: https://scrollscan.com
    type: official
testnets:
  - name: Scroll Sepolia
    chainId: 534351
    url: https://sepolia.scrollscan.com
    description: Scroll testnet on Ethereum Sepolia for testing smart contracts and dApps on the zkEVM.
    faucets:
      - https://faucet.scroll.io
    rpcs:
      - https://sepolia-rpc.scroll.io
      - https://scroll-sepolia.drpc.org
      - https://rpc.ankr.com/scroll_sepolia_testnet
      - https://scroll-sepolia-rpc.publicnode.com
rpcs:
  - name: Scroll RPC
    url: https://rpc.scroll.io
    type: public
  - name: 1RPC
    url: https://1rpc.io/scroll
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/scroll
    type: public
  - name: dRPC
    url: https://scroll.drpc.org
    type: public
  - name: Blast
    url: https://scroll-mainnet.public.blastapi.io
    type: public
  - name: PublicNode
    url: https://scroll-rpc.publicnode.com
    type: public
  - name: OnFinality
    url: https://scroll.api.onfinality.io/public
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/scroll/mainnet/public
    type: public
  - name: Unifra
    url: https://scroll-mainnet-public.unifra.io
    type: public
  - name: Chainstack
    url: https://scroll-mainnet.chainstacklabs.com
    type: public
  - name: IceCream Swap
    url: https://rpc-scroll.icecreamswap.com
    type: public
sourceCode:
  - name: Scroll zkEVM
    url: https://github.com/scroll-tech
    description: Main Scroll GitHub organization with zkEVM repositories
forums:
  - name: Scroll Discord
    url: https://discord.gg/scroll
    description: Community Discord for discussions and support
# SDKs and tools are inherited from evm-common.md
---

Scroll is a native zkEVM Layer 2 scaling solution for Ethereum, offering full EVM compatibility with the security guarantees of zero-knowledge proofs. Built to deliver extremely low transaction costs (typically under $0.005) while maintaining complete compatibility with existing Ethereum tooling and smart contracts.

As a zkEVM, Scroll processes transactions off-chain and generates cryptographic proofs of their validity, which are then verified on Ethereum mainnet. This approach enables high throughput without sacrificing security or decentralization. The protocol achieves fast finality through its proof generation system while keeping the developer experience identical to Ethereum L1.

The platform's focus on removing trade-offs between scalability and security makes it particularly attractive for applications requiring high transaction volumes at minimal cost, while its open-source infrastructure ensures transparency and community involvement in the protocol's development.