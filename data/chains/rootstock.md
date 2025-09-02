---
name: Rootstock
chainId: 30
nativeCurrency: RBTC
color: "#FF931E"
logo: rootstock.svg
parentOrganization: IOV Labs
website: https://rootstock.io
launchDate: 2018-01-04
maxBlockSize: 6.8
technology:
  type: Proof of Work
  layer: Sidechain
  vm:
    type: EVM
    evmCompatible: true
  settlementLayer: Bitcoin
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
docs:
  - https://dev.rootstock.io/
blockscanners:
  - name: Rootstock Explorer
    url: https://explorer.rsk.co
    type: official
  - name: Blockscout
    url: https://rootstock.blockscout.com
    type: alternative
testnets:
  - name: Rootstock Testnet
    chainId: 31
    url: https://explorer.testnet.rsk.co
    description: Rootstock testnet for testing smart contracts and dApps on Bitcoin-merged mining architecture.
    faucets:
      - https://faucet.rsk.co/
    rpcs:
      - https://public-node.testnet.rsk.co
      - https://mycrypto.testnet.rsk.co
      - https://rootstock-testnet.drpc.org
rpcs:
  - name: Public Node
    url: https://public-node.rsk.co
    type: public
  - name: MyCrypto RSK
    url: https://mycrypto.rsk.co
    type: public
  - name: dRPC
    url: https://rootstock.drpc.org
    type: public
  - name: Blast API
    url: https://rootstock-mainnet.public.blastapi.io
    type: public
  - name: Node Histori
    url: https://node.histori.xyz/rsk-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: RSKj (Rootstock Node)
    url: https://github.com/rsksmart/rskj
    description: Official Java implementation of the Rootstock protocol
  - name: RSK Organization
    url: https://github.com/rsksmart
    description: Main Rootstock GitHub organization with core repositories
forums:
  - name: Rootstock Research Forum
    url: https://research.rsk.dev/
    description: Community forum for Rootstock development and research discussions
  - name: RSK Community Discord
    url: https://discord.gg/rootstock
    description: Official Discord server for Rootstock community
# SDKs and tools are inherited from evm-common.md
---

The original Bitcoin sidechain from 2018, secured by 81% of Bitcoin's hashpower through merged mining. Where Bitcoin miners validate EVM contracts without running extra hardware.

**Unique Position**
Rootstock operates as a true sidechain parallel to Bitcoin, not a rollup posting proofs. Bitcoin miners earn RBTC rewards alongside BTC through merged mining, securing the network with 740+ exahashes/second. Hardware-secured federation controls the bridge, preventing miner theft while maintaining Bitcoin's security guarantees.

**Primary Use Cases**

- Bitcoin-native DeFi without wrapped token risks
- Mining operations seeking additional revenue streams
- BTC-backed stablecoins with direct collateral
- Conservative Bitcoin holders wanting smart contracts

**Ecosystem Character**
Bitcoin-maximalist ecosystem focused on BTC as the only real collateral. Sovryn dominates as the primary DEX and lending protocol. Community values security and proven technology over innovation speed. Smaller but dedicated user base preferring stability to hype cycles.

**Trade-offs**

- Federation-controlled bridge less trustless than newer BitVM approaches
- 30-second blocks feel sluggish compared to modern sub-second L2s
- 24-36 hour peg times optimize security over convenience
- Smaller ecosystem despite being the oldest Bitcoin sidechain
- Sidechain architecture less capital efficient than rollups

## Technical Details

**Architecture**
True sidechain running parallel to Bitcoin with independent consensus through merged mining. Full EVM compatibility via RVM allowing unchanged Solidity deployment. DECOR+ protocol prevents mining centralization while maintaining security. Federation uses hardware security modules for bridge control.

**Performance**
Capable of 300+ TPS though actual usage remains lower. Thirty-second block times provide predictability at the cost of speed. Transaction fees reduced 60% in 2025 making it competitive with newer solutions. Peg operations take 24-36 hours prioritizing security over user experience.

**Security & Trust Model**
Secured by 81% of Bitcoin's hashpower through merged mining without additional hardware requirements. Powpeg federation with HSMs prevents both miner and federation member theft. DECOR+ ensures fair reward distribution preventing centralization. Security model proven since 2018 without major incidents.

**Control & Governance**
Federation members control bridge operations through multi-signature HSM setup. Protocol upgrades require both miner and federation consensus. IOV Labs provides development but cannot unilaterally change protocol. More decentralized than appearance suggests through careful mechanism design.
