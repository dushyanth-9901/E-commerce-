import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState,
  useMemo
} from "react";

import axios from "axios";

function ProductDetails({ cart, setCart }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        const foundProduct = res.data.find(
          (item) => item.id === Number(id)
        );

        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const productImages = useMemo(() => {
    if (!product) return [];

    let extraImages = [];

    try {
      extraImages = JSON.parse(product.images || "[]");
    } catch {
      extraImages = [];
    }

    return [product.image, ...extraImages.filter(Boolean)];
  }, [product]);

  if (loading) {
    return <h1 style={styles.loading}>Loading Product...</h1>;
  }

  const addToCart = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }

    alert("Added To Cart ✅");
  };

  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };

  return (
    <div style={styles.container}>

      {/* LEFT IMAGE SECTION */}
      <div style={styles.imageGallery}>

        <div style={styles.mainImageBox}>
          <img
            src={selectedImage}
            alt={product.name}
            style={styles.mainImage}
          />
        </div>

        <div style={styles.thumbnailRow}>
          {productImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              style={{
                ...styles.thumbnail,
                border: selectedImage === img
                  ? "3px solid #6c63ff"
                  : "2px solid #ddd"
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>

        <h1 style={styles.title}>{product.name}</h1>

        <div style={styles.rating}>⭐⭐⭐⭐☆ (4.5)</div>

        <h2 style={styles.price}>₹ {product.price}</h2>

        <p style={styles.stock}>
          {product.stock > 0 ? "✅ In Stock" : "❌ Out Of Stock"}
        </p>

        <p style={styles.delivery}>🚚 Free Delivery By Tomorrow</p>

        <div style={styles.section}>
          <h3>Product Description</h3>
          <p style={styles.description}>
            {product.description ||
              "Premium quality product with modern design and excellent performance."}
          </p>
        </div>

        <div style={styles.section}>
          <h3>Features</h3>
          <ul style={styles.features}>
            <li>Premium Build Quality</li>
            <li>Long Lasting Performance</li>
            <li>Stylish Design</li>
            <li>Best Seller Product</li>
          </ul>
        </div>

        <div style={styles.qtyContainer}>
          <button
            style={styles.qtyBtn}
            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
          >
            −
          </button>

          <span style={styles.qtyText}>{qty}</span>

          <button
            style={styles.qtyBtn}
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>

        <div style={styles.buttons}>
          <button style={styles.cartBtn} onClick={addToCart}>
            Add To Cart
          </button>

          <button style={styles.buyBtn} onClick={buyNow}>
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {

  container: {
    display: "flex",
    gap: "40px",
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
    flexWrap: "wrap"
  },

  imageGallery: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center"
  },

  mainImageBox: {
    width: "360px",
    height: "360px",
    background: "#fff",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px"
  },

  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "10px"
  },

  thumbnailRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  thumbnail: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer"
  },

  right: {
    flex: 1,
    background: "#fff",
    padding: "30px",
    borderRadius: "15px"
  },

  title: { fontSize: "35px", marginBottom: "10px" },
  rating: { color: "#f59e0b", fontSize: "18px", marginBottom: "20px" },
  price: { color: "#6c63ff", marginBottom: "15px" },
  stock: { color: "green", fontWeight: "bold" },
  delivery: { marginTop: "10px", color: "#444" },

  section: { marginTop: "30px" },
  description: { color: "#555", lineHeight: "1.8" },
  features: { lineHeight: "2" },

  qtyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px"
  },

  qtyBtn: {
    width: "40px",
    height: "40px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px"
  },

  qtyText: { fontSize: "22px", fontWeight: "bold" },

  buttons: {
    display: "flex",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap"
  },

  cartBtn: {
    padding: "14px 30px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  buyBtn: {
    padding: "14px 30px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  loading: {
    textAlign: "center",
    marginTop: "100px"
  }
};

export default ProductDetails;