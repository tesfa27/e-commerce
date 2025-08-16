import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchOrder, payOrder, resetPay } from '../redux/orderSlice';
import { colors, components } from '../styles/theme';
import { 
  TruckIcon, 
  CreditCardIcon, 
  ShoppingBagIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function OrderScreen() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  const { loading, error, order, successPay, loadingPay } = useSelector((state) => state.order);
  const orderData = order?.order || order;
  
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const loadPaypalScript = async () => {
    try {
      const { data: clientId } = await axios.get('/api/keys/paypal');
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': clientId,
          currency: 'USD',
        },
      });
      paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      setPaypalLoaded(true);
    } catch (error) {
      console.error('Failed to load PayPal script:', error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }

    if (!orderData || successPay || (orderData._id && orderData._id !== orderId)) {
      dispatch(fetchOrder(orderId));
      if (successPay) {
        dispatch(resetPay());
      }
    } else if (!orderData.isPaid && !paypalLoaded) {
      loadPaypalScript();
    }
  }, [dispatch, userInfo, orderId, navigate, orderData, successPay, paypalLoaded]);

  if (loading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (error) return <div className={components.states.error}><MessageBox variant="danger">{error}</MessageBox></div>;
  if (!orderData) return <div className={components.states.error}><MessageBox variant="danger">Order not found</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Order #{orderId.slice(-8)} - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Order Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={components.typography.h2}>Order #{orderId.slice(-8)}</h1>
                <p className={colors.text.secondary}>
                  Placed on {new Date(orderData.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Payment Status */}
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  orderData.isPaid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {orderData.isPaid ? (
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 mr-1" />
                  )}
                  {orderData.isPaid ? 'Paid' : 'Unpaid'}
                </div>
                
                {/* Delivery Status */}
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  orderData.isDelivered 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {orderData.isDelivered ? (
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ClockIcon className="w-4 h-4 mr-1" />
                  )}
                  {orderData.isDelivered ? 'Delivered' : 'Processing'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className={components.card.base}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <TruckIcon className="w-5 h-5 text-emerald-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                  </div>
                  
                  <div className={colors.text.secondary}>
                    <p className="font-medium text-gray-900">{orderData.shippingAddress?.fullName}</p>
                    <p>{orderData.shippingAddress?.address}</p>
                    <p>{orderData.shippingAddress?.city}, {orderData.shippingAddress?.postalCode}</p>
                    <p>{orderData.shippingAddress?.country}</p>
                  </div>
                  
                  <div className="mt-4">
                    {orderData.isDelivered ? (
                      <div className="flex items-center text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">
                          Delivered on {new Date(orderData.deliveredAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                        <ClockIcon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Order is being processed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className={components.card.base}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CreditCardIcon className="w-5 h-5 text-emerald-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                  </div>
                  
                  <p className={`${colors.text.secondary} mb-4`}>
                    Payment Method: <span className="font-medium text-gray-900">{orderData.paymentMethod}</span>
                  </p>
                  
                  {orderData.isPaid ? (
                    <div className="flex items-center text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">
                        Paid on {new Date(orderData.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-red-700 bg-red-50 px-3 py-2 rounded-lg mb-4">
                        <XCircleIcon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Payment pending</span>
                      </div>
                      
                      {isPending ? (
                        <LoadingBox />
                      ) : (
                        <div className="mt-4">
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: orderData.totalPrice.toString(),
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order.capture().then((details) => {
                                dispatch(
                                  payOrder({
                                    orderId,
                                    paymentResult: {
                                      id: details.id,
                                      status: details.status,
                                      update_time: details.update_time,
                                      email_address: details.payer.email_address,
                                    },
                                  })
                                );
                              });
                            }}
                            onError={(err) => {
                              console.error('PayPal error:', err);
                            }}
                          />
                        </div>
                      )}
                      {loadingPay && <LoadingBox />}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className={components.card.base}>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <ShoppingBagIcon className="w-5 h-5 text-emerald-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {orderData.orderItems?.map((item) => (
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
                      <span className="font-medium">${orderData.itemsPrice?.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={colors.text.secondary}>Shipping</span>
                      <span className="font-medium">
                        {orderData.shippingPrice === 0 ? 'Free' : `$${orderData.shippingPrice?.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={colors.text.secondary}>Tax</span>
                      <span className="font-medium">${orderData.taxPrice?.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${orderData.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>
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
