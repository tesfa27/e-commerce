import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  ClipboardDocumentListIcon, 
  EyeIcon, 
  TrashIcon, 
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchOrderList, deleteOrder } from '../redux/orderListSlice';
import { colors, components, utils } from '../styles/theme';

export default function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders, loadingDelete } = useSelector((state) => state.orderList);
  const { userInfo } = useSelector((state) => state.user);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await dispatch(deleteOrder(order._id)).unwrap();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchOrderList());
  }, [dispatch]);

  const deliverHandler = async (order) => {
    try {
      setLoadingDeliver(true);
      await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoadingDeliver(false);
      toast.success('Order delivered successfully');
      dispatch(fetchOrderList());
    } catch (error) {
      setLoadingDeliver(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (error) return <div className={components.states.error}><MessageBox variant="danger">{error}</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Admin Orders - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className={components.typography.h2}>Orders Management</h1>
                <p className={colors.text.secondary}>Manage all customer orders</p>
              </div>
            </div>
          </div>

          {/* Loading States */}
          {(loadingDeliver || loadingDelete) && (
            <div className="mb-4">
              <LoadingBox />
            </div>
          )}

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className={`${components.card.base} p-12 ${utils.centerText}`}>
              <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className={`${colors.text.secondary} mb-6`}>Orders will appear here when customers make purchases</p>
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
                        Customer
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
                          <div className="text-sm font-medium text-gray-900">
                            {order.user ? order.user.name : 'DELETED USER'}
                          </div>
                          {order.user && (
                            <div className="text-sm text-gray-500">{order.user.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.isPaid ? (
                            <div className="flex items-center">
                              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-green-700">Paid</div>
                                <div className="text-xs text-gray-500">
                                  {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ''}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircleIcon className="w-4 h-4 text-red-500 mr-2" />
                              <span className="text-sm font-medium text-red-700">Unpaid</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.isDelivered ? (
                            <div className="flex items-center">
                              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-green-700">Delivered</div>
                                <div className="text-xs text-gray-500">
                                  {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : ''}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 text-yellow-500 mr-2" />
                              <span className="text-sm font-medium text-yellow-700">Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/order/${order._id}`)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <EyeIcon className="w-3 h-3 mr-1" />
                              View
                            </button>
                            {order.isPaid && !order.isDelivered && (
                              <button
                                onClick={() => deliverHandler(order)}
                                disabled={loadingDeliver}
                                className="inline-flex items-center px-2 py-1 border border-green-300 shadow-sm text-xs leading-4 font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                              >
                                <TruckIcon className="w-3 h-3 mr-1" />
                                {loadingDeliver ? 'Processing...' : 'Mark Delivered'}
                              </button>
                            )}
                            <button
                              onClick={() => deleteHandler(order)}
                              className="inline-flex items-center px-2 py-1 border border-red-300 shadow-sm text-xs leading-4 font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <TrashIcon className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
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