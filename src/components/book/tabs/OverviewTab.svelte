<script lang="ts">
  import { marked } from "marked";
  import { getAccessibleBrandColor } from "$lib/utils/colorUtils";

  interface Props {
    chainStatic: any;
  }

  let { chainStatic }: Props = $props();
  const brandColor = chainStatic.color || "#3b82f6";
  const accessibleBrandColor = $derived(getAccessibleBrandColor(brandColor));
</script>

<div
  class="prose"
  style="--brand-color: {brandColor}; --accessible-brand-color: {accessibleBrandColor}"
>
  <h2>What is {chainStatic.name}?</h2>
  {#if chainStatic.description}
    {@html marked.parse(chainStatic.description)}
  {:else}
    <p>No description available.</p>
  {/if}

  {#if chainStatic.contractLanguages && chainStatic.contractLanguages.length > 0}
    <h3>Contract Languages</h3>
    <div>
      <p>This blockchain supports the following smart contract languages:</p>
      <div class="languages-grid">
        {#each chainStatic.contractLanguages as lang}
          <a
            href={lang.url}
            target="_blank"
            class="language-card"
            class:primary={lang.details === "Primary"}
          >
            <span class="language-name">{lang.name}</span>
            {#if lang.details}
              <span class="language-details">{lang.details}</span>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .prose {
    color: #374151;
    line-height: 1.8;
    font-size: 1rem;
    max-width: 70ch;
    font-weight: 400;
    letter-spacing: 0;
    overflow-wrap: break-word;
    font-family: var(--font-body);
  }

  .prose :global(h1) {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.3;
    letter-spacing: -0.025em;
    font-family: var(--font-display);
  }

  .prose :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.35;
    letter-spacing: -0.02em;
    font-family: var(--font-display);
  }

  .prose :global(h2:first-child) {
    margin-top: 0;
  }

  .prose :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    letter-spacing: -0.015em;
    font-family: var(--font-display);
  }

  .prose :global(p) {
    margin-bottom: 1.25rem;
  }

  .prose :global(a) {
    color: var(--brand-color);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;
  }

  .prose :global(a:hover) {
    color: color-mix(in srgb, var(--brand-color) 80%, black);
  }

  .prose :global(code) {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.875em;
    font-family: var(--font-mono);
  }

  .prose :global(pre) {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .prose :global(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #6b7280;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.75;
  }

  .prose :global(strong) {
    font-weight: 600;
    color: #111827;
  }

  .prose :global(em) {
    font-style: italic;
  }

  .prose :global(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 3rem 0;
  }

  .languages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 0.25rem;
  }

  .language-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none !important;
    transition: all 0.2s;
  }

  .language-card:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .language-card.primary {
    background: color-mix(in srgb, var(--brand-color) 5%, white);
    border: 1px solid var(--brand-color);
  }

  .language-card.primary:hover {
    background: color-mix(in srgb, var(--brand-color) 10%, white);
    border: 1px solid var(--brand-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .language-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .language-details {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    line-height: 1.2;
  }

  .language-card.primary .language-details {
    color: var(--accessible-brand-color);
  }

  @media (max-width: 640px) {
    .prose {
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .prose :global(h2) {
      font-size: 1.25rem;
    }

    .prose :global(h3) {
      font-size: 1.125rem;
    }

    .languages-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .language-card {
      padding: 1rem;
    }

    .language-name {
      font-size: 0.875rem;
    }

    .language-details {
      font-size: 0.6875rem;
    }
  }
</style>
