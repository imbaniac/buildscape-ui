<script lang="ts">
  import { onMount } from "svelte";
  import Island from "./Island.svelte";
  import { blockchains } from "./blockchainData.js";

  let svg = $state();
  let viewBox = $state("0 0 3000 1000");
  let isPanning = false;
  let startPoint = { x: 0, y: 0 };
  let viewBoxStart = { x: 0, y: 0, width: 3000, height: 2000 };
  let scale = 1;
  let center = { x: 1000, y: 600 };

  function handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // Left mouse button
      isPanning = true;
      startPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      viewBoxStart = parseViewBox();
      event.preventDefault();
    }
  }

  function handleMouseMove(event) {
    if (isPanning) {
      const dx =
        (event.clientX - startPoint.x) * (viewBoxStart.width / svg.clientWidth);
      const dy =
        (event.clientY - startPoint.y) *
        (viewBoxStart.height / svg.clientHeight);

      const newViewBox = `${viewBoxStart.x - dx} ${viewBoxStart.y - dy} ${viewBoxStart.width} ${viewBoxStart.height}`;
      viewBox = newViewBox;
    }
  }

  function handleMouseUp() {
    isPanning = false;
  }

  function handleWheel(event) {
    event.preventDefault();

    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert mouse position to SVG coordinates
    const viewBoxObj = parseViewBox();
    const svgX = viewBoxObj.x + (mouseX / rect.width) * viewBoxObj.width;
    const svgY = viewBoxObj.y + (mouseY / rect.height) * viewBoxObj.height;

    // Calculate new scale
    const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
    scale = Math.max(0.5, Math.min(5, scale * zoomFactor));

    // Calculate new viewBox dimensions
    const newWidth = 2000 / scale;
    const newHeight = 1200 / scale;

    // Calculate new viewBox position to zoom toward mouse position
    const newX = svgX - (mouseX / rect.width) * newWidth;
    const newY = svgY - (mouseY / rect.height) * newHeight;

    viewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
  }

  function parseViewBox() {
    const [x, y, width, height] = viewBox.split(" ").map(Number);
    return { x, y, width, height };
  }

  function zoomIn() {
    scale = Math.min(5, scale * 1.2);
    const newWidth = 2000 / scale;
    const newHeight = 1200 / scale;
    const newX = center.x - newWidth / 2;
    const newY = center.y - newHeight / 2;
    viewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
  }

  function zoomOut() {
    scale = Math.max(0.5, scale * 0.8);
    const newWidth = 2000 / scale;
    const newHeight = 1200 / scale;
    const newX = center.x - newWidth / 2;
    const newY = center.y - newHeight / 2;
    viewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
  }

  function resetView() {
    scale = 1;
    viewBox = "0 0 2000 1200";
  }

  onMount(() => {
    if (svg) {
      svg.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        svg.removeEventListener("wheel", handleWheel);
      };
    }
  });
</script>

<div class="map-container">
  <svg
    bind:this={svg}
    {viewBox}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
  >
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3" />
      </filter>
    </defs>

    <!-- Sea background -->
    <rect x="0" y="0" width="2000" height="1200" fill="#8BBDD9" />
    <text
      x="1000"
      y="1000"
      font-size="80"
      fill="#5A8BA8"
      text-anchor="middle"
      font-weight="bold"
      opacity="0.7">EVM SEA</text
    >

    <!-- Main Ethereum Island (center) -->
    <Island
      name={blockchains.ethereum.name}
      color={blockchains.ethereum.color}
      darkColor={blockchains.ethereum.darkColor}
      logo={blockchains.ethereum.logo}
      scale={1.5}
      x={1000}
      y={600}
    />

    <!-- L2s in a circle, spaced further out -->
    {#each [blockchains.optimism, blockchains.arbitrum, blockchains.polygon, blockchains.base, blockchains.zksync] as blockchain, i}
      <Island
        name={blockchain.name}
        color={blockchain.color}
        darkColor={blockchain.darkColor}
        logo={blockchain.logo}
        scale={0.8}
        x={1000 +
          1800 * Math.cos((2 * Math.PI * i) / Object.keys(blockchains).length)}
        y={600 +
          1120 * Math.sin((2 * Math.PI * i) / Object.keys(blockchains).length)}
      />
    {/each}
  </svg>

  <div class="controls">
    <button onclick={resetView}>Reset View</button>
    <button onclick={zoomIn}>Zoom In</button>
    <button onclick={zoomOut}>Zoom Out</button>
  </div>
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #87c1d3;
    cursor: grab;
  }

  .map-container:active {
    cursor: grabbing;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
  }

  button {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button:hover {
    background-color: #f0f0f0;
  }
</style>
