<script lang="ts">
  interface Props {
    column: string;
    label: string;
    currentSort: string;
    direction: 'asc' | 'desc';
    onSort: (column: any) => void;
    showLogo?: boolean;
  }
  
  let { 
    column, 
    label, 
    currentSort, 
    direction, 
    onSort,
    showLogo = false
  }: Props = $props();
  
  const isActive = $derived(currentSort === column);
  const arrowRotation = $derived(
    isActive ? (direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)') : 'rotate(90deg)'
  );
</script>

<th 
  class="chart-header"
  class:active={isActive}
  class:with-logo={showLogo}
  onclick={() => onSort(column)}
>
  <div class="header-content">
    <span class="header-label">{label}</span>
    <span 
      class="sort-arrow"
      style="transform: {arrowRotation}"
    >
      ▲
    </span>
  </div>
</th>

<style>
  .chart-header {
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #4a5568, #3a4456);
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    color: #f0e6d2;
    text-align: left;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    position: sticky;
    top: 0;
    border-right: 1px solid rgba(82, 94, 114, 0.5);
    border-bottom: 1px solid #525e72;
  }
  
  .chart-header:last-child {
    border-right: none;
  }
  
  .chart-header:hover {
    background: linear-gradient(135deg, #525e72, #424d5f);
    z-index: 11;
  }
  
  .chart-header.active {
    background: linear-gradient(135deg, #5a6678, #4a5568);
    color: #ffffff;
    z-index: 11;
  }
  
  .chart-header.with-logo {
    width: 40%;
    min-width: 200px;
  }
  
  .chart-header:not(.with-logo) {
    width: 20%;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .header-label {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .sort-arrow {
    font-size: 0.7rem;
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  .chart-header.active .sort-arrow {
    opacity: 0.9;
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .chart-header {
      padding: 0.6rem 0.5rem;
      font-size: 0.75rem;
      border-right: none;
    }
    
    .chart-header.with-logo {
      width: 40%;
      min-width: 150px;
    }
    
    .chart-header:not(.with-logo) {
      width: 20%;
      min-width: 80px;
    }
    
    .header-label {
      letter-spacing: 0.02em;
    }
    
    .sort-arrow {
      font-size: 0.6rem;
    }
  }
  
  @media (max-width: 480px) {
    .chart-header {
      padding: 0.5rem 0.35rem;
      font-size: 0.7rem;
    }
    
    .header-label {
      letter-spacing: 0;
    }
  }
</style>