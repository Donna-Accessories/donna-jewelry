// src/components/product/ProductDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProductContext } from "../../contexts/ProductContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { getProductById } = useProductContext();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">
          Product not found.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="flex flex-col gap-4">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.title}
            className="rounded-2xl shadow-lg object-cover w-full h-96"
          />
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx}`}
                  className="rounded-lg object-cover h-24 w-full cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-playfair text-gray-900">
            {product.title}
          </h1>
          <p className="text-gold-primary text-xl font-semibold">
            ${product.price}
          </p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="capitalize font-medium">{product.category}</span>
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button className="bg-gold-primary hover:bg-gold-600 text-white px-6 py-3 rounded-lg">
              Add to Cart
            </button>
            <Link
              to="/products"
              className="border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white px-6 py-3 rounded-lg"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
