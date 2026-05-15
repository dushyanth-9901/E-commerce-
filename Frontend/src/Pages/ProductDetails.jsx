import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import products from "../data/products";

function ProductDetails({ cart, setCart }) {

  // 🔥 GET PRODUCT ID
  const { id } = useParams();

  // 🔥 NAVIGATION
  const navigate = useNavigate();

  // 🔥 QUANTITY
  const [qty, setQty] = useState(1);

  // 🔐 PROTECT PAGE
  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
    }

  }, [navigate]);



  // 🔥 FIND PRODUCT
  const product = products.find(
    (p) => p.id === Number(id)
  );



  // ❌ PRODUCT NOT FOUND
  if (!product) {
    return (
      <h2 style={{ padding: "20px" }}>
        Product Not Found
      </h2>
    );
  }



  // 🛒 ADD TO CART
  const addToCart = () => {

    const existing = cart.find(
      (item) => item.id === product.id
    );

    // 🔥 IF PRODUCT ALREADY EXISTS
    if (existing) {

      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + qty
            }
          : item
      );

      setCart(updatedCart);

    } else {

      // 🔥 NEW PRODUCT
      setCart([
        ...cart,
        {
          ...product,
          quantity: qty
        }
      ]);
    }

    alert("Added To Cart ✅");
  };



  // ⚡ BUY NOW
  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };



  return (
    <div style={styles.container}>

      {/* LEFT SIDE IMAGE */}
      <div style={styles.imageBox}>

        <img
          src={product.image}
          alt={product.name}
          style={styles.image}
        />

      </div>



      {/* RIGHT SIDE DETAILS */}
      <div style={styles.details}>

        {/* PRODUCT NAME */}
        <h1>{product.name}</h1>

        {/* DESCRIPTION */}
        <p style={styles.description}>
          {product.description}
        </p>

        {/* PRICE */}
        <h2 style={styles.price}>
          ₹ {product.price}
        </h2>



        {/* QUANTITY */}
        <div style={styles.qtyContainer}>

          <button
            style={styles.qtyBtn}
            onClick={() =>
              setQty(qty > 1 ? qty - 1 : 1)
            }
          >
            -
          </button>

          <span style={styles.qtyText}>
            {qty}
          </span>

          <button
            style={styles.qtyBtn}
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>

        </div>



        {/* BUTTONS */}
        <div style={styles.buttonContainer}>

          <button
            style={styles.cartBtn}
            onClick={addToCart}
          >
            Add To Cart
          </button>

          <button
            style={styles.buyBtn}
            onClick={buyNow}
          >
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}



const styles = {

  container: {
    display: "flex",
    gap: "40px",
    padding: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f4f4"
  },



  imageBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  image: {
    width: "350px",
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px"
  },



  details: {
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  description: {
    color: "#555",
    lineHeight: "1.6"
  },



  price: {
    color: "#6c63ff",
    margin: "20px 0"
  },



  qtyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px"
  },



  qtyBtn: {
    width: "40px",
    height: "40px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    fontSize: "20px",
    borderRadius: "8px",
    cursor: "pointer"
  },



  qtyText: {
    fontSize: "20px",
    fontWeight: "bold"
  },



  buttonContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },



  cartBtn: {
    padding: "12px 25px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },



  buyBtn: {
    padding: "12px 25px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  }

};

export default ProductDetails;