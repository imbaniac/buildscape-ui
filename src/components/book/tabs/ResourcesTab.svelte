<script lang="ts">
  import type { BookmarkTab, BookmarkField } from '$lib/types';
  
  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
  }

  let { chainStatic, bookmarks }: Props = $props();
  
  const resourcesTab = $derived(bookmarks.find((g: BookmarkTab) => g.id === 'resources'));
</script>

<div class="resources-sections">
  {#each resourcesTab?.fields || [] as field}
    {#if chainStatic[field.field]?.length > 0}
      <div class="resource-section">
        <h4 class="section-title">{field.label}</h4>
        <div class="links-list">
          {#each chainStatic[field.field] || [] as link}
            {#if typeof link === 'string'}
              <a href={link} target="_blank" class="link-item">
                <span class="link-icon">{field.icon}</span>
                <span>{link}</span>
              </a>
            {:else}
              <a href={link.url} target="_blank" class="link-item">
                <span class="link-icon">{field.icon}</span>
                <span>{link.name}</span>
              </a>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .resources-sections {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .resource-section h4.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  .resource-section:first-child h4.section-title {
    margin-top: 0;
  }

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