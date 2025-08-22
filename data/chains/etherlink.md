---
name: Etherlink
chainId: 42793
nativeCurrency: XTZ
color: "#38FF9C"
logo: etherlink.svg
parentOrganization: Tezos Foundation
website: https://etherlink.com
launchDate: 2024-05-01
maxBlockSize: 30
technology:
  isL2: true
  parentChain: Tezos
  isEVM: true
  rollupType: Tezos Smart Rollup
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - https://docs.etherlink.com/
blockscanners:
  - name: Etherlink Explorer
    url: https://explorer.etherlink.com
    type: official
testnets:
  - name: Ghostnet
    chainId: 128123
    url: https://testnet.explorer.etherlink.com
    description: Etherlink testnet running on Tezos Ghostnet
    faucets:
      - https://faucet.etherlink.com
    rpcs:
      - https://node.ghostnet.etherlink.com
      - https://rpc.ankr.com/etherlink_testnet
rpcs:
  - name: Official RPC
    url: https://node.mainnet.etherlink.com
    type: public
  - name: Ankr
    url: https://rpc.ankr.com/etherlink_mainnet
    type: public
sourceCode:
  - name: Etherlink on Tezos GitLab
    url: https://gitlab.com/tezos/tezos
    description: Part of the Tezos protocol implementation
forums:
  - name: Tezos Stack Exchange
    url: https://tezos.stackexchange.com/
    description: Q&A site for Tezos and Etherlink developers
  - name: Etherlink Discord
    url: https://discord.com/invite/etherlink
# SDKs and tools are inherited from evm-common.md
---

The only EVM rollup on Tezos, using XTZ for gas. Cheap and fast but isolated from mainstream EVM liquidity.

**Key Difference:** Built directly into Tezos protocol ("enshrined") rather than external, with fraud proofs settled by Tezos validators instead of Ethereum.

**Best for:** Projects already in Tezos ecosystem wanting EVM compatibility, apps needing sub-cent transaction costs.

**Technical:** Smart Rollup on Tezos with fraud proofs, XTZ as native token, sub-second confirmations with 16-second finality.

- **Use Cases**
  - **DeFi**: IguanaDEX (concentrated liquidity DEX), SuperLend (lending), Curve deployment
  - **Gaming**: BattleRise, Bit Hotel, UPvsDOWN, Degeneratives
  - **Incentives**: Apple Farm program boosted TVL from low millions to peak near $50M
  - **Bridges**: LayerZero and Stargate for cross-chain connectivity

- **Security & Data Availability**
  - Settles on Tezos L1 using fraud proofs and commitment publishing.
  - Finality in 2 Tezos blocks (16 seconds after Quebec upgrade).
  - Permissionless: anyone can run a node and challenge invalid state.

- **Infra & Execution**
  - Built with Tezos Smart Rollup framework, enshrined in protocol.
  - Standard EVM with some RPC differences due to Tezos backend.
  - Uses XTZ for gas instead of ETH.

- **Performance**
  - Sub-second soft confirmations.
  - Very low fees (sub-cent transactions).
  - Calypso upgrade improved contract processing speed significantly.

- **Trade-offs**
  - Isolated from Ethereum L2 ecosystem — bridges required for ETH assets.
  - Limited tooling support compared to Ethereum-based L2s.
  - Smaller ecosystem despite incentive programs.
  - WebSocket support limited, requiring polling for subscriptions.
