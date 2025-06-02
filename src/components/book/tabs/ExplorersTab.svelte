<script lang="ts">
  interface Props {
    chainStatic: any;
  }

  let { chainStatic }: Props = $props();
</script>

<div class="links-list">
  {#each chainStatic.blockscanners || [] as link}
    <a href={link} target="_blank" class="link-item">
      <span class="link-icon">🔍</span>
      <span>{link}</span>
    </a>
  {/each}
</div>

<style>
  .links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fafbfc;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s;
    font-size: 0.9375rem;
    line-height: 1.5;
    font-weight: 450;
  }

  a.link-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .link-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
</style>