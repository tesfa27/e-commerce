import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PayPalScriptProvider deferLoading={true}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PayPalScriptProvider>
  </StrictMode>
);
