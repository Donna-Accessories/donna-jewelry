// src/hooks/usePagination.js
import { useState, useMemo } from "react"

export function usePagination(data = [], itemsPerPage = 9) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(data.length, startIndex + itemsPerPage)

  const currentItems = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    startIndex,
    endIndex,
    currentItems,
  }
}
