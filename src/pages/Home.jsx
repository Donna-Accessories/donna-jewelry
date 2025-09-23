import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Shield, Heart, Award } from 'lucide-react';

// Components
import ProductCard from '../components/product/ProductCard.jsx';
import WhatsAppButton from '../components/product/WhatsAppButton.jsx';

// Hooks
import { useProducts } from '../hooks/useProducts.js';

/**
 * Home Page Component - Premium Landing Experience
 * 
 * Features:
 * - Hero section with brand story
 * - Featured jewelry collections
 * - Customer testimonials
 * - Brand values showcase
 * - Call-to-action sections
 * - Mobile-optimized jewelry browsing
 */
const Home = () => {
  const { products, loading, error } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Filter featured products on data load
  useEffect(() => {
    if (products?.length > 0) {
      // Get featured products or fallback to first 6 products
      const featured = products.filter(product => product.featured === true).slice(0, 6) || 
                     products.slice(0, 6);
      setFeaturedProducts(featured);
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-premium via-blue-800 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-primary rounded-full mb-6">
                {/* Infinity Symbol */}
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 8.17 8.15c-.97-.97-2.33-1.53-3.77-1.53C1.95 6.62 0 8.57 0 11.02s1.95 4.4 4.4 4.4c1.44 0 2.8-.56 3.77-1.53L12 11.38l3.83 2.51c.97.97 2.33 1.53 3.77 1.53 2.45 0 4.4-1.95 4.4-4.4s-1.95-4.4-4.4-4.4z"/>
                </svg>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-4">
                DONNA
              </h1>
              <p className="text-xl lg:text-2xl text-gold-light tracking-wider">
                JEWELLERY & ACCESSORIES
              </p>
            </div>

            {/* Hero Content */}
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-light mb-6 leading-relaxed">
                Timeless Elegance, <span className="text-gold-primary font-playfair">Infinite Beauty</span>
              </h2>
              <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Discover handcrafted jewelry that tells your unique story. From delicate everyday pieces 
                to statement treasures, each piece is chosen with love and care.
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="
                  bg-gold-primary hover:bg-gold-600 
                  text-white px-8 py-4 rounded-lg 
                  font-semibold text-lg
                  transform hover:scale-105 transition-all duration-200
                  shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-blue-premium
                  inline-flex items-center gap-2
                "
              >
                Explore Collection
                <ChevronRight size={20} />
              </Link>
              
              <WhatsAppButton
                message="Hi! I'd like to learn more about your jewelry collection. Could you help me find the perfect piece?"
                className="
                  border-2 border-white text-white 
                  hover:bg-white hover:text-blue-premium 
                  px-8 py-4 rounded-lg font-semibold text-lg
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-premium
                "
              >
                Chat With Us
              </WhatsAppButton>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48V120z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-6">
                Featured Collection
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Handpicked pieces that embody our commitment to quality, beauty, and craftsmanship.
              </p>
              <div className="w-24 h-1 bg-gold-primary mx-auto mt-8"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className="transform hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link
                to="/donna-jewelry/products"
                className="
                  inline-flex items-center gap-2
                  bg-white border-2 border-gold-primary text-gold-primary 
                  hover:bg-gold-primary hover:text-white 
                  px-8 py-4 rounded-lg font-semibold text-lg
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2
                "
              >
                View All Jewelry
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-6">
              Why Choose Donna
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence shows in every piece we offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality Guarantee */}
            <div className="text-center group">
              <div className="
                w-16 h-16 bg-gold-primary bg-opacity-10 
                rounded-full flex items-center justify-center mx-auto mb-6
                group-hover:bg-opacity-20 transition-colors duration-200
              ">
                <Award className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Each piece is carefully selected for its exceptional quality and craftsmanship.
              </p>
            </div>

            {/* Authentic Materials */}
            <div className="text-center group">
              <div className="
                w-16 h-16 bg-gold-primary bg-opacity-10 
                rounded-full flex items-center justify-center mx-auto mb-6
                group-hover:bg-opacity-20 transition-colors duration-200
              ">
                <Shield className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Authentic Materials</h3>
              <p className="text-gray-600 leading-relaxed">
                Genuine and Authentic products that make you shine.
              </p>
            </div>

            {/* Personal Service */}
            <div className="text-center group">
              <div className="
                w-16 h-16 bg-gold-primary bg-opacity-10 
                rounded-full flex items-center justify-center mx-auto mb-6
                group-hover:bg-opacity-20 transition-colors duration-200
              ">
                <Heart className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Touch</h3>
              <p className="text-gray-600 leading-relaxed">
                One-on-one consultation to help you find the perfect piece for every occasion.
              </p>
            </div>

            {/* Customer Satisfaction */}
            <div className="text-center group">
              <div className="
                w-16 h-16 bg-gold-primary bg-opacity-10 
                rounded-full flex items-center justify-center mx-auto mb-6
                group-hover:bg-opacity-20 transition-colors duration-200
              ">
                <Star className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Love</h3>
              <p className="text-gray-600 leading-relaxed">
                Trusted by hundreds of satisfied customers who cherish their Donna pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-6">
              Customer Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear what our customers say about their Donna jewelry experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold-primary fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "The earrings I bought for my wedding were absolutely perfect. The quality 
                exceeded my expectations and I received so many compliments!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-semibold">SA</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah A.</h4>
                  <p className="text-gray-500 text-sm">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold-primary fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "Donna helped me choose the perfect necklace for my mother's birthday. 
                The personal service and attention to detail was exceptional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-semibold">MK</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Michael K.</h4>
                  <p className="text-gray-500 text-sm">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold-primary fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "I've bought three pieces from Donna now and each one is more beautiful 
                than the last. The craftsmanship is truly outstanding."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-semibold">LR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Lisa R.</h4>
                  <p className="text-gray-500 text-sm">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-gold-primary to-yellow-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-playfair mb-6">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse our complete collection or chat with us directly to find jewelry that speaks to your heart.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donna-jewelry/products"
              className="
                bg-white text-gold-primary hover:bg-gray-50
                px-8 py-4 rounded-lg font-semibold text-lg
                transform hover:scale-105 transition-all duration-200
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gold-primary
                inline-flex items-center justify-center gap-2
              "
            >
              Browse Collection
              <ChevronRight size={20} />
            </Link>
            
            <WhatsAppButton
              message="Hi! I'm interested in finding the perfect jewelry piece. Could you help me explore your collection?"
              className="
                border-2 border-white text-white 
                hover:bg-white hover:text-gold-primary 
                px-8 py-4 rounded-lg font-semibold text-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gold-primary
              "
            >
              Start Conversation
            </WhatsAppButton>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-gold-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading featured collection...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-20 text-center">
          <p className="text-red-600 mb-4">Unable to load featured products</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-gold-primary hover:text-gold-600 font-medium"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;