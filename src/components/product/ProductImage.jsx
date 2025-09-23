// src/components/product/ProductImage.jsx
import React from "react";

export default function ProductImage({ src, alt, title, className = "" }) {
  const fallback = "/placeholder.jpg"; // put a default image in /public

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-100 aspect-square ${className}`}
    >
      <img
        src={src || fallback}
        alt={alt || title || "Product image"}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
    </div>
  );
}
