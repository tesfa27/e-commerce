import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { savePaymentMethod } from '../redux/paymentSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { shippingAddress } = useSelector((state) => state.shipping);
  const { paymentMethod: savedPaymentMethod } = useSelector((state) => state.payment);
  
  // Initialize with saved payment method or default to PayPal
  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder'); // Add explicit path
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}