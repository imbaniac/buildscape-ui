---
name: PulseChain
chainId: 369
nativeCurrency: PLS
color: "#6163F1"
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
  - https://hexpulse.info/docs/
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
  - name: PulseChain Telegram Dev
    url: https://t.me/PulseDEV
    description: PulseChain dev community channel
# SDKs and tools are inherited from evm-common.md
---

Ethereum's controversial "system state fork" that copied every wallet balance, NFT, and contract at launch. Richard Heart's chain where 33 validators control everything and your "free" USDC copy has zero value.

**Unique Position**
PulseChain forked Ethereum's entire state, giving everyone free copies of their ETH holdings as PLS and duplicating all tokens and NFTs. The only chain where having millions in "USDC" means nothing since copies lack backing. Created by Richard Heart of HEX fame, concentrating his ecosystem on one permissioned chain.

**Primary Use Cases**

- Experimenting with Ethereum forks at minimal cost
- Trading within Richard Heart's token ecosystem
- Holders of pre-fork Ethereum assets claiming copies
- Speculative trading on PulseX DEX
- Testing ground for projects avoiding real chains

**Ecosystem Character**
Insular community of Richard Heart followers trading HEX-related tokens with minimal external participation. Most activity centers on PulseX DEX and speculative token trading. Copied DeFi protocols sit abandoned without teams or updates. Strong cult-like devotion from supporters, complete dismissal from broader crypto.

**Trade-offs**

- Only 33 validators control the entire network
- No exchange listings limiting liquidity to internal DEXs
- Copied stablecoins and wrapped tokens worthless without backing
- SEC investigation history and founder controversies
- Complete isolation from legitimate crypto ecosystem

## Technical Details

**Architecture**
Proof-of-Stake fork with permissioned validator set rather than open participation. Full Ethereum state duplication at genesis including all balances, contracts, and NFTs. Standard EVM execution without modern scaling solutions like rollups or blob storage.

**Performance**
Ten-second block times slightly faster than Ethereum's twelve seconds. Low fees result from minimal usage rather than technical innovation. Lacks any L2 scaling technology or data availability improvements. Network capacity untested under real load.

**Security & Trust Model**
Proof-of-Staked-Authority with approximately 33 validators controlling consensus. Validators permissioned rather than openly elected through staking. No connection to Ethereum security through fraud proofs or validity proofs. Standalone security model entirely dependent on small validator set.

**Control & Governance**
Richard Heart and associates control validator selection and protocol direction. No meaningful decentralization or community governance mechanisms. Fork parameters and upgrade decisions made unilaterally. Copied assets controlled by no one, rendering most valueless.
