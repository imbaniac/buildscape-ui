/**
 * Glossary of blockchain terms with descriptions and optional links
 */

export interface TooltipContent {
  text: string;
  link?: string;
  linkText?: string;
}

// Shared layer definitions
const layer1Content: TooltipContent = {
  text: "Layer 1 (L1) blockchains are the base foundation networks that provide security and finality for transactions. They handle consensus and data availability directly.",
};

const layer2Content: TooltipContent = {
  text: "Layer 2 (L2) blockchains are scaling solutions built on top of Layer 1 networks. They process transactions off the main chain while inheriting its security guarantees.",
};

const layer3Content: TooltipContent = {
  text: "Layer 3 (L3) blockchains are specialized chains built on top of Layer 2s to provide additional functionality or security guarantees. They power specific use cases or ecosystems.",
};

// Shared term definitions to avoid duplication
const lpTokensContent: TooltipContent = {
  text: "LP tokens represent your share of a liquidity pool, earning fees from trades in that pool.",
};

const dataAvailabilityContent: TooltipContent = {
  text: "DA (Data Availability) ensures transaction data is accessible to all network participants for verification.",
};

export const glossary: Record<string, TooltipContent> = {
  // Layer types - full names and abbreviations
  layer1: layer1Content,
  l1: layer1Content,

  layer2: layer2Content,
  l2: layer2Content,

  layer3: layer3Content,
  l3: layer3Content,

  // Technology stacks
  settlementLayer: {
    text: "The settlement layer is where the Layer 2's state transitions are finalized and secured. This is typically a Layer 1 blockchain that provides ultimate security.",
  },
  optimisticRollup: {
    text: "Optimistic Rollups assume transactions are valid by default and only run computations when challenged. They offer high throughput with a 7-day withdrawal delay for security.",
    link: "https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/",
  },
  zkRollup: {
    text: "ZK Rollups use zero-knowledge proofs to validate transactions cryptographically. They provide instant finality but require more complex computation.",
    link: "https://ethereum.org/en/developers/docs/scaling/zk-rollups/",
  },
  evm: {
    text: "EVM (Ethereum Virtual Machine) compatible chains can run Ethereum smart contracts and tools without modification, enabling easy migration of dApps.",
    link: "https://ethereum.org/en/developers/docs/evm/",
  },
  opStack: {
    text: "The OP Stack is a modular framework for building Layer 2 blockchains developed by Optimism. It provides standardized components for creating optimistic rollups.",
    link: "https://docs.optimism.io/stack/getting-started",
  },
  arbitrumNitro: {
    text: "Arbitrum Nitro is the technology stack powering Arbitrum chains, featuring advanced compression, improved EVM compatibility, and lower fees.",
    link: "https://docs.arbitrum.io/how-arbitrum-works/nitro/nitro-technology",
  },
  zkStack: {
    text: "The ZK Stack is a modular framework for building ZK-powered Layer 2s and Layer 3s, offering customizable and interconnected blockchain solutions.",
    link: "https://docs.zksync.io/zk-stack/",
  },
  sidechain: {
    text: "Sidechains are independent blockchains that run parallel to the main chain with their own consensus mechanisms, connected via a two-way bridge.",
  },
  validium: {
    text: "Validium is a scaling solution that uses validity proofs like ZK rollups but stores data off-chain, offering higher throughput at the cost of data availability guarantees.",
  },
  plasma: {
    text: "Plasma chains are Layer 2 scaling solutions that use fraud proofs and exit mechanisms to ensure security while processing transactions off the main chain.",
  },

  // EIP and technical terms
  "eip-4844": {
    text: "EIP-4844 (Proto-Danksharding) introduces blob transactions to Ethereum, dramatically reducing L2 costs by 90%+ through temporary data storage.",
    link: "https://www.eip4844.com/",
  },

  // DeFi terms
  defi: {
    text: "DeFi (Decentralized Finance) - Financial services built on blockchain without traditional intermediaries like banks.",
    link: "https://ethereum.org/en/defi/",
  },
  dex: {
    text: "DEX (Decentralized Exchange) - Platforms for trading cryptocurrencies without a central authority.",
  },
  amm: {
    text: "AMM (Automated Market Maker) - Protocol that uses liquidity pools instead of order books for trading.",
  },
  tvl: {
    text: "TVL (Total Value Locked) - The total value of assets deposited in a DeFi protocol or blockchain.",
  },

  // Consensus and validation
  pos: {
    text: "PoS (Proof of Stake) - Consensus mechanism where validators stake tokens to secure the network.",
    link: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
  },
  pow: {
    text: "PoW (Proof of Work) - Consensus mechanism using computational power to validate transactions (Bitcoin mining).",
  },
  validator: {
    text: "Validators secure the network by proposing and attesting to blocks, earning rewards for honest behavior.",
  },
  sequencer: {
    text: "Sequencer orders and batches transactions on L2s before submitting them to L1.",
  },

  // Transaction terms
  tps: {
    text: "TPS (Transactions Per Second) - Measure of blockchain throughput and scalability.",
  },
  gas: {
    text: "Gas is the unit measuring computational effort required to execute operations on Ethereum based chains.",
    link: "https://ethereum.org/en/developers/docs/gas/",
  },
  gwei: {
    text: "Gwei (gigawei) - Unit of Ether used for gas prices. 1 Gwei = 0.000000001 ETH.",
  },

  // NFT and tokens
  nft: {
    text: "NFT (Non-Fungible Token) - Unique digital assets representing ownership of specific items or content.",
    link: "https://ethereum.org/en/nft/",
  },
  erc20: {
    text: "ERC-20 - Token standard for fungible tokens on Ethereum (like USDC, DAI).",
  },
  erc721: {
    text: "ERC-721 - Token standard for non-fungible tokens (NFTs) on Ethereum.",
  },

  // Bridge and interoperability
  bridge: {
    text: "Bridges transfer assets and data between different blockchains, enabling cross-chain functionality.",
  },
  "fraud proof": {
    text: "Fraud proofs allow anyone to challenge invalid state transitions on optimistic rollups during the challenge period.",
  },
  "validity proof": {
    text: "Validity proofs (ZK proofs) cryptographically prove that state transitions are correct without revealing the data.",
  },

  // Governance
  dao: {
    text: "DAO (Decentralized Autonomous Organization) - Organization governed by smart contracts and token holders.",
  },
  multisig: {
    text: "Multisig (Multi-signature) wallet requires multiple signatures to execute transactions, improving security.",
  },

  // Performance metrics
  finality: {
    text: "Finality is when a transaction becomes irreversible. Instant on ZK rollups, delayed on optimistic rollups.",
  },
  throughput: {
    text: "Throughput measures how many transactions a blockchain can process, usually measured in TPS.",
  },
  latency: {
    text: "Latency is the time delay between submitting a transaction and its confirmation.",
  },

  // Security
  "51% attack": {
    text: "51% attack occurs when a single entity controls majority of network's mining/validating power, enabling double-spending.",
  },
  slashing: {
    text: "Slashing penalizes validators for malicious behavior by burning their staked tokens.",
  },
  mev: {
    text: "MEV (Maximum Extractable Value) - Profit extracted by reordering, including, or excluding transactions in a block.",
    link: "https://ethereum.org/en/developers/docs/mev/",
  },

  // Additional terms
  hashpower: {
    text: "Hashpower is the total computational power used by miners to process transactions and secure a proof-of-work blockchain.",
  },
  rollup: {
    text: "Rollups bundle hundreds of transactions into a single transaction on L1, reducing costs while maintaining security.",
    link: "https://ethereum.org/en/developers/docs/scaling/#rollups",
  },
  custodian: {
    text: "A custodian holds and secures digital assets on behalf of users, managing private keys and transactions.",
  },
  bitvm: {
    text: "BitVM enables Turing-complete smart contracts on Bitcoin using fraud proofs and off-chain computation.",
    link: "https://bitvm.org/",
  },
  dapp: {
    text: "dApp (Decentralized Application) - Application that runs on a blockchain network rather than centralized servers.",
  },
  tee: {
    text: "TEE (Trusted Execution Environment) - Secure hardware area that ensures code and data are protected during execution.",
  },
  posa: {
    text: "PoSA (Proof of Staked Authority) - Consensus combining Proof of Stake with authorized validators for better performance.",
  },
  "eip-7702": {
    text: "EIP-7702 enables EOA wallets to temporarily act as smart contracts, adding programmability to regular accounts.",
    link: "https://eips.ethereum.org/EIPS/eip-7702",
  },
  lp: lpTokensContent,
  "lp tokens": lpTokensContent,
  da: dataAvailabilityContent,
  "data availability": dataAvailabilityContent,
  subnets: {
    text: "Subnets are independent blockchains within a network that can have custom rules while sharing security.",
  },
  dag: {
    text: "DAG (Directed Acyclic Graph) - Alternative to blockchain structure where transactions form a graph instead of linear blocks.",
  },
  rpc: {
    text: "RPC (Remote Procedure Call) endpoints allow applications to interact with blockchain nodes to read data and send transactions.",
  },
  zkevm: {
    text: "zkEVM is an EVM-compatible environment that uses zero-knowledge proofs for scalability and privacy.",
    link: "https://ethereum.org/en/developers/docs/scaling/zk-rollups/#zk-evms",
  },
};
