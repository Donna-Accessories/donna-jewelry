// src/hooks/useProducts.js
import { useContext } from "react"
import { ProductContext } from "../contexts/ProductContext.jsx"

// Named export (must match your import in Home.jsx)
export function useProducts() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }

  return context   // expects ProductProvider to supply { products, loading, error }
}
