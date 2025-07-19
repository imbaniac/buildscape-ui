---
name: Soneium
chainId: 1868
color: "#000000"
darkColor: "#333333"
logo: soneium.svg
parentOrganization: Sony Block Solutions Labs
website: https://soneium.org
launchDate: 
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
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
  - https://docs.soneium.org/
blockscanners:
  - name: Blockscout
    url: https://soneium.blockscout.com
    type: official
  - name: OKLink
    url: https://www.okx.com/web3/explorer/soneium
    type: alternative
  - name: SlamVision
    url: https://soneium.slam.vision
    type: alternative
testnets:
  - name: Soneium Testnet Minato
    chainId: 1946
    url: https://soneium-minato.blockscout.com
    description: Soneium's Minato testnet for deploying and testing applications on the Soneium Layer 2 network.
    faucets:
      - https://bridge.soneium.org/testnet
    rpcs:
      - https://rpc.minato.soneium.org
      - https://soneium-minato.drpc.org
rpcs:
  - name: Soneium
    url: https://rpc.soneium.org
    type: official
  - name: dRPC
    url: https://soneium.drpc.org
    type: public
sourceCode:
forums:
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

Soneium is Sony's Layer 2 network built on the OP Stack, marking the entertainment giant's entry into blockchain infrastructure. It aims to create an open internet environment where creators and communities can thrive, leveraging Sony's expertise in entertainment and technology.

As an Optimistic Rollup on the Superchain, Soneium offers full EVM compatibility with reduced fees and faster transactions. Being developed by Sony Block Solutions Labs, it has the backing of a major corporation, potentially bringing mainstream adoption and professional-grade infrastructure to Web3.

However, as a newer L2, the ecosystem is still developing. The network inherits the OP Stack's current limitations, including reliance on a centralized sequencer and pending fraud proof implementation. Developers should consider these factors alongside the potential benefits of building on a chain backed by one of the world's largest entertainment companies.