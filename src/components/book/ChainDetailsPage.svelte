<script lang="ts">
  import TabButton from "./ui/TabButton.svelte";
  import OverviewTab from "./tabs/OverviewTab.svelte";
  import ResourcesTab from "./tabs/ResourcesTab.svelte";
  import ExplorersTab from "./tabs/ExplorersTab.svelte";
  import DevelopmentTab from "./tabs/DevelopmentTab.svelte";
  import WalletsTab from "./tabs/WalletsTab.svelte";
  import SkeletonLoader from "./SkeletonLoader.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";
  import type {
    BookmarkTab,
    BookmarkField,
    WalletsByCategory,
  } from "$lib/types";

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
    onTabClick,
  }: Props = $props();

  const tabGroups = $derived(
    bookmarks.map((group: BookmarkTab) => ({
      ...group,
      isActive:
        group.id === activeTab ||
        group.fields.some((f: BookmarkField) => f.field === activeTab),
    })),
  );

  // Tab icons mapping - using more subtle icons
  const tabIcons: Record<string, string> = {
    overview: "📋",
    resources: "📚",
    explorers: "🔍",
    development: "🛠️",
    wallets: "💰",
  };

  // Get accessible brand color for UI elements
  const adjustedBrandColor = $derived(
    getAccessibleBrandColor(chainStatic.color || "#3b82f6"),
  );
</script>

<div class="page-content">
  <div class="tabs-container">
    <div class="tabs-header">
      {#each bookmarks as group}
        {#if group.id !== "wallets" || chainStatic.technology?.isEVM}
          <TabButton
            active={tabGroups.find((g) => g.id === group.id)?.isActive}
            onclick={() => onTabClick(group.id, group.id)}
            brandColor={adjustedBrandColor}
            icon={tabIcons[group.id]}
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
          onTabChange={(tab) => onTabClick(tab, "development")}
        />
      {:else if activeTab === "wallets" && chainStatic.technology?.isEVM}
        {#if Object.keys(walletsByCategory).length === 0}
          <SkeletonLoader type="wallets" />
        {:else}
          <WalletsTab {walletsByCategory} />
        {/if}
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
    position: absolute;
    top: 2rem;
    right: 3rem;
    bottom: 2rem;
    left: 3rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family:
      -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
  }

  .tabs-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .tabs-header {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 2.5rem;
    position: relative;
    padding-bottom: 0;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 4px;
    padding-right: 2rem;
  }

  .no-content {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 0.9375rem;
  }

  /* Mobile/Tablet view - single page */
  @media (max-width: 1280px) {
    .page-content {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      padding: 1.5rem;
      height: auto; /* Let content determine height */
      display: flex;
      flex-direction: column;
    }

    .tab-content {
      padding-left: 0;
      padding-right: 0;
      overflow-x: hidden;
    }

    .tabs-header {
      margin-bottom: 1.5rem;
      gap: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tabs-header :global(.tab-button) {
      padding: 0.625rem 0.875rem;
      font-size: 0.75rem;
      flex: 0 0 auto;
      white-space: nowrap;
    }
  }
</style>
