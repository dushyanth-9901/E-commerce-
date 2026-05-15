import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import products from "../data/products";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

// 🔥 Dashboard Page
function Dashboard({ cart }) {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // 🔐 Protect dashboard
  useEffect(() => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
    }

  }, []);

  // 🔍 Filter products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      {/* 🔹 Navbar */}
      <Navbar cart={cart} />

      <div style={styles.content}>

        {/* 🔹 Search */}
        <SearchBar setSearch={setSearch} />

        {/* 🔹 Product Grid */}
        <div style={styles.grid}>

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </div>
    </div>
  );
}

const styles = {

  container: {
    background: "#f4f4f4",
    minHeight: "100vh"
  },

  content: {
    padding: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  }
};

export default Dashboard;