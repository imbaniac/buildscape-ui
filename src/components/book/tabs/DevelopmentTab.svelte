<script lang="ts">
  import type { BookmarkTab, BookmarkField } from "$lib/types";
  import RpcSection from "./development/RpcSection.svelte";
  import TestnetsSection from "./development/TestnetsSection.svelte";
  import DevResourcesSection from "./development/DevResourcesSection.svelte";
  import GenericLinksSection from "./development/GenericLinksSection.svelte";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";

  interface Props {
    chainStatic: any;
    bookmarks: BookmarkTab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
  }

  let { chainStatic, bookmarks, activeTab, onTabChange }: Props = $props();

  const developmentTab = $derived(
    bookmarks.find((g: BookmarkTab) => g.id === "development"),
  );
  const activeField = $derived(
    developmentTab?.fields.find((f: BookmarkField) => f.field === activeTab) ||
      developmentTab?.fields[0],
  );
  const brandColor = chainStatic.color || "#3b82f6";
  const accessibleColor = $derived(getAccessibleBrandColor(brandColor));
</script>

{#if activeField}
  <div
    class="subtabs"
    style="--brand-color: {brandColor}; --accessible-color: {accessibleColor}"
  >
    {#each developmentTab?.fields || [] as field}
      <button
        class="subtab-button"
        class:active={activeTab === field.field ||
          (activeTab === "development" && field === activeField)}
        onclick={() => onTabChange(field.field)}
      >
        {field.label}
      </button>
    {/each}
  </div>

  {#if activeField.field === "rpcs" && chainStatic.rpcs}
    <RpcSection rpcs={chainStatic.rpcs} brandColor={accessibleColor} />
  {:else if activeField.field === "testnets"}
    <TestnetsSection
      testnets={chainStatic.testnets || []}
      brandColor={accessibleColor}
    />
  {:else if activeField.field === "sdks" || activeField.field === "tools"}
    {#if activeField.field === "sdks"}
      <blockquote class="section-quote">
        <p>
          Language-specific libraries for interacting with the blockchain -
          smart contract deployment, transaction signing, and RPC calls.
        </p>
      </blockquote>
    {:else if activeField.field === "tools"}
      <blockquote class="section-quote">
        <p>
          Development environments, testing frameworks, and infrastructure
          services for building and deploying dApps.
        </p>
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
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.8125rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .subtab-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  .subtab-button:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .subtab-button:hover::before {
    opacity: 1;
  }

  .subtab-button.active {
    background: var(--accessible-color, var(--brand-color));
    color: white;
    border-color: var(--accessible-color, var(--brand-color));
    font-weight: 700;
    box-shadow:
      0 4px 12px color-mix(in srgb, var(--brand-color) 30%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .subtab-button:active {
    transform: translateY(0);
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
    font-family: Georgia, "Times New Roman", serif;
    color: #d4a574;
    opacity: 0.3;
  }

  .section-quote p {
    margin: 0;
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.4;
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0.01em;
  }

  @media (max-width: 900px) {
    .subtabs {
      gap: 0.375rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 0.75rem;
    }

    .subtabs::-webkit-scrollbar {
      display: none;
    }

    .subtab-button {
      padding: 0.375rem 0.875rem;
      font-size: 0.8125rem;
      white-space: nowrap;
      flex: 0 0 auto;
    }
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
