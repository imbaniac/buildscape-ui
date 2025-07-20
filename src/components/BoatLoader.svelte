<script lang="ts">
  import boatUrl from '$lib/assets/boat.svg?url';
  import { fade } from 'svelte/transition';
</script>

<div class="boat-loader" transition:fade={{ duration: 500 }}>
  <div class="sea-background">
    <div class="wave wave1"></div>
    <div class="wave wave2"></div>
    <div class="wave wave3"></div>
  </div>
  
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
    background: 
      radial-gradient(ellipse at center top, #87ceeb 0%, #6bb6d8 30%, #5ca9ce 60%, #4d9bc3 100%),
      linear-gradient(to bottom, #7fc3e6 0%, #5ca9ce 100%);
    background-blend-mode: normal;
    z-index: 100;
  }

  .sea-background {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    overflow: hidden;
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="%235A8BA8"></path></svg>') repeat-x;
    animation: wave 20s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  }

  .wave2 {
    bottom: 10px;
    animation: wave 17s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite;
    opacity: 0.5;
  }

  .wave3 {
    bottom: 20px;
    animation: wave 25s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.25s infinite;
    opacity: 0.3;
  }

  @keyframes wave {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
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