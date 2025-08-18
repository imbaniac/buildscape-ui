<script lang="ts">
  interface Props {
    onclick: () => void;
  }

  let { onclick }: Props = $props();
</script>

<button class="close-button" {onclick} aria-label="Close and return to map">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

<style>
  .close-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 2px rgba(255, 255, 255, 0.9);
    position: relative;
    overflow: hidden;
  }

  .close-button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      rgba(239, 68, 68, 0.1) 0%,
      transparent 70%
    );
    transition: all 0.3s;
    border-radius: 50%;
  }

  .close-button:hover {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    transform: scale(1.1) rotate(90deg);
    box-shadow:
      0 6px 16px rgba(239, 68, 68, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.9);
    border-color: #fca5a5;
  }

  .close-button:hover::before {
    width: 100%;
    height: 100%;
  }

  .close-button:active {
    transform: scale(1.05) rotate(90deg);
  }

  @media (max-width: 640px) {
    .close-button {
      width: 36px;
      height: 36px;
    }

    .close-button svg {
      width: 20px;
      height: 20px;
    }
  }
</style>
