---
name: Berachain
chainId: 80094
color: "#814625"
darkColor: "#6E3B1E"
logo: berachain.svg
parentOrganization: Berachain Foundation
website: https://www.berachain.com
launchDate: 2025-01-16
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
docs:
  - https://docs.berachain.com
blockscanners:
  - name: Berascan
    url: https://berascan.com
    type: official
  - name: Beratrail
    url: https://beratrail.io
    type: alternative
testnets:
  - name: Bepolia
    chainId: 80069
    url: https://bepolia.beratrail.io
    description: Canonical testnet that mirrors mainnet functionality with full Proof-of-Liquidity support.
    faucets:
      - https://bepolia.faucet.berachain.com/
      - https://faucet.quicknode.com/berachain/bepolia
      - https://faucet.trade/berachain-testnet-bera-faucet
    rpcs:
      - https://bepolia.rpc.berachain.com
      - https://berachain-bepolia.drpc.org
rpcs:
  - name: Official RPC
    url: https://rpc.berachain.com
    type: public
  - name: PublicNode
    url: https://berachain-rpc.publicnode.com
    type: public
  - name: drpc
    url: https://berachain.drpc.org
    type: public
  - name: Berachain APIs
    url: https://rpc.berachain-apis.com
    type: public
sourceCode:
  - name: Berachain GitHub
    url: https://github.com/berachain
    description: Official Berachain GitHub organization
forums:
  - name: Berachain Discord
    url: https://discord.gg/berachain
    description: Official Discord community for developers and users
  - name: Berachain X (Twitter)
    url: https://x.com/berachain
    description: Official X account for announcements and updates
# SDKs and tools are inherited from evm-common.md
---

A Layer 1 chain with a novel Proof-of-Liquidity (PoL) consensus model, built on a modular BeaconKit + CometBFT stack.

- **Consensus (PoL)**: Validators must stake and provide protocol liquidity to earn governance power. Uses a tri-token system:  
  - **BERA**: gas and fee token  
  - **BGT**: non-transferable governance token, earned via liquidity provision  
  - **Honey**: reward token used in ecosystem apps  
- **Infra**: Runs on CometBFT with BeaconKit coordination, enabling fast block times and single-slot finality.  
- **Ecosystem**: Native DeFi suite includes BEX (DEX), Honey stablecoin, lending/perps. Designed to incentivize liquidity as a security primitive.  
- **Trade-offs**:  
  - PoL is untested at scale and depends on sustained DeFi activity  
  - Validator incentives are tightly coupled to protocol usage  
  - Governance (via BGT) is non-transferable and controlled by liquidity dynamics  
  - Modular design introduces coordination and implementation complexity  