// 📁 src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

function Dashboard({ cart, setCart }) {

  // 🔥 NAVIGATION
  const navigate = useNavigate();



  // 🔥 SEARCH STATE
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");



  // 🔥 PRODUCTS STATE
  const [products, setProducts] = useState([]);




  // 🔥 LOADING STATE
  const [loading, setLoading] = useState(true);



  // 🔥 LOAD PRODUCTS FROM BACKEND
  useEffect(() => {

    fetchProducts();

  }, []);




  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      // 🔥 GET PRODUCTS FROM BACKEND
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );



      // 🔥 SAVE PRODUCTS
      setProducts(res.data);



      // 🔥 STOP LOADING
      setLoading(false);

    } catch (error) {

      console.log(error);



      // ❌ STOP LOADING EVEN IF ERROR
      setLoading(false);

    }

  };




  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Footwear",
    "Accessories",
    ...Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter(Boolean)
      )
    )
  ];

  const sortedProducts = [...products]
    .filter((p) => {
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All"
          ? true
          : p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "Price Low → High") {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === "Price High → Low") {
        return Number(b.price) - Number(a.price);
      }
      if (sortBy === "Newest") {
        return Number(b.id) - Number(a.id);
      }
      return 0;
    });




  // =====================================================
  // 🛒 ADD TO CART WITH QUANTITY
  // =====================================================
  const addToCart = (product) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const cartKey = user ? `cart_${user.email}` : "cart_guest";

  const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingProduct = oldCart.find(
    (item) => item.id === product.id
  );

  let updatedCart;

  if (existingProduct) {
    updatedCart = oldCart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [
      ...oldCart,
      { ...product, quantity: 1 }
    ];
  }

  // 🔥 SAVE TO STATE
  setCart(updatedCart);

  // 🔥 SAVE TO LOCALSTORAGE (MOST IMPORTANT)
  localStorage.setItem(cartKey, JSON.stringify(updatedCart));

  alert("Added To Cart ✅");
};



  // 🔥 LOADING SCREEN
  if (loading) {

    return (

      <h1 style={styles.loading}>
        Loading Products...
      </h1>

    );

  }




  return (

    <div style={styles.page}>

      {/* 🔥 NAVBAR */}
      <Navbar
        cart={cart}
        search={search}
        setSearch={setSearch}
      />



      <div style={styles.container}>

        {/* 🔥 TITLE */}
        <h1 style={styles.title}>
          Explore Products 🛒
        </h1>

        <div style={styles.filterRow}>
          <p style={styles.count}>
            {sortedProducts.length}
            {" "}
            Products Available
          </p>

          <div style={styles.filterGroup}>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              style={styles.categorySelect}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="Newest">Newest</option>
              <option value="Price Low → High">
                Price Low → High
              </option>
              <option value="Price High → Low">
                Price High → Low
              </option>
            </select>
          </div>
        </div>

        {/* 🔥 PRODUCTS GRID */}
        <div style={styles.grid}>

          {sortedProducts.length > 0 ? (

            sortedProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />

            ))

          ) : (

            <h2 style={styles.empty}>
              No Products Found 😢
            </h2>

          )}

        </div>

      </div>



      {/* 🔥 FOOTER */}
      <Footer />

    </div>

  );

}



// 🎨 STYLES
const styles = {

  // 🔥 PAGE
  page: {
    minHeight: "100vh",
    background: "#f5f7fb"
  },



  // 🔥 CONTAINER
  container: {
    padding: "30px"
  },



  // 🔥 TITLE
  title: {
    marginBottom: "10px",
    fontSize: "34px",
    fontWeight: "bold",
    color: "#222"
  },



  // 🔥 PRODUCT COUNT
  count: {
    color: "#666",
    marginBottom: "0",
    fontSize: "16px"
  },

  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "20px"
  },

  categorySelect: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    minWidth: "180px"
  },

  sortSelect: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    minWidth: "200px"
  },

  filterGroup: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  },


  // 🔥 GRID
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
    marginTop: "25px"
  },



  // 🔥 LOADING
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "32px",
    color: "#6c63ff"
  },



  // 🔥 EMPTY
  empty: {
    color: "#666"
  }

};

export default Dashboard;