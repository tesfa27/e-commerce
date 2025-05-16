import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, clearError } from "../redux/cartSlice";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Row, Col, ListGroup, Card, Badge, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";

// Product page component
function ProductScreen() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: cartError } = useSelector((state) => state.cart);

  // Fetch product data
  const {
    data: product,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await axios.get(`/api/products/slug/${slug}`)).data,
    retry: 3,
  });

  // Update document title
  useEffect(() => {
    const defaultTitle = "Amazona";
    if (product?.name) {
      document.title = product.name;
      return () => {
        document.title = defaultTitle;
      };
    }
  }, [product]);

  // Clear cart error after 3 seconds
  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartError, dispatch]);

  // Handle adding product to cart
  const handleAddToCart = async () => {
    try {
      console.log("Adding to cart:", { product, quantity: 1 }); // Debug log
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err); // Debug log
    }
  };

  if (isLoading) return <LoadingBox />;
  if (queryError) return <MessageBox variant="danger">{getError(queryError)}</MessageBox>;

  return (
    <div>
      {cartError && <MessageBox variant="danger">{cartError}</MessageBox>}
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-lg" />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price?.toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        disabled={status === "loading"}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;