---
name: ApeChain
color: "#0054FA"
darkColor: "#0040C0"
chainId: 33139
nativeCurrency: APE
logo: apechain.svg
parentOrganization: Ape Foundation
website: https://apechain.com
launchDate: 2024-10-20
maxBlockSize: 30
techStack: Arbitrum Orbit
technology:
  type: Arbitrum Orbit
  settlementLayer: Ethereum
  isL2: false
  isL3: true
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
blockscanners:
  - name: ApeScan
    url: https://apescan.io
    type: official
testnets:
  - name: Curtis
    chainId: 33111
    url: https://explorer.curtis.apechain.com
    description: ApeChain testnet for deploying and testing applications before mainnet launch.
    faucets: 
      - https://curtis.hub.caldera.xyz
    rpcs:
      - https://rpc.curtis.apechain.com
      - https://apechain-curtis.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.apechain.com
    type: official
  - name: dRPC
    url: https://apechain.drpc.org
    type: public
  - name: Histori
    url: https://node.histori.xyz/apechain-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
docs:
  - name: ApeChain Documentation
    url: https://docs.apechain.com
  - name: Developer Hub
    url: https://apechain.hub.caldera.xyz
sourceCode:
forums:
sdks:
tools:
# Additional SDKs and tools are inherited from evm-common.md
---

ApeChain is an Arbitrum Orbit L3 blockchain that serves as the dedicated infrastructure layer for the ApeCoin ecosystem. Built on Arbitrum technology, it provides a high-performance, cost-effective platform specifically designed for gaming, NFT marketplaces, and web3 applications.

The chain uses $APE as its native gas token, making it seamless for users already holding ApeCoin to interact with applications on the network. This design choice eliminates the need for users to acquire ETH for gas fees, significantly improving the user experience within the Ape ecosystem.

As an Arbitrum Orbit chain, ApeChain inherits the security and decentralization of Ethereum while offering enhanced scalability and customization options. The chain is optimized for ecosystem discovery, unique web3 rails, and top-of-funnel exposure, making it particularly suitable for consumer-facing applications that require fast, affordable transactions.

While ApeChain provides excellent performance and ecosystem integration, developers should be aware that as an L3, it operates with additional layers of abstraction from Ethereum mainnet. This architecture enables the chain's unique features but may require special considerations for certain types of applications.