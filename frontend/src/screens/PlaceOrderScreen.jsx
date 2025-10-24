import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import { createOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';
import { colors, components, utils } from '../styles/theme';
import { ShoppingBagIcon, TruckIcon, CreditCardIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.order);
  const { loading, error, success, order } = orderCreate;
  const { userInfo } = useSelector((state) => state.user);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  
  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }
    if (!shippingAddress?.address) {
      navigate('/shipping');
      return;
    }
    if (!paymentMethod) {
      navigate('/payment');
      return;
    }
    if (success && order && order._id) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order, userInfo, shippingAddress, paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      if (paymentMethod === 'Stripe') {
        // For Stripe, create payment intent first, then order after successful payment
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          throw new Error('Please login first');
        }

        const response = await axios.post('/api/stripe/create-payment-intent', 
          {
            amount: totalPrice,
            currency: 'usd',
            orderData: {
              orderItems: cartItems,
              shippingAddress,
              paymentMethod,
              itemsPrice,
              shippingPrice,
              taxPrice,
              totalPrice,
            }
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        
        if (response.data.clientSecret) {
          // Store order details in localStorage for after payment completion
          localStorage.setItem('pendingOrderDetails', JSON.stringify({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          }));
          
          // Navigate to payment screen with the client secret
          navigate(`/payment-processing?clientSecret=${response.data.clientSecret}`);
        } else {
          toast.error('Failed to initialize payment');
        }
      } else {
        // For PayPal, create order directly
        const resultAction = await dispatch(createOrder({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        })).unwrap();
        
        if (resultAction && resultAction.order && resultAction.order._id) {
          navigate(`/order/${resultAction.order._id}`);
        } else {
          toast.error('Invalid order response');
        }
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to process order');
    }
  };

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Place Order - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          <CheckoutSteps step1 step2 step3 step4 />
          
          <div className="mt-8">
            <h1 className={`${components.typography.h2} mb-8`}>Review Your Order</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <div className={components.card.base}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <TruckIcon className="w-5 h-5 text-emerald-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                      </div>
                      <Link 
                        to="/shipping"
                        className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                    <div className={colors.text.secondary}>
                      <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className={components.card.base}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CreditCardIcon className="w-5 h-5 text-emerald-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                      </div>
                      <Link 
                        to="/payment"
                        className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                    <p className={colors.text.secondary}>{paymentMethod}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className={components.card.base}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <ShoppingBagIcon className="w-5 h-5 text-emerald-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                      </div>
                      <Link 
                        to="/cart"
                        className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.slug}`}
                              className="text-gray-900 hover:text-emerald-600 font-medium"
                            >
                              {item.name}
                            </Link>
                            <p className={`${colors.text.secondary} text-sm mt-1`}>
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className={`${components.card.base} sticky top-24`}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className={colors.text.secondary}>Items</span>
                        <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={colors.text.secondary}>Shipping</span>
                        <span className="font-medium">
                          {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={colors.text.secondary}>Tax</span>
                        <span className="font-medium">${taxPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0 || loading}
                      className={`${components.button.primary} w-full`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <LoadingBox />
                          <span className="ml-2">Processing...</span>
                        </div>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}