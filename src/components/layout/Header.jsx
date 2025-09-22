import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import routes from "../../utils/routes";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", to: routes.home },
    { name: "Products", to: routes.products },
    { name: "About", to: routes.about },
  ];

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Logo + Navigation */}
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-400">DONNA</h1>
            <p className="text-sm text-yellow-300 tracking-wide">
              JEWELLERY & ACCESSORIES
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`relative group transition-colors duration-300 ${
                  location.pathname === link.to ? 'text-yellow-400' : ''
                }`}
              >
                {link.name}
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:block text-right">
            <p className="text-sm text-yellow-300">Contact us:</p>
            <p className="text-yellow-400 font-semibold">+233 24 862 8880</p>
            <p className="text-sm text-yellow-300">@donna_accessoriess</p>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-yellow-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pt-4 border-t border-blue-800"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-blue-800 text-yellow-300">
                <p className="text-sm">Contact us:</p>
                <p className="text-yellow-400 font-semibold">
                  +233 24 862 8880
                </p>
                <p className="text-sm">@donna_accessoriess</p>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
