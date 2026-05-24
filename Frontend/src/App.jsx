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

export default function App() {

  // =====================================================
  // 🔥 LOAD CART FROM LOCALSTORAGE
  // =====================================================
 const [cart, setCart] = useState(

  JSON.parse(
    localStorage.getItem("cart")
  ) || []

);

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

      </Routes>

    </BrowserRouter>

  );

}