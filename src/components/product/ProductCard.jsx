// src/components/product/ProductCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import routes from "../../utils/routes";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <Link to={routes.productDetail(product.id)} className="block">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-playfair text-lg text-gray-900 truncate">
            {product.title}
          </h3>
          <p className="text-gold-primary font-semibold mt-1">
            ${product.price}
          </p>
          {product.category && (
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {product.category}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
