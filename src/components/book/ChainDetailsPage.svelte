<script lang="ts">
  import TabButton from './ui/TabButton.svelte';
  import OverviewTab from './tabs/OverviewTab.svelte';
  import ResourcesTab from './tabs/ResourcesTab.svelte';
  import ExplorersTab from './tabs/ExplorersTab.svelte';
  import DevelopmentTab from './tabs/DevelopmentTab.svelte';
  import WalletsTab from './tabs/WalletsTab.svelte';
  import type { BookmarkTab, BookmarkField, WalletsByCategory } from '$lib/types';
  
  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
    walletsByCategory: WalletsByCategory;
    activeTab: string;
    activeGroup: string;
    onTabClick: (tabId: string, groupId: string) => void;
  }

  let { 
    chainStatic, 
    bookmarks, 
    walletsByCategory, 
    activeTab, 
    activeGroup,
    onTabClick 
  }: Props = $props();
  
  const tabGroups = $derived(
    bookmarks.map((group: BookmarkTab) => ({
      ...group,
      isActive: group.id === activeTab || group.fields.some((f: BookmarkField) => f.field === activeTab)
    }))
  );
</script>

<div class="page-content">
  <div class="tabs-container">
    <div class="tabs-header">
      {#each bookmarks as group}
        {#if group.id !== 'wallets' || chainStatic.technology?.isEVM}
          <TabButton
            active={tabGroups.find(g => g.id === group.id)?.isActive}
            onclick={() => onTabClick(group.id, group.id)}
          >
            {group.name}
          </TabButton>
        {/if}
      {/each}
    </div>

    <div class="tab-content">
      {#if activeTab === "overview"}
        <OverviewTab {chainStatic} />
      {:else if activeGroup === "resources"}
        <ResourcesTab {chainStatic} {bookmarks} />
      {:else if activeGroup === "explorers"}
        <ExplorersTab {chainStatic} />
      {:else if activeGroup === "development"}
        <DevelopmentTab 
          {chainStatic} 
          {bookmarks} 
          {activeTab}
          onTabChange={(tab) => onTabClick(tab, 'development')}
        />
      {:else if activeTab === "wallets" && chainStatic.technology?.isEVM}
        <WalletsTab {walletsByCategory} />
      {:else}
        <div class="no-content">
          <p>No data available for this section</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .page-content {
    padding: 4rem;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .tabs-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tabs-header {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 2.5rem;
    position: relative;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2rem;
  }

  .no-content {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 0.9375rem;
  }

  @media (max-width: 1024px) {
    .page-content {
      padding: 2.5rem;
    }
  }

  @media (max-width: 640px) {
    .page-content {
      padding: 2rem;
    }

    .tab-content {
      padding-right: 0.5rem;
    }

    .tabs-header {
      gap: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    
    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tabs-header :global(.tab-button) {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      flex: 0 0 auto;
    }
  }
</style>