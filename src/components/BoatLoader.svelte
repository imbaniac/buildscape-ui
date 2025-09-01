<script lang="ts">
  import { fade } from "svelte/transition";

  import boatUrl from "/assets/boat.svg?url";
</script>

<div class="boat-loader" transition:fade={{ duration: 500 }}>
  <div class="boat-container">
    <div class="boat">
      <img src={boatUrl} alt="" />
    </div>
  </div>
</div>

<style>
  .boat-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #5ca9ce;
    z-index: 10;
  }

  .boat-container {
    position: relative;
    animation: swim-patrol 10s ease-in-out infinite;
  }

  .boat {
    width: 220px;
    height: 220px;
    transform-origin: center center;
    animation: rock 2s ease-in-out infinite;
  }

  .boat img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @keyframes swim-patrol {
    0%,
    100% {
      transform: translateX(-200px) scaleX(1);
    }
    45% {
      transform: translateX(200px) scaleX(1);
    }
    50% {
      transform: translateX(200px) scaleX(-1);
    }
    95% {
      transform: translateX(-200px) scaleX(-1);
    }
  }

  @keyframes rock {
    0%,
    100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .boat {
      width: 160px;
      height: 160px;
    }
  }
</style>
