import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/userSlice";
import Button from "react-bootstrap/Button";

const Header = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Link to="/">
            <Navbar.Brand>amazona</Navbar.Brand>
          </Link>
          <Nav className="me-auto">
            <Link to="/cart" className="nav-link">
              Cart
              {cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cartItems.length}
                </Badge>
              )}
            </Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <span className="nav-link text-light">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/signin" className="nav-link">
                Sign In
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;