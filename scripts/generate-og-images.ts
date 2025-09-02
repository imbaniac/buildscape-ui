#!/usr/bin/env bun
import { Resvg } from "@resvg/resvg-js";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import satori from "satori";
import YAML from "yaml";

// Configuration
const OUTPUT_DIR = "./static/og";
const CHAIN_DATA_DIR = "./data/chains";
const INTER_FONT_PATH = "./scripts/Inter-Regular.ttf";

// Ensure output directory exists
async function ensureDir(path: string) {
  try {
    await mkdir(path, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

// Parse markdown frontmatter
function parseFrontmatter(content: string) {
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  if (match) {
    return YAML.parse(match[1]);
  }
  return {};
}

// Convert satori SVG to PNG
async function svgToPng(svg: string): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    background: "white",
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

// Generate homepage/map OG image
async function generateMapOG(interFont: ArrayBuffer) {
  console.log("Generating map OG image...");

  // Load Buildscape logo with text
  let logoData = null;
  try {
    const logoContent = await readFile("./static/bs-logo.svg", "utf-8");
    logoData = `data:image/svg+xml;base64,${Buffer.from(logoContent).toString("base64")}`;
  } catch {
    console.log("Could not load bs-logo.svg");
  }

  // Fetch metrics from API
  let metrics = {
    active_chains: 38,
    total_transactions: 1803910,
    total_active_addresses: 413542,
  };
  try {
    const response = await fetch("https://api.buildscape.org/overview");
    if (response.ok) {
      const data = await response.json();
      metrics = {
        active_chains: data.active_chains,
        total_transactions: data.total_transactions,
        total_active_addresses: data.total_active_addresses,
      };
    }
  } catch {
    console.log("Using default metrics");
  }

  // Format numbers helper
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
    return String(num);
  };

  const element = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(180deg, #0a2342 0%, #1e4c8a 50%, #2c5f7c 100%)",
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
        padding: "80px",
      },
      children: [
        // Wave pattern overlay (same as chain OG)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(ellipse at 20% 80%, rgba(44, 95, 124, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(30, 74, 138, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 40%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 70%, rgba(41, 128, 185, 0.2) 0%, transparent 40%)
              `,
              pointerEvents: "none",
            },
          },
        },
        // Main content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: "1",
            },
            children: [
              // Logo and subtitle section
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "60px",
                  },
                  children: [
                    // Combined logo with Buildscape text
                    logoData && {
                      type: "div",
                      props: {
                        style: {
                          marginBottom: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        children: {
                          type: "img",
                          props: {
                            src: logoData,
                            style: {
                              width: "800px",
                              height: "160px",
                              objectFit: "contain",
                            },
                          },
                        },
                      },
                    },
                    // Subtitle
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: "28px",
                          color: "#aed6f1",
                          textAlign: "center",
                          margin: "0",
                          fontWeight: "400",
                          letterSpacing: "0.5px",
                        },
                        children: "The blockchain ecosystem, mapped",
                      },
                    },
                  ].filter(Boolean),
                },
              },
              // Metrics cards section (matching chain OG style)
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "24px",
                    marginBottom: "40px",
                  },
                  children: [
                    // Active Chains card
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          padding: "24px 32px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          minWidth: "200px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "4px",
                                height: "40px",
                                background: "#4599BF",
                                borderRadius: "2px",
                              },
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "36px",
                                      fontWeight: "800",
                                      color: "white",
                                      lineHeight: "1",
                                    },
                                    children: String(metrics.active_chains),
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "14px",
                                      color: "#8b9dc3",
                                      marginTop: "4px",
                                      fontWeight: "600",
                                      letterSpacing: "0.5px",
                                    },
                                    children: "ACTIVE CHAINS",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // Transactions card
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          padding: "24px 32px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          minWidth: "200px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "4px",
                                height: "40px",
                                background: "#5dade2",
                                borderRadius: "2px",
                              },
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "36px",
                                      fontWeight: "800",
                                      color: "white",
                                      lineHeight: "1",
                                    },
                                    children: formatNumber(
                                      metrics.total_transactions,
                                    ),
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "14px",
                                      color: "#8b9dc3",
                                      marginTop: "4px",
                                      fontWeight: "600",
                                      letterSpacing: "0.5px",
                                    },
                                    children: "TRANSACTIONS (24H)",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // Active Users card
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          padding: "24px 32px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          minWidth: "200px",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: "4px",
                                height: "40px",
                                background: "#48c9b0",
                                borderRadius: "2px",
                              },
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "36px",
                                      fontWeight: "800",
                                      color: "white",
                                      lineHeight: "1",
                                    },
                                    children: formatNumber(
                                      metrics.total_active_addresses,
                                    ),
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: "14px",
                                      color: "#8b9dc3",
                                      marginTop: "4px",
                                      fontWeight: "600",
                                      letterSpacing: "0.5px",
                                    },
                                    children: "ACTIVE USERS (24H)",
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              // Tagline
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "20px",
                    color: "#aed6f1",
                    textAlign: "center",
                    margin: "0",
                    fontStyle: "italic",
                    opacity: 0.9,
                  },
                  children: "Discover what makes each blockchain unique",
                },
              },
            ],
          },
        },
        // Buildscape branding (matching chain OG placement)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "40px",
              right: "80px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "24px",
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.3)",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                  },
                  children: "buildscape.org",
                },
              },
            ],
          },
        },
        // Ocean wave at bottom (matching chain OG)
        {
          type: "svg",
          props: {
            width: "100%",
            height: "120",
            viewBox: "0 0 1200 120",
            style: {
              position: "absolute",
              bottom: "0",
              left: "0",
              opacity: "0.1",
            },
            children: [
              {
                type: "path",
                props: {
                  d: "M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z",
                  fill: "#4599BF",
                  opacity: "0.3",
                },
              },
              {
                type: "path",
                props: {
                  d: "M0,80 Q300,50 600,80 T1200,80 L1200,120 L0,120 Z",
                  fill: "rgba(93, 173, 226, 0.2)",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: interFont,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const png = await svgToPng(svg);
  await ensureDir(OUTPUT_DIR);
  await writeFile(join(OUTPUT_DIR, "map.png"), png);
  console.log("✓ Generated map.png");
}

// Generate chain-specific OG image
async function generateChainOG(chain: any, metrics: any, font: ArrayBuffer) {
  const { name, chainId, color, technology, slug } = chain;

  // Use metrics passed from overview data
  const chainMetrics = {
    population: metrics.active_addresses || 0,
    transactions: metrics.transactions || 0,
    tps: Math.round(metrics.tps || 0),
  };

  // Format metrics
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
    return String(num);
  };

  // Try to load chain logo with special cases handling
  let logoData = null;
  let logoSlug = slug;

  // Handle special cases for logo names
  if (slug === "polygon_pos" || slug === "polygon_zkevm") {
    logoSlug = "polygon";
  } else if (slug === "bnb") {
    logoSlug = "bnb"; // Make sure it's lowercase
  }

  try {
    const logoPath = join("./assets/chains", `${logoSlug}.svg`);
    const logoContent = await readFile(logoPath, "utf-8");
    // Convert SVG to base64 data URL
    logoData = `data:image/svg+xml;base64,${Buffer.from(logoContent).toString(
      "base64",
    )}`;
  } catch {
    // Try PNG fallback
    try {
      const logoPngPath = join("./assets/chains", `${logoSlug}.png`);
      const logoPngContent = await readFile(logoPngPath);
      logoData = `data:image/png;base64,${logoPngContent.toString("base64")}`;
    } catch {
      console.log(`No logo found for ${slug} (tried ${logoSlug})`);
    }
  }

  const chainColor = color || "#3498db";
  const chainType =
    technology?.type ||
    (technology?.vm?.evmCompatible ? "EVM Chain" : "Blockchain");

  const element = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(180deg, #0a2342 0%, #1e4c8a 50%, #2c5f7c 100%)",
        position: "relative",
        fontFamily: "Inter",
        overflow: "hidden",
      },
      children: [
        // Wave pattern overlay (same as map OG)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                  radial-gradient(ellipse at 20% 80%, rgba(44, 95, 124, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 20%, rgba(30, 74, 138, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 40% 40%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
                  radial-gradient(ellipse at 90% 70%, rgba(41, 128, 185, 0.2) 0%, transparent 40%)
                `,
              pointerEvents: "none",
            },
          },
        },
        // Main content container
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              height: "100%",
              padding: "80px",
              position: "relative",
            },
            children: [
              // Left side - Logo and chain info
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                    justifyContent: "center",
                    paddingRight: "60px",
                  },
                  children: [
                    // Logo container
                    logoData && {
                      type: "div",
                      props: {
                        style: {
                          width: "120px",
                          height: "120px",
                          marginBottom: "40px",
                          background: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        },
                        children: {
                          type: "img",
                          props: {
                            src: logoData,
                            style: {
                              width: "72px",
                              height: "72px",
                              objectFit: "contain",
                            },
                          },
                        },
                      },
                    },
                    // Chain name
                    {
                      type: "h1",
                      props: {
                        style: {
                          fontSize: "64px",
                          fontWeight: "800",
                          color: "white",
                          margin: "0 0 16px 0",
                          letterSpacing: "-2px",
                          lineHeight: "1",
                        },
                        children: name,
                      },
                    },
                    // Chain type badge
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignSelf: "flex-start",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        },
                        children: {
                          type: "span",
                          props: {
                            style: {
                              fontSize: "14px",
                              color: "#1a2f4e",
                              fontWeight: "700",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                            },
                            children: chainType,
                          },
                        },
                      },
                    },
                  ].filter(Boolean),
                },
              },
              // Right side - Metrics
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  },
                  children: [
                    // Metric cards
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        },
                        children: [
                          // Population card
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "24px",
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "24px 32px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: "4px",
                                      height: "40px",
                                      background: chainColor,
                                      borderRadius: "2px",
                                    },
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      display: "flex",
                                      flexDirection: "column",
                                    },
                                    children: [
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "36px",
                                            fontWeight: "800",
                                            color: "white",
                                            lineHeight: "1",
                                          },
                                          children: formatNumber(
                                            chainMetrics.population,
                                          ),
                                        },
                                      },
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "14px",
                                            color: "#8b9dc3",
                                            marginTop: "4px",
                                            fontWeight: "600",
                                            letterSpacing: "0.5px",
                                          },
                                          children: "POPULATION (24H)",
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                          // Transactions card
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "24px",
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "24px 32px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: "4px",
                                      height: "40px",
                                      background: "#5dade2",
                                      borderRadius: "2px",
                                    },
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      display: "flex",
                                      flexDirection: "column",
                                    },
                                    children: [
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "36px",
                                            fontWeight: "800",
                                            color: "white",
                                            lineHeight: "1",
                                          },
                                          children: formatNumber(
                                            chainMetrics.transactions,
                                          ),
                                        },
                                      },
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "14px",
                                            color: "#8b9dc3",
                                            marginTop: "4px",
                                            fontWeight: "600",
                                            letterSpacing: "0.5px",
                                          },
                                          children: "TRANSACTIONS (24H)",
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                          // TPS card
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "24px",
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "24px 32px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: "4px",
                                      height: "40px",
                                      background: "#48c9b0",
                                      borderRadius: "2px",
                                    },
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      display: "flex",
                                      flexDirection: "column",
                                    },
                                    children: [
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "36px",
                                            fontWeight: "800",
                                            color: "white",
                                            lineHeight: "1",
                                          },
                                          children: String(chainMetrics.tps),
                                        },
                                      },
                                      {
                                        type: "div",
                                        props: {
                                          style: {
                                            fontSize: "14px",
                                            color: "#8b9dc3",
                                            marginTop: "4px",
                                            fontWeight: "600",
                                            letterSpacing: "0.5px",
                                          },
                                          children: "AVG TPS (24H)",
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Buildscape branding
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "40px",
              right: "80px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "24px",
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.3)",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                  },
                  children: "buildscape.org",
                },
              },
            ],
          },
        },
        // Ocean reference - subtle wave at bottom
        {
          type: "svg",
          props: {
            width: "100%",
            height: "120",
            viewBox: "0 0 1200 120",
            style: {
              position: "absolute",
              bottom: "0",
              left: "0",
              opacity: "0.1",
            },
            children: [
              {
                type: "path",
                props: {
                  d: "M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z",
                  fill: chainColor,
                  opacity: "0.3",
                },
              },
              {
                type: "path",
                props: {
                  d: "M0,80 Q300,50 600,80 T1200,80 L1200,120 L0,120 Z",
                  fill: "rgba(93, 173, 226, 0.2)",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: font,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const png = await svgToPng(svg);
  await writeFile(join(OUTPUT_DIR, `chain-${slug}.png`), png);
  console.log(`✓ Generated chain-${slug}.png`);
}

// Main generation function
async function generateAllOGImages() {
  console.log("Starting OG image generation...\n");

  // Load fonts
  let interFont: ArrayBuffer;

  try {
    const interBuffer = await readFile(INTER_FONT_PATH);
    interFont = interBuffer as unknown as ArrayBuffer;
  } catch (e) {
    console.error("Inter font file not found at", INTER_FONT_PATH, e);
    process.exit(1);
  }

  // Fetch overview data for all chains
  console.log("Fetching chain metrics from API...");
  const chainMetricsMap = new Map();

  try {
    const response = await fetch(
      "https://api.buildscape.org/overview?period=24h",
    );
    if (response.ok) {
      const data = await response.json();
      // Create lookup map by chainId
      for (const chain of data.chains) {
        chainMetricsMap.set(chain.chain_id, {
          tvl_usd: chain.tvl,
          tps: chain.tps,
          gas_price_gwei: chain.gas_price,
          transactions: chain.transactions,
          active_addresses: chain.active_addresses,
        });
      }
      console.log(`Loaded metrics for ${chainMetricsMap.size} chains`);
    }
  } catch (e) {
    console.error("Failed to fetch overview data:", e);
    console.log("Continuing with default values...");
  }

  // Generate map OG
  await generateMapOG(interFont);

  // Load chain data
  console.log("\nGenerating chain OG images...");
  const { readdir } = await import("fs/promises");
  const files = await readdir(CHAIN_DATA_DIR);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await readFile(join(CHAIN_DATA_DIR, file), "utf-8");
    const chain = parseFrontmatter(content);
    const slug = file.replace(".md", "");

    // Get real metrics from overview data or use defaults
    const metrics = chainMetricsMap.get(chain.chainId) || {
      tvl_usd: 0,
      tps: 0,
      gas_price_gwei: 0,
      transactions: 0,
      active_addresses: 0,
    };

    await generateChainOG({ ...chain, slug }, metrics, interFont);
  }

  console.log("\n✅ OG image generation complete!");
}

// Run the script
generateAllOGImages().catch(console.error);
