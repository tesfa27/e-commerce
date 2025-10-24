import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { StripeProvider } from '../utils/stripe.jsx';
import LoadingBox from '../components/LoadingBox';
import StripePaymentElement from '../components/StripePaymentElement';
import { colors, components } from '../styles/theme';
import axios from 'axios';
import { createOrder, fetchOrderHistory } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';

export default function PaymentProcessingScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const clientSecret = searchParams.get('clientSecret');
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle redirect from payment authorization
    if (paymentIntent && paymentIntentClientSecret) {
      handleRedirectPayment();
      return;
    }
    
    if (!clientSecret) {
      navigate('/cart');
    }
  }, [clientSecret, paymentIntent, paymentIntentClientSecret, navigate]);

  const handleRedirectPayment = async () => {
    setLoading(true);
    try {
      const pendingOrderDetails = JSON.parse(localStorage.getItem('pendingOrderDetails'));
      if (!pendingOrderDetails) {
        throw new Error('Order details not found');
      }

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?.token) {
        throw new Error('Please login first');
      }

      const response = await axios.post('/api/stripe/confirm-payment', 
        {
          paymentIntentId: paymentIntent,
          orderData: pendingOrderDetails
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );

      if (response.data?.order?._id) {
        localStorage.removeItem('pendingOrderDetails');
        dispatch(clearCart());
        localStorage.removeItem('cartItems');
        // Refresh order history
        dispatch(fetchOrderHistory());
        toast.success('Payment successful! Order has been placed.');
        navigate(`/order/${response.data.order._id}`);
      } else {
        throw new Error('Invalid order response');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      toast.error(err?.response?.data?.message || 'Failed to complete order');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setLoading(true);
    try {
      // Get the pending order details from localStorage
      const pendingOrderDetails = JSON.parse(localStorage.getItem('pendingOrderDetails'));
      
      if (!pendingOrderDetails) {
        throw new Error('Order details not found');
      }

      // Get the user token from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('Please login first');
      }

      // Confirm payment and create order via backend
      const response = await axios.post('/api/stripe/confirm-payment', 
        {
          paymentIntentId: paymentIntent.id,
          orderData: pendingOrderDetails
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      if (response.data && response.data.order && response.data.order._id) {
        // Clear the pending order from localStorage
        localStorage.removeItem('pendingOrderDetails');
        
        // Clear the cart
        dispatch(clearCart());
        localStorage.removeItem('cartItems');
        
        toast.success('Payment successful! Order has been placed.');
        navigate(`/order/${response.data.order._id}`);
      } else {
        throw new Error('Invalid order response');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      toast.error(err?.response?.data?.message || err.message || 'Failed to complete order');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error(error.message || 'Payment failed');
    navigate('/placeorder');
  };

  if (loading || paymentIntent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingBox />
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Process Payment - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="max-w-lg mx-auto py-12">
          <div className={components.card.base}>
            <div className="p-6">
              <h1 className={components.typography.h2}>Complete Your Payment</h1>
              <p className="text-gray-600 mb-6">
                Please provide your payment details to complete the purchase.
              </p>
              
              {clientSecret && (
                <StripeProvider clientSecret={clientSecret}>
                  <StripePaymentElement
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}