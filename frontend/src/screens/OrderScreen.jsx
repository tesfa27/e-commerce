import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchOrder, payOrder, resetPay } from '../redux/orderSlice';

export default function OrderScreen() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user info and order from Redux store
  const { userInfo } = useSelector((state) => state.user);
  const { loading, error, order, successPay, loadingPay } = useSelector((state) => state.order);
  const orderData = order?.order || order; // Handle both { order: {...} } and direct order object
  
  // PayPal script state
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Load PayPal script
  const loadPaypalScript = async () => {
    try {
      const { data: clientId } = await axios.get('/api/keys/paypal');
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': clientId,
          currency: 'USD',
        },
      });
      paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      setPaypalLoaded(true);
    } catch (error) {
      console.error('Failed to load PayPal script:', error);
    }
  };

  useEffect(() => {
    // Redirect to signin if not logged in
    if (!userInfo) {
      navigate('/signin');
      return;
    }

    if (!orderData || successPay || (orderData._id && orderData._id !== orderId)) {
      dispatch(fetchOrder(orderId));
      if (successPay) {
        dispatch(resetPay());
      }
    } else if (!orderData.isPaid && !paypalLoaded) {
      loadPaypalScript();
    }
  }, [dispatch, userInfo, orderId, navigate, orderData, successPay, paypalLoaded]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : !orderData ? (
    <MessageBox variant="danger">Order not found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {orderData.shippingAddress?.fullName} <br />
                <strong>Address:</strong> {orderData.shippingAddress?.address},
                {orderData.shippingAddress?.city}, {orderData.shippingAddress?.postalCode},
                {orderData.shippingAddress?.country}
              </Card.Text>
              {orderData.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {orderData.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {orderData.paymentMethod}
              </Card.Text>
              {orderData.isPaid ? (
                <MessageBox variant="success">
                  Paid at {orderData.paidAt}
                </MessageBox>
              ) : (
                <div>
                  <MessageBox variant="danger">Not Paid</MessageBox>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
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
                    </div>
                  )}
                  {loadingPay && <LoadingBox />}
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {orderData.orderItems?.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${orderData.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${orderData.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${orderData.taxPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col><strong>Order Total</strong></Col>
                    <Col><strong>${orderData.totalPrice?.toFixed(2)}</strong></Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}