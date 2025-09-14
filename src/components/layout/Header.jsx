import React from 'react';
const Header = () => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        {/* Logo Section */}
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="text-center">
            <div className="text-yellow-400 text-4xl font-bold mb-1">
              ∞
            </div>
            <h1 className="text-2xl font-bold text-yellow-400">
              DONNA
            </h1>
            <p className="text-sm text-yellow-300 tracking-wide">
              JEWELLERY & ACCESSORIES
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="/" 
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              Home
            </a>
            <a 
              href="/products" 
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              Products
            </a>
            <a 
              href="/about" 
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              About
            </a>
            <a 
              href="/contact" 
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              Contact
            </a>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:block text-right">
            <p className="text-sm text-yellow-300">Contact us:</p>
            <p className="text-yellow-400 font-semibold">+233 24 862 8880</p>
            <p className="text-sm text-yellow-300">@donna_accessoriess</p>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu (Hidden by default) */}
        <nav className="md:hidden mt-4 pt-4 border-t border-blue-800">
          <div className="flex flex-col space-y-2">
            <a href="/" className="hover:text-yellow-400 py-2">Home</a>
            <a href="/products" className="hover:text-yellow-400 py-2">Products</a>
            <a href="/about" className="hover:text-yellow-400 py-2">About</a>
            <a href="/contact" className="hover:text-yellow-400 py-2">Contact</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;