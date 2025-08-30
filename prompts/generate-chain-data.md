# AI Prompt for Generating Chain Data

## Instructions for Using This Prompt

1. Replace `[CHAIN_NAME]` with the actual chain name (e.g., "Arbitrum One")
2. Replace `[CHAIN_ID]` with the actual chain ID (e.g., 42161)
3. Provide any additional context about the chain if available
4. The AI MUST perform web searches for 2025 data to ensure accuracy

---

## The Prompt

You are creating a comprehensive blockchain chain profile for Buildscape. You MUST perform web searches for "2025 [CHAIN_NAME]" and related terms to ensure all information is current and accurate.

**CHAIN TO DOCUMENT:** [CHAIN_NAME] (Chain ID: [CHAIN_ID])

**CRITICAL REQUIREMENTS:**

1. **MANDATORY WEB SEARCH**: Search for "[CHAIN_NAME] 2025", "[CHAIN_NAME] RPCs", "[CHAIN_NAME] documentation", "[CHAIN_NAME] testnet" to verify current information
2. **USE EXACT FORMAT**: Follow the structure below precisely
3. **NO PLACEHOLDER DATA**: All fields must contain real, verified information
4. **VERIFY CHAIN ID**: Confirm the chain ID matches official sources

Create a markdown file with the following exact structure:

```markdown
---
name: [Official chain name]
chainId: [Verified chain ID number]
nativeCurrency: [Native token symbol, e.g., ETH, MATIC]
color: "[Brand hex color with #]"
logo: [chainname.svg - lowercase, underscores for spaces]
parentOrganization: [Company/foundation that maintains the chain]
website: [Official website URL]
launchDate: [YYYY-MM-DD format]
maxBlockSize: [Block size in MB, typically 30 for most chains]
technology:
  type: [One of: L1, Optimistic Rollup, zkEVM Rollup, Sidechain, Other]
  settlementLayer: [If L2/sidechain: Ethereum, etc. Omit if L1]
  isL2: [true/false]
  isEVM: [true/false]
  stack: [If applicable: OP Stack, Polygon CDK, Arbitrum Orbit, etc.]
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
docs:
  - [Primary documentation URL]
blockscanners:
  - name: [Explorer name, e.g., Etherscan, Blockscout]
    url: [Explorer URL]
    type: official
  - name: [Alternative explorer if exists]
    url: [URL]
    type: alternative
testnets:
  - name: [Testnet name]
    chainId: [Testnet chain ID]
    url: [Testnet explorer URL]
    description: [Brief description of testnet purpose]
    faucets:
      - [Faucet URL 1]
      - [Faucet URL 2]
    rpcs:
      - [Testnet RPC URL 1]
      - [Testnet RPC URL 2]
rpcs:
  - name: [RPC provider name]
    url: [RPC URL or provider website]
    type: [public/private/official]
  [Include 10-20 RPC endpoints, mix of public and private providers]
sourceCode:
  - name: [Repository name]
    url: [GitHub URL]
    description: [Brief description]
forums:
  - name: [Forum/Discord/community name]
    url: [URL]
    description: [Brief description]
# SDKs and tools are inherited from evm-common.md
---

[Opening paragraph: 1-2 memorable sentences capturing the chain's essence and position. Be opinionated and direct about what this chain IS in the ecosystem.]

**Unique Position**
[2-3 sentences explaining what problem this chain uniquely solves. What's the core differentiator? Include killer features or strategic advantages. Be specific about the value proposition.]

**Primary Use Cases**

- [Specific application type or use case]
- [Developer/user segment it attracts]
- [Scenario where it's optimal]
- [Another specific use case]
- [Fifth use case if applicable]

**Ecosystem Character**
[2-3 sentences describing dominant activity patterns and culture. What kind of community has formed? What applications gravitate here? Paint a picture of the chain's "personality".]

**Trade-offs**

- [Honest centralization reality or limitation]
- [Technical limitation or constraint]
- [Security/speed/cost compromise]
- [Ecosystem gap or dependency]
- [Another trade-off if significant]

## Technical Details

**Architecture**
[1-2 sentences clearly stating core technology: consensus mechanism, rollup type, settlement layer, data availability. Include unique implementation features.]

**Performance**
[2-3 sentences describing throughput and latency in relative terms. How does it handle congestion? Cost structure (high/low/volatile)? Compare to alternatives without specific numbers.]

**Security & Trust Model**
[3-4 sentences explaining validator/sequencer architecture and trust assumptions. Finality guarantees? What must users trust? Include significant security considerations.]

**Control & Governance**
[2-3 sentences about who controls critical components. How do changes happen? State governance reality, not aspirations. Include decentralization timeline if credible.]
```

**CONTENT GUIDELINES:**

1. **Focus on inherent properties**, not metrics
   - YES: "Cheapest L2 for simple transfers"
   - NO: "Fees are $0.001 per transaction"

2. **Be brutally honest about trade-offs**
   - Include centralization realities
   - Mention security compromises
   - State ecosystem limitations

3. **Write memorable, opinionated descriptions**
   - The opening should be quotable
   - Show personality, not corporate speak
   - Cut through marketing to show reality

4. **Verify through web search:**
   - Current RPCs that actually work
   - Active testnets and faucets
   - Real governance structure
   - Actual technology stack

5. **Length: 350-500 words for the content section**

**EXAMPLE REFERENCES:**
Look at these files for tone and structure:

- `/data/chains/ethereum.md` - The settlement layer description
- `/data/chains/base.md` - Corporate L2 positioning
- `/data/chains/polygon_pos.md` - Sidechain trade-offs
- `/data/chains/optimism.md` - Idealistic positioning

Remember: Web search for 2025 information is MANDATORY. Blockchain ecosystems change rapidly.
