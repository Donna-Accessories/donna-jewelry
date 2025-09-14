// src/hooks/usePagination.js
import { useState, useMemo } from "react"

export function usePagination(data = [], itemsPerPage = 9) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }, [data, currentPage, itemsPerPage])

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    currentData,
  }
}
