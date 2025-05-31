import zksyncPng from "$lib/assets/chains/zksync.png";
import baseSvg from "$lib/assets/chains/base.svg";
import arbitrumSvg from "$lib/assets/chains/arbitrum.svg";
import optimismSvg from "$lib/assets/chains/optimism.svg";
import unichainSvg from "$lib/assets/chains/unichain.svg";
import polygonSvg from "$lib/assets/chains/polygon.svg";
import ethereumSvg from "$lib/assets/chains/ethereum.svg";

export const ethereum = {
  name: "Ethereum",
  color: "#8A93B2",
  darkColor: "#6B7390",
  logo: ethereumSvg,
};

export const evmBlockchains = {
  arbitrum: {
    name: "Arbitrum",
    color: "#12AAFF",
    darkColor: "#1C8CC9",
    logo: arbitrumSvg,
  },
  optimism: {
    name: "Optimism",
    color: "#FF0420",
    darkColor: "#CC0319",
    logo: optimismSvg,
  },
  base: {
    name: "Base",
    color: "#0052FF",
    darkColor: "#0041CC",
    logo: baseSvg,
  },
  unichain: {
    name: "Unichain",
    color: "#F50FB4",
    darkColor: "#C3008A",
    logo: unichainSvg,
  },
  polygon: {
    name: "Polygon",
    color: "#6C00F6",
    darkColor: "#4700A8",
    logo: polygonSvg,
  },
  zksync: {
    name: "ZKsync Era",
    color: "#0C18EC",
    darkColor: "#0E16A5",
    logo: zksyncPng,
  },
};
