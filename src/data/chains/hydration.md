---
name: Hydration
chainId: 222222
color: "#DFB1F3"
darkColor: "#AB85BC"
logo: hydration.svg
parentOrganization: ""
website: https://hydration.net
launchDate: ""
maxBlockSize: ""
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
  - https://docs.hydration.net/
blockscanners:
  - name: Blockscout
    url: https://explorer.evm.hydration.cloud
    type: official
testnets: []
rpcs:
  - name: Hydration
    url: https://rpc.hydradx.cloud
    type: public
  - name: Dwellir
    url: https://hydration-rpc.n.dwellir.com
    type: public
  - name: Helikon
    url: https://rpc.helikon.io/hydradx
    type: public
  - name: Hydration Dotters
    url: https://hydration.dotters.network
    type: public
  - name: IBP Network
    url: https://hydration.ibp.network
    type: public
  - name: Hydration Cloud (Cay)
    url: https://rpc.cay.hydration.cloud
    type: public
  - name: Hydration Cloud (Parm)
    url: https://rpc.parm.hydration.cloud
    type: public
  - name: Hydration Cloud (Roach)
    url: https://rpc.roach.hydration.cloud
    type: public
  - name: Hydration Cloud (Zipp)
    url: https://rpc.zipp.hydration.cloud
    type: public
  - name: Hydration Cloud (Sin)
    url: https://rpc.sin.hydration.cloud
    type: public
  - name: Hydration Cloud (Coke)
    url: https://rpc.coke.hydration.cloud
    type: public
sourceCode: []
forums: []
# SDKs and tools are inherited from evm-common.md
---

Hydration is a liquidity layer built on Polkadot that enables developers to build efficient financial applications. It unites swaps, lending, and the Hollar stablecoin within a scalable appchain architecture.

The protocol features multiple AMM types including Omnipool, Stablepools, and Isolated Pools, providing flexible liquidity solutions for different use cases. Hydration supports cross-chain communication through XCM and offers permissionless market making capabilities for DAOs.

While Hydration provides a comprehensive SDK and supports standard EVM development, specific technical details like block times and consensus mechanisms would need to be confirmed through their documentation.