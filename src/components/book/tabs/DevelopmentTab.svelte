<script lang="ts">
  import type { BookmarkTab, BookmarkField } from '$lib/types';
  import RpcSection from './development/RpcSection.svelte';
  import TestnetsSection from './development/TestnetsSection.svelte';
  import DevResourcesSection from './development/DevResourcesSection.svelte';
  import GenericLinksSection from './development/GenericLinksSection.svelte';
  
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
    <RpcSection rpcs={chainStatic.rpcs} />
  {:else if activeField.field === 'testnets'}
    <TestnetsSection testnets={chainStatic.testnets || []} />
  {:else if activeField.field === 'sdks' || activeField.field === 'tools'}
    <DevResourcesSection 
      resources={chainStatic[activeField.field] || []} 
      resourceType={activeField.field} 
    />
  {:else}
    <GenericLinksSection 
      links={chainStatic[activeField.field] || []} 
      icon={activeField.icon} 
    />
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
</style>