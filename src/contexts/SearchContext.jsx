import React, { createContext, useState, useCallback, useMemo } from "react";

// Named export, so hooks can import { SearchContext }
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((term, products = []) => {
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
  }, []);

  const filterProducts = useCallback((products, term) => {
    if (!term) return products;
    const lower = term.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(lower))
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      results,
      filterProducts,
      setResults,
      handleSearch,
      error,
      loading,
    }),
    [searchTerm, results, error, loading, filterProducts, handleSearch]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
