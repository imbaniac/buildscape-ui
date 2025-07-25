---
name: Soneium
chainId: 1868
nativeCurrency: ETH
color: "#F5F6F9"
darkColor: "#8D8D8D"
logo: soneium.svg
parentOrganization: Sony Block Solutions Labs
website: https://soneium.org
launchDate: 
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
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
  - https://docs.soneium.org/
blockscanners:
  - name: Blockscout
    url: https://soneium.blockscout.com
    type: official
  - name: OKLink
    url: https://www.okx.com/web3/explorer/soneium
    type: alternative
  - name: SlamVision
    url: https://soneium.slam.vision
    type: alternative
testnets:
  - name: Soneium Testnet Minato
    chainId: 1946
    url: https://soneium-minato.blockscout.com
    description: Soneium's Minato testnet for deploying and testing applications on the Soneium Layer 2 network.
    faucets:
      - https://docs.soneium.org/docs/builders/tools/faucets
    rpcs:
      - https://rpc.minato.soneium.org
      - https://soneium-minato.drpc.org
rpcs:
  - name: Soneium
    url: https://rpc.soneium.org
    type: official
  - name: dRPC
    url: https://soneium.drpc.org
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/Soneium
forums:
  - name: Discord
    url: https://discord.com/invite/soneium
sdks:
# Additional SDKs and tools are inherited from evm-common.md
---

An OP Stack-based optimistic rollup built by Sony Network Communications, launched in early 2025 and part of the Superchain ecosystem.

- **Security & Sequencing**  
  - Optimistic rollup using OP Stack architecture.  
  - Centralized sequencer handles block production and calldata posting to Ethereum.  
  - Fraud-proof window exists, but only limited actors can submit challenges — not fully permissionless yet.

- **Data Availability**  
  - Uses Ethereum calldata (blobs) for data availability.  
  - Withdrawals depend on batch publication and challenge window processing.

- **Infra & Usage**  
  - Fully EVM-equivalent — standard Ethereum tooling and contracts work out of the box.  
  - Processes around 8 micro-operations per second on average.  
  - State updates and calldata batches are posted at regular intervals (~9 minutes for tx batches, ~2 hours for state updates).  
  - On-chain costs are low, typically <$0.001 per op.

- **Use Cases**  
  - Suitable for applications wanting Ethereum alignment with low fees and OP Stack compatibility — e.g., consumer-facing apps, gaming, or compliant DeFi.

- **Trade-offs**  
  - Centralized sequencer introduces censorship and liveness risk.  
  - Fraud proofs are limited to select actors — weaker trust assumptions than fully open rollups.  
  - RPC-level censorship has been observed — risk for permission-sensitive apps.  
  - Exit finality is delayed by batch posting intervals and challenge periods.