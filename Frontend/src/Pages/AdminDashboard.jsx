import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 🔐 ADMIN CHECK
  // =====================================================
  useEffect(() => {

    const isAdmin =
      localStorage.getItem("isAdmin");

    if (!isAdmin) {
      navigate("/admin");
    }

    fetchProducts();

  }, []);

  // =====================================================
  // 🔥 FETCH PRODUCTS
  // =====================================================
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }

  };

  // =====================================================
  // ❌ DELETE PRODUCT
  // =====================================================
  const deleteProduct = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      const updatedProducts =
        products.filter(
          (item) => item.id !== id
        );

      setProducts(updatedProducts);

      alert("Product Deleted ✅");

    } catch (error) {

      console.log(error);

      alert("Delete Failed ❌");

    }

  };

  // =====================================================
  // 🔓 LOGOUT
  // =====================================================
  const logout = () => {

    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin");

  };

  // =====================================================
  // ⏳ LOADING
  // =====================================================
  if (loading) {

    return (
      <h1 style={styles.loading}>
        Loading Dashboard...
      </h1>
    );

  }

  // =====================================================
  // 🎨 UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          Admin Panel 👨‍💼
        </h2>

        <button style={styles.menuBtn}>
          Dashboard
        </button>

        <button style={styles.menuBtn}>
          Products
        </button>

        <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <div style={styles.header}>
          <h1>Admin Dashboard 🚀</h1>
        </div>

        {/* STATS */}
        <div style={styles.statsContainer}>

          <div style={styles.card}>
            <h2>{products.length}</h2>
            <p>Total Products</p>
          </div>

        </div>

        {/* TABLE */}
        <div style={styles.tableBox}>

          <h2>
            Products List 📦
          </h2>

          <table style={styles.table}>

            <thead>

              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr key={product.id}>

                  <td>{product.id}</td>

                  <td>

                    <img
                      src={product.image}
                      alt={product.name}
                      style={styles.productImage}
                    />

                  </td>

                  <td>{product.name}</td>

                  <td>₹ {product.price}</td>

                  <td>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f7fc"
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  logo: {
    marginBottom: "30px"
  },

  menuBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#1f2937",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "bold"
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "crimson",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  main: {
    flex: 1,
    padding: "30px"
  },

  header: {
    marginBottom: "30px"
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  tableBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },

  productImage: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px"
  },

  deleteBtn: {
    padding: "8px 15px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },

  loading: {
    textAlign: "center",
    marginTop: "100px"
  }

};

export default AdminDashboard;