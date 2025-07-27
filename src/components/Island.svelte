<script lang="ts">
  import { browser } from "$app/environment";
  import { preloadData } from "$app/navigation";

  interface Props {
    name: any;
    color: any;
    darkColor: any;
    x?: number;
    y?: number;
    scale?: number;
    logo: any;
    editMode?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    class?: string;
    isSearchMatch?: boolean;
    isCurrentSearchResult?: boolean;
    slug?: string;
    chainId?: number;
    brandColor?: string;
  }

  let {
    name,
    color,
    darkColor,
    x = 0,
    y = 0,
    scale = 1,
    logo,
    editMode = false,
    onDragStart,
    onDragEnd,
    class: className = "",
    isSearchMatch = false,
    isCurrentSearchResult = false,
    slug,
    chainId,
    brandColor,
    ...restProps
  }: Props = $props();

  // More realistic earth tones with grass/terrain variety
  const islandPalettes = [
    { main: "#7A8B3A", dark: "#5A6B2A", accent: "#8FA043" }, // Grassland
    { main: "#8B7D4E", dark: "#6B5D3E", accent: "#9B8D5E" }, // Plains
    { main: "#7B8A5B", dark: "#5B6A4B", accent: "#8B9A6B" }, // Forest edge
    { main: "#9A8A6A", dark: "#7A6A5A", accent: "#AA9A7A" }, // Savanna
    { main: "#8A7A5A", dark: "#6A5A4A", accent: "#9A8A6A" }, // Desert edge
    { main: "#6A8B5A", dark: "#4A6B4A", accent: "#7A9B6A" }, // Lush grass
    { main: "#8B8A7A", dark: "#6B6A6A", accent: "#9B9A8A" }, // Rocky terrain
    { main: "#7A8A6A", dark: "#5A6A5A", accent: "#8A9A7A" }, // Mixed terrain
  ];

  // Use chain name to consistently pick a palette
  const paletteIndex = name.charCodeAt(0) % islandPalettes.length;
  const islandColors = islandPalettes[paletteIndex];
  const islandColor = islandColors.main;
  const islandDarkColor = islandColors.dark;
  const islandAccentColor = islandColors.accent;

  // Detect if we're on a touch device
  const isTouchDevice =
    browser && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Handle touch start for mobile prefetching
  function handleTouchStart() {
    if (slug && !editMode && isTouchDevice) {
      // Prefetch on touch start for faster navigation
      preloadData(`/chain/${slug}`);
    }
  }

  // Shield and ribbon sizing
  const shieldScale = 0.35; // Decreased shield size
  const logoSize = 400; // Adjusted logo size

  const fontSize = 130; // Increased font size
</script>

<g
  transform={`translate(${x}, ${y})`}
  class="island-group {editMode ? 'edit-mode' : ''} {isSearchMatch
    ? 'search-match'
    : ''} {isCurrentSearchResult ? 'current-search-result' : ''} {className}"
  pointer-events="all"
  style="cursor: {editMode ? 'move' : 'pointer'}"
  onpointerdown={editMode ? onDragStart : undefined}
  onpointerup={editMode ? onDragEnd : undefined}
  ontouchstart={slug && !editMode ? handleTouchStart : undefined}
  {...restProps}
