// src/pages/About.jsx
import React from "react";
import { Award, Heart, Gem, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import WhatsAppButton from "../components/product/WhatsAppButton.jsx";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-premium via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative container mx-auto px-6 py-20 lg:py-32 text-center">
          <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
            About <span className="text-gold-primary">Donna’s Jewelry</span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            More than just jewelry — we celebrate **moments, heritage, and timeless beauty.**  
            Every piece is crafted with passion, elegance, and a touch of tradition.
          </p>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48V120z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to a celebrated jewelry brand, here’s how Donna’s Jewelry came to life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-gold-primary mb-4">2010 – The Beginning</h3>
              <p className="text-gray-600 leading-relaxed">
                Donna started creating handcrafted jewelry as gifts for family and friends — every piece told a story.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-gold-primary mb-4">2015 – The Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Word spread, and demand grew. Donna’s Jewelry & Accessories was officially founded, blending heritage with modern design.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-gold-primary mb-4">Today</h3>
              <p className="text-gray-600 leading-relaxed">
                With customers across Ghana and beyond, Donna’s Jewelry is now known for premium quality and timeless elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair text-gray-800 mb-6">
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our values guide everything we do — from sourcing to craftsmanship to how we treat our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Award className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Craftsmanship</h3>
              <p className="text-gray-600">Meticulous attention to detail in every piece.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gold-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Gem className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Authenticity</h3>
              <p className="text-gray-600">Only genuine materials — your trust matters.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gold-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Heart className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Passion</h3>
              <p className="text-gray-600">Jewelry designed with love for people who love jewelry.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gold-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Globe className="w-8 h-8 text-gold-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Heritage</h3>
              <p className="text-gray-600">Blending African tradition with modern elegance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gold-primary to-yellow-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-playfair mb-6">
            Let’s Create Your Story Together
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether it’s a milestone gift or an everyday piece, Donna’s Jewelry helps you shine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-gold-primary hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all shadow-lg"
            >
              Explore Collection
            </Link>
            <WhatsAppButton
              message="Hi Donna, I’d love to learn more about your jewelry and find my perfect piece!"
              className="border-2 border-white text-white hover:bg-white hover:text-gold-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Chat With Us
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
