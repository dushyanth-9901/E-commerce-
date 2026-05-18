

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard({ cart }) {

  // 🔥 NAVIGATION
  const navigate = useNavigate();



  // 🔥 SEARCH STATE
  const [search, setSearch] = useState("");



  // 🔥 PRODUCTS STATE
  const [products, setProducts] = useState([]);




  // 🔥 LOADING STATE
  const [loading, setLoading] = useState(true);




  // 🔐 PROTECT PAGE
  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");



    // ❌ IF NOT LOGGED IN
    if (!isLoggedIn) {

      navigate("/");

    }

  }, [navigate]);




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




  // 🔥 FILTER PRODUCTS
  const filteredProducts =
    products.filter((p) =>

      p.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );




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
      <Navbar cart={cart} />



      <div style={styles.container}>

        {/* 🔥 TITLE */}
        <h1 style={styles.title}>
          Explore Products 🛒
        </h1>



        {/* 🔥 PRODUCT COUNT */}
        <p style={styles.count}>
          {filteredProducts.length}
          {" "}
          Products Available
        </p>



        {/* 🔥 SEARCH BAR */}
        <SearchBar setSearch={setSearch} />



        {/* 🔥 PRODUCTS GRID */}
        <div style={styles.grid}>

          {filteredProducts.length > 0 ? (

            filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))

          ) : (

            <h2 style={styles.empty}>
              No Products Found 😢
            </h2>

          )}

        </div>

      </div>

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
    marginBottom: "20px",
    fontSize: "16px"
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
    marginTop: "100px"
  },



  // 🔥 EMPTY
  empty: {
    color: "#666"
  }

};

export default Dashboard;