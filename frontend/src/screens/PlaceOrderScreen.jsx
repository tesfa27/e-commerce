import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import { createOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';


export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Update selectors to get data from correct slices
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  
  
  const orderCreate = useSelector((state) => state.order);
  const { loading, error, success, order } = orderCreate;
  const { userInfo } = useSelector((state) => state.user);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  
  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }
    // Remove these checks since we're about to place the order
    // if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
    //   navigate('/shipping');
    //   return;
    // }
    // if (!paymentMethod) {
    //   navigate('/payment');
    //   return;
    // }
    if (success && order && order._id) {
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order, userInfo]);

  const placeOrderHandler = async () => {
    try {
      const resultAction = await dispatch(createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })).unwrap();
      
      if (resultAction && resultAction.order && resultAction.order._id) {
        toast.success('Order placed successfully');
        navigate(`/order/${resultAction.order._id}`);
        dispatch(clearCart()); // Move clearCart after navigation
      } else {
        toast.error('Invalid order response');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to place order');
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName} <br />
                <strong>Address:</strong> {shippingAddress.address},
                {shippingAddress.city}, {shippingAddress.postalCode},
                {shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
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
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col><strong>Order Total</strong></Col>
                    <Col><strong>${totalPrice.toFixed(2)}</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0 || loading}
                    >
                      {loading ? <LoadingBox /> : 'Place Order'}
                    </Button>
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}