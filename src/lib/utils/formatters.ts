export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return num.toString();

  if (n >= 1e9) {
    return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (n >= 1e6) {
    return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (n >= 1e3) {
    return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return Math.round(n).toString();
}

export function formatNumberWithCommas(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return num.toString();
  return n.toLocaleString();
}

export function formatTVL(value: number | undefined): string {
  if (!value || value === 0) return "—";

  // For values >= $1B, show in billions
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  // For values >= $1M, show in millions
  else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  // For values >= $1K, show in thousands
  else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}k`;
  }
  // For very small values, just show the dollar amount
  else {
    return `$${value.toFixed(0)}`;
  }
}
