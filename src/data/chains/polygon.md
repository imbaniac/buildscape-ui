---
name: Polygon
chainId: 137
color: "#6C00F6"
darkColor: "#4700A8"
logo: polygon.svg
contractLanguages:
  primary:
    name: Solidity
    url: https://soliditylang.org
  others:
    - name: Vyper
      url: https://vyper.readthedocs.io
docs:
  - https://docs.polygon.technology/
blockscanners:
  - https://polygonscan.com
wallets:
  - https://metamask.io
  - https://walletconnect.com/
testnets:
  - Mumbai
rpcs:
  public:
    - https://polygon-rpc.com
  private:
    - https://polygon-mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/maticnetwork/bor
forums:
  - https://forum.polygon.technology/
  - https://community.polygon.technology/
sdks:
  - https://docs.polygon.technology/docs/develop/network-details/network/
  - https://docs.ethers.org/
tools:
  - https://getfoundry.sh/
  - https://hardhat.org/
bookmarks:
  - Overview
  - Source
  - Forums
  - Docs
  - Blockscanners
  - Wallets
  - Testnets
  - RPCs
  - SDKs
  - Tools
---

Polygon PoS is a sidechain to Ethereum that offers fast and low-cost transactions, but with a distinct trust model: it relies on its own validator set and uses periodic checkpoints to Ethereum for finality, rather than inheriting Ethereum’s security directly like rollups do. This is why it’s technically not a Layer 2—because a true L2 relies on Ethereum for data availability and dispute resolution, while Polygon PoS operates independently and only posts snapshots to Ethereum.

It’s fully EVM-compatible, so deploying Ethereum contracts requires no changes, but developers should note that Polygon’s consensus is based on a relatively small set of validators coordinated through a PoS mechanism, and governance remains heavily influenced by the Polygon Foundation via a multi-sig. State sync to Ethereum happens via a bridge, but it’s not trust-minimized—security relies on the bridge and validator honesty rather than fraud or validity proofs.

While this makes it performant and cheap, it’s a different trust trade-off compared to rollups, and developers building high-value or security-critical apps should factor that in.