<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import BookLayout from "../../../components/book/BookLayout.svelte";
  import ChainInfoPage from "../../../components/book/ChainInfoPage.svelte";
  import ChainDetailsPage from "../../../components/book/ChainDetailsPage.svelte";
  import type { PageData } from "./$types";
  import type { BookmarkTab, BookmarkField } from "$lib/types";

  let { data }: { data: PageData } = $props();

  let activeTab = $state(data.initialTab);
  let activeGroup = $state(data.initialTab);
  let metricsSpan = $state<"1h" | "24h" | "7d" | "30d">(data.initialSpan);
  let chainDynamic = $state<any>(null);
  let loadingDynamic = $state(false);
  let pollInterval: number | undefined;
  let isVisible = $state(true);

  $effect(() => {
    const currentTab = $page.url.searchParams.get("tab") || "overview";
    const currentSpan = $page.url.searchParams.get("span") || "24h";

    // Only update URL if values have actually changed
    if (currentTab !== activeTab || currentSpan !== metricsSpan) {
      const url = new URL($page.url);
      url.searchParams.set("tab", activeTab);
      url.searchParams.set("span", metricsSpan);
      goto(url.toString(), { replaceState: true, noScroll: true });
    }
  });
  
  function handleTabClick(tabId: string, groupId: string) {
    activeTab = tabId;
    activeGroup = groupId;
  }
  
  $effect(() => {
    // Update activeGroup based on activeTab
    const group = data.bookmarks.find((g: BookmarkTab) => 
      g.id === activeTab || g.fields.some((f: BookmarkField) => f.field === activeTab)
    );
    if (group) {
      activeGroup = group.id;
    }
  });

  async function loadDynamic(span: "1h" | "24h" | "7d" | "30d") {
    if (!data.dynamicLoader) return;

    loadingDynamic = true;
    try {
      chainDynamic = await data.dynamicLoader(span);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
    } finally {
      loadingDynamic = false;
    }
  }

  function handleClose() {
    goto("/");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  onMount(() => {
    loadDynamic(metricsSpan);
    
    // Start polling every 15 seconds
    pollInterval = setInterval(() => {
      if (isVisible) {
        loadDynamic(metricsSpan);
      }
    }, 15000);
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        loadDynamic(metricsSpan); // Refresh immediately when becoming visible
      }
    };
    
    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (pollInterval) clearInterval(pollInterval);
    };
  });

  // React to metricsSpan changes
  let previousSpan = metricsSpan;
  $effect(() => {
    if (metricsSpan !== previousSpan) {
      previousSpan = metricsSpan;
      loadDynamic(metricsSpan);
    }
  });
</script>

<BookLayout onClose={handleClose}>
  {#snippet leftPage()}
    <ChainInfoPage 
      chainStatic={data.chainStatic}
      {chainDynamic}
      {loadingDynamic}
      {metricsSpan}
      onSpanChange={(span) => metricsSpan = span}
    />
  {/snippet}
  
  {#snippet rightPage()}
    <ChainDetailsPage
      chainStatic={data.chainStatic}
      bookmarks={data.bookmarks}
      walletsByCategory={data.walletsByCategory}
      {activeTab}
      {activeGroup}
      onTabClick={handleTabClick}
    />
  {/snippet}
</BookLayout>