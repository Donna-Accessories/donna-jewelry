import React from 'react';
import { SortAsc, SortDesc } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

const SortOptions = () => {
  const { sortBy, setSortBy } = useSearch();

  const options = [
    { value: 'dateAdded-desc', label: 'Newest First', icon: <SortDesc size={16} /> },
    { value: 'dateAdded-asc', label: 'Oldest First', icon: <SortAsc size={16} /> },
    { value: 'price-asc', label: 'Price: Low to High', icon: <SortAsc size={16} /> },
    { value: 'price-desc', label: 'Price: High to Low', icon: <SortDesc size={16} /> },
    { value: 'title-asc', label: 'Name: A to Z', icon: <SortAsc size={16} /> },
    { value: 'title-desc', label: 'Name: Z to A', icon: <SortDesc size={16} /> }
  ];

  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split('-');
    setSortBy({ field, direction });
  };

  return (
    <div className="relative">
      <select
        value={`${sortBy.field}-${sortBy.direction}`}
        onChange={handleSortChange}
        className="
          appearance-none
          bg-white
          border border-gray-300
          rounded-lg
          pl-4 pr-10 py-2
          text-gray-700
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent
          hover:border-gray-400
          transition-colors duration-200
        "
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <SortDesc size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default SortOptions;
