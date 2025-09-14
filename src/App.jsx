// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router basename="/donna-jewelry">
  {/* routes here */}
</Router>
// Layout
import Layout from './components/layout/Layout.jsx';

// Regular Pages
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';

// Context Providers
import { ProductProvider } from './contexts/ProductContext.jsx';
import { AdminProvider } from './contexts/AdminContext.jsx';
import { SearchProvider } from './contexts/SearchContext.jsx';

// Styles
import './index.css';

// Lazy-loaded pages
const ProductDetail = lazy(() => import('./components/product/ProductDetail.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const About = lazy(() => import('./pages/About.jsx'));

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-2xl font-playfair text-gray-800 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We apologize for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold-primary hover:bg-gold-600 text-white px-6 py-3 rounded-lg"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer mb-4">
                  Error Details
                </summary>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto text-red-600">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main App
const App = () => {
  return (
    <div className="App">
      <AdminProvider>
        <ProductProvider>
          <SearchProvider>
            <Router>
              <Layout>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />

                    {/* Lazy pages */}
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/about" element={<About />} />

                    {/* 404 */}
                    <Route
                      path="*"
                      element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                          <div className="text-center max-w-md mx-auto px-6">
                            <h1 className="text-8xl font-bold text-gold-primary mb-4">404</h1>
                            <h2 className="text-2xl font-playfair text-gray-800 mb-4">
                              Page Not Found
                            </h2>
                            <p className="text-gray-600 mb-8">
                              The page you're looking for doesn't exist.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <a
                                href="/"
                                className="bg-gold-primary hover:bg-gold-600 text-white px-6 py-3 rounded-lg"
                              >
                                Go Home
                              </a>
                              <a
                                href="/products"
                                className="border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white px-6 py-3 rounded-lg"
                              >
                                Shop Jewelry
                              </a>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </SearchProvider>
        </ProductProvider>
      </AdminProvider>
    </div>
  );
};

// Wrapper with ErrorBoundary
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
