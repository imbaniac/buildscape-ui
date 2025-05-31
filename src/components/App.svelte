<script lang="ts">
  import { onMount } from "svelte";
  import Island from "./Island.svelte";
  import { ethereum, evmBlockchains } from "./data.js";

  const initialViewBox = { x: 0, y: -2000, width: 2000, height: 5000 };
  let svg = $state<SVGSVGElement>();
  let viewBox = $state(
    `${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}`
  );
  let isPanning = $state(false);
  let startPoint = $state({ x: 0, y: 0 });
  let viewBoxStart = { ...initialViewBox };
  let scale = 1;
  let center = {
    x: initialViewBox.x + initialViewBox.width / 2,
    y: initialViewBox.y + initialViewBox.height / 2,
  };

  function handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      isPanning = true;
      startPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      viewBoxStart = parseViewBox();
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      event.preventDefault();
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (isPanning) {
      const dx =
        (event.clientX - startPoint.x) *
        (viewBoxStart.width / svg!.clientWidth);
      const dy =
        (event.clientY - startPoint.y) *
        (viewBoxStart.height / svg!.clientHeight);

      const newViewBox = `${viewBoxStart.x - dx} ${viewBoxStart.y - dy} ${viewBoxStart.width} ${viewBoxStart.height}`;
      viewBox = newViewBox;
    }
  }

  function handleMouseUp() {
    isPanning = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    const rect = svg!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert mouse position to SVG coordinates
    const viewBoxObj = parseViewBox();
    const svgX = viewBoxObj.x + (mouseX / rect.width) * viewBoxObj.width;
    const svgY = viewBoxObj.y + (mouseY / rect.height) * viewBoxObj.height;

    // Calculate new scale
    const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
    scale = Math.max(0.3, Math.min(5, scale * zoomFactor));

    // Calculate new viewBox dimensions
    const newWidth = initialViewBox.width / scale;
    const newHeight = initialViewBox.height / scale;

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
    scale = Math.min(5, scale * 1.05);
    const newWidth = initialViewBox.width / scale;
    const newHeight = initialViewBox.height / scale;
    const newX = center.x - newWidth / 2;
    const newY = center.y - newHeight / 2;
    viewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
  }

  function zoomOut() {
    scale = Math.max(0.3, scale * 0.95);
    const newWidth = initialViewBox.width / scale;
    const newHeight = initialViewBox.height / scale;
    const newX = center.x - newWidth / 2;
    const newY = center.y - newHeight / 2;
    viewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
  }

  function resetView() {
    scale = 1;
    viewBox = `${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.width} ${initialViewBox.height}`;
  }

  onMount(() => {
    if (svg) {
      svg.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        svg!.removeEventListener("wheel", handleWheel);
      };
    }
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="map-container {isPanning ? 'panning' : ''}">
  <svg
    bind:this={svg}
    {viewBox}
    xmlns="http://www.w3.org/2000/svg"
    onmousedown={handleMouseDown}
    onmouseleave={handleMouseUp}
    aria-label="Map of the EVM ecosystem"
    role="region"
  >
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3" />
      </filter>
    </defs>

    <text
      x="1000"
      y="2800"
      font-size="220"
      fill="#5A8BA8"
      text-anchor="middle"
      font-weight="bold"
      opacity="0.25"
      transform="skewY(0) scale(1,0.866)"
      style="font-family: inherit; letter-spacing: 8px;"
    >
      EVM SEA
    </text>

    <!-- Main Ethereum Island (center) -->
    <Island
      name={ethereum.name}
      color={ethereum.color}
      darkColor={ethereum.darkColor}
      logo={ethereum.logo}
      scale={1.5}
      x={1000}
      y={600}
    />

    <!-- L2s in a circle, spaced further out -->
    {#each Object.values(evmBlockchains) as blockchain, i}
      <Island
        name={blockchain.name}
        color={blockchain.color}
        darkColor={blockchain.darkColor}
        logo={blockchain.logo}
        scale={0.8}
        x={1000 +
          1800 *
            Math.cos((2 * Math.PI * i) / Object.keys(evmBlockchains).length)}
        y={600 +
          1120 *
            Math.sin((2 * Math.PI * i) / Object.keys(evmBlockchains).length)}
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
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #87c1d3;
    cursor: grab;
  }
  .map-container.panning {
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
