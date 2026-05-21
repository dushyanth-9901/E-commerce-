import { useNavigate } from "react-router-dom";

// 🔥 Product Card Component
function ProductCard({ product }) {

  const navigate = useNavigate();

  return (
            <div
          style={styles.card}
          onClick={() =>
            navigate(`/product/${product.id}`)
          }
        >

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

              <div style={styles.buttonContainer}>

          {/* 🛒 ADD TO CART */}
          <button
            style={styles.cartBtn}
            onClick={(e) => {

              // ❌ STOP CARD CLICK
              e.stopPropagation();

              const isLoggedIn =
                localStorage.getItem("isLoggedIn");

              // 🔐 LOGIN CHECK
              if (!isLoggedIn) {

                navigate("/login");

                return;

              }

              // 🔥 GET EXISTING CART
              const existingCart =
                JSON.parse(
                  localStorage.getItem("cart")
                ) || [];



              // 🔥 CHECK PRODUCT EXISTS
              const existingProduct =
                existingCart.find(
                  (item) =>
                    item.id === product.id
                );



              let updatedCart;

              // ✅ IF PRODUCT EXISTS
              if (existingProduct) {

                updatedCart = existingCart.map(
                  (item) =>

                    item.id === product.id

                      ? {
                          ...item,
                          quantity:
                            item.quantity + 1
                        }

                      : item
                );

              } else {

                updatedCart = [

                  ...existingCart,

                  {
                    ...product,
                    quantity: 1
                  }

                ];

              }



              // 🔥 SAVE CART
              localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
              );



              alert("Added To Cart ✅");

            }}
          >
            Add To Cart
          </button>



          {/* ⚡ BUY NOW */}
          <button
            style={styles.buyBtn}
            onClick={(e) => {

              // ❌ STOP CARD CLICK
              e.stopPropagation();

              const isLoggedIn =
                localStorage.getItem("isLoggedIn");

              // 🔐 LOGIN CHECK
              if (!isLoggedIn) {

                navigate("/login");

                return;

              }

              navigate(`/product/${product.id}`);

            }}
          >
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
  cursor: "pointer",
  fontWeight: "bold"
},

buyBtn: {
  flex: 1,
  padding: "10px",
  border: "none",
  background: "#111",
  color: "#fff",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
}
};

export default ProductCard;