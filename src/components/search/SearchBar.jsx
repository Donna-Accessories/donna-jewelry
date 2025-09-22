import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative flex-1 max-w-lg">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for jewelry..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
        />
      </div>
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
