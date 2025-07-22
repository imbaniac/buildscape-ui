<script lang="ts">
  import type { BookmarkTab, BookmarkField } from '$lib/types';
  
  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
  }

  let { chainStatic, bookmarks }: Props = $props();
  
  const resourcesTab = $derived(bookmarks.find((g: BookmarkTab) => g.id === 'resources'));
  
  // Get display name from URL or use provided name
  function getDisplayName(link: any): string {
    if (!link) return '';
    if (typeof link === 'string') {
      try {
        const url = new URL(link);
        const domain = url.hostname.replace('www.', '');
        return domain;
      } catch {
        return link;
      }
    }
    return link.name || link.url;
  }
  
  // Get URL from link
  function getUrl(link: any): string {
    if (!link) return '';
    return typeof link === 'string' ? link : link.url;
  }
</script>

<div class="resources-modern">
  {#each resourcesTab?.fields || [] as field}
    {#if chainStatic[field.field]?.length > 0}
      <div class="resource-section">
        <h4 class="section-title">
          <span class="section-icon">{field.icon}</span>
          {field.label}
        </h4>
        <div class="resource-list">
          {#each chainStatic[field.field] || [] as link}
            {#if link}
              {@const url = getUrl(link)}
              {@const name = getDisplayName(link)}
              <a 
                href={url} 
                target="_blank" 
                class="resource-item"
              >
                <span class="resource-name">{name}</span>
                <svg class="resource-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17L17 7"/>
                  <path d="M7 7h10v10"/>
                </svg>
              </a>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Modern Resources Design */
  .resources-modern {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .resource-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .section-icon {
    font-size: 1rem;
  }
  
  /* Resource List */
  .resource-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
  }
  
  .resource-item:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateX(2px);
  }
  
  .resource-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }
  
  .resource-arrow {
    color: #cbd5e1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }
  
  .resource-item:hover .resource-arrow {
    color: #64748b;
    transform: translate(1px, -1px);
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .resources-modern {
      gap: 1.5rem;
    }

    .resource-section {
      gap: 0.5rem;
    }

    .section-title {
      font-size: 0.875rem;
    }

    .section-icon {
      font-size: 0.875rem;
    }

    .resource-list {
      gap: 0.375rem;
    }

    .resource-item {
      padding: 0.75rem;
      gap: 0.75rem;
    }
    
    .resource-name {
      font-size: 0.8125rem;
    }

    .resource-arrow {
      width: 12px;
      height: 12px;
    }
  }
</style>