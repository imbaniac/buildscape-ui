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
  return n.toString();
}

export function formatNumberWithCommas(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return num.toString();
  return n.toLocaleString();
}