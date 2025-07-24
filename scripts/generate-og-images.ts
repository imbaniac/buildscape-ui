#!/usr/bin/env bun
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import YAML from "yaml";

// Configuration
const OUTPUT_DIR = "./static/og";
const CHAIN_DATA_DIR = "./src/data/chains";
const FONT_PATH = "./scripts/Inter-Regular.ttf"; // We'll need to download this

// Ensure output directory exists
async function ensureDir(path: string) {
  try {
    await mkdir(path, { recursive: true });
  } catch (e) {
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
async function generateMapOG(font: ArrayBuffer) {
  console.log("Generating map OG image...");

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
  } catch (e) {
    console.log("Using default metrics");
  }

  const element = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(180deg, #0a2342 0%, #1e4c8a 50%, #2c5f7c 100%)",
        padding: "60px",
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Wave pattern overlay
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
        // Top section
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1,
              marginTop: "20px",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "72px",
                    fontWeight: "800",
                    color: "white",
                    margin: "0 0 10px 0",
                    textAlign: "center",
                    letterSpacing: "-2px",
                    textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                  children: "BUILDSCAPE",
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "28px",
                    color: "#5dade2",
                    textAlign: "center",
                    margin: "0",
                    fontWeight: "500",
                    letterSpacing: "2px",
                  },
                  children: "Sea of Chains",
                },
              },
            ],
          },
        },
        // Metrics section
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: "80px",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              marginTop: "40px",
              marginBottom: "40px",
            },
            children: [
              // Chains metric
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "64px",
                          fontWeight: "800",
                          color: "#fff",
                          lineHeight: "1",
                          textShadow: "0 4px 20px rgba(93, 173, 226, 0.5)",
                        },
                        children: String(metrics.active_chains),
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          color: "#aed6f1",
                          marginTop: "8px",
                          fontWeight: "600",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        },
                        children: "CHAINS",
                      },
                    },
                  ],
                },
              },
              // Transactions metric
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "64px",
                          fontWeight: "800",
                          color: "#fff",
                          lineHeight: "1",
                          textShadow: "0 4px 20px rgba(52, 152, 219, 0.5)",
                        },
                        children:
                          metrics.total_transactions >= 1e6
                            ? `${(metrics.total_transactions / 1e6).toFixed(
                                1
                              )}M`
                            : `${(metrics.total_transactions / 1e3).toFixed(
                                0
                              )}K`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          color: "#aed6f1",
                          marginTop: "8px",
                          fontWeight: "600",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        },
                        children: "TRANSACTIONS",
                      },
                    },
                  ],
                },
              },
              // Population metric
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "64px",
                          fontWeight: "800",
                          color: "#fff",
                          lineHeight: "1",
                          textShadow: "0 4px 20px rgba(41, 128, 185, 0.5)",
                        },
                        children:
                          metrics.total_active_addresses >= 1e6
                            ? `${(metrics.total_active_addresses / 1e6).toFixed(
                                1
                              )}M`
                            : `${(metrics.total_active_addresses / 1e3).toFixed(
                                0
                              )}K`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          color: "#aed6f1",
                          marginTop: "8px",
                          fontWeight: "600",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        },
                        children: "POPULATION",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Bottom tagline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1,
              marginBottom: "20px",
            },
            children: [
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "22px",
                    color: "#85c1e5",
                    textAlign: "center",
                    margin: "0",
                    fontStyle: "italic",
                    opacity: 0.9,
                  },
                  children: "Navigate the decentralized ocean",
                },
              },
            ],
          },
        },
        // Wave decorations
        {
          type: "svg",
          props: {
            width: "100%",
            height: "100",
            viewBox: "0 0 1200 100",
            style: {
              position: "absolute",
              bottom: "0",
              left: "0",
              opacity: "0.2",
            },
            children: [
              {
                type: "path",
                props: {
                  d: "M0,40 Q300,20 600,40 T1200,40 L1200,100 L0,100 Z",
                  fill: "rgba(255, 255, 255, 0.1)",
                },
              },
              {
                type: "path",
                props: {
                  d: "M0,60 Q300,40 600,60 T1200,60 L1200,100 L0,100 Z",
                  fill: "rgba(93, 173, 226, 0.1)",
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
  await ensureDir(OUTPUT_DIR);
  await writeFile(join(OUTPUT_DIR, "map.png"), png);
  console.log("✓ Generated map.png");
}

// Generate chain-specific OG image
async function generateChainOG(chain: any, metrics: any, font: ArrayBuffer) {
  const { name, chainId, nativeCurrency, color, darkColor, technology, slug } =
    chain;

  // Fetch real metrics from API
  let chainMetrics = {
    population: 0,
    transactions: 0,
    tps: 0,
  };

  try {
    const response = await fetch(
      `https://api.buildscape.org/chains/${chainId}/metrics?period=24h`
    );

    if (response.ok) {
      const data = await response.json();
      chainMetrics = {
        population: data.active_addresses || 0,
        transactions: data.transactions || 0,
        tps: Math.round(data.tps || 0),
      };
    }
  } catch (e) {
    console.log(`Failed to fetch metrics for ${slug}, using defaults`);
  }

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
    const logoPath = join(
      dirname(CHAIN_DATA_DIR),
      "..",
      "lib",
      "assets",
      "chains",
      `${logoSlug}.svg`
    );
    const logoContent = await readFile(logoPath, "utf-8");
    // Convert SVG to base64 data URL
    logoData = `data:image/svg+xml;base64,${Buffer.from(logoContent).toString(
      "base64"
    )}`;
  } catch (e) {
    // Try PNG fallback
    try {
      const logoPngPath = join(
        dirname(CHAIN_DATA_DIR),
        "..",
        "lib",
        "assets",
        "chains",
        `${logoSlug}.png`
      );
      const logoPngContent = await readFile(logoPngPath);
      logoData = `data:image/png;base64,${logoPngContent.toString("base64")}`;
    } catch (e2) {
      console.log(`No logo found for ${slug} (tried ${logoSlug})`);
    }
  }

  const chainColor = color || "#3498db";
  const chainType =
    technology?.type || (technology?.isEVM ? "EVM Chain" : "Blockchain");

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
              zIndex: 1,
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
                                            chainMetrics.population
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
                                            chainMetrics.transactions
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

  // Download font if not exists (you'll need to do this manually for now)
  let font: ArrayBuffer;
  try {
    font = await readFile(FONT_PATH);
  } catch (e) {
    console.error("Font file not found. Downloading Inter font...");
    const response = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
    );
    const woff2 = await response.arrayBuffer();
    // Note: We need TTF, not WOFF2. For now, you'll need to download Inter-Regular.ttf manually
    console.error(
      "Please download Inter-Regular.ttf and place it in scripts/Inter-Regular.ttf"
    );
    process.exit(1);
  }

  // Generate map OG
  await generateMapOG(font);

  // Load chain data
  console.log("\nGenerating chain OG images...");
  const { readdir } = await import("fs/promises");
  const files = await readdir(CHAIN_DATA_DIR);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await readFile(join(CHAIN_DATA_DIR, file), "utf-8");
    const chain = parseFrontmatter(content);
    const slug = file.replace(".md", "");

    // For now, use placeholder metrics. In production, you'd fetch real data
    const metrics = {
      tvl_usd: Math.random() * 10e9, // Placeholder
      tps: Math.random() * 100, // Placeholder
      gas_price_gwei: Math.random() * 50, // Placeholder
    };

    await generateChainOG({ ...chain, slug }, metrics, font);
  }

  console.log("\n✅ OG image generation complete!");
}

// Run the script
generateAllOGImages().catch(console.error);
