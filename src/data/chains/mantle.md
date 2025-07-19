---
name: Mantle
chainId: 5000
color: "#64B3AE"
darkColor: "#4B8782"
logo: mantle.svg
parentOrganization: Mantle Network
website: https://mantle.xyz
launchDate: 2023-07-14
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
docs:
  - https://docs.mantle.xyz/network
blockscanners:
  - name: MantleScan
    url: https://mantlescan.xyz
    type: official
  - name: Mantle Explorer
    url: https://explorer.mantle.xyz
    type: alternative
testnets:
  - name: Mantle Sepolia
    chainId: 5003
    url: https://explorer.sepolia.mantle.xyz
    description: Mantle's Sepolia testnet for testing dApps and smart contracts with fast confirmations.
    faucets:
      - https://faucet.sepolia.mantle.xyz
    rpcs:
      - https://rpc.sepolia.mantle.xyz
      - https://mantle-sepolia.drpc.org
rpcs:
  - name: Mantle RPC
    url: https://rpc.mantle.xyz
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/mantle
    type: public
  - name: PublicNode
    url: https://mantle-rpc.publicnode.com
    type: public
  - name: dRPC
    url: https://mantle.drpc.org
    type: public
  - name: 1RPC
    url: https://1rpc.io/mantle
    type: public
  - name: OnFinality
    url: https://mantle.api.onfinality.io/public
    type: public
  - name: Blast
    url: https://mantle-mainnet.public.blastapi.io
    type: public
  - name: ZAN
    url: https://api.zan.top/mantle-mainnet
    type: public
  - name: OMNIA
    url: https://endpoints.omniatech.io/v1/mantle/mainnet/public
    type: public
sourceCode:
  - name: Mantle GitHub
    url: https://github.com/mantlenetworkio
    description: Main Mantle Network GitHub organization
forums:
  - name: Mantle Forum
    url: https://forum.mantle.xyz
    description: Official Mantle community forum for discussions and governance
  - name: Mantle Discord
    url: https://discord.gg/0xMantle
    description: Official Discord server for the Mantle community
# SDKs and tools are inherited from evm-common.md
---

Mantle is an Ethereum Layer-2 network built with a modular architecture that combines optimistic rollup technology with innovative data availability solutions. It's the first L2 to integrate EigenDA, significantly reducing transaction costs while maintaining Ethereum's security guarantees.

The network features a unique modular design allowing independent upgrades to execution, data availability, and finality modules. This flexibility enables rapid innovation without compromising stability. Mantle also supports native liquid staking with mETH and governance through the MNT token.

While Mantle offers competitive fees and fast transaction finality, it's still relatively new compared to other L2s. The ecosystem is growing but may have fewer tools and integrations than more established networks.