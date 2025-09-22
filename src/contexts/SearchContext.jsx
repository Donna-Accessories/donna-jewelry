import React, { createContext, useState } from "react";

// Named export, so hooks can import { SearchContext }
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search handler with error handling + loading state
  const handleSearch = (term, products = []) => {
    setLoading(true);
    setError(null);
    setSearchTerm(term);

    try {
      if (!term) {
        setResults(products);
        return;
      }

      if (!Array.isArray(products)) {
        throw new Error("Invalid products data");
      }

      const lower = term.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower)
      );

      setResults(filtered);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        results,
        setResults,
        handleSearch,
        error,
        loading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
