import { useNavigate } from "react-router-dom";

// 🔥 Product Card Component
function ProductCard({ product }) {

  const navigate = useNavigate();

  return (
    <div style={styles.card}>

      {/* 🔹 Product Image */}
      <img
        src={product.image}
        alt={product.name}
        style={styles.image}
      />

      {/* 🔹 Product Name */}
      <h3>{product.name}</h3>

      {/* 🔹 Product Price */}
      <p style={styles.price}>₹ {product.price}</p>

      {/* 🔹 Button */}
      <button
        style={styles.button}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        View Details
      </button>

    </div>
  );
}

const styles = {

  card: {
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: "0.3s"
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

  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "white",
    cursor: "pointer"
  }
};

export default ProductCard;