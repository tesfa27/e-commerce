import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Nav, Container } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { productAPI } from './api';
import { getError } from './utils';
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingScreen from "./screens/ShippingScreen";
import SignUpScreen from './screens/SignUpScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import CreateProductScreen from './screens/CreateProductScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import Footer from './components/Footer';


const AppContent = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await productAPI.getCategories();
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div className="site-container flex flex-col min-h-screen">
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="bg-white shadow-lg rounded-xl border border-gray-200 text-gray-900"
          bodyClassName="text-sm font-medium"
          progressClassName="bg-emerald-500"
        />
        
        <Header sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
        <main className="flex-1">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/products" element={<ProductsScreen />} />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/product/create"
              element={
                <AdminRoute>
                  <CreateProductScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/forget-password" element={<ForgetPasswordScreen />} />
            <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
const queryClient = new QueryClient();
const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;