import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchOrderHistory } from '../redux/orderSlice';
import { colors, components, utils } from '../styles/theme';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  const { loadingHistory, errorHistory, orders } = useSelector((state) => state.order);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }
    dispatch(fetchOrderHistory());
  }, [dispatch, userInfo, navigate]);

  if (loadingHistory) return <div className={components.states.loading}><LoadingBox /></div>;
  if (errorHistory) return <div className={components.states.error}><MessageBox variant="danger">{errorHistory}</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Order History - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          <div className="flex items-center mb-8">
            <ShoppingBagIcon className="w-8 h-8 text-emerald-600 mr-3" />
            <h1 className={components.typography.h2}>Order History</h1>
          </div>

          {orders.length === 0 ? (
            <div className={`${components.card.base} p-12 ${utils.centerText}`}>
              <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className={`${colors.text.secondary} mb-6`}>Start shopping to see your orders here</p>
              <button 
                onClick={() => navigate('/products')}
                className={components.button.primary}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className={components.card.base}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ${order.totalPrice.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.isPaid ? (
                            <div className="flex items-center">
                              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm text-green-700 font-medium">Paid</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircleIcon className="w-4 h-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-700 font-medium">Unpaid</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.isDelivered ? (
                            <div className="flex items-center">
                              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm text-green-700 font-medium">Delivered</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 text-yellow-500 mr-2" />
                              <span className="text-sm text-yellow-700 font-medium">Processing</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
