export default async function getDynamicData(
  span: "1h" | "24h" | "7d" | "30d"
) {
  // Generate plausible random data for demonstration
  const baseBlock = 22522165;
  const lastBlock = baseBlock + Math.floor(Math.random() * 1000);
  const lastGas = Math.floor(Math.random() * 100) + 20;
  const lastBlockSize = (Math.random() * 2 + 1).toFixed(2);
  const blockGasLimit = Math.floor(Math.random() * 1000000) + 1000000;

  // Metrics vary by span
  const multipliers = {
    "1h": 1,
    "24h": 24,
    "7d": 7 * 24,
    "30d": 30 * 24,
  };
  const m = multipliers[span] || 1;

  return {
    lastBlock,
    lastGas,
    lastBlockSize: Number(lastBlockSize),
    metrics: {
      txPerSecond: Number((12 + Math.random() * 3).toFixed(2)),
      numTransactions: Math.floor(10000 * m + Math.random() * 5000 * m),
      uniqueUsers: Math.floor(1000 * m + Math.random() * 500 * m),
      contractsDeployed: Math.floor(100 * m + Math.random() * 50 * m),
    },
  };
}
