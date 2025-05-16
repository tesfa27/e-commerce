import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { increaseQuantity, decreaseQuantity, deleteFromCart, clearError } from "../redux/cartSlice";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { Row, Col, ListGroup, Card, Button, Spinner } from "react-bootstrap";

// Shopping cart page component
function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, status, error } = useSelector((state) => state.cart);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Handlers for cart actions
  const increaseCartHandler = (item) => {
    console.log("increaseCartHandler:", { item }); // Debug log
    dispatch(increaseQuantity(item));
  };

  const decreaseCartHandler = (item) => {
    console.log("decreaseCartHandler:", { item }); // Debug log
    dispatch(decreaseQuantity(item));
  };

  const deleteCartHandler = (item) => {
    console.log("deleteCartHandler:", { item }); // Debug log
    dispatch(deleteFromCart(item));
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      {status === "loading" && <Spinner animation="border" size="sm" />}
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4} className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                        style={{ maxWidth: "60px" }}
                      />
                      <Link to={`/product/${item.slug}`} className="ms-2">
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() => decreaseCartHandler(item)}
                        disabled={item.quantity === 1 || status === "loading"}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant="light"
                        onClick={() => increaseCartHandler(item)}
                        disabled={item.quantity >= item.countInStock || status === "loading"}
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>
                    </Col>
                    <Col md={3}>${item.price?.toFixed(2)}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => deleteCartHandler(item)}
                        disabled={status === "loading"}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) : $
                    {cartItems
                      .reduce((a, c) => a + (c.price || 0) * c.quantity, 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0 || status === "loading"}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartScreen;