<script lang="ts">
  interface Props {
    column: string;
    label: string;
    sortColumn: string;
    sortDirection: "asc" | "desc";
    onSort: (column: string) => void;
    className?: string;
  }

  let {
    column,
    label,
    sortColumn,
    sortDirection,
    onSort,
    className = "",
  }: Props = $props();

  const isActive = $derived(sortColumn === column);
  const arrowTransform = $derived(
    isActive
      ? sortDirection === "asc"
        ? "rotate(0deg)"
        : "rotate(180deg)"
      : "rotate(90deg)",
  );
</script>

<button
  class="grid-header sticky-header sortable {className}"
  class:active={isActive}
  onclick={() => onSort(column)}
>
  <div class="header-content">
    <span class="header-label">{label}</span>
    <span class="sort-arrow" style="transform: {arrowTransform}"> ▲ </span>
  </div>
</button>

<style>
  .grid-header {
    background: linear-gradient(135deg, #4a5568, #3a4456);
    padding: 0.75rem 1rem;
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: #f0e6d2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid #525e72;
    display: flex;
    align-items: center;
    border-right: 1px solid rgba(82, 94, 114, 0.5);
    border-top: none;
    border-left: none;
  }

  .grid-header.sortable {
    cursor: pointer;
    user-select: none;
    transition: background 0.2s ease;
  }

  .grid-header.sortable:hover {
    background: linear-gradient(135deg, #526178, #3f4a5c);
  }

  .grid-header.active {
    background: linear-gradient(135deg, #526178, #3f4a5c);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .header-label {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .sort-arrow {
    font-size: 0.7rem;
    opacity: 0.6;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .grid-header.active .sort-arrow {
    opacity: 1;
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .grid-header {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .grid-header {
      padding: 0.5rem 0.6rem;
      font-size: 0.8rem;
    }
  }
</style>
