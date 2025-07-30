<script lang="ts">
    import { onMount } from "svelte";

  interface Props {
    leftPage?: import("svelte").Snippet;
    rightPage?: import("svelte").Snippet;
    brandColor?: string;
  }

  let {
    leftPage,
    rightPage,
    brandColor = "#3b82f6",
  }: Props = $props();

  // Mobile page state
  let showRightPage = $state(false);
  let touchStartX = 0;
  let touchStartY = 0;
  let isMobile = $state(false);

  onMount(() => {
    isMobile = window.innerWidth <= 800;

    const handleResize = () => {
      isMobile = window.innerWidth <= 800;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // Handle swipe gestures on mobile
  function handleTouchStart(e: TouchEvent) {
    if (!isMobile) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (!isMobile) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Only process horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0 && showRightPage) {
        // Swipe right - go to left page
        showRightPage = false;
      } else if (deltaX < 0 && !showRightPage) {
        // Swipe left - go to right page
        showRightPage = true;
      }
    }
  }
</script>

<div
  class="book-fullscreen"
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  {#if isMobile}
    <div class="book-header">
      <div class="mobile-page-indicator" style="--brand-color: {brandColor}">
        <button
          class="page-dot"
          class:active={!showRightPage}
          onclick={() => (showRightPage = false)}
          aria-label="Show info page"
        ></button>
        <button
          class="page-dot"
          class:active={showRightPage}
          onclick={() => (showRightPage = true)}
          aria-label="Show details page"
        ></button>
      </div>
    </div>
  {/if}

  <!-- Book Cover Wrapper -->
  <div class="book-cover" style="--brand-color: {brandColor}">
    <div class="book-spread">
      <!-- Left Page Edges -->
      <div class="page-edges page-edges-left">
        <div class="page-edge" style="--index: 0; --brightness: 1"></div>
        <div class="page-edge" style="--index: 1; --brightness: 0.98"></div>
        <div class="page-edge" style="--index: 2; --brightness: 0.96"></div>
        <div class="page-edge" style="--index: 3; --brightness: 0.94"></div>
        <div class="page-edge" style="--index: 4; --brightness: 0.92"></div>
        <div class="page-edge" style="--index: 5; --brightness: 0.90"></div>
        <div class="page-edge" style="--index: 6; --brightness: 0.88"></div>
      </div>

      <!-- Left Page -->
      <div
        class="book-page-wrapper book-page-wrapper-left"
        class:mobile-hidden={isMobile && showRightPage}
      >
        <div class="book-page book-page-left">
          <div class="book-page-content">
            {#if leftPage}
              {@render leftPage()}
            {/if}
          </div>
          <div class="book-page-shadow-left"></div>
        </div>
      </div>

      <!-- Book Spine -->
      <div class="book-spine"></div>

      <!-- Right Page -->
      <div
        class="book-page-wrapper book-page-wrapper-right"
        class:mobile-hidden={isMobile && !showRightPage}
      >
        <div class="book-page book-page-right">
          <div class="book-page-content">
            {#if rightPage}
              {@render rightPage()}
            {/if}
          </div>
          <div class="book-page-shadow-right"></div>
        </div>
      </div>

      <!-- Right Page Edges -->
      <div class="page-edges page-edges-right">
        <div class="page-edge" style="--index: 6; --brightness: 0.88"></div>
        <div class="page-edge" style="--index: 5; --brightness: 0.90"></div>
        <div class="page-edge" style="--index: 4; --brightness: 0.92"></div>
        <div class="page-edge" style="--index: 3; --brightness: 0.94"></div>
        <div class="page-edge" style="--index: 2; --brightness: 0.96"></div>
        <div class="page-edge" style="--index: 1; --brightness: 0.98"></div>
        <div class="page-edge" style="--index: 0; --brightness: 1"></div>
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
    background:
      radial-gradient(
        ellipse at center top,
        #87ceeb 0%,
        #6bb6d8 30%,
        #5ca9ce 60%,
        #4d9bc3 100%
      ),
      linear-gradient(to bottom, #7fc3e6 0%, #5ca9ce 100%);
    background-blend-mode: normal;
    overflow: hidden;
    z-index: 1000;
  }

  .book-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    z-index: 10;
    background: transparent;
  }

  /* Book Cover */
  .book-cover {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: color-mix(in srgb, var(--brand-color, #3b82f6) 70%, black 30%);
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
      );
    border-radius: 8px 4px 4px 8px;
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 10px 20px rgba(0, 0, 0, 0.2),
      inset 0 2px 4px rgba(255, 255, 255, 0.1),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3);
    padding: 15px 25px;
  }

  .book-spread {
    display: flex;
    height: calc(100vh - 80px);
    max-height: 920px;
    gap: 0;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible;
  }

  .book-page-wrapper {
    position: relative;
    height: 100%;
    width: calc(50vw - 50px);
    max-width: min(900px, 48vw);
    z-index: 5;
    overflow: visible;
  }

  .book-page-wrapper-left {
    margin-right: 0;
  }

  .book-page-wrapper-right {
    margin-left: 0;
  }

  /* Page Edges */
  .page-edges {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    z-index: 1;
    overflow: visible;
  }

  .page-edges-left {
    left: -22px;
  }

  .page-edges-right {
    right: -22px;
  }

  .page-edge {
    position: absolute;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      hsl(39, 42%, calc(93% * var(--brightness))) 0%,
      hsl(37, 37%, calc(89% * var(--brightness))) 50%,
      hsl(35, 32%, calc(86% * var(--brightness))) 100%
    );
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    width: 4px;
  }

  .page-edges-left .page-edge {
    right: calc(var(--index) * 3px - 5px);
    border-radius: 2px 0 0 2px;
  }

  .page-edges-right .page-edge {
    left: calc(var(--index) * 3px - 5px);
    border-radius: 0 2px 2px 0;
  }

  .book-page {
    background: #fafaf8;
    height: 100%;
    width: 100%;
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.25),
      0 2px 10px rgba(0, 0, 0, 0.15),
      0 0 15px rgba(0, 0, 0, 0.05) inset;
    overflow: visible;
    position: relative;
    z-index: 10;
  }

  .book-page::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
      linear-gradient(225deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
    opacity: 0.5;
  }

  /* Subtle page texture */
  .book-page::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="0.5" fill="%23000" opacity="0.02"/></svg>');
    pointer-events: none;
    z-index: 2;
    transform: rotate(15deg);
  }

  .book-page-left {
    border-radius: 4px 0 0 4px;
    position: relative;
    margin-right: -1px;
    box-shadow:
      inset 5px 0 10px -5px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #d8d5d0;
    border-right: none;
  }

  .book-page-content {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
  }

  .book-page-shadow-left {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100px;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.005) 40%,
      rgba(0, 0, 0, 0.015) 60%,
      rgba(0, 0, 0, 0.04) 80%,
      rgba(0, 0, 0, 0.08) 95%,
      rgba(0, 0, 0, 0.12) 100%
    );
    pointer-events: none;
    z-index: 10;
  }

  .book-page-shadow-right {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100px;
    background: linear-gradient(
      to left,
      transparent 0%,
      rgba(0, 0, 0, 0.005) 40%,
      rgba(0, 0, 0, 0.015) 60%,
      rgba(0, 0, 0, 0.04) 80%,
      rgba(0, 0, 0, 0.08) 95%,
      rgba(0, 0, 0, 0.12) 100%
    );
    pointer-events: none;
    z-index: 10;
  }

  .book-page-right {
    border-radius: 0 4px 4px 0;
    position: relative;
    margin-left: -1px;
    box-shadow:
      inset -5px 0 10px -5px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #d8d5d0;
    border-left: none;
  }

  /* Book Spine */
  .book-spine {
    width: 0;
    height: 100%;
    position: relative;
    z-index: 4;
  }

  @media (max-width: 1280px) {
    .book-spread {
      padding: 60px 40px 30px;
    }

    .book-page-wrapper {
      max-width: min(600px, 48vw);
    }
  }

  @media (max-width: 1100px) {
    .book-spread {
      flex-direction: column;
      padding: 60px 20px 20px;
      gap: 0;
      max-height: none;
    }

    .book-cover {
      position: relative;
      top: 0;
      left: 0;
      transform: none;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .book-spine,
    .page-edges {
      display: none;
    }

    .book-page-wrapper {
      width: 100%;
      max-width: 700px;
      height: calc(50vh - 50px);
      min-height: 400px;
      max-height: 500px;
    }

    .book-page-wrapper-left,
    .book-page-wrapper-right {
      margin: 0;
    }

    /* Add separator between pages */
    .book-page-wrapper-left {
      position: relative;
    }

    .book-page-wrapper-left::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        to right,
        transparent 10%,
        #e2e8f0 30%,
        #e2e8f0 70%,
        transparent 90%
      );
      z-index: 10;
    }

    .book-page {
      height: 100%;
      width: 100%;
    }

    .book-page-left {
      border-radius: 20px 20px 0 0;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .book-page-right {
      border-radius: 0 0 20px 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    /* Hide paper stack effects in column layout */
    .book-page-wrapper::before,
    .book-page-wrapper::after {
      display: none;
    }
  }

  @media (max-width: 800px) {
    .book-fullscreen {
      background:
        radial-gradient(
          ellipse at center top,
          #87ceeb 0%,
          #6bb6d8 30%,
          #5ca9ce 60%,
          #4d9bc3 100%
        ),
        linear-gradient(to bottom, #7fc3e6 0%, #5ca9ce 100%);
      background-blend-mode: normal;
    }

    .book-header {
      height: 50px;
      padding: 0 1rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .book-spread {
      flex-direction: column;
      padding: 0;
      height: 100vh;
      top: 0;
      transform: none;
      left: 0;
      gap: 0;
      width: 100%;
      max-width: none;
    }

    /* Hide all book decoration effects */
    .book-cover {
      background: transparent;
      padding: 0;
      box-shadow: none;
    }

    .book-spine,
    .page-edges {
      display: none;
    }

    /* Single page view - only show one at a time */
    .book-page-wrapper {
      width: 100vw;
      height: calc(100vh - 50px);
      max-width: none;
      max-height: none;
      margin: 0 !important;
      position: absolute;
      top: 50px;
      left: 0;
    }

    .book-page-wrapper {
      display: none;
    }

    .book-page-wrapper-left:not(.mobile-hidden) {
      display: block;
    }

    .book-page-wrapper-right:not(.mobile-hidden) {
      display: block;
    }

    .book-page {
      border-radius: 0;
      box-shadow: none;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      /* Keep the parchment background on mobile too */
      border: none;
    }

    .book-page-left,
    .book-page-right {
      border-radius: 0;
    }
  }

  @media (max-width: 640px) {
    .book-spread {
      padding: 60px 10px 10px;
    }
  }

  /* Mobile page indicator */
  .mobile-page-indicator {
    display: flex;
    gap: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .page-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #cbd5e1;
    border: none;
    padding: 0;
    transition: all 0.2s;
    cursor: pointer;
  }

  .page-dot:hover {
    background: #94a3b8;
  }

  .page-dot.active {
    background: var(--brand-color, #3b82f6);
    width: 24px;
    border-radius: 5px;
  }

  .mobile-hidden {
    display: none !important;
  }
</style>
