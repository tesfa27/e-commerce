import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { addToCart } from '../redux/cartSlice';

function ReduxTest() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems) || [];
  console.log('ReduxTest cartItems:', cartItems);

  const handleAddTestItem = () => {
    const testItem = {
      _id: 'test-123',
      name: 'Test Item',
      price: 99,
      slug: 'test-item',
      image: '/images/test.jpg',
    };
    dispatch(addToCart(testItem));
  };

  return (
    <div>
      <h3>Redux Test</h3>
      <Button variant="primary" onClick={handleAddTestItem}>
        Add Test Item to Cart
      </Button>
      <p>Cart Items: {cartItems.length}</p>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReduxTest;