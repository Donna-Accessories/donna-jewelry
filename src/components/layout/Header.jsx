import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
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
    <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-4 md:px-8">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          DONNA
        </h1>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex space-x-8"
          role="navigation"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`relative group transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === link.to
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="md:hidden text-yellow-400 focus:outline-none"
        >
          {mobileOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 right-0 bg-blue-900 border-t border-blue-800 flex flex-col items-center space-y-5 py-5 md:hidden rounded-b-2xl shadow-lg"
        >
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block text-base tracking-wide transition-all duration-200 ${
                  location.pathname === link.to
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
