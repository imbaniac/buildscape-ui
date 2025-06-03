<script lang="ts">
  interface Props {
    onclick: () => void;
  }

  let { onclick }: Props = $props();
</script>

<button
  class="close-button"
  {onclick}
  aria-label="Close and return to map"
>
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
    background: rgba(255, 255, 255, 0.9);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .close-button:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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