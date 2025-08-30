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

Sony's L2 that blocked meme coins on launch day, freezing $100k in user funds. The corporate chain where IP protection trumps permissionless deployment.

**Unique Position**
Soneium features built-in IP protection that automatically restricts contracts suspected of trademark infringement. Sony-themed meme coins (Aibo, Toro) were blocked and funds frozen on day one. The only L2 where corporate compliance overrides crypto principles, designed for entertainment companies rather than DeFi degens.

**Primary Use Cases**

- Entertainment companies deploying official IP
- Sony Music/Pictures NFT collections
- Regulated applications requiring compliance controls
- On-chain ticketing and fan engagement
- Corporate partners within Sony ecosystem

**Ecosystem Character**
Curated environment where Soneium Spark selected 32 apps from 1,700+ applicants. Entertainment-focused with anime titles like Solo Leveling leading adoption. Community split between Sony fans embracing controls and crypto natives opposing censorship. More corporate boardroom than crypto Twitter.

**Trade-offs**

- Blocked legitimate meme coins freezing user funds on launch
- Contract deployment requires passing IP filters
- RPC-level censorship makes flagged contracts invisible
- 12-hour delay to bypass restrictions through L1
- Philosophy fundamentally conflicts with permissionless ethos

## Technical Details

**Architecture**
OP Stack optimistic rollup with additional IP protection layer screening deployments. EVM-equivalent base with Superchain compatibility maintained. Restrictions implemented at RPC level allowing eventual L1 bypass. Curated application layer on top of standard infrastructure.

**Performance**
Processes approximately 8 operations per second reflecting limited activity. Sub-$0.001 transaction fees due to low usage volume. Nine-minute batch intervals for transactions, two hours for state updates. Performance unchallenged due to controlled ecosystem.

**Security & Trust Model**
Standard optimistic rollup with 7-day withdrawal period to Ethereum. Centralized sequencer operated by Sony Block Solutions Labs. Fraud proofs restricted to authorized actors rather than permissionless. Additional trust in Sony's IP filtering decisions required.

**Control & Governance**
Sony Block Solutions Labs controls all aspects including sequencer and IP filters. Contract restrictions decided internally without community input. Soneium Spark curation process gatekeeps ecosystem access. No meaningful decentralization or community governance planned.
