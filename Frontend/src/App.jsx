import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Success from "./pages/Success";
import ResetPassword from "./pages/ResetPassword";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";

export default function App() {

  // =====================================================
  // 🔥 LOAD CART FROM LOCALSTORAGE
  // =====================================================
    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    const cartKey = user
      ? `cart_${user.email}`
      : "cart_guest";

    const [cart, setCart] =
      useState(

        JSON.parse(
          localStorage.getItem(cartKey)
        ) || []

      );
  // =====================================================
// 🔥 SAVE USER CART
// =====================================================
      useEffect(() => {

        const user =

          JSON.parse(
            localStorage.getItem("user")
          );

        if (!user) return;

        localStorage.setItem(

          `cart_${user.email}`,

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
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/success"
          element={<Success />}
        />
       <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/order-history"
          element={<OrderHistory />}
        />
        <Route
          path="/wishlist"
          element={<Wishlist
            cart={cart}
            setCart={setCart}
          />}
        />

      </Routes>

    </BrowserRouter>

  );

}