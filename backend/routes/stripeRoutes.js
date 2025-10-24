import express from 'express';
import Stripe from 'stripe';
import { isAuth } from '../utils.js';
import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeRouter = express.Router();

stripeRouter.post(
  '/create-payment-intent',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { amount, currency = 'usd', orderData } = req.body;

    try {
      if (!amount || amount <= 0) {
        return res.status(400).send({ message: 'Invalid amount' });
      }

      // Store order data temporarily (in production, use Redis or database)
      global.pendingOrders = global.pendingOrders || {};
      const tempOrderId = `temp_${Date.now()}_${req.user._id}`;
      global.pendingOrders[tempOrderId] = orderData;
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents
        currency,
        payment_method_types: ['card', 'amazon_pay', 'klarna', 'link', 'affirm'], // Allow multiple payment methods
        metadata: {
          userId: req.user._id.toString(),
          tempOrderId
        }
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      res.status(500).send({ message: error.message });
    }
  })
);

stripeRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      try {
        if (orderId) {
          const order = await Order.findById(orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date(paymentIntent.created * 1000).toISOString(),
              email_address: paymentIntent.receipt_email
            };
            await order.save();
            console.log(`Order ${orderId} marked as paid via webhook`);
          }
        }
      } catch (error) {
        console.error('Error updating order via webhook:', error);
      }
    }

    res.send({ received: true });
  }
);

// Route to confirm payment and create order
stripeRouter.post(
  '/confirm-payment',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { paymentIntentId, orderData } = req.body;

    try {
      // Verify the payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).send({ message: 'Payment not completed' });
      }

      // Get order data from request or temporary storage
      let finalOrderData = orderData;
      if (!finalOrderData && paymentIntent.metadata.tempOrderId) {
        global.pendingOrders = global.pendingOrders || {};
        finalOrderData = global.pendingOrders[paymentIntent.metadata.tempOrderId];
        delete global.pendingOrders[paymentIntent.metadata.tempOrderId];
      }

      if (!finalOrderData) {
        return res.status(400).send({ message: 'Order data not found' });
      }

      // Create the order after successful payment
      const newOrder = new Order({
        orderItems: finalOrderData.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: finalOrderData.shippingAddress,
        paymentMethod: finalOrderData.paymentMethod,
        itemsPrice: finalOrderData.itemsPrice,
        shippingPrice: finalOrderData.shippingPrice,
        taxPrice: finalOrderData.taxPrice,
        totalPrice: finalOrderData.totalPrice,
        user: req.user._id,
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date(paymentIntent.created * 1000).toISOString(),
          email_address: paymentIntent.receipt_email
        }
      });

      // Initialize tracking history
      newOrder.trackingHistory = [{
        status: 'pending',
        description: 'Order placed successfully',
        timestamp: new Date(),
        location: 'Online Store'
      }];
      
      const order = await newOrder.save();
      res.status(201).send({ message: 'Order created successfully', order });
    } catch (error) {
      console.error('Error confirming payment and creating order:', error);
      res.status(500).send({ message: error.message });
    }
  })
);

export default stripeRouter;