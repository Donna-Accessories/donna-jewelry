import React, { useEffect, useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext.jsx';
import { useProducts } from '../../hooks/useProducts';
import { useSupabase } from '../../hooks/useSupabase';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminDashboard = () => {
  const { isAuthenticated, logout, user } = useAdminContext();
  const { products, categories, loading: productsLoading, refresh } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    in_stock: 0,
    featured: 0,
    categories: 0
  });

  useEffect(() => {
    if (products) {
      setStats({
        total: products.length,
        in_stock: products.filter(p => p.in_stock).length,
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Logged in as {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gold-primary">{stats.total}</div>
          <div className="text-gray-600">Total Products</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gold-primary">{stats.in_stock}</div>
          <div className="text-gray-600">In Stock</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gold-primary">{stats.featured}</div>
          <div className="text-gray-600">Featured</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-gold-primary">{stats.categories}</div>
          <div className="text-gray-600">Categories</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-600"
        >
          Add New Product
        </button>
        <button
          onClick={refresh}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {showAddForm ? (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSave={() => {
            handleFormClose();
            refresh();
          }}
          setError={setError}
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
              <p className="text-3xl font-bold text-green-600">{stats.in_stock}</p>
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
