import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PhoneIcon,
  AtSymbolIcon,
} from "@heroicons/react/24/outline";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import routes from "../../utils/routes";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <motion.div
                className="text-yellow-400 text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                ∞ DONNA
              </motion.div>
              <p className="text-yellow-300 text-sm tracking-wide mb-4">
                JEWELLERY & ACCESSORIES
              </p>
              <p className="text-gray-300 leading-relaxed">
                Discover our premium collection of handcrafted jewelry.
                Each piece is carefully selected for its{" "}
                <span className="text-yellow-400">beauty</span>,{" "}
                <span className="text-yellow-400">quality</span>, and{" "}
                <span className="text-yellow-400">craftsmanship</span>.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", to: routes.home },
                { name: "All Products", to: routes.products },
                { name: "Bracelets", to: routes.category('bracelets') },
                { name: "Necklaces", to: routes.category('necklaces') },
                { name: "Earrings", to: routes.category('earrings') },
                { name: "Watches", href: "/watches" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-yellow-400" />
                <span>+233 24 862 8880</span>
              </div>
              <div className="flex items-center space-x-3">
                <AtSymbolIcon className="w-5 h-5 text-yellow-400" />
                <span>@donna_accessoriess</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaInstagram className="w-5 h-5 text-yellow-400" />
                <span>Follow us on Instagram</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="w-5 h-5 text-yellow-400" />
                <span>Chat with us on WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jewelry Care Info */}
        <div className="border-t border-blue-800 pt-8 mb-8">
          <h3 className="text-yellow-400 font-semibold mb-6 text-center">
            Jewelry Care Tips
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center text-sm">
            {[
              "Keep away from moisture",
              "Remove when sleeping",
              "Allow perfume to dry first",
              "Remove before water",
              "Store in closed bag",
              "Remove when active",
            ].map((tip, i) => (
              <motion.div
                key={i}
                className="text-gray-300"
                whileHover={{ scale: 1.05, color: "#FACC15" }}
                transition={{ duration: 0.2 }}
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-blue-800 py-6 text-center">
          <div className="text-yellow-400 text-2xl font-bold mb-2">
            ∞ DONNA
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Donna's Jewellery & Accessories. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Crafted with ♥ for jewelry lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
