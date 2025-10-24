import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { StripeProvider } from '../utils/stripe.jsx';
import StripeCheckoutForm from './StripeCheckoutForm.jsx';
import LoadingBox from './LoadingBox';

export default function PaymentSection({ 
  orderData, 
  isPending, 
  stripeError, 
  stripeClientSecret, 
  loadStripeClientSecret,
  dispatch,
  orderId,
  payOrder,
  resetPay 
}) {
  if (isPending) {
    return <LoadingBox />;
  }

  return (
    <div className="mt-4 space-y-4">
      {orderData.paymentMethod === 'Stripe' ? (
        <div className="w-full">
          {stripeError && (
            <div className="text-red-600 mb-4">
              {stripeError}
            </div>
          )}
          {stripeClientSecret ? (
            <StripeProvider clientSecret={stripeClientSecret}>
              <StripeCheckoutForm
                orderId={orderId}
                onPaymentSuccess={() => dispatch(resetPay())}
              />
            </StripeProvider>
          ) : (
            <button
              onClick={loadStripeClientSecret}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Pay with Stripe
            </button>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}