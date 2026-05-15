import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Cart({ cart, setCart }) {

  // 🔥 NAVIGATION
  const navigate = useNavigate();

  // 🔐 PROTECT PAGE
  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
    }

  }, [navigate]);



  // 🔥 INCREASE QUANTITY
  const increaseQty = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          quantity: item.quantity + 1
        };

      }

      return item;
    });

    setCart(updatedCart);
  };



  // 🔥 DECREASE QUANTITY
  const decreaseQty = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          quantity:
            item.quantity > 1
              ? item.quantity - 1
              : 1
        };

      }

      return item;
    });

    setCart(updatedCart);
  };



  // ❌ REMOVE PRODUCT
  const removeItem = (id) => {

    const filteredCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(filteredCart);
  };



  // 💰 TOTAL PRICE
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );



  return (
    <div style={styles.container}>

      {/* 🔥 TITLE */}
      <h1 style={styles.heading}>
        Your Cart 🛒
      </h1>



      {/* ❌ EMPTY CART */}
      {cart.length === 0 ? (

        <div style={styles.emptyBox}>

          <h2>Cart is Empty 😢</h2>

          <button
            style={styles.shopBtn}
            onClick={() => navigate("/dashboard")}
          >
            Go Shopping
          </button>

        </div>

      ) : (

        <>
          {/* 🔥 CART ITEMS */}
          <div style={styles.cartContainer}>

            {cart.map((item) => (

              <div
                key={item.id}
                style={styles.card}
              >

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.image}
                />



                {/* DETAILS */}
                <div style={styles.details}>

                  <h2>{item.name}</h2>

                  <p style={styles.price}>
                    ₹ {item.price}
                  </p>



                  {/* QTY */}
                  <div style={styles.qtyContainer}>

                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        decreaseQty(item.id)
                      }
                    >
                      -
                    </button>

                    <span style={styles.qtyText}>
                      {item.quantity}
                    </span>

                    <button
                      style={styles.qtyBtn}
                      onClick={() =>
                        increaseQty(item.id)
                      }
                    >
                      +
                    </button>

                  </div>



                  {/* REMOVE */}
                  <button
                    style={styles.removeBtn}
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>



          {/* 💰 TOTAL SECTION */}
          <div style={styles.totalBox}>

            <h2>
              Total: ₹ {totalPrice}
            </h2>

            <button
              style={styles.checkoutBtn}
              onClick={() =>
                alert("Order Placed Successfully ✅")
              }
            >
              Checkout
            </button>

          </div>
        </>
      )}

    </div>
  );
}



// 🎨 STYLES
const styles = {

  container: {
    minHeight: "100vh",
    background: "#f4f4f4",
    padding: "30px"
  },



  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },



  cartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },



  card: {
    background: "#fff",
    display: "flex",
    gap: "20px",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    flexWrap: "wrap"
  },



  image: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px"
  },



  details: {
    flex: 1
  },



  price: {
    color: "#6c63ff",
    fontWeight: "bold"
  },



  qtyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    margin: "15px 0"
  },



  qtyBtn: {
    width: "35px",
    height: "35px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px"
  },



  qtyText: {
    fontWeight: "bold",
    fontSize: "18px"
  },



  removeBtn: {
    padding: "10px 18px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },



  totalBox: {
    marginTop: "40px",
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  checkoutBtn: {
    marginTop: "15px",
    padding: "12px 30px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },



  emptyBox: {
    textAlign: "center",
    marginTop: "100px"
  },



  shopBtn: {
    marginTop: "20px",
    padding: "12px 25px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer"
  }

};

export default Cart;