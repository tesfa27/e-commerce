import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { savePaymentMethod } from '../redux/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { colors, components, utils } from '../styles/theme';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { shippingAddress } = useSelector((state) => state.cart);
  const { paymentMethod: savedPaymentMethod } = useSelector((state) => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod || 'Stripe'
  );

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Saving payment method:', paymentMethod);
    dispatch(savePaymentMethod(paymentMethod));
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  const paymentOptions = [
    {
      id: 'Stripe',
      name: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: CreditCardIcon,
      popular: true
    },
    {
      id: 'PayPal',
      name: 'PayPal',
      description: 'Pay securely with your PayPal account',
      icon: BanknotesIcon,
      popular: false
    }
  ];

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Payment Method - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          <CheckoutSteps step1 step2 step3 />
          
          <div className="max-w-2xl mx-auto mt-8">
            <div className={`${components.card.base} p-8`}>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <CreditCardIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment Method</h1>
                  <p className={colors.text.secondary}>Choose how you'd like to pay</p>
                </div>
              </div>

              <form onSubmit={submitHandler} className="space-y-4">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === option.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={paymentMethod === option.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        paymentMethod === option.id ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <option.icon className={`w-5 h-5 ${
                          paymentMethod === option.id ? 'text-emerald-600' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`font-medium ${
                            paymentMethod === option.id ? 'text-emerald-900' : 'text-gray-900'
                          }`}>
                            {option.name}
                          </span>
                          {option.popular && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          paymentMethod === option.id ? 'text-emerald-700' : colors.text.secondary
                        }`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === option.id
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </label>
                ))}

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className={`${components.button.primary} w-full`}
                  >
                    Continue to Review Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}