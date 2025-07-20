<script lang="ts">
  import CloseButton from "./ui/CloseButton.svelte";
  import { onMount } from "svelte";

  interface Props {
    onClose: () => void;
    leftPage?: import("svelte").Snippet;
    rightPage?: import("svelte").Snippet;
  }

  let { onClose, leftPage, rightPage }: Props = $props();
  
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
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

<div class="book-fullscreen" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
  <div class="book-header">
    <CloseButton onclick={onClose} />
    {#if isMobile}
      <div class="mobile-page-indicator">
        <button 
          class="page-dot" 
          class:active={!showRightPage}
          onclick={() => showRightPage = false}
          aria-label="Show info page"
        ></button>
        <button 
          class="page-dot" 
          class:active={showRightPage}
          onclick={() => showRightPage = true}
          aria-label="Show details page"
        ></button>
      </div>
    {/if}
  </div>

  <div class="book-spread">
    <!-- Left Page -->
    <div class="book-page-wrapper book-page-wrapper-left" class:mobile-hidden={isMobile && showRightPage}>
      <div class="book-page book-page-left">
        {#if leftPage}
          {@render leftPage()}
        {/if}
      </div>
    </div>

    <!-- Book Spine -->
    <div class="book-spine-effect"></div>

    <!-- Right Page -->
    <div class="book-page-wrapper book-page-wrapper-right" class:mobile-hidden={isMobile && !showRightPage}>
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
    background: 
      radial-gradient(ellipse at center top, #87ceeb 0%, #6bb6d8 30%, #5ca9ce 60%, #4d9bc3 100%),
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
    max-width: min(700px, 45vw);
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
    background: #f8f8f6;
    border: 1px solid #e5e2dd;
    top: 15px;
    bottom: 15px;
    z-index: -1;
  }

  .book-page-wrapper-left::before {
    left: -8px;
    right: 8px;
    border-radius: 15px 0 0 15px;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  }

  .book-page-wrapper-left::after {
    left: -16px;
    right: 16px;
    border-radius: 12px 0 0 12px;
    box-shadow: -3px 0 12px rgba(0, 0, 0, 0.08);
    background: #f5f5f3;
  }

  /* Paper stack effect for right wrapper */
  .book-page-wrapper-right::before,
  .book-page-wrapper-right::after {
    content: "";
    position: absolute;
    background: #f8f8f6;
    border: 1px solid #e5e2dd;
    top: 15px;
    bottom: 15px;
    z-index: -1;
  }

  .book-page-wrapper-right::before {
    left: 8px;
    right: -8px;
    border-radius: 0 15px 15px 0;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  }

  .book-page-wrapper-right::after {
    left: 16px;
    right: -16px;
    border-radius: 0 12px 12px 0;
    box-shadow: 3px 0 12px rgba(0, 0, 0, 0.08);
    background: #f5f5f3;
  }

  .book-page {
    background: #fafaf8;
    height: 100%;
    width: 100%;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.15),
      0 0 15px rgba(0, 0, 0, 0.05) inset;
    overflow: hidden;
    position: relative;
    z-index: 1;
    border: 1px solid #e5e2dd;
  }
  
  .book-page::before {
    content: '';
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
    content: '';
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
    border-radius: 20px 2px 2px 20px;
    position: relative;
  }
  

  .book-page-right {
    border-radius: 2px 20px 20px 2px;
    position: relative;
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

    .book-spread::before,
    .book-spine-effect {
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
      background: linear-gradient(to right, transparent 10%, #e2e8f0 30%, #e2e8f0 70%, transparent 90%);
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
        radial-gradient(ellipse at center top, #87ceeb 0%, #6bb6d8 30%, #5ca9ce 60%, #4d9bc3 100%),
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
    .book-spread::before,
    .book-spine-effect,
    .book-page-wrapper::before,
    .book-page-wrapper::after {
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
    background: #3b82f6;
    width: 24px;
    border-radius: 5px;
  }

  .mobile-hidden {
    display: none !important;
  }
</style>
