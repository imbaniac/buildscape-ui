---
name: PulseChain
chainId: 369
color: "#6163F1"
darkColor: "#4243AF"
logo: pulsechain.svg
parentOrganization: PulseChain Foundation
website: https://pulsechain.com/
launchDate: 2023-05-13
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
  - https://docs.pulsechain.com/
blockscanners:
  - name: PulseScan
    url: https://ipfs.scan.pulsechain.com
    type: official
  - name: OtterScan
    url: https://otter.pulsechain.com
    type: alternative
testnets:
  - name: PulseChain Testnet v4
    chainId: 943
    url: https://scan.v4.testnet.pulsechain.com
    description: Test network for PulseChain development and smart contract testing
    faucets:
      - https://faucet.v4.testnet.pulsechain.com/
    rpcs:
      - https://rpc.v4.testnet.pulsechain.com
      - https://pulsechain-testnet-rpc.publicnode.com
      - https://rpc-testnet-pulsechain.g4mm4.io
rpcs:
  - name: Official RPC
    url: https://rpc.pulsechain.com
    type: public
  - name: PublicNode
    url: https://pulsechain-rpc.publicnode.com
    type: public
  - name: G4MM4
    url: https://rpc-pulsechain.g4mm4.io
    type: public
  - name: Evex Cloud
    url: https://evex.cloud/pulserpc
    type: public
  - name: OwlRacle
    url: https://rpc.owlracle.info/pulse/70d38ce1826c4a60bb2a8e05a6c8b20f
    type: public
sourceCode:
  - name: PulseChain
    url: https://gitlab.com/pulsechaincom
    description: PulseChain GitLab organization
forums:
  - name: PulseChain Telegram
    url: https://t.me/PulseChainCom
    description: Official PulseChain community channel
# SDKs and tools are inherited from evm-common.md
---

PulseChain is an Ethereum fork that launched in 2023 with the goal of providing a more efficient alternative to Ethereum. It uses a delegated proof-of-stake consensus mechanism and features faster block times with lower transaction costs.

The network is fully EVM-compatible, supporting all Ethereum tooling and smart contracts. PulseChain includes a complete state copy of Ethereum at the time of fork, meaning all ERC-20 tokens and NFTs were duplicated on the new chain.

While PulseChain offers lower fees and faster transactions compared to Ethereum, it trades off some decentralization for these performance gains. The ecosystem is still developing, with fewer established protocols and tools compared to more mature chains.