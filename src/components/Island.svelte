<script lang="ts">
  import { browser } from '$app/environment';
  import { preloadData } from '$app/navigation';
  
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
    class: className = '',
    isSearchMatch = false,
    isCurrentSearchResult = false,
    slug,
    chainId,
    ...restProps
  }: Props = $props();
  
  // Detect if we're on a touch device
  const isTouchDevice = browser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  // Handle touch start for mobile prefetching
  function handleTouchStart() {
    if (slug && !editMode && isTouchDevice) {
      // Prefetch on touch start for faster navigation
      preloadData(`/chain/${slug}`);
    }
  }

  // Dynamic label sizing based on content - use desktop sizes for all devices
  const logoSize = 120;
  const gap = 40;
  const charWidth = 52;
  const padding = 200;
  let textWidth = String(name).length * charWidth;
  let contentWidth = logoSize + gap + textWidth;
  let labelWidth = contentWidth + padding; // Dynamic width
  let left = padding / 2; // Start after left padding
</script>

<g
  transform={`translate(${x}, ${y})`}
  class="island-group {editMode ? 'edit-mode' : ''} {isSearchMatch ? 'search-match' : ''} {isCurrentSearchResult ? 'current-search-result' : ''} {className}"
  pointer-events="all"
  style="cursor: {editMode ? 'move' : 'pointer'}"
  onpointerdown={editMode ? onDragStart : undefined}
  onpointerup={editMode ? onDragEnd : undefined}
  ontouchstart={slug && !editMode ? handleTouchStart : undefined}
  {...restProps}
>
  <g>
    <!-- Island base -->
    <g transform="scale({scale})" opacity="0.85">
      <g transform="translate(-931, -560)">
        <!-- Using the provided SVG path for the island -->
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M686.595 933.906L244.381 678.594V723.385L686.595 978.698V933.906Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M244.381 678.594L321.962 633.803V678.594L244.381 723.386V678.594Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M321.962 633.801L232.743 582.291V627.083L321.962 678.593V633.801Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M232.743 582.292L310.325 537.5V582.292L232.743 627.083V582.292Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M310.325 537.501L232.743 492.709V537.501L310.325 582.292V537.501Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M232.743 492.708L389.458 402.229V447.02L232.743 537.499V492.708Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M389.457 402.229L311.876 357.438V402.229L389.457 447.021V402.229Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M311.876 357.437L592.333 195.516V240.307L311.876 402.229V357.437Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M592.333 195.516L669.914 240.307V285.099L592.333 240.307V195.516Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M669.915 240.307L853.395 134.375V179.167L669.915 285.099V240.307Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M853.395 134.375L930.976 179.167V223.958L853.395 179.167V134.375Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M930.977 179.167L1008.56 134.375V179.167L930.977 223.958V179.167Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1008.56 134.375L1097.78 185.885V230.677L1008.56 179.167V134.375Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1097.78 185.885L1175.36 141.094V185.885L1097.78 230.677V185.885Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1175.36 141.094L1617.57 396.406V441.198L1175.36 185.885V141.094Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1617.57 396.406L1539.99 441.198V485.99L1617.57 441.198V396.406Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1539.99 441.197L1629.21 492.708V537.499L1539.99 485.989V441.197Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1629.21 492.709L1551.63 537.501V582.292L1629.21 537.501V492.709Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1551.63 537.5L1629.21 582.291V627.083L1551.63 582.292V537.5Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1629.21 582.291L1471.33 673.442V718.234L1629.21 627.083V582.291Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1471.33 673.441L1548.91 718.233V763.025L1471.33 718.233V673.441Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1548.91 718.234L1268.46 880.156V924.948L1548.91 763.026V718.234Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1268.46 880.157L1190.87 835.365V880.157L1268.46 924.949V880.157Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1190.87 835.365L1008.56 940.626V985.417L1190.87 880.157V835.365Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1008.56 940.624L930.977 895.832V940.624L1008.56 985.415V940.624Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M930.976 895.832L853.395 940.624V985.415L930.976 940.624V895.832Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M853.394 940.626L764.176 889.115V933.907L853.394 985.417V940.626Z"
          fill={darkColor}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M764.176 889.115L686.595 933.907V978.699L764.176 933.907V889.115Z"
          fill={darkColor}
        />
        <path
          d="M686.595 933.906L244.381 678.593L321.962 633.802L764.176 889.114L686.595 933.906ZM1551.63 537.5L1629.21 582.291L1008.56 940.624L930.977 895.833L853.396 940.624L232.745 582.291L310.326 537.5L232.745 492.708L389.458 402.229L311.877 357.438L592.334 195.516L669.915 240.308L853.396 134.375L930.977 179.167L1008.56 134.375L1629.21 492.708L1551.63 537.5ZM1268.46 880.156L1190.87 835.364L1471.33 673.442L1548.91 718.234L1268.46 880.156ZM1539.99 441.197L1097.78 185.885L1175.36 141.093L1617.57 396.406L1539.99 441.197Z"
          fill={color}
        />
      </g>
    </g>

    <!-- Label shadow diamond -->
    <polygon points="0,-40 60,0 0,40 -60,0" fill={darkColor} opacity="0.4" />

    <!-- Label with game-like styling -->
    <g transform="translate({-labelWidth / 2}, -380)">
      <!-- Fancy label frame -->

      <!-- Outer frame -->
      <rect
        x="-8"
        y="-8"
        width={labelWidth + 16}
        height="236"
        rx="12"
        fill="#8B6914"
        opacity="0.9"
      />

      <!-- Inner border -->
      <rect
        x="-4"
        y="-4"
        width={labelWidth + 8}
        height="228"
        rx="10"
        fill="#2c5f7c"
        opacity="0.8"
      />

      <!-- Main label background -->
      <rect
        x="0"
        y="0"
        width={labelWidth}
        height="220"
        rx="8"
        fill="#f4e4c1"
        stroke="#8B6914"
        stroke-width="2"
      />
      <!-- Logo and name horizontally centered inside label -->
      <g transform={`translate(${left}, 55)`}>
        {#if typeof logo === "string"}
          <g clip-path="circle({logoSize / 2}px at {logoSize / 2}px {logoSize / 2}px)">
            <image
              href={logo}
              x="0"
              y="0"
              width={logoSize}
              height={logoSize}
            />
          </g>
        {:else}
          <g transform="scale(3)">{@html logo}</g>
        {/if}
        <text
          x={logoSize + gap}
          y={logoSize / 2 + 6}
          font-size="100"
          fill="#4a5568"
          text-anchor="start"
          font-weight="bold"
          alignment-baseline="middle"
          style="font-family: 'Lato', 'Inter', 'Helvetica Neue', sans-serif; font-weight: 700; letter-spacing: 0.5px; dominant-baseline: middle;"
        >
          {name}
        </text>
      </g>
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
    0%, 100% { 
      filter: drop-shadow(0 0 40px rgba(127, 195, 230, 0.9)) brightness(1.15);
    }
    50% { 
      filter: drop-shadow(0 0 50px rgba(127, 195, 230, 1)) brightness(1.2);
    }
  }

  @keyframes currentSearchPulse {
    0%, 100% { 
      filter: drop-shadow(0 0 60px rgba(168, 213, 232, 1)) brightness(1.25);
    }
    50% { 
      filter: drop-shadow(0 0 80px rgba(168, 213, 232, 1)) brightness(1.3);
    }
  }
</style>
