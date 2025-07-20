---
tabs:
  - name: Overview
    id: overview
    fields: []
  - name: Resources
    id: resources
    fields:
      - field: docs
        label: Documentation
        icon: 📚
      - field: forums
        label: Community Forums
        icon: 💬
      - field: sourceCode
        label: Source Code
        icon: 📁
  - name: Explorers
    id: explorers
    fields:
      - field: blockscanners
        label: Block Explorers
        icon: 🔍
  - name: Dev
    id: development
    fields:
      - field: rpcs
        label: RPC
        icon: 🌐
      - field: testnets
        label: Testnets
        icon: 🧪
      - field: sdks
        label: SDKs & Libraries
        icon: 🛠️
      - field: tools
        label: Tools
        icon: ⚡
  - name: Wallets
    id: wallets
    fields: []
---

# Chain Information Tab Structure

This file defines the tab structure for chain detail pages in the Buildscape UI.

## Overview Tab
Displays the chain description and contract language information.

## Resources Tab
Groups documentation, community forums, and source code repositories.

## Explorers Tab
Lists block explorers and blockchain scanners for the chain.

## Development Tab
Contains developer resources including RPC endpoints, test networks, SDKs, and tools.

## Wallets Tab
For EVM-compatible chains, displays wallets from the wallets.md file.
For non-EVM chains, this tab is hidden.