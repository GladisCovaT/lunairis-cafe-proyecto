export default function FilterButtons({ filters, active, onChange }) {
  return (
    <div className="filter-buttons" id="menuFilters">
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={`filter${active === filter.key ? ' active' : ''}`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
