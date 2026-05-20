// import { useNavigate } from "react-router-dom";

// // 🔥 Navbar Component
// function Navbar({ cart }) {

//   const navigate = useNavigate();

//   // 🔥 CHECK LOGIN
//   const isLoggedIn =
//     localStorage.getItem("isLoggedIn");



//   // 🔓 LOGOUT FUNCTION
//   const logout = () => {

//   // 🔥 REMOVE LOGIN DATA
//   localStorage.removeItem("isLoggedIn");
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");

//   // 🔥 REDIRECT
//   navigate("/");

// };



//   return (

//     <div style={styles.navbar}>

//       {/* 🔹 LOGO */}
//       <h2 style={styles.logo}>
//         ShopZone 🛒
//       </h2>



//       {/* 🔹 RIGHT SIDE */}
//       <div style={styles.right}>

//         {/* 🔹 LOGIN / LOGOUT */}
//         {isLoggedIn ? (

//           <button
//             type = "button"
//             style={styles.logoutBtn}
//             onClick={logout}
//           >
//             Logout
//           </button>

//         ) : (

//           <button
//             type = "button"
//             style={styles.loginBtn}
//             onClick={() =>
//               navigate("/login")
//             }
//           >
//             Login
//           </button>

//         )}



//         {/* 🔹 CART BUTTON */}
//         <button
//           type = "button"
//           style={styles.cartBtn}
//           onClick={() =>
//             navigate("/cart")
//           }
//         >
//           Cart ({cart.length})
//         </button>

//       </div>

//     </div>

//   );

// }



// const styles = {

//   navbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "15px 30px",
//     background: "#111",
//     color: "white",
//     position: "sticky",
//     top: 0,
//     zIndex: 1000
//   },



//   logo: {
//     margin: 0
//   },



//   right: {
//     display: "flex",
//     gap: "10px",
//     alignItems: "center"
//   },



//   cartBtn: {
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     background: "#667eea",
//     color: "white",
//     fontWeight: "bold"
//   },



//   logoutBtn: {
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     background: "crimson",
//     color: "white",
//     fontWeight: "bold"
//   },



//   loginBtn: {
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     background: "#22c55e",
//     color: "white",
//     fontWeight: "bold"
//   }

// };

// export default Navbar;
import { useNavigate } from "react-router-dom";

function Navbar({ cart, search, setSearch }) {

  // 🔥 NAVIGATION
  const navigate = useNavigate();

  // 🔥 LOGIN STATUS
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");



  // =====================================================
  // 🔥 LOGOUT
  // =====================================================
  const logout = () => {

    // 🔥 CLEAR STORAGE
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 REDIRECT
    navigate("/");

  };



  return (

    <div style={styles.navbar}>


      {/* =====================================================
          🔥 LOGO
      ===================================================== */}
      <h2
        style={styles.logo}
        onClick={() => navigate("/")}
      >
        ShopEase 🛍️
      </h2>





      {/* =====================================================
          🔍 SEARCH BAR CENTER
      ===================================================== */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={styles.search}
      />







      {/* =====================================================
          🔥 RIGHT SIDE BUTTONS
      ===================================================== */}
      <div style={styles.right}>


        {/* 🛒 CART */}
        <button
          style={styles.cartBtn}
          onClick={() => navigate("/cart")}
        >
          Cart ({cart.length})
        </button>





        {/* 🔐 LOGIN / LOGOUT */}
        {isLoggedIn ? (

          <button
            style={styles.logoutBtn}
            onClick={logout}
          >
            Logout
          </button>

        ) : (

          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        )}

      </div>

    </div>

  );

}






// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // 🔥 NAVBAR
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#111",
    color: "#fff",
    flexWrap: "wrap",
    gap: "20px"
  },



  // 🔥 LOGO
  logo: {
    cursor: "pointer"
  },



  // 🔍 SEARCH
  search: {
    flex: 1,
    maxWidth: "500px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },



  // 🔥 RIGHT SIDE
  right: {
    display: "flex",
    gap: "15px"
  },



  // 🛒 CART BUTTON
  cartBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#6c63ff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // 🔐 LOGIN BUTTON
  loginBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "green",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // 🔓 LOGOUT BUTTON
  logoutBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "crimson",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  }

};

export default Navbar;