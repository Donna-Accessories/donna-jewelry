// src/pages/Admin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../contexts/AdminContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import routes from '../utils/routes';

export default function Admin() {
  const { isAuthenticated, loading } = useAdminContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Redirect to home if not authenticated and not loading
  if (!loading && !isAuthenticated) {
    return <AdminLogin onError={setError} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
        <AdminDashboard />
      </div>
    </div>
  );
}
