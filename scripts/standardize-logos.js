#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target viewBox size
const TARGET_SIZE = 1000;

async function processsvg(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const dom = new JSDOM(content, { contentType: "image/svg+xml" });
    const svg = dom.window.document.querySelector("svg");

    if (!svg) {
      console.error(`No SVG element found in ${filePath}`);
      return;
    }

    // Get current viewBox or derive from width/height
    let viewBox = svg.getAttribute("viewBox");
    let currentWidth,
      currentHeight,
      minX = 0,
      minY = 0;

    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      minX = parts[0] || 0;
      minY = parts[1] || 0;
      currentWidth = parts[2] || TARGET_SIZE;
      currentHeight = parts[3] || TARGET_SIZE;
    } else {
      // Try to get from width/height attributes
      currentWidth = parseFloat(svg.getAttribute("width")) || TARGET_SIZE;
      currentHeight = parseFloat(svg.getAttribute("height")) || TARGET_SIZE;
    }

    // Calculate scale to fit within target size while maintaining aspect ratio
    const scale = Math.min(
      TARGET_SIZE / currentWidth,
      TARGET_SIZE / currentHeight,
    );
    const scaledWidth = currentWidth * scale;
    const scaledHeight = currentHeight * scale;

    // Calculate offset to center the content
    const offsetX = (TARGET_SIZE - scaledWidth) / 2;
    const offsetY = (TARGET_SIZE - scaledHeight) / 2;

    // Create a wrapper group with transform
    const g = dom.window.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    g.setAttribute(
      "transform",
      `translate(${offsetX}, ${offsetY}) scale(${scale})`,
    );

    // Move all direct children of SVG into the group
    const children = Array.from(svg.children);
    children.forEach((child) => {
      g.appendChild(child);
    });

    // Clear SVG and add the group
    svg.innerHTML = "";
    svg.appendChild(g);

    // Set new viewBox and dimensions
    svg.setAttribute("viewBox", `0 0 ${TARGET_SIZE} ${TARGET_SIZE}`);
    svg.setAttribute("width", TARGET_SIZE);
    svg.setAttribute("height", TARGET_SIZE);

    // Remove any preserveAspectRatio that might interfere
    svg.removeAttribute("preserveAspectRatio");

    // Serialize back to string
    const serializer = new dom.window.XMLSerializer();
    let result = serializer.serializeToString(svg);

    // Clean up the output
    result = result.replace(/xmlns=""/g, "");

    // Write back to file
    await fs.writeFile(filePath, result, "utf-8");
    console.log(`✓ Processed ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  const chainsDir = path.join(__dirname, "..", "assets", "chains");

  try {
    const files = await fs.readdir(chainsDir);
    const svgFiles = files.filter((f) => f.endsWith(".svg"));

    console.log(`Found ${svgFiles.length} SVG files to process...`);

    for (const file of svgFiles) {
      await processsvg(path.join(chainsDir, file));
    }

    console.log("\nAll SVG files have been standardized!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();

// Clean up the script after ourselves
setTimeout(() => {
  process.exit(0);
}, 100);
