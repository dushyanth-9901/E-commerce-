import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Wishlist({ cart, setCart }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const wishlistKey = user
    ? `wishlist_${user.email}`
    : "wishlist_guest";

  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(wishlistKey)) || [];
    setItems(stored);
  }, [wishlistKey]);

  const removeItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem(wishlistKey, JSON.stringify(updated));
  };

  const addToCart = (product) => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    const cartKey = userObj
      ? `cart_${userObj.email}`
      : "cart_guest";

    const existingCart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = existingCart.find(
      (item) => item.id === product.id
    );

    const updatedCart = existing
      ? existingCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    removeItem(product.id);
    alert("Added to cart from wishlist ✅");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>My Wishlist</h1>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>
          <h2>No items in wishlist yet.</h2>
          <p>Save products from the product page to see them here.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((product) => (
            <div key={product.id} style={styles.card}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
              <h3>{product.name}</h3>
              <p style={styles.price}>₹ {product.price}</p>
              {product.category && (
                <p style={styles.category}>{product.category}</p>
              )}
              <div style={styles.buttons}>
                <button
                  style={styles.addBtn}
                  onClick={() => addToCart(product)}
                >
                  Add To Cart
                </button>
                <button
                  style={styles.removeBtn}
                  onClick={() => removeItem(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f5f7fb"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  backBtn: {
    padding: "10px 18px",
    background: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },
  emptyBox: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px"
  },
  price: {
    fontWeight: "bold",
    margin: "12px 0 6px"
  },
  category: {
    color: "#6b7280",
    marginBottom: "16px"
  },
  buttons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  addBtn: {
    flex: 1,
    background: "#10b981",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer"
  },
  removeBtn: {
    flex: 1,
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer"
  }
};
