import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { colors, components, utils } from '../styles/theme';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className={`${components.layout.container} py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl tracking-tight">E</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl blur opacity-20"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">EcomStore</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide -mt-1">PREMIUM SHOPPING</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your trusted destination for premium products, exceptional service, and unbeatable shopping experiences.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Secure Shopping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <HeartIcon className="w-4 h-4 text-red-400" />
                <span>Customer First</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Shopping Cart</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">support@ecomstore.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPinIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">Addis Ababa<br />Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 EcomStore. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;