import { useNavigate } from "react-router-dom";

// 🔥 Navbar Component
function Navbar({ cart }) {

  const navigate = useNavigate();

  // 🔥 CHECK LOGIN
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");



  // 🔓 LOGOUT FUNCTION
  const logout = () => {

    localStorage.removeItem("isLoggedIn");

    navigate("/dashboard");

  };



  return (

    <div style={styles.navbar}>

      {/* 🔹 LOGO */}
      <h2 style={styles.logo}>
        ShopZone 🛒
      </h2>



      {/* 🔹 RIGHT SIDE */}
      <div style={styles.right}>

        {/* 🔹 LOGIN / LOGOUT */}
        {isLoggedIn ? (

          <button
            type = "button"
            style={styles.logoutBtn}
            onClick={logout}
          >
            Logout
          </button>

        ) : (

          <button
            type = "button"
            style={styles.loginBtn}
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        )}



        {/* 🔹 CART BUTTON */}
        <button
          type = "button"
          style={styles.cartBtn}
          onClick={() =>
            navigate("/cart")
          }
        >
          Cart ({cart.length})
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
    top: 0,
    zIndex: 1000
  },



  logo: {
    margin: 0
  },



  right: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },



  cartBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#667eea",
    color: "white",
    fontWeight: "bold"
  },



  logoutBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "crimson",
    color: "white",
    fontWeight: "bold"
  },



  loginBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#22c55e",
    color: "white",
    fontWeight: "bold"
  }

};

export default Navbar;