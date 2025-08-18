<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
    rounded?: boolean;
  }

  let { width = "100%", height = "1.5rem", rounded = false }: Props = $props();
</script>

<div class="skeleton-loader" class:rounded style:width style:height></div>

<style>
  .skeleton-loader {
    background: linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 4px;
  }

  .skeleton-loader.rounded {
    border-radius: 9999px;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
