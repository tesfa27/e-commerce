import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { productAPI } from '../api/index.js';

import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import { colors, components, utils } from '../styles/theme';



const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];

const ratings = [
  { name: '4stars & up', rating: 4 },
  { name: '3stars & up', rating: 3 },
  { name: '2stars & up', rating: 2 },
  { name: '1stars & up', rating: 1 },
];

export default function ProductsScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const {
    data: searchData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['products', 'search', { page, query, category, price, rating, order }],
    queryFn: async () => {
      const response = await productAPI.search({ page, query, category, price, rating, order });
      return response.data;
    },
    retry: 3,
  });

  const products = searchData?.products || [];
  const pages = searchData?.pages || 1;
  const countProducts = searchData?.countProducts || 0;

  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await productAPI.getCategories();
        setCategories(data);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/products?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Products - EcomStore</title>
      </Helmet>
      
      <div className="flex">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl' : 'hidden'} lg:block lg:w-80 lg:flex-shrink-0 lg:relative lg:shadow-none`}>
          <div className="h-full overflow-y-auto bg-white lg:bg-gray-50 lg:border-r lg:border-gray-200">
            <div className="sticky top-0 bg-white lg:bg-gray-50 p-6 border-b border-gray-200 lg:border-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                </div>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Search */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Search Products
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        navigate(getFilterUrl({ query: e.target.value || 'all' }));
                      }
                    }}
                  />
                </div>
              </div>
            
              {/* Categories */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Categories
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <Link
                    to={getFilterUrl({ category: 'all' })}
                    className={`block px-4 py-3 text-sm border-b border-gray-100 transition-colors ${
                      category === 'all' 
                        ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-l-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    All Categories
                  </Link>
                  {(showAllCategories ? categories : categories.slice(0, 5)).map((c, index) => (
                    <Link
                      key={c}
                      to={getFilterUrl({ category: c })}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        index < (showAllCategories ? categories : categories.slice(0, 5)).length - 1 ? 'border-b border-gray-100' : ''
                      } ${
                        c === category 
                          ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-l-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      {c}
                    </Link>
                  ))}
                  {categories.length > 5 && (
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    >
                      {showAllCategories ? 'Show Less' : `Show All (${categories.length})`}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Price Range
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <Link
                    to={getFilterUrl({ price: 'all' })}
                    className={`block px-4 py-3 text-sm border-b border-gray-100 transition-colors ${
                      price === 'all' 
                        ? 'bg-green-50 text-green-700 font-medium border-l-4 border-l-green-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    Any Price
                  </Link>
                  {prices.map((p, index) => (
                    <Link
                      key={p.value}
                      to={getFilterUrl({ price: p.value })}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        index < prices.length - 1 ? 'border-b border-gray-100' : ''
                      } ${
                        p.value === price 
                          ? 'bg-green-50 text-green-700 font-medium border-l-4 border-l-green-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                      }`}
                    >
                      {p.name}
                    </Link>
                  ))}
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs font-medium text-gray-700 mb-2">Custom Range</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      />
                      <span className="text-gray-400 text-xs">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => {
                          if (minPrice || maxPrice) {
                            const min = minPrice || '0';
                            const max = maxPrice || '999999';
                            navigate(getFilterUrl({ price: `${min}-${max}` }));
                          }
                        }}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Minimum Rating
                </h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={rating === 'all'}
                        onChange={() => navigate(getFilterUrl({ rating: 'all' }))}
                        className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">All Ratings</span>
                    </label>
                    {[4, 3, 2, 1].map((r) => (
                      <label key={r} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={`${r}` === `${rating}`}
                          onChange={() => navigate(getFilterUrl({ rating: r }))}
                          className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <div className="ml-3 flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < r ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showFilters && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className={components.layout.container}>
            <div className="py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className={components.typography.h2}>
                    {query !== 'all' ? `Search: "${query}"` : 'All Products'}
                  </h1>

                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Filters
                  </button>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={order}
                      onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <option value="newest">✨ Newest Arrivals</option>
                      <option value="lowest">💰 Price: Low to High</option>
                      <option value="highest">💎 Price: High to Low</option>
                      <option value="toprated">⭐ Top Rated</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  {query !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Search: {query}
                      <button onClick={() => navigate(getFilterUrl({ query: 'all' }))} className="ml-2">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {category !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Category: {category}
                      <button onClick={() => navigate(getFilterUrl({ category: 'all' }))} className="ml-2">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {price !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Price: {price}
                      <button onClick={() => navigate(getFilterUrl({ price: 'all' }))} className="ml-2">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {rating !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Rating: {rating}+ stars
                      <button onClick={() => navigate(getFilterUrl({ rating: 'all' }))} className="ml-2">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => navigate('/products')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className={components.states.loading}>
                  <LoadingBox />
                </div>
              ) : error ? (
                <div className={components.states.error}>
                  <MessageBox variant="danger">{error.message || 'An error occurred'}</MessageBox>
                </div>
              ) : products.length === 0 ? (
                <div className={`${components.card.base} p-12 ${utils.centerText}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className={colors.text.secondary}>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        {[...Array(pages).keys()].map((x) => (
                          <Link
                            key={x + 1}
                            to={getFilterUrl({ page: x + 1 })}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              Number(page) === x + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {x + 1}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}