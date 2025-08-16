import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { addToCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import { getCardImage } from '../utils/imageOptimization';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group h-full flex flex-col">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.image}
            alt={product.name}
            src={getCardImage(product.image)}
            className={`h-48 w-full object-cover object-top group-hover:opacity-90 transition-all duration-200 ${
              product.countInStock === 0 ? 'grayscale opacity-60' : ''
            }`}
          />
        </div>
      </Link>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="ml-1 text-xs text-gray-500">
              ({product.numReviews})
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mb-3">
            {product.brand}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.countInStock > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
          
          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              product.countInStock > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;