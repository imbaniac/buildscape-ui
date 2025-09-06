<script lang="ts">
  import { goto } from "$app/navigation";

  interface Props {
    onClose?: () => void;
    leftPage?: import("svelte").Snippet;
    rightPage?: import("svelte").Snippet;
    brandColor?: string;
    currentPath?: string;
  }

  let {
    onClose,
    leftPage,
    rightPage,
    brandColor = "#3b82f6",
    currentPath,
  }: Props = $props();

  // Determine if we're on a sub-route (shows right page on mobile)
  const isSubRoute = $derived(() => {
    if (!currentPath || typeof currentPath !== "string") return false;
    // Check if we're on a sub-route like /chain/slug/something
    const pathParts = currentPath.split("/").filter(Boolean);
    return pathParts.length > 2; // ['chain', 'slug', 'something']
  });

  // Mobile page state - derived from route
  const showRightPage = $derived(isSubRoute());

  // Get base chain path
  const baseChainPath = $derived(
    currentPath && typeof currentPath === "string"
      ? currentPath.match(/^\/chain\/([^/]+)/)?.[0] || "/"
      : "/",
  );

  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;
  let swipeDistance = 0;

  // Handle swipe gestures on mobile
  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping) return;
    swipeDistance = e.touches[0].clientX - touchStartX;
  }

  function handleTouchEnd(e: TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Only process horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0 && showRightPage) {
        // Swipe right - go to left page (root route)
        goto(baseChainPath, { replaceState: true });
      } else if (deltaX < 0 && !showRightPage) {
        // Swipe left - go to right page (overview if on root)
        if (!isSubRoute()) {
          goto(`${baseChainPath}/overview`, { replaceState: true });
        }
      }
    }

    // Reset swipe state
    isSwiping = false;
    swipeDistance = 0;
  }

  // Prevent wheel zoom when modal is open
  function handleWheel(e: WheelEvent) {
    // Only prevent if it's a pinch gesture (ctrl/cmd + wheel)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  }
</script>

<div
  class="book-fullscreen"
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  onwheel={handleWheel}
>
  <!-- Backdrop to dim the map behind -->
  <div class="book-backdrop"></div>

  <!-- Mobile header - hidden on desktop via CSS -->
  <div class="book-header">
    <div class="mobile-page-indicator" style="--brand-color: {brandColor}">
      <div class="page-indicator-bg"></div>
      <button
        class="page-dot"
        class:active={!showRightPage}
        onclick={() => {
          // Navigate to root route to show left page
          goto(baseChainPath, { replaceState: true });
        }}
        aria-label="Show info page"
      ></button>
      <button
        class="page-dot"
        class:active={showRightPage}
        onclick={() => {
          // If on root, navigate to overview, otherwise stay on current route
          if (!isSubRoute()) {
            goto(`${baseChainPath}/overview`, { replaceState: true });
          }
        }}
        aria-label="Show details page"
      ></button>
    </div>

    <!-- Edge gradients for swipe hints -->
    <div class="swipe-hint-left" class:visible={showRightPage}></div>
    <div
      class="swipe-hint-right"
      class:visible={!showRightPage && !isSubRoute()}
    ></div>
    {#if onClose}
      <button class="mobile-close-button" onclick={onClose} aria-label="Close">
        ×
      </button>
    {/if}
  </div>

  <!-- Book Cover Wrapper -->
  <div class="book-cover" style="--brand-color: {brandColor}">
    <div class="book-spread">
      <!-- Bookmark close button tucked behind pages -->
      {#if onClose}
        <button
          class="bookmark-close"
          onclick={onClose}
          aria-label="Close book"
        >
          <div class="bookmark-ribbon"></div>
          <div class="bookmark-tail"></div>
        </button>
      {/if}

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
      {#key !showRightPage}
        <div
          class="book-page-wrapper book-page-wrapper-left"
          class:mobile-hide={showRightPage}
          class:initial-peek={!showRightPage}
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
      {/key}

      <!-- Book Spine -->
      <div class="book-spine"></div>

      <!-- Right Page -->
      {#key showRightPage}
        <div
          class="book-page-wrapper book-page-wrapper-right"
          class:mobile-show={showRightPage}
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
      {/key}

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
    pointer-events: auto;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    z-index: 10;
    cursor: default; /* Ensure default cursor over the entire modal */
    touch-action: pan-x pan-y; /* Allow scrolling but prevent pinch zoom */
  }

  .book-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: default; /* Override any inherited cursor */
    background: rgb(5, 16, 21);

    opacity: 0.5;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .book-header {
    display: none; /* Hidden by default on desktop */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    z-index: 3;
    background: transparent;
  }

  /* Book Cover */
  .book-cover {
    position: absolute;
    max-width: 1500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: color-mix(in srgb, var(--brand-color, #3b82f6) 70%, black 30%);
    z-index: 2;
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
    height: calc(100dvh - 80px);
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
    position: relative;
    z-index: 10;
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
    overflow-y: auto;
    overflow-x: hidden;
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

  /* Mobile/Tablet view - single page */
  @media (max-width: 1280px) {
    .book-header {
      display: flex; /* Show on mobile */
      height: 50px;
      padding: 0 1rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Extend backdrop to cover animation area */
    .book-backdrop {
      width: calc(100% + 40px);
      left: -20px;
    }

    .book-spread {
      flex-direction: column;
      padding: 0;
      height: calc(100dvh - 50px); /* Account for header */
      margin-top: 50px; /* Space for header */
      gap: 0;
      width: 100%;
      max-width: none;
      overflow: hidden; /* Clip content during animation */
      background: #fafaf8; /* Match page background */
    }

    /* Hide all book decoration effects */
    .book-cover {
      position: relative;
      top: 0;
      left: 0;
      transform: none;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }

    .book-spine,
    .page-edges {
      display: none;
    }

    /* Single page view - only show one at a time */
    .book-page-wrapper {
      width: 100vw;
      height: calc(100dvh - 50px);
      max-width: none;
      max-height: none;
      margin: 0 !important;
      position: relative; /* Use normal flow instead of absolute */
    }

    /* Show left page by default */
    .book-page-wrapper-left {
      display: block;
    }

    .book-page-wrapper-right {
      display: none;
    }

    /* Hide left page when mobile-hide is active */
    .book-page-wrapper-left.mobile-hide {
      display: none;
    }

    /* Show right page when mobile-show is active */
    .book-page-wrapper-right.mobile-show {
      display: block;
    }

    .book-page {
      border-radius: 0;
      box-shadow: none;
      height: 100%;
      overflow: hidden;
      border: none;
      background: #fafaf8; /* Ensure consistent background */
    }

    .book-page-content {
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .book-page-left,
    .book-page-right {
      border-radius: 0;
      box-shadow: none;
    }

    /* Hide paper stack effects */
    .book-page-wrapper::before,
    .book-page-wrapper::after {
      display: none;
    }

    .book-page-shadow-left,
    .book-page-shadow-right {
      display: none;
    }

    .bookmark-close {
      display: none;
    }
  }

  /* Mobile page indicator */
  .mobile-page-indicator {
    display: flex;
    gap: 8px;
    position: relative;
    padding: 6px 12px;
    align-items: center;
    justify-content: center;
  }

  .page-indicator-bg {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .page-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #94a3b8;
    border: none;
    padding: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  .page-dot:hover {
    background: #64748b;
    transform: scale(1.1);
  }

  .page-dot.active {
    background: var(--brand-color, #3b82f6);
    width: 32px;
    border-radius: 7px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  /* Bookmark Close Button */
  .bookmark-close {
    position: absolute;
    top: -35px;
    right: 10px;
    z-index: 3; /* Behind pages (which are z-index: 5) but above page edges */
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 55px;
    transition: transform 0.2s ease;
    touch-action: none; /* Prevent any touch gestures on the button */
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight on iOS */
  }

  .bookmark-close:hover {
    transform: translateY(3px);
  }

  .bookmark-ribbon {
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 45px;
    background: linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
    border-radius: 2px 2px 0 0;
    box-shadow:
      -2px 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }

  .bookmark-close:hover .bookmark-ribbon {
    box-shadow:
      -2px 3px 6px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  .bookmark-tail {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 16px 0 16px;
    border-color: #991b1b transparent transparent transparent;
  }

  /* Add a subtle X icon on the ribbon */
  .bookmark-ribbon::after {
    content: "×";
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  /* Mobile close button */
  .mobile-close-button {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    color: #64748b;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    padding: 0;
    line-height: 1;
    font-family:
      Arial, sans-serif; /* Use consistent font for × across browsers */
    touch-action: none; /* Prevent any touch gestures on the button */
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight on iOS */
  }

  .mobile-close-button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #475569;
  }

  /* Swipe hint gradients */
  .swipe-hint-left,
  .swipe-hint-right {
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 20;
  }

  .swipe-hint-left {
    left: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
  }

  .swipe-hint-right {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
  }

  .swipe-hint-left.visible,
  .swipe-hint-right.visible {
    opacity: 1;
  }

  @media (max-width: 1280px) {
    /* Initial peek animation */
    @keyframes peekHint {
      0%,
      100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(-10px);
      }
    }

    .book-page-wrapper.initial-peek {
      animation: peekHint 0.6s ease-out 0.3s;
    }

    /* Enhanced page transitions */
    .book-page-wrapper {
      transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.3s ease;
    }

    .book-page-wrapper-left.mobile-hide {
      transform: translateX(-100%);
      opacity: 0;
    }

    .book-page-wrapper-right:not(.mobile-show) {
      transform: translateX(100%);
      opacity: 0;
    }
  }
</style>
