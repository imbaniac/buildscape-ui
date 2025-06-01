---
name: Ethereum
chainId: 1
color: "#8A93B2"
darkColor: "#6B7390"
logo: ethereum.svg
parentOrganization: Ethereum Foundation
contractLanguages:
  primary:
    name: Solidity
    url: https://soliditylang.org
  others:
    - name: Vyper
      url: https://vyper.readthedocs.io
docs:
  - https://ethereum.org/en/developers/docs/
blockscanners:
  - https://etherscan.io
wallets:
  - https://metamask.io
  - https://walletconnect.com/
testnets:
  - Sepolia
  - Holesky
rpcs:
  public:
    - https://rpc.ankr.com/eth
  private:
    - https://mainnet.infura.io/v3/YOUR-PROJECT-ID
sourceCode:
  - https://github.com/ethereum/go-ethereum
forums:
  - https://ethereum-magicians.org/
  - https://ethereum.stackexchange.com/
sdks:
  - https://docs.ethers.org/
  - https://web3js.readthedocs.io/
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

Ethereum is the original smart contract blockchain and the de facto standard for decentralized application development. It’s fully decentralized, with thousands of validators securing the network via proof-of-stake, and it prioritizes protocol stability and neutrality over rapid iteration.

While Ethereum offers unmatched security and a massive ecosystem, it also comes with trade-offs: transaction fees can spike unpredictably during network congestion, and throughput is still limited despite recent upgrades like the Merge and Dencun. 

The protocol is relatively slow-moving due to its strong emphasis on backward compatibility and community consensus, which is great if you care about long-term reliability but frustrating if you’re hoping for fast L1 innovation.