import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductTable = () => {
  const { products, loading, error, deleteProduct } = useProducts();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-x-auto px-4"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gold-primary">Product List</h2>
      <table className="min-w-[640px] w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">{product.category}</td>
              <td className="border px-4 py-2">
                <button className="btn-secondary mr-2">Edit</button>
                <button className="btn-primary" onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};