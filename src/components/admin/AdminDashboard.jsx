import React, { useEffect, useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext.jsx';
import { useProducts } from '../../hooks/useProducts';
import { useSupabase } from '../../hooks/useSupabase';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdminContext();
  const { products, categories, loading: productsLoading } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    featured: 0,
    categories: 0
  });

  useEffect(() => {
    if (products) {
      setStats({
        total: products.length,
        inStock: products.filter(p => p.inStock).length,
        featured: products.filter(p => p.featured).length,
        categories: new Set(products.map(p => p.category)).size
      });
    }
  }, [products]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setEditingProduct(null);
    setShowAddForm(false);
  };

  if (productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showAddForm ? (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormClose}
          onCancel={handleFormClose}
        />
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gold-primary">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your jewelry catalog</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add New Product
              </button>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-600">Total Products</h3>
              <p className="text-3xl font-bold text-gold-primary">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-600">In Stock</h3>
              <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-600">Featured</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.featured}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg text-gray-600">Categories</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.categories}</p>
            </div>
          </div>

          {/* Product Table */}
          <ProductTable onEdit={handleEditClick} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
