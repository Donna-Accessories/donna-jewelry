// src/components/product/ProductCard.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }){
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl shadow p-4"
    >
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded" />
        <h3 className="mt-3 font-serif text-lg">{product.title}</h3>
        <p className="text-sm text-gray-600">{product.price}</p>
      </Link>
    </motion.article>
  )
}
