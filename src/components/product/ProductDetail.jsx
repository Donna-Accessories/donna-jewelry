// src/components/product/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import routes from "../../utils/routes";
import { useProductContext } from "../../contexts/ProductContext";
import WhatsAppButton from "./WhatsAppButton";

export default function ProductDetail() {
  const { id } = useParams();
  const { getProductById, fetchProducts, loading, error } = useProductContext();
  const [product, setProduct] = useState(null);

  // Ensure we fetch if products are not already loaded
  useEffect(() => {
    const p = getProductById(id);
    if (!p) {
      fetchProducts(true).then(() => {
        setProduct(getProductById(id));
      });
    } else {
      setProduct(p);
    }
  }, [id, getProductById, fetchProducts]);

  if (loading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl text-gray-600">Loading product...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl text-red-600">Error: {error}</h1>
      </div>
    );
  }

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
            src={product.image}
            alt={product.title}
            className="rounded-2xl shadow-lg object-cover w-full h-full"
          />

          {/* WhatsApp Button */}
          <WhatsAppButton
            message={`Hello, I'm interested in ${product.title} priced at ${product.price}. Is it available?`}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-playfair text-gray-900">
            {product.title}
          </h1>
          <p className="text-gold-primary text-xl font-semibold">
            ${product.price}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
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
              to={routes.products}
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
