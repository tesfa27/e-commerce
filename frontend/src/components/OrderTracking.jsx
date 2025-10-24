import React from 'react';
import { CheckCircleIcon, ClockIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';

const OrderTracking = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'shipped': return <TruckIcon className="w-6 h-6 text-blue-500" />;
      case 'processing': return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      default: return <MapPinIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'confirmed': return 'bg-emerald-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
        {order.trackingNumber && (
          <span className="text-sm text-gray-600">
            Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span>
          </span>
        )}
      </div>

      <div className="space-y-4">
        {order.trackingHistory?.map((track, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(track.status)} mt-2`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {track.status.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(track.timestamp).toLocaleDateString()} {new Date(track.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{track.description}</p>
              {track.location && (
                <p className="text-xs text-gray-500 mt-1">📍 {track.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Current Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
            order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;