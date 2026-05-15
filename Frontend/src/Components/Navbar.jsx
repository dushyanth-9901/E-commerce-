import { useNavigate } from "react-router-dom";

// 🔥 Navbar Component
function Navbar({ cart }) {

  const navigate = useNavigate();

  // 🔓 Logout
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>

      {/* 🔹 Logo */}
      <h2 style={styles.logo}>ShopZone 🛒</h2>

      {/* 🔹 Right Side */}
      <div style={styles.right}>

        {/* 🔹 Cart Button */}
        <button
          style={styles.cartBtn}
          onClick={() => navigate("/cart")}
        >
          Cart ({cart.length})
        </button>

        {/* 🔹 Logout */}
        <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

const styles = {

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#111",
    color: "white",
    position: "sticky",
    top: 0
  },

  logo: {
    margin: 0
  },

  right: {
    display: "flex",
    gap: "10px"
  },

  cartBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#667eea",
    color: "white"
  },

  logoutBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "crimson",
    color: "white"
  }
};

export default Navbar;