import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="d-flex flex-column site-container">
          <header>
            <Navbar bg="dark" variant="dark">
              <Container>
                <Link to="/">
                  <Navbar.Brand>amazona</Navbar.Brand>
                </Link>
              </Container>
            </Navbar>
          </header>
          <main>
            <Container>
              <Routes>
                <Route path="/product/:slug" element={<ProductScreen />} />

                <Route path="/" element={<HomeScreen />} />
              </Routes>
            </Container>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
