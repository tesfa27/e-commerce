import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import LoadingBox from './LoadingBox';
import { useNavigate } from 'react-router-dom';

export default function StripeCheckoutForm({ orderId, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/${orderId}`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        onPaymentSuccess();
        toast.success('Payment successful!');
        navigate(`/order/${orderId}`);
      }
    } catch (error) {
      toast.error('An error occurred while processing your payment.');
      console.error('Payment error:', error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? <LoadingBox /> : 'Pay now'}
      </button>
    </form>
  );
}