<script lang="ts">
  import boatUrl from '$lib/assets/boat.svg?url';
  import { fade } from 'svelte/transition';
</script>

<div class="boat-loader" transition:fade={{ duration: 500 }}>
  <div class="boat-container">
    <div class="boat">
      <img src={boatUrl} alt="Sailing boat" />
    </div>
  </div>
  
  <p class="loading-text">Charting the EVM seas...</p>
</div>

<style>
  .boat-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #5ca9ce;
    z-index: 100;
  }

  .boat-container {
    position: relative;
    z-index: 10;
    animation: sail 4s ease-in-out infinite;
  }

  .boat {
    width: 120px;
    height: 120px;
    transform-origin: center bottom;
    animation: rock 3s ease-in-out infinite;
  }

  .boat img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @keyframes sail {
    0%, 100% {
      transform: translateX(-100px);
    }
    50% {
      transform: translateX(100px);
    }
  }

  @keyframes rock {
    0%, 100% {
      transform: rotate(-5deg) translateY(0);
    }
    25% {
      transform: rotate(3deg) translateY(-5px);
    }
    50% {
      transform: rotate(-3deg) translateY(0);
    }
    75% {
      transform: rotate(5deg) translateY(-3px);
    }
  }

  .loading-text {
    position: absolute;
    bottom: 120px;
    font-size: 1.5em;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .boat {
      width: 80px;
      height: 80px;
    }
    
    .loading-text {
      font-size: 1.2em;
      bottom: 80px;
    }
  }
</style>