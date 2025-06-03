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
    {#if activeField.field === 'sdks'}
      <blockquote class="section-quote">
        <p>Language-specific libraries for interacting with the blockchain - smart contract deployment, transaction signing, and RPC calls.</p>
      </blockquote>
    {:else if activeField.field === 'tools'}
      <blockquote class="section-quote">
        <p>Development environments, testing frameworks, and infrastructure services for building and deploying dApps.</p>
      </blockquote>
    {/if}
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

  .section-quote {
    position: relative;
    margin: 0 0 1.5rem 0;
    padding: 0.75rem 1.25rem 0.75rem 2.5rem;
    background: #fefefe;
    border-left: 3px solid #d4a574;
    font-style: italic;
  }

  .section-quote::before {
    content: '"';
    position: absolute;
    top: 0.125rem;
    left: 0.75rem;
    font-size: 2rem;
    font-family: Georgia, 'Times New Roman', serif;
    color: #d4a574;
    opacity: 0.3;
  }

  .section-quote p {
    margin: 0;
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.4;
    font-family: Georgia, 'Times New Roman', serif;
    letter-spacing: 0.01em;
  }

  @media (max-width: 640px) {
    .subtabs {
      gap: 0.375rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .subtabs::-webkit-scrollbar {
      display: none;
    }

    .subtab-button {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      white-space: nowrap;
      flex: 0 0 auto;
    }

    .section-quote {
      padding: 0.625rem 1rem 0.625rem 2rem;
      margin-bottom: 1rem;
    }

    .section-quote::before {
      font-size: 1.5rem;
      left: 0.5rem;
    }

    .section-quote p {
      font-size: 0.75rem;
    }
  }
</style>