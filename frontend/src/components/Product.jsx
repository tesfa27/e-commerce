import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, clearError } from "../redux/cartSlice";

function Product(props) {
  const { product } = props;
  const dispatch = useDispatch();
  const handleAddToCart = async () => {
    try {
     
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
    } catch (err) {
      console.error("Add to cart error:", err); // Debug log
    }
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        <Button variant="primary" onClick={handleAddToCart}>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
