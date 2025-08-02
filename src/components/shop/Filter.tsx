import { motion } from "framer-motion";
import { useState } from "react";

interface FilterSectionProps {
  title: string;
  options: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}

const FilterSection = ({
  title,
  options,
  selected,
  onSelect,
}: FilterSectionProps) => {
  return (
    <div className="py-3 border-t border-gray-200">
      <p className="text-sm font-bold mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options
          .filter(Boolean) // Remove empty items
          .map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selected === item
                  ? "bg-dark text-white"
                  : "bg-gray-100 text-dark hover:bg-gray-200"
              }`}
              onClick={() => onSelect?.(item)}
            >
              {item}
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

export const Filter = ({ onFilter, initialFilters = {} }: FilterProps) => {
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [zipCode, setZipCode] = useState("");

  const filterSections = [
    {
      title: "Size",
      options: ["10 ft", "16 ft", "20 ft", "24 ft", "30 ft", "40 ft", "45 ft"],
      key: "size",
    },
    {
      title: "Category",
      options: [
        "Bleacher",
        "Conjoined",
        "Dry",
        "Flat rack",
        "Ground level office",
        "Hazmat",
        "Machinery enclosure",
        "Mining container",
        "Office trailer",
        "Portable self storage",
      ],
      key: "category",
    },
    {
      title: "Grade",
      options: ["3-trip", "New", "Refurbished", "Used"],
      key: "grade",
    },
    {
      title: "Height",
      options: ["High cube (9.5ft)", "Standard (8.5ft)"],
      key: "height",
    },
    {
      title: "Attributes",
      options: ["Double door", "Hard top", "Open side", "Soft top"],
      key: "attributes",
    },
    {
      title: "Width",
      options: ["7 ft", "10 ft", "16 ft"],
      key: "width",
    },
    {
      title: "Sort by",
      options: ["Price", "Popularity", "Newest"],
      key: "sort",
    },
  ];

  const handleSelect = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: filters[key] === value ? "" : value, // Toggle selection
    };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter?.({ ...filters, zipCode });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your ZIP"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-dark focus:border-transparent"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyFilters}
          className="w-full mt-3 bg-dark text-white text-sm font-bold py-2.5 rounded-lg hover:bg-dark transition"
        >
          See prices
        </motion.button>
      </div>

      <h4 className="text-lg font-bold mb-2">Filters</h4>

      <div className="space-y-1">
        {filterSections.map((section) => (
          <FilterSection
            key={section.key}
            title={section.title}
            options={section.options}
            selected={filters[section.key]}
            onSelect={(value) => handleSelect(section.key, value)}
          />
        ))}
      </div>
    </div>
  );
};
