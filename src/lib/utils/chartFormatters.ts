export function formatChartValue(
  value: number | undefined,
  type: "tvl" | "tps" | "gas" | "count" | "blockTime",
): string {
  if (value === undefined || value === null) {
    return "-";
  }

  if (type === "tvl") {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  } else if (type === "tps") {
    return value.toFixed(1);
  } else if (type === "gas") {
    return value ? `${value.toFixed(1)}` : "-";
  } else if (type === "blockTime") {
    return value ? `${value.toFixed(1)}s` : "-";
  } else if (type === "count") {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  }
  return value.toString();
}
