<script lang="ts">
  import { fade } from "svelte/transition";

  import boatUrl from "/assets/boat.svg?url";
  import logoUrl from "/static/bs-logo.svg?url";
</script>

<div class="boat-loader" transition:fade={{ duration: 500 }}>
  <img class="logo" src={logoUrl} alt="logo" />
  <div class="boat-container">
    <div class="boat">
      <img src={boatUrl} alt="" />
    </div>
  </div>
  <div class="waves">
    <div class="wave wave-1"></div>
    <div class="wave wave-2"></div>
    <div class="bottom"></div>
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
    background: #28a0cf;
    z-index: 10;
  }

  .boat-container {
    position: absolute;
    bottom: 12%;
    animation: swim-patrol 14s ease-in-out infinite;
  }

  .logo {
    position: absolute;
    top: 35%;
    max-width: 50%;
  }

  .waves {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    pointer-events: none;
    overflow: hidden;
  }

  .wave {
    position: absolute;
    width: 200%;
    height: 20%;
    background-repeat: repeat-x;
    background-size: 150px 100%;
    left: -50%;
  }

  .wave-1 {
    bottom: 30%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' preserveAspectRatio='none'%3E%3Cpath d='M0,20 Q25,5 50,20 T100,20 L100,40 L0,40 Z' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E");
    animation: wave-shift-1 12s linear infinite;
  }

  .wave-2 {
    bottom: 30%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' preserveAspectRatio='none'%3E%3Cpath d='M0,20 Q25,5 50,20 T100,20 L100,40 L0,40 Z' fill='rgba(255,255,255,0.15)'/%3E%3C/svg%3E");
    animation: wave-shift-2 15s linear infinite;
  }

  .bottom {
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    height: 30%;
    width: 100%;
    bottom: 0;
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
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(4deg);
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

  @keyframes wave-shift-1 {
    0% {
      background-position-x: 0;
    }
    100% {
      background-position-x: 300px;
    }
  }

  @keyframes wave-shift-2 {
    0% {
      background-position-x: 0;
    }
    100% {
      background-position-x: -300px;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .boat {
      width: 160px;
      height: 160px;
    }

    .logo {
      max-width: 70%;
    }

    .wave {
      background-size: 200px 100%;
    }
  }
</style>
