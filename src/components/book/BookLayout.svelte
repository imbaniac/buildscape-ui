<script lang="ts">
  import CloseButton from "./ui/CloseButton.svelte";

  interface Props {
    onClose: () => void;
    leftPage?: import("svelte").Snippet;
    rightPage?: import("svelte").Snippet;
  }

  let { onClose, leftPage, rightPage }: Props = $props();
</script>

<div class="book-fullscreen">
  <div class="book-header">
    <CloseButton onclick={onClose} />
  </div>

  <div class="book-spread">
    <!-- Left Page -->
    <div class="book-page-wrapper book-page-wrapper-left">
      <div class="book-page book-page-left">
        {#if leftPage}
          {@render leftPage()}
        {/if}
      </div>
    </div>

    <!-- Book Spine -->
    <div class="book-spine-effect"></div>

    <!-- Right Page -->
    <div class="book-page-wrapper book-page-wrapper-right">
      <div class="book-page book-page-right">
        {#if rightPage}
          {@render rightPage()}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .book-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #87c1d3;
    overflow: hidden;
    z-index: 1000;
  }

  .book-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    z-index: 10;
  }

  .book-spread {
    display: flex;
    height: 100vh;
    max-height: 950px;
    padding: 60px 60px 40px;
    gap: 0;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .book-spread::before {
    content: "";
    position: absolute;
    top: 60px;
    bottom: 40px;
    left: 50%;
    width: 40px;
    transform: translateX(-50%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.02) 10%,
      rgba(0, 0, 0, 0.04) 20%,
      rgba(0, 0, 0, 0.06) 30%,
      rgba(0, 0, 0, 0.08) 40%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.08) 60%,
      rgba(0, 0, 0, 0.06) 70%,
      rgba(0, 0, 0, 0.04) 80%,
      rgba(0, 0, 0, 0.02) 90%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .book-page-wrapper {
    position: relative;
    height: calc(min(100vh, 950px) - 100px);
    max-height: 850px;
    width: calc(50vw - 42px);
    max-width: 700px;
  }

  .book-page-wrapper-left {
    margin-right: -1px;
  }

  .book-page-wrapper-right {
    margin-left: -1px;
  }

  /* Paper stack effect for left wrapper */
  .book-page-wrapper-left::before,
  .book-page-wrapper-left::after {
    content: "";
    position: absolute;
    background: white;
    border: 1px solid #e2e8f0;
    top: 15px;
    bottom: 15px;
    z-index: -1;
  }

  .book-page-wrapper-left::before {
    left: -8px;
    right: 8px;
    border-radius: 15px 0 0 15px;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
    background: linear-gradient(to right, #f7f7f7 0%, #fcfcfc 100%);
  }

  .book-page-wrapper-left::after {
    left: -16px;
    right: 16px;
    border-radius: 12px 0 0 12px;
    box-shadow: -3px 0 12px rgba(0, 0, 0, 0.08);
    background: linear-gradient(to right, #f2f2f2 0%, #f9f9f9 100%);
  }

  /* Paper stack effect for right wrapper */
  .book-page-wrapper-right::before,
  .book-page-wrapper-right::after {
    content: "";
    position: absolute;
    background: white;
    border: 1px solid #e2e8f0;
    top: 15px;
    bottom: 15px;
    z-index: -1;
  }

  .book-page-wrapper-right::before {
    left: 8px;
    right: -8px;
    border-radius: 0 15px 15px 0;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
    background: linear-gradient(to left, #f7f7f7 0%, #fcfcfc 100%);
  }

  .book-page-wrapper-right::after {
    left: 16px;
    right: -16px;
    border-radius: 0 12px 12px 0;
    box-shadow: 3px 0 12px rgba(0, 0, 0, 0.08);
    background: linear-gradient(to left, #f2f2f2 0%, #f9f9f9 100%);
  }

  .book-page {
    background: white;
    height: 100%;
    width: 100%;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.15),
      0 0 15px rgba(0, 0, 0, 0.05) inset;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .book-page-left {
    border-radius: 20px 2px 2px 20px;
    background: linear-gradient(
      to right,
      #ffffff 0%,
      #fcfcfc 95%,
      #f8f8f8 100%
    );
  }

  .book-page-right {
    border-radius: 2px 20px 20px 2px;
    background: linear-gradient(to left, #ffffff 0%, #fcfcfc 95%, #f8f8f8 100%);
  }

  .book-spine-effect {
    position: absolute;
    top: 60px;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    z-index: 1;
    pointer-events: none;
  }

  .book-spine-effect::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.15) 0%,
      rgba(0, 0, 0, 0.12) 15%,
      rgba(0, 0, 0, 0.08) 30%,
      rgba(0, 0, 0, 0.04) 50%,
      transparent 80%
    );
  }

  /* Center crease */
  .book-spine-effect::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 10%,
      rgba(0, 0, 0, 0.15) 50%,
      rgba(0, 0, 0, 0.1) 90%,
      transparent 100%
    );
  }

  /* Additional spine details */
  .book-spine-effect {
    &:before {
      filter: blur(2px);
    }
  }

  @media (max-width: 1024px) {
    .book-spread {
      flex-direction: column;
      padding: 60px 20px 20px;
      gap: 0;
      max-height: none;
    }

    .book-spread::before,
    .book-spine-effect {
      display: none;
    }

    .book-page-wrapper {
      width: 100%;
      max-width: 800px;
      height: 50%;
      max-height: 450px;
    }

    .book-page {
      height: 100%;
      width: 100%;
    }

    .book-page-left {
      border-radius: 20px 20px 4px 4px;
    }

    .book-page-right {
      border-radius: 4px 4px 20px 20px;
    }
  }

  @media (max-width: 640px) {
    .book-spread {
      padding: 60px 10px 10px;
    }
  }
</style>
