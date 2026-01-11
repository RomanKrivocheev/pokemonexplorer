type FilterType = 'all' | 'type' | 'habitat';

type Props = {
  value: FilterType;
  onChange: (v: FilterType) => void;
  onClose: () => void;
};

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All Pokémon', value: 'all' },
  { label: 'By Type', value: 'type' },

  { label: 'By Habitat', value: 'habitat' },
];

const FilterPopup = ({ value, onChange, onClose }: Props) => {
  return (
    <div
      className="
        absolute right-0 top-10 z-50
        rounded-lg p-4 w-56
        bg-white dark:bg-neutral-900
        shadow-lg
        ring-1 ring-black/10 dark:ring-white/20
      "
    >
      <h3 className="text-sm font-semibold mb-3">Filter Pokémon</h3>

      <div className="space-y-2">
        {FILTERS.map((f) => (
          <label
            key={f.value}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="pokemon-filter"
              checked={value === f.value}
              onChange={() => {
                onChange(f.value);
                onClose();
              }}
            />
            {f.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPopup;
