# Chain Description Update Guide

## Goal
Update chain descriptions to be more user-friendly while preserving technical details for builders. Cut through marketing bullshit and show what each chain REALLY offers.

## Structure for Each Chain

```markdown
---
[frontmatter remains unchanged]
---

[One paragraph plain English explanation]
The key difference: [What makes this chain unique vs competitors]

**Best for:** [2-3 specific use cases, be concrete]

**Technical:** [One-line technical description with jargon]

- **Security & Data Availability**
  [Keep existing structure but update if needed]
  
- **Infra & Execution**  
  [Keep existing structure but update if needed]
  
- **Performance**  
  [Keep existing structure but update if needed]
  
- **Use Cases**  
  [Update with SPECIFIC examples: real apps, protocols, use patterns]
  
- **Trade-offs**  
  [Keep existing structure - be honest about limitations]
```

## Key Principles

1. **No marketing fluff** - Be honest about what the chain actually does differently
2. **Avoid specific numbers** - Don't include TVL, user counts, TPS that change quickly (these go in metrics sidebar)
3. **Show real differentiators** - Why choose this over similar chains?
4. **Concrete examples** - Name actual apps/protocols using it
5. **Keep it short** - Regular users have short attention spans
6. **Preserve technical sections** - Builders need the detailed info

## Examples of Good Differentiators

### zkEVMs
- **Scroll**: Prioritizes 100% Ethereum compatibility, no code changes needed
- **zkSync Era**: Custom VM for faster proofs, requires special compiler
- **Polygon zkEVM**: Balances compatibility and performance

### Optimistic Rollups  
- **Base**: Coinbase integration, fiat onramps, consumer apps focus
- **Arbitrum**: Largest ecosystem, most mature
- **Optimism**: Public goods funding, Superchain vision

### Special Cases
- **Lisk**: Was JavaScript L1, now Optimism L2 focused on emerging markets
- **Immutable**: Gaming-specific optimizations
- **Mantle**: Treasury-backed, uses ETH + MNT for gas

## What NOT to Do

❌ "A fast, cheap, scalable L2" (too generic, applies to all)
❌ "$5B TVL, 2M users" (changes too quickly)
❌ "Revolutionary technology" (marketing speak)
❌ Removing the technical sections (builders need them)
❌ Adding duplicate headings (UI auto-generates "What is [Chain]?")

## Research Tips

- Search for "[Chain1] vs [Chain2] 2025" to find real differences
- Look for actual usage, not just promises
- Check what major apps are deployed there
- Verify recent changes (like Lisk's L1→L2 transition)
- Focus on what developers actually care about when choosing

## Completed Examples

✅ **Scroll** - Updated with clear differentiator (100% Ethereum compatibility), concrete use cases, preserved technical structure