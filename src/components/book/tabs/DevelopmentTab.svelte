<script lang="ts">
  import type { BookmarkTab, BookmarkField } from '$lib/types';
  
  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
  }

  let { chainStatic, bookmarks, activeTab, onTabChange }: Props = $props();
  
  const developmentTab = $derived(bookmarks.find((g: BookmarkTab) => g.id === 'development'));
  const activeField = $derived(
    developmentTab?.fields.find((f: BookmarkField) => f.field === activeTab) || 
    developmentTab?.fields[0]
  );
</script>

{#if activeField}
  <div class="subtabs">
    {#each developmentTab?.fields || [] as field}
      <button
        class="subtab-button"
        class:active={activeTab === field.field || (activeTab === 'development' && field === activeField)}
        onclick={() => onTabChange(field.field)}
      >
        {field.label}
      </button>
    {/each}
  </div>
  
  {#if activeField.field === 'rpcs' && chainStatic.rpcs}
    <div class="rpc-section">
      {#if chainStatic.rpcs.public?.length}
        <h4>Public RPCs</h4>
        <div class="links-list">
          {#each chainStatic.rpcs.public as rpc}
            <div class="link-item">
              <span class="link-icon">🌐</span>
              <span>{rpc}</span>
            </div>
          {/each}
        </div>
      {/if}
      {#if chainStatic.rpcs.private?.length}
        <h4>Private RPCs</h4>
        <div class="links-list">
          {#each chainStatic.rpcs.private as rpc}
            <div class="link-item">
              <span class="link-icon">🔒</span>
              <span>{rpc}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else if activeField.field === 'testnets'}
    <div class="links-list">
      {#each chainStatic.testnets || [] as net}
        <div class="link-item">
          <span class="link-icon">{activeField.icon}</span>
          <span>{typeof net === 'string' ? net : net.name}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div class="links-list">
      {#each chainStatic[activeField.field] || [] as link}
        {#if typeof link === 'string'}
          <a href={link} target="_blank" class="link-item">
            <span class="link-icon">{activeField.icon}</span>
            <span>{link}</span>
          </a>
        {:else}
          <a href={link.url} target="_blank" class="link-item">
            <span class="link-icon">{activeField.icon}</span>
            <span>{link.name}</span>
          </a>
        {/if}
      {/each}
    </div>
  {/if}
{/if}

<style>
  .subtabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .subtab-button {
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .subtab-button:hover {
    background: #f1f5f9;
    color: #475569;
  }

  .subtab-button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .rpc-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }

  .rpc-section h4:first-child {
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