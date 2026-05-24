import {
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

function Navbar({
  cart,
  search,
  setSearch
}) {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate =
    useNavigate();

  // =====================================================
  // 🔥 USER DATA
  // =====================================================
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const isLoggedIn =
    localStorage.getItem(
      "isLoggedIn"
    );

  // =====================================================
  // 🔥 DROPDOWN
  // =====================================================
  const [showMenu, setShowMenu] =
    useState(false);

  // =====================================================
  // 🔥 TOTAL CART COUNT
  // =====================================================
  const totalItems =
    cart.reduce(

      (acc, item) =>

        acc + item.quantity,

      0

    );

  // =====================================================
  // 🔥 LOGOUT
  // =====================================================
  const logout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");

  };

  return (

    <div style={styles.navbar}>

      {/* LOGO */}
      <h2
        style={styles.logo}
        onClick={() =>
          navigate("/")
        }
      >
        ShopEase 🛍️
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={styles.search}
      />

      {/* RIGHT */}
      <div style={styles.right}>

        {/* CART */}
        <div
          style={styles.cartWrapper}
          onClick={() =>
            navigate("/cart")
          }
        >

          🛒

          <span style={styles.badge}>
            {totalItems}
          </span>

        </div>

        {/* LOGIN */}
        {!isLoggedIn ? (

          <button
            style={styles.loginBtn}
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        ) : (

          <div
            style={styles.profileWrapper}
          >

            {/* PROFILE ICON */}
            <div
              style={styles.profile}
              onClick={() =>
                setShowMenu(
                  !showMenu
                )
              }
            >

              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            {/* DROPDOWN */}
            {showMenu && (

              <div
                style={styles.dropdown}
              >

                <p
                  style={styles.userName}
                >
                  {user?.name}
                </p>

                <button
                  style={
                    styles.menuBtn
                  }
                  onClick={() =>
                    navigate("/cart")
                  }
                >
                  My Cart
                </button>

                <button
                  style={
                    styles.menuBtn
                  }
                >
                  Orders
                </button>

                <button
                  style={
                    styles.logoutBtn
                  }
                  onClick={logout}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}

const styles = {

  navbar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#111827",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 999,
    gap: "20px",
    flexWrap: "wrap"
  },

  logo: {
    cursor: "pointer",
    fontSize: "28px"
  },

  search: {
    flex: 1,
    maxWidth: "550px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },

  cartWrapper: {
    position: "relative",
    fontSize: "28px",
    cursor: "pointer"
  },

  badge: {
    position: "absolute",
    top: "-10px",
    right: "-12px",
    background: "crimson",
    color: "#fff",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold"
  },

  loginBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#6c63ff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  profileWrapper: {
    position: "relative"
  },

  profile: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#6c63ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px"
  },

  dropdown: {
    position: "absolute",
    top: "60px",
    right: 0,
    background: "#fff",
    color: "#111",
    width: "220px",
    borderRadius: "12px",
    padding: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.2)"
  },

  userName: {
    fontWeight: "bold",
    marginBottom: "15px"
  },

  menuBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    background: "#f3f4f6",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  logoutBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  }

};

export default Navbar;