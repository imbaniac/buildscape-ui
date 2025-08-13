<script lang="ts">
  import { page } from "$app/stores";

  const errorMessages: Record<number, { title: string; message: string }> = {
    404: {
      title: "Uncharted Territory",
      message:
        "This blockchain island hasn't been<br />discovered on our map yet",
    },
    500: {
      title: "Rough Seas Ahead",
      message:
        "Our ship encountered an unexpected storm.<br />Please try again later.",
    },
    503: {
      title: "Port Closed",
      message:
        "The harbor is temporarily closed for maintenance.<br />Please check back soon.",
    },
  };

  const defaultError = {
    title: "Navigation Error",
    message:
      "Something went wrong on our voyage.<br />Let's get you back to safe waters.",
  };

  $: status = $page.status || 500;
  $: error = errorMessages[status] || defaultError;
</script>

<div class="error-container">
  <div class="error-content">
    <h1 class="error-code">{status}</h1>
    <h2 class="error-title">{error.title}</h2>

    <p class="error-message">
      {@html error.message}
    </p>

    <a href="/" class="home-button"> Navigate Home </a>
  </div>

  <div class="waves">
    <div class="wave wave1"></div>
    <div class="wave wave2"></div>
  </div>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background:
      radial-gradient(
        ellipse at center top,
        #87ceeb 0%,
        #6bb6d8 30%,
        #5a9cc5 60%,
        #4d9bc3 100%
      ),
      linear-gradient(to bottom, #7fc3e6 0%, #5ca9ce 100%);
    background-blend-mode: normal;
    color: #ffffff;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    position: relative;
    overflow: hidden;
  }

  .error-content {
    text-align: center;
    z-index: 10;
    padding: 2rem;
  }

  .error-code {
    font-size: 8rem;
    font-weight: 200;
    margin: 0;
    opacity: 0.4;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.9);
  }

  .error-title {
    font-size: 2rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    margin-bottom: 0.5rem;
  }

  .error-message {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 1;
    margin-bottom: 3rem;
    font-weight: 400;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .home-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.5rem;
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
    letter-spacing: 0.05em;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .home-button:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .waves {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    overflow: hidden;
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.1) 30%,
      transparent 70%
    );
    border-radius: 50% 50% 0 0;
    animation: wave 20s linear infinite;
  }

  .wave2 {
    animation-delay: -10s;
    opacity: 0.5;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 30%,
      transparent 70%
    );
  }

  @keyframes wave {
    0% {
      transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
      transform: translateX(-25%) translateZ(0) scaleY(0.8);
    }
    100% {
      transform: translateX(-50%) translateZ(0) scaleY(1);
    }
  }

  @media (max-width: 640px) {
    .error-code {
      font-size: 6rem;
    }

    .error-title {
      font-size: 1.5rem;
      margin: -2.5rem 0 1rem 0;
    }
  }
</style>
