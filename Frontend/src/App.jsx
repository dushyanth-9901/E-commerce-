import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Success from "./pages/Success";

export default function App() {

  // =====================================================
  // 🔥 CART STATE
  // =====================================================
  const [cart, setCart] =
    useState([]);

  // =====================================================
  // 🔥 LOAD CART FROM STORAGE
  // =====================================================
  useEffect(() => {

    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {

      setCart(
        JSON.parse(savedCart)
      );

    }

  }, []);

  // =====================================================
  // 🔥 SAVE CART
  // =====================================================
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Dashboard
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/login"
          element={<Auth />}
        />

        <Route
          path="/success"
          element={<Success />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );

}