---
name: Soneium
chainId: 1868
nativeCurrency: ETH
color: "#F5F6F9"
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

Sony's entertainment-focused L2 with IP protection that blocked meme coins on launch day, sparking community backlash.

**Key Difference:** Built-in IP protection system that restricts contracts suspected of infringement — blocked Sony-themed meme coins (Aibo, Toro) and froze funds, prioritizing corporate IP over permissionless deployment.

**Best for:** Entertainment companies needing IP protection, Sony ecosystem partners, regulated applications requiring compliance controls.

**Technical:** OP Stack optimistic rollup with IP protection layer, RPC-level contract restrictions, curated application ecosystem.

- **Use Cases**
  - **Entertainment IP**: Sony Music/Pictures NFTs, anime titles like Solo Leveling
  - **Event management**: On-chain ticketing, fan engagement platforms
  - **Curated ecosystem**: Soneium Spark selected 32 apps from 1,700+ applicants
  - **Corporate Web3**: Applications requiring IP compliance and content controls

- **Security & Data Availability**
  - Optimistic rollup on OP Stack with standard 7-day withdrawal period.
  - Centralized sequencer operated by Sony Block Solutions Labs.
  - Fraud proofs limited to authorized actors, not permissionless.

- **Infra & Execution**
  - EVM-equivalent with OP Stack and Superchain compatibility.
  - IP protection system flags suspected infringing contracts.
  - Restrictions apply at RPC level; direct L1 submission possible with delays.

- **Performance**
  - Processes ~8 operations per second on average.
  - Low fees (typically <$0.001 per transaction).
  - Batch intervals: ~9 minutes for transactions, ~2 hours for state updates.

- **Trade-offs**
  - Blocked popular meme coins on launch, freezing ~$100k in user funds.
  - Contract restrictions prevent permissionless deployment.
  - RPC-level controls make flagged contracts invisible on explorers.
  - 12-hour delay required to bypass restrictions via L1.
  - Philosophy conflicts with crypto's permissionless ethos.
