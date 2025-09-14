import React, { createContext, useState } from "react";

// Named export, so hooks can import { SearchContext }
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // Simple search handler — you can improve this later
  const handleSearch = (term, products = []) => {
    setSearchTerm(term);

    if (!term) {
      setResults(products);
      return;
    }

    const lower = term.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower)
    );

    setResults(filtered);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        results,
        setResults,
        handleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
