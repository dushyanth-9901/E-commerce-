import { useNavigate } from "react-router-dom";

// 🔥 Navbar Component
function Navbar({ cart }) {

  const navigate = useNavigate();
  const isLoggedIn =
  localStorage.getItem("isLoggedIn");

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

           {/* 🔹 Login/Logout Button */}
                  {
            isLoggedIn ? (

              <button
                style={styles.logoutBtn}
                onClick={() => {

                  localStorage.removeItem(
                    "isLoggedIn"
                  );

                  window.location.reload();

                }}
              >
                Logout
              </button>

            ) : (

              <button
                style={styles.loginBtn}
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </button>

            )
          }

            {/* 🔹 Logout */}
            <button
              style={styles.logoutBtn}
              onClick={logout}
            >
              Logout
            </button>
        
              {/* 🔹 Cart Button */}
              <button
                style={styles.cartBtn}
                onClick={() => navigate("/cart")}
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
  },
  loginBtn: {
  padding: "10px 18px",
  border: "none",
  background: "#6c63ff",
  color: "#fff",
  borderRadius: "8px",
  cursor: "pointer",
  marginLeft: "15px"
},

// logoutBtn: {
//   padding: "10px 18px",
//   border: "none",
//   background: "crimson",
//   color: "#fff",
//   borderRadius: "8px",
//   cursor: "pointer",
//   marginLeft: "15px"
// },
};

export default Navbar;