import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Auth from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";

export default function App() {
  const [cart, setCart] = useState([]);

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
        <Route path="/login" element={<Auth />} />

        <Route
          path="/dashboard"
          element={<Dashboard cart={cart} setCart={setCart} />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails cart={cart} setCart={setCart} />}
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}