// src/components/product/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, title }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products available.</p>
      </div>
    );
  }

  return (
    <section className="py-10">
      {title && (
        <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 text-gray-900">
          {title}
        </h2>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
