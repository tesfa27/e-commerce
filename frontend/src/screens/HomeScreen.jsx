import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Product from "../components/Product";
import { Row, Col } from "react-bootstrap";

function HomeScreen() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      // Normalize response to prevent 'products.map is not a function'
      return Array.isArray(response.data)
        ? response.data
        : response.data.products || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading products.</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
