<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    onClose: () => void;
  }

  const { onClose }: Props = $props();

  let overlayElement: HTMLDivElement;
  let contentElement: HTMLDivElement;

  function handleClose() {
    // Add fade-out class for animation
    overlayElement.classList.add("fade-out");
    contentElement.classList.add("fade-out");

    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  }

  onMount(() => {
    // Force Safari to properly initialize the element
    overlayElement.offsetHeight;
  });
</script>

<div class="overlay-container" bind:this={overlayElement}>
  <div class="map-backdrop"></div>
  <div class="content-box" bind:this={contentElement}>
    <div class="modal-header">
      <h2>Welcome to Buildscape</h2>
    </div>
    <div class="modal-body">
      <p class="subtitle">Your interactive guide to the blockchain ecosystem</p>
      <div class="feature-container">
        <ul class="feature-list">
          <li>
            <span class="icon">🏝️</span>
            <span
              >Each island represents a <strong>blockchain network</strong
              ></span
            >
          </li>
          <li>
            <span class="icon">📊</span>
            <span
              >Bigger islands = <strong>more value locked</strong> (TVL)</span
            >
          </li>
          <li>
            <span class="icon">⚡</span>
            <span>Greener islands = <strong>more activity</strong> (TPS)</span>
          </li>
          <li>
            <span class="icon">🧭</span>
            <span>Click any island to <strong>explore details</strong></span>
          </li>
        </ul>
      </div>
      <button class="got-it-btn" onclick={handleClose}>
        <span>Begin Exploration</span>
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    animation: fadeIn 300ms ease-out forwards;
    -webkit-animation: fadeIn 300ms ease-out forwards;
  }

  .map-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(5, 16, 21);
    opacity: 0.8;
    cursor: default;
  }

  .content-box {
    position: relative;
    background: #f8f7f5;
    border: 1px solid #525e72;
    border-radius: 8px;
    max-width: 550px;
    width: 90%;
    text-align: center;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: fadeIn 300ms ease-out 150ms backwards;
    -webkit-animation: fadeIn 300ms ease-out 150ms backwards;
  }
  .content-box::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid rgba(82, 94, 114, 0.1);
    border-radius: 6px;
    pointer-events: none;
  }

  .modal-header {
    background: linear-gradient(135deg, #4a5568, #3a4456);
    border-bottom: 1px solid #525e72;
    padding: 1.5rem 2rem;
    margin-bottom: 0;
  }

  .modal-body {
    padding: 2rem 1.5rem;
    position: relative;
    background:
      radial-gradient(
        ellipse at top,
        rgba(255, 251, 235, 0.4),
        transparent 50%
      ),
      radial-gradient(
        ellipse at bottom right,
        rgba(74, 124, 89, 0.05),
        transparent 50%
      ),
      linear-gradient(180deg, #f8f7f5 0%, #f0ede8 100%);
    background-image:
      radial-gradient(
        ellipse at top,
        rgba(255, 251, 235, 0.4),
        transparent 50%
      ),
      radial-gradient(
        ellipse at bottom right,
        rgba(74, 124, 89, 0.05),
        transparent 50%
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 20px,
        rgba(82, 94, 114, 0.02) 20px,
        rgba(82, 94, 114, 0.02) 21px
      ),
      linear-gradient(180deg, #f8f7f5 0%, #f0ede8 100%);
  }

  .modal-body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(82, 94, 114, 0.2),
      transparent
    );
  }

  .modal-body::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(82, 94, 114, 0.1),
      transparent
    );
  }

  h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: #f0e6d2;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-family: var(--font-ui);
    font-size: 0.95rem;
    color: #5a5651;
    margin-bottom: 1.5rem;
  }

  .feature-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.75rem;
    width: 100%;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
    max-width: 450px;
  }

  .feature-list li {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-family: var(--font-ui);
    font-size: 0.9rem;
    color: #3a4456;
    line-height: 1.4;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(82, 94, 114, 0.15);
    border-radius: 6px;
    padding: 1.25rem 1rem;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .feature-list li:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    z-index: 1;
  }

  .feature-list li:hover::before {
    opacity: 0.8;
    height: 4px;
  }

  .feature-list .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-list strong {
    color: #2c3542;
    font-weight: 600;
    background: linear-gradient(180deg, #3a4456, #2c3542);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .got-it-btn {
    background: linear-gradient(135deg, #4a7c59, #3a6c49);
    color: #ffffff;
    border: 1px solid #3a6c49;
    border-radius: 6px;
    padding: 12px 32px;
    cursor: pointer;
    font-family: var(--font-ui);
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.02em;
    transition: all 0.2s ease;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .got-it-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  .got-it-btn:hover {
    background: linear-gradient(135deg, #5a8c69, #4a7c59);
    transform: translateY(-1px);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .got-it-btn:hover::before {
    left: 100%;
  }

  .got-it-btn:active {
    transform: translateY(0);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* Tablet adjustments */
  @media (max-width: 768px) {
    .feature-list {
      gap: 0.7rem;
      max-width: 400px;
    }

    .feature-list li {
      padding: 1.1rem 0.9rem;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .content-box {
      width: 95%;
    }

    .modal-header {
      padding: 1.25rem 1.5rem;
    }

    .modal-body {
      padding: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    .subtitle {
      font-size: 0.9rem;
    }

    .feature-list {
      grid-template-columns: 1fr;
      gap: 0.65rem;
      max-width: 300px;
    }

    .feature-list li {
      font-size: 0.9rem;
      padding: 1rem 0.85rem;
    }

    .feature-list .icon {
      font-size: 1.25rem;
      width: 2.25rem;
      height: 2.25rem;
      margin-bottom: 0.4rem;
    }

    .got-it-btn {
      padding: 10px 24px;
      font-size: 0.95rem;
    }
  }
</style>
