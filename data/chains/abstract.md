---
name: Abstract
chainId: 2741
nativeCurrency: ETH
color: "#36f197"
darkColor: "#2ECA7E"
logo: abstract.svg
parentOrganization: Abstract Foundation
website: https://abs.xyz
launchDate: 2024-01-01
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
  - https://docs.abs.xyz/
blockscanners:
  - name: Abscan
    url: https://abscan.org
    type: official
  - name: Abstract Explorer
    url: https://explorer.mainnet.abs.xyz
    type: alternative
testnets:
  - name: Abstract Sepolia
    chainId: 11124
    url: https://sepolia.abscan.org
    description: Abstract testnet on Sepolia for testing dApps and smart contracts.
    faucets:
      - https://faucet.triangleplatform.com/abstract/testnet
    rpcs:
      - https://api.testnet.abs.xyz
rpcs:
  - name: Abstract Official RPC
    url: https://api.mainnet.abs.xyz
    type: public
  - name: dRPC
    url: https://abstract.drpc.org
    type: public
  - name: dRPC WebSocket
    url: wss://abstract.drpc.org
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/abstract-foundation
    description: Main Abstract GitHub organization
forums:
  - name: Discord
    url: https://discord.com/invite/abstractchain/
# SDKs and tools are inherited from evm-common.md
---

A consumer-focused Ethereum L2 built as a zk-rollup using the ZK Stack.

- **Security**: Inherits Ethereum security via zk-proofs; uses EigenDA for data availability.  
- **UX**: Native account abstraction with passkey/email login, gas paid in any token or sponsored.  
- **Focus**: Built for consumer apps—games, social, NFTs—with unified wallet and seamless UX.  
- **Trade-offs**:  
  - Young ecosystem, limited adoption and app depth  
  - New UX patterns (e.g. passkeys) may face education/compatibility challenges  
  - Relies on zkSync infra and EigenDA — not fully sovereign  