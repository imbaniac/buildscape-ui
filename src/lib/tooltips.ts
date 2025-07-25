/**
 * Tooltip texts for technology stamps in the chain info page
 */

export const tooltipTexts = {
  layer1:
    "Layer 1 blockchains are the base foundation networks that provide security and finality for transactions. They handle consensus and data availability directly.",
  layer2:
    "Layer 2 blockchains are scaling solutions built on top of Layer 1 networks. They process transactions off the main chain while inheriting its security guarantees.",
  layer3:
    "Layer 3 blockchains are specialized chains built on top of Layer 2s to provide additional functionality or security guarantees. They are typically used to power specific use cases or ecosystems.",
  settlementLayer:
    "The settlement layer is where the Layer 2's state transitions are finalized and secured. This is typically a Layer 1 blockchain that provides ultimate security.",
  optimisticRollup:
    "Optimistic Rollups assume transactions are valid by default and only run computations when challenged. They offer high throughput with a withdrawal delay for security.",
  zkRollup:
    "ZK Rollups use zero-knowledge proofs to validate transactions cryptographically. They provide instant finality but require more complex computation.",
  evm: "EVM (Ethereum Virtual Machine) compatible chains can run Ethereum smart contracts and tools without modification, enabling easy migration of dApps.",
  opStack:
    "The OP Stack is a modular framework for building Layer 2 blockchains developed by Optimism. It provides standardized components for creating optimistic rollups.",
  arbitrumNitro:
    "Arbitrum Nitro is the technology stack powering Arbitrum chains, featuring advanced compression, improved EVM compatibility, and lower fees.",
  zkStack:
    "The ZK Stack is a modular framework for building ZK-powered Layer 2s and Layer 3s, offering customizable and interconnected blockchain solutions.",
  sidechain:
    "Sidechains are independent blockchains that run parallel to the main chain with their own consensus mechanisms, connected via a two-way bridge.",
  validium:
    "Validium is a scaling solution that uses validity proofs like ZK rollups but stores data off-chain, offering higher throughput at the cost of data availability guarantees.",
  plasma:
    "Plasma chains are Layer 2 scaling solutions that use fraud proofs and exit mechanisms to ensure security while processing transactions off the main chain.",
};