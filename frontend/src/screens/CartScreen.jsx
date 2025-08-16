import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { increaseQuantity, decreaseQuantity, deleteFromCart, clearError } from "../redux/cartSlice";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { colors, components, utils } from '../styles/theme';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const increaseCartHandler = (item) => {
    dispatch(increaseQuantity(item));
  };

  const decreaseCartHandler = (item) => {
    dispatch(decreaseQuantity(item));
  };

  const deleteCartHandler = (item) => {
    dispatch(deleteFromCart(item));
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((a, c) => a + (c.price || 0) * c.quantity, 0);
  const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Shopping Cart - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          <div className="flex items-center mb-8">
            <ShoppingBagIcon className="w-8 h-8 text-emerald-600 mr-3" />
            <h1 className={components.typography.h2}>Shopping Cart</h1>
          </div>

          {error && <MessageBox variant="danger">{error}</MessageBox>}

          {cartItems.length === 0 ? (
            <div className={`${components.card.base} p-12 ${utils.centerText}`}>
              <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className={`${colors.text.secondary} mb-6`}>Add some products to get started</p>
              <Link 
                to="/products"
                className={components.button.primary}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className={`${components.card.base} overflow-hidden`}>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cart Items ({totalItems})
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item._id} className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.slug}`}
                              className="text-lg font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className={`${colors.text.secondary} text-sm mt-1`}>
                              Brand: {item.brand}
                            </p>
                            <p className="text-xl font-bold text-gray-900 mt-2">
                              ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => decreaseCartHandler(item)}
                              disabled={item.quantity === 1 || status === "loading"}
                              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => increaseCartHandler(item)}
                              disabled={item.quantity >= item.countInStock || status === "loading"}
                              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => deleteCartHandler(item)}
                            disabled={status === "loading"}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className={`${components.card.base} p-6 sticky top-24`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className={colors.text.secondary}>Items ({totalItems})</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={colors.text.secondary}>Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0 || status === "loading"}
                    className={`${components.button.primary} w-full`}
                  >
                    {status === "loading" ? "Processing..." : "Proceed to Checkout"}
                  </button>
                  
                  <div className={`${utils.centerText} mt-4`}>
                    <Link 
                      to="/products"
                      className={`${colors.text.secondary} hover:text-emerald-600 text-sm transition-colors`}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartScreen;