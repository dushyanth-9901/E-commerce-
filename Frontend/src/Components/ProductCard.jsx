import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const reviews =
    JSON.parse(
      localStorage.getItem(
        `reviews_${product.id}`
      )
    ) || [];

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, item) =>
              acc + Number(item.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  const addToCart = (e) => {
    e.stopPropagation();

    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const cartKey = `cart_${user.email}`;

    const oldCart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

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

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    alert("Added To Cart ✅");
  };

  const buyNow = (e) => {
    e.stopPropagation();

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(`/product/${product.id}`);
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        style={styles.image}
      />

      <h3>{product.name}</h3>

      {product.category && (
        <p style={styles.category}>
          Category: {product.category}
        </p>
      )}

      <p style={styles.stock}>
        Stock: {product.stock}
      </p>

      {averageRating ? (
        <p style={styles.rating}>
          ⭐ {averageRating} ({reviews.length})
        </p>
      ) : (
        <p style={styles.rating}>No ratings yet</p>
      )}

      <p style={styles.price}>₹ {product.price}</p>

      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.cartBtn,
            opacity: product.stock === 0 ? 0.6 : 1,
            cursor: product.stock === 0 ? "not-allowed" : "pointer"
          }}
          onClick={addToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
        </button>

        <button style={styles.buyBtn} onClick={buyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  price: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: "18px"
  },

  category: {
    color: "#4b5563",
    fontSize: "14px",
    margin: "6px 0 0"
  },

  stock: {
    color: "#16a34a",
    fontSize: "14px",
    margin: "6px 0 0"
  },

  rating: {
    color: "#d97706",
    fontSize: "14px",
    margin: "6px 0 0"
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  cartBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },

  buyBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default ProductCard;