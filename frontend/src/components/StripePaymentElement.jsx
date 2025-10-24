import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { components } from '../styles/theme';
import LoadingBox from './LoadingBox';

export default function StripePaymentElement({ onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-processing`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`${components.button.primary} w-full mt-6`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <LoadingBox />
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
}