---
name: Abstract
chainId: 2741
nativeCurrency: ETH
color: "#36f197"
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

Pudgy Penguins' L2 built for consumer apps, using email sign-ins instead of seed phrases. Launched January 2025 with big hype but unclear substance. Created by the NFT team that sold plushies at Target — betting on bringing retail consumers to crypto through simplified UX and "digital Disneyland" branding.

**Key Difference**: Built to onboard non-crypto users by eliminating wallets entirely — you interact with blockchain using email/passkeys like normal apps.

**Best for:** Consumer apps wanting Pudgy Penguins audience, projects needing sponsored gas fees, developers betting on NFT-to-mainstream crossover.

**Technical:** ZK rollup using zkSync's ZK Stack, EigenDA for data availability, native account abstraction with passkey/email wallets.

- **Use Cases**
  - **The Portal**: App store/streaming platform hybrid claiming 600K MAU (unverified)
  - **Consumer apps**: 100+ apps at launch, mostly simple games and social
  - **Pudgy ecosystem**: PENGU token integration, NFT utilities
  - **Target market**: Non-crypto users via simplified onboarding

- **Trade-offs**
  - Brand-new chain with unproven tech stack at scale.
  - Relies entirely on zkSync and EigenDA infrastructure.
  - Success tied to Pudgy Penguins brand relevance.
  - Consumer blockchain thesis unproven — previous attempts failed.

- **Security & Data Availability**
  - ZK rollup inheriting Ethereum security via validity proofs.
  - Uses EigenDA for data availability instead of Ethereum.
  - Account abstraction built-in with social recovery options.

- **Infra & Execution**
  - Built on zkSync's ZK Stack framework.
  - Abstract Global Wallet (AGW) with email/passkey login.
  - Gas can be paid in any token or sponsored by apps.

- **Performance**
  - Standard ZK rollup performance characteristics.
  - Focus on consumer UX over raw throughput.
  - Early stage with limited stress testing.
