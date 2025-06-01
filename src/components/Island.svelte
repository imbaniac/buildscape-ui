<script lang="ts">
  interface Props {
    name: any;
    color: any;
    darkColor: any;
    x?: number;
    y?: number;
    scale?: number;
    logo: any;
    onclick?: () => void;
  }

  let {
    name,
    color,
    darkColor,
    x = 0,
    y = 0,
    scale = 1,
    logo,
    ...restProps
  }: Props = $props();

  // Flex-like centering for label content
  const labelWidth = 600;
  const logoWidth = 75;
  const gap = 32;
  const charWidth = 40; // approx for bold uppercase, font-size 64
  let textWidth = String(name).length * charWidth;
  let contentWidth = logoWidth + gap + textWidth;
  let left = (labelWidth - contentWidth) / 2;
</script>

<g
  transform={`translate(${x}, ${y}) scale(${scale})`}
  class="island-group"
  pointer-events="all"
  style="cursor: pointer"
  {...restProps}
>
  <!-- Island base -->
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

  <!-- Label shadow (diamond) -->
  <polygon points="0,-40 60,0 0,40 -60,0" fill={darkColor} opacity="0.4" />

  <!-- Flagpole -->
  <line
    x1="0"
    y1="0"
    x2="0"
    y2={-195}
    stroke="#fff"
    opacity="0.8"
    stroke-width="8"
  />

  <!-- Label -->
  <g transform="translate(-305, -370)">
    <rect
      x="0"
      y="0"
      width="611"
      height="177"
      rx="32"
      fill="white"
      opacity="0.8"
      filter="url(#shadow)"
    />
    <!-- Logo and name horizontally centered inside label -->
    <g transform={`translate(${left}, 50)`}>
      <defs>
        <clipPath id="logoClip">
          <circle cx="37.5" cy="37.5" r="37.5" />
        </clipPath>
      </defs>
      {#if typeof logo === "string"}
        <image
          href={logo}
          x="0"
          y="0"
          width="75"
          height="75"
          clip-path="url(#logoClip)"
        />
      {:else}
        <g transform="scale(2.5)">{@html logo}</g>
      {/if}
      <text
        x={logoWidth + gap}
        y="42"
        font-size="72"
        fill="#222"
        text-anchor="start"
        font-weight="bold"
        alignment-baseline="middle"
        style="font-family: inherit; letter-spacing: 2px; dominant-baseline: middle;"
      >
        {name}
      </text>
    </g>
  </g>
</g>

<style>
  .island-group {
    transition: transform 0.2s ease;
  }

  .island-group:hover {
    filter: brightness(1.1);
  }
</style>