>
  <g>
    <!-- Island base with rounded edges -->
    <g transform="scale({scale})" opacity="0.9">
      <defs>
        <!-- Gradient for terrain depth -->
        <radialGradient id="islandGradient{chainId}">
          <stop offset="0%" stop-color={islandAccentColor} stop-opacity="1" />
          <stop offset="50%" stop-color={islandColor} stop-opacity="1" />
          <stop offset="100%" stop-color={islandDarkColor} stop-opacity="1" />
        </radialGradient>

        <!-- Texture pattern for terrain -->
        <pattern
          id="terrainTexture{chainId}"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="1" fill={islandAccentColor} opacity="0.3" />
          <circle
            cx="15"
            cy="15"
            r="1.5"
            fill={islandDarkColor}
            opacity="0.2"
          />
          <circle
            cx="25"
            cy="10"
            r="1"
            fill={islandAccentColor}
            opacity="0.25"
          />
          <circle
            cx="35"
            cy="25"
            r="1.2"
            fill={islandDarkColor}
            opacity="0.3"
          />
          <circle
            cx="10"
            cy="30"
            r="1"
            fill={islandAccentColor}
            opacity="0.2"
          />
        </pattern>
      </defs>
      <g transform="translate(-931, -560)">
        <!-- Using the provided SVG path for the island -->
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M686.595 933.906L244.381 678.594V723.385L686.595 978.698V933.906Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M244.381 678.594L321.962 633.803V678.594L244.381 723.386V678.594Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M321.962 633.801L232.743 582.291V627.083L321.962 678.593V633.801Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M232.743 582.292L310.325 537.5V582.292L232.743 627.083V582.292Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M310.325 537.501L232.743 492.709V537.501L310.325 582.292V537.501Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M232.743 492.708L389.458 402.229V447.02L232.743 537.499V492.708Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M389.457 402.229L311.876 357.438V402.229L389.457 447.021V402.229Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M311.876 357.437L592.333 195.516V240.307L311.876 402.229V357.437Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M592.333 195.516L669.914 240.307V285.099L592.333 240.307V195.516Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M669.915 240.307L853.395 134.375V179.167L669.915 285.099V240.307Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M853.395 134.375L930.976 179.167V223.958L853.395 179.167V134.375Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M930.977 179.167L1008.56 134.375V179.167L930.977 223.958V179.167Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1008.56 134.375L1097.78 185.885V230.677L1008.56 179.167V134.375Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1097.78 185.885L1175.36 141.094V185.885L1097.78 230.677V185.885Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1175.36 141.094L1617.57 396.406V441.198L1175.36 185.885V141.094Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1617.57 396.406L1539.99 441.198V485.99L1617.57 441.198V396.406Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1539.99 441.197L1629.21 492.708V537.499L1539.99 485.989V441.197Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1629.21 492.709L1551.63 537.501V582.292L1629.21 537.501V492.709Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1551.63 537.5L1629.21 582.291V627.083L1551.63 582.292V537.5Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1629.21 582.291L1471.33 673.442V718.234L1629.21 627.083V582.291Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1471.33 673.441L1548.91 718.233V763.025L1471.33 718.233V673.441Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1548.91 718.234L1268.46 880.156V924.948L1548.91 763.026V718.234Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1268.46 880.157L1190.87 835.365V880.157L1268.46 924.949V880.157Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1190.87 835.365L1008.56 940.626V985.417L1190.87 880.157V835.365Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1008.56 940.624L930.977 895.832V940.624L1008.56 985.415V940.624Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M930.976 895.832L853.395 940.624V985.415L930.976 940.624V895.832Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M853.394 940.626L764.176 889.115V933.907L853.394 985.417V940.626Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M764.176 889.115L686.595 933.907V978.699L764.176 933.907V889.115Z"
          fill="url(#islandGradient{chainId})"
        />
        <path
          d="M686.595 933.906L244.381 678.593L321.962 633.802L764.176 889.114L686.595 933.906ZM1551.63 537.5L1629.21 582.291L1008.56 940.624L930.977 895.833L853.396 940.624L232.745 582.291L310.326 537.5L232.745 492.708L389.458 402.229L311.877 357.438L592.334 195.516L669.915 240.308L853.396 134.375L930.977 179.167L1008.56 134.375L1629.21 492.708L1551.63 537.5ZM1268.46 880.156L1190.87 835.364L1471.33 673.442L1548.91 718.234L1268.46 880.156ZM1539.99 441.197L1097.78 185.885L1175.36 141.093L1617.57 396.406L1539.99 441.197Z"
          fill="url(#islandGradient{chainId})"
        />
      </g>

      <!-- Overlay terrain texture -->
      <g transform="translate(-931, -560)" opacity="0.4">
        <path
          d="M686.595 933.906L244.381 678.593L321.962 633.802L764.176 889.114L686.595 933.906ZM1551.63 537.5L1629.21 582.291L1008.56 940.624L930.977 895.833L853.396 940.624L232.745 582.291L310.326 537.5L232.745 492.708L389.458 402.229L311.877 357.438L592.334 195.516L669.915 240.308L853.396 134.375L930.977 179.167L1008.56 134.375L1629.21 492.708L1551.63 537.5ZM1268.46 880.156L1190.87 835.364L1471.33 673.442L1548.91 718.234L1268.46 880.156ZM1539.99 441.197L1097.78 185.885L1175.36 141.093L1617.57 396.406L1539.99 441.197Z"
          fill="url(#terrainTexture{chainId})"
        />
      </g>
    </g>

    <g
      transform="translate(-200, -500) scale({shieldScale})"
      style="shape-rendering: crispEdges;"
    >
      <!-- Shield outer layer (red) -->
      <path
        d="M127.967 93.2743C127.967 93.2743 123.541 258.313 127.967 431.573C131.761 604.832 242.42 793.9 311.976 876.104C338.534 907.72 382.798 949.454 427.061 989.924V6.64453C357.505 15.4972 127.967 93.2743 127.967 93.2743Z"
        fill={brandColor || "#95060D"}
      />
      <path
        d="M1017.03 93.2743C1017.03 93.2743 1021.46 258.313 1017.03 431.573C1012.61 604.832 901.948 793.9 832.391 876.104C805.833 907.72 762.202 949.454 717.307 989.924V6.64453C786.863 15.4972 1017.03 93.2743 1017.03 93.2743Z"
        fill={brandColor || "#95060D"}
      />
      <path
        d="M426.062 6.63951V989.919C499.149 1055.05 572.499 1114.49 572.499 1114.49C572.499 1114.49 645.218 1055.05 718.304 989.919V6.63951C648.379 -2.21317 496.619 -2.21317 426.062 6.63951Z"
        fill={brandColor || "#95060D"}
      />

      <!-- Shield inner layer (cream) -->
      <path
        d="M200.639 150.203C200.639 150.203 196.951 291.625 200.639 440.09C203.8 588.555 295.995 750.566 353.946 821.006C376.072 848.098 412.95 883.86 449.828 918.538V75.9707C391.877 83.5565 200.639 150.203 200.639 150.203Z"
        fill="#F8EDCF"
      />
      <path
        d="M941.36 150.203C941.36 150.203 945.048 291.625 941.36 440.09C937.672 588.555 845.478 750.566 787.527 821.006C765.4 848.098 729.049 883.86 691.645 918.538V75.9707C749.595 83.5565 941.36 150.203 941.36 150.203Z"
        fill="#F8EDCF"
      />
      <path
        d="M448.83 75.9648V918.532C509.888 974.342 571 1025.28 571 1025.28C571 1025.28 631.585 974.342 692.643 918.532V75.9648C634.219 68.3789 507.781 68.3789 448.83 75.9648Z"
        fill="#F8EDCF"
      />

      <!-- Banner ribbon -->
      <path
        d="M1381.94 1033.409L1443 1200H798.883V807.045H1443L1381.94 1033.409Z"
        fill="#BB915F"
      />
      <path
        d="M798.883 1131.816V1200L1180.62 1131.816H798.883Z"
        fill="#865D2D"
      />
      <path
        d="M-238.939 1033.409L-300 1200H344.117V807.045H-300L-238.939 1033.409Z"
        fill="#BB915F"
      />
      <path
        d="M344.115 1131.816V1200L-37.619 1131.816H344.115Z"
        fill="#865D2D"
      />
      <path
        d="M1180.62 1131.819H-37.619V765H1180.62V1131.819Z"
        fill="#D7B031"
      />

      <!-- Logo -->
      <g transform={`translate(${571 - logoSize / 2}, ${300})`}>
        {#if typeof logo === "string"}
          <image href={logo} x="0" y="0" width={logoSize} height={logoSize} />
        {:else}
          <g transform="scale(10)">{@html logo}</g>
        {/if}
      </g>

      <!-- Chain name on banner -->
      <foreignObject x="-30" y="820" width="1200" height="270">
        <div
          style="
          text-align: center; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          font-weight: bold; 
          font-size: {fontSize}px; 
          color: #4B2F00;
          line-height: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          letter-spacing: 1px;
          text-transform: uppercase;
        "
        >
          {name}
        </div>
      </foreignObject>
    </g>
  </g>
  {#if slug && !editMode}
    <a
      href="/chain/{slug}"
      style="position: absolute; inset: 0; opacity: 0;"
      data-sveltekit-preload-data={isTouchDevice ? "tap" : "hover"}
      aria-label="View {name} details"
    ></a>
  {/if}
</g>

<style>
  .island-group {
    transition: transform 0.2s ease;
  }

  .island-group:hover:not(.search-match):not(.current-search-result) {
    filter: brightness(1.15) saturate(1.2);
  }

  .island-group.edit-mode:hover {
    stroke: #333;
    stroke-width: 3;
    stroke-dasharray: 10 5;
  }

  /* Search match styling - use !important to override hover */
  .island-group.search-match {
    filter: drop-shadow(0 0 40px rgba(127, 195, 230, 0.9)) brightness(1.15) !important;
    animation: searchPulse 2s ease-in-out infinite;
  }

  /* Add a subtle ring around search matches */
  .island-group.search-match > g {
    filter: drop-shadow(0 0 0 3px rgba(127, 195, 230, 0.4));
  }

  /* Current search result gets stronger glow */
  .island-group.current-search-result {
    filter: drop-shadow(0 0 60px rgba(168, 213, 232, 1)) brightness(1.25) !important;
    animation: currentSearchPulse 1s ease-in-out infinite;
  }

  /* Stronger ring for current result */
  .island-group.current-search-result > g {
    filter: drop-shadow(0 0 0 5px rgba(168, 213, 232, 0.6));
  }

  @keyframes searchPulse {
    0%,
    100% {
      filter: drop-shadow(0 0 40px rgba(127, 195, 230, 0.9)) brightness(1.15);
    }
    50% {
      filter: drop-shadow(0 0 50px rgba(127, 195, 230, 1)) brightness(1.2);
    }
  }

  @keyframes currentSearchPulse {
    0%,
    100% {
      filter: drop-shadow(0 0 60px rgba(168, 213, 232, 1)) brightness(1.25);
    }
    50% {
      filter: drop-shadow(0 0 80px rgba(168, 213, 232, 1)) brightness(1.3);
    }
  }
</style>
