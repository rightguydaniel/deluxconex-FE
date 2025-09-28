import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selected?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const FilterSection = ({
  title,
  options,
  selected,
  onSelect,
  disabled = false,
}: FilterSectionProps) => {
  return (
    <div className="py-3 border-t border-gray-200">
      <p className="text-sm font-bold mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options
          .filter((item) => Boolean(item.value))
          .map((item) => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selected === item.value
                  ? "bg-dark text-white"
                  : "bg-gray-100 text-dark hover:bg-gray-200"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!disabled) {
                  onSelect?.(item.value);
                }
              }}
              type="button"
              disabled={disabled}
            >
              {item.label}
            </motion.button>
          ))}
      </div>
    </div>
  );
};

interface FilterProps {
  onFilter?: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
}

const defaultFilters: Record<string, string> = {
  search: "",
  size: "",
  category: "",
  sort: "",
};

export const Filter = ({
  initialFilters = defaultFilters,
  onFilter,
}: FilterProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [searchTerm, setSearchTerm] = useState(filters.search ?? "");

  const trimmedSearchTerm = searchTerm.trim();
  const appliedSearch = filters.search ?? "";
  const filtersDisabled =
    trimmedSearchTerm.length > 0 && trimmedSearchTerm !== appliedSearch;

  useEffect(() => {
    setFilters({
      ...defaultFilters,
      ...initialFilters,
    });
    setSearchTerm(initialFilters.search ?? "");
  }, [initialFilters]);

  const filterSections: Array<{
    title: string;
    options: FilterOption[];
    key: string;
  }> = [
    {
      title: "Size",
      options: [
        "10ft",
        "16ft",
        "20ft",
        "24ft",
        "30ft",
        "40ft",
        "45ft",
      ].map((value) => ({ label: value, value })),
      key: "size",
    },
    {
      title: "Category",
      options: [
        "containers",
        "office containers",
        "cold storage",
        "conjoined containers",
        "ground level office",
        "hazmat storage",
        "parts",
        "chasis",
        "rent",
      ].map((value) => ({ label: value, value })),
      key: "category",
    },
    {
      title: "Sort by",
      options: [
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Oldest", value: "oldest" },
        { label: "Newest", value: "newest" },
      ],
      key: "sort",
    },
  ];

  const emitFilters = (nextFilters: Record<string, string>) => {
    const cleaned = Object.fromEntries(
      Object.entries(nextFilters).filter(([, value]) => value && value.trim())
    );
    onFilter?.(cleaned);
  };

  const handleSelect = (key: string, value: string) => {
    const toggledValue = filters[key] === value ? "" : value;
    const nextFilters = {
      ...filters,
      [key]: toggledValue,
    };
    setFilters(nextFilters);
    emitFilters(nextFilters);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      handleClearSearch();
      return;
    }

    const nextFilters = {
      ...defaultFilters,
      search: trimmed,
    };
    setSearchTerm(trimmed);
    setFilters(nextFilters);
    emitFilters(nextFilters);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const nextFilters = { ...defaultFilters };
    setFilters(nextFilters);
    emitFilters(nextFilters);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <form className="mb-4" onSubmit={handleSearchSubmit}>
        <label className="block text-sm font-bold mb-2" htmlFor="product-search">
          Search
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              id="product-search"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-dark"
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="px-4 py-2 bg-dark text-white rounded-lg text-sm font-semibold"
          >
            Search
          </motion.button>
        </div>
      </form>

      <h4 className="text-lg font-bold mb-2">Filters</h4>

      <div className="space-y-1">
        {filterSections.map((section) => (
          <FilterSection
            key={section.key}
            title={section.title}
            options={section.options}
            selected={filters[section.key]}
            onSelect={(value) => handleSelect(section.key, value)}
            disabled={filtersDisabled}
          />
        ))}
      </div>
    </div>
  );
};
