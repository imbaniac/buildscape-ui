<script lang="ts">
  interface DevResource {
    name: string;
    url: string;
    type?: string;
    description?: string;
    source?: string;
  }

  interface Props {
    resources: DevResource[];
    resourceType: 'sdks' | 'tools';
  }

  let { resources = [], resourceType }: Props = $props();
</script>

<div class="dev-resources">
  {#if !resources || resources.length === 0}
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>
      <p>No {resourceType === 'sdks' ? 'SDKs' : 'tools'} available for this chain.</p>
    </div>
  {:else}
    {#each resources as item}
      <a href={item.url} target="_blank" class="dev-resource-card" class:official={item.source === 'official'}>
        <div class="resource-content">
          <div class="resource-header">
            <div class="resource-name-wrapper">
              <h4 class="resource-name">{item.name}</h4>
              {#if item.type}
                <span class="resource-type" data-type={item.type.toLowerCase().replace('/', '-').replace('.', '')}>{item.type}</span>
              {/if}
            </div>
            <svg class="resource-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </div>
          {#if item.description}
            <p class="resource-desc">{item.description}</p>
          {/if}
        </div>
      </a>
    {/each}
  {/if}
</div>

<style>
  /* Dev Resources (SDKs & Tools) */
  .dev-resources {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dev-resource-card {
    display: block;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
    position: relative;
  }

  .dev-resource-card:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }

  .dev-resource-card.official {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  }

  .dev-resource-card.official:hover {
    border-color: #f59e0b;
  }

  .resource-content {
    padding: 0.875rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .resource-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .resource-name-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .resource-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .resource-desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .resource-type {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: #f8fafc;
    color: #64748b;
    border-radius: 4px;
    font-size: 0.6875rem;
    font-weight: 500;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    flex-shrink: 0;
  }
  
  /* Type-specific colors - subtle variations */
  .resource-type[data-type="js-ts"] {
    background: #fffbeb;
    color: #78350f;
  }
  
  .resource-type[data-type="python"] {
    background: #eff6ff;
    color: #1e40af;
  }
  
  .resource-type[data-type="rust"] {
    background: #fff7ed;
    color: #7c2d12;
  }
  
  .resource-type[data-type="go"] {
    background: #ecfdf5;
    color: #047857;
  }
  
  .resource-type[data-type="java"] {
    background: #fdf4ff;
    color: #6b21a8;
  }
  
  .resource-type[data-type="net"] {
    background: #f3f4f6;
    color: #4b5563;
  }
  
  .resource-type[data-type="react"] {
    background: #ecfeff;
    color: #0e7490;
  }
  
  .resource-type[data-type="free"],
  .resource-type[data-type="free-tier"] {
    background: #f0fdf4;
    color: #166534;
  }
  
  .resource-type[data-type="documentation"] {
    background: #f8fafc;
    color: #64748b;
  }

  .resource-arrow {
    color: #cbd5e1;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .dev-resource-card:hover .resource-arrow {
    color: #64748b;
    transform: translate(1px, -1px);
  }
  
  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    color: #94a3b8;
  }
  
  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  
  .empty-state p {
    font-size: 0.9375rem;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  @media (max-width: 640px) {
    .dev-resources {
      gap: 0.375rem;
    }

    .resource-content {
      padding: 0.75rem;
      gap: 0.5rem;
    }

    .resource-name {
      font-size: 0.8125rem;
    }

    .resource-desc {
      font-size: 0.6875rem;
    }

    .resource-type {
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
    }

    .resource-arrow {
      width: 12px;
      height: 12px;
    }

    .empty-state {
      padding: 3rem 1.5rem;
    }

    .empty-state svg {
      width: 40px;
      height: 40px;
    }

    .empty-state p {
      font-size: 0.875rem;
    }
  }
</style>