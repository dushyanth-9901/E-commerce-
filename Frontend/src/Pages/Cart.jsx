// 📁 src/pages/Cart.jsx

// =====================================================
// 🔥 IMPORTS
// =====================================================
import axios from "axios";
import { useNavigate } from "react-router-dom";





function Cart({ cart, setCart }) {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();





  // =====================================================
  // ❌ REMOVE PRODUCT
  // =====================================================
  const removeFromCart = (id) => {

    const updatedCart =
      cart.filter((item) => item.id !== id);

    setCart(updatedCart);

  };






  // =====================================================
  // 💳 HANDLE PAYMENT
  // =====================================================
  const handlePayment = async (product) => {

    try {

      // =====================================================
      // 🔥 CREATE ORDER
      // =====================================================
      const res = await axios.post(

        "http://localhost:5000/api/payment/create-order",

        {
          amount: product.price
        }

      );



      // =====================================================
      // 🔥 RAZORPAY OPTIONS
      // =====================================================
      const options = {

        key: "rzp_test_SsfWvZhtYI6dCX",

        amount: res.data.amount,

        currency: "INR",

        name: "My E-commerce",

        description: product.name,

        order_id: res.data.id,



        // =====================================================
        // ✅ PAYMENT SUCCESS
        // =====================================================
        handler: function () {

          alert("Payment Successful ✅");

        },



        // =====================================================
        // 🎨 THEME
        // =====================================================
        theme: {
          color: "#111"
        }

      };



      // =====================================================
      // 🔥 OPEN RAZORPAY
      // =====================================================
      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert("Payment Failed ❌");

    }

  };







  // =====================================================
  // 🎨 UI
  // =====================================================
  return (

    <div style={styles.container}>


      {/* =====================================================
          🔥 TITLE
      ===================================================== */}
      <h1 style={styles.title}>
        My Cart 🛒
      </h1>






      {/* =====================================================
          ❌ EMPTY CART
      ===================================================== */}
      {cart.length === 0 ? (

        <div style={styles.emptyBox}>

          <h2>
            Cart is Empty 😢
          </h2>

          <button
            style={styles.shopBtn}
            onClick={() => navigate("/home")}
          >
            Shop Now
          </button>

        </div>

      ) : (



        // =====================================================
        // 🔥 PRODUCTS
        // =====================================================
        <div style={styles.productsContainer}>

          {cart.map((product) => (

            <div
              key={product.id}
              style={styles.card}
            >

              {/* 🔥 IMAGE */}
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />



              {/* 🔥 NAME */}
              <h2>
                {product.name}
              </h2>



              {/* 🔥 PRICE */}
              <p style={styles.price}>
                ₹ {product.price}
              </p>






              {/* =====================================================
                  💳 BUY NOW
              ===================================================== */}
              <button
                style={styles.buyBtn}
                onClick={() =>
                  handlePayment(product)
                }
              >
                Buy Now
              </button>






              {/* =====================================================
                  ❌ REMOVE BUTTON
              ===================================================== */}
              <button
                style={styles.removeBtn}
                onClick={() =>
                  removeFromCart(product.id)
                }
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}









// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // 🔥 MAIN CONTAINER
  container: {
    padding: "30px",
    background: "#f4f4f4",
    minHeight: "100vh"
  },



  // 🔥 TITLE
  title: {
    textAlign: "center",
    marginBottom: "40px"
  },



  // 🔥 PRODUCTS GRID
  productsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px"
  },



  // 🔥 PRODUCT CARD
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },



  // 🔥 PRODUCT IMAGE
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px"
  },



  // 🔥 PRICE
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "15px 0"
  },



  // 💳 BUY BUTTON
  buyBtn: {
    width: "100%",
    padding: "12px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    fontWeight: "bold"
  },



  // ❌ REMOVE BUTTON
  removeBtn: {
    width: "100%",
    padding: "12px",
    background: "crimson",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // 🔥 EMPTY CART
  emptyBox: {
    textAlign: "center",
    marginTop: "100px"
  },



  // 🔥 SHOP BUTTON
  shopBtn: {
    padding: "12px 25px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px"
  }

};



// =====================================================
// 🔥 EXPORT
// =====================================================
export default Cart;