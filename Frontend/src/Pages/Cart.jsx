import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

function Cart({
  cart,
  setCart
}) {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate =
    useNavigate();

  // =====================================================
  // 🔥 DELIVERY FORM
  // =====================================================
  const [form, setForm] =
    useState({

      name: "",
      phone: "",
      state: "",
      district: "",
      village: "",
      pincode: "",
      address: ""

    });

  // =====================================================
  // 🔥 REMOVE ITEM
  // =====================================================
  const removeFromCart = (id) => {

    const updatedCart =
      cart.filter(
        (item) =>
          item.id !== id
      );

    setCart(updatedCart);

  };

  // =====================================================
  // 🔥 QUANTITY +
  // =====================================================
  const increaseQty = (id) => {

    const updatedCart =
      cart.map((item) =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1
            }

          : item

      );

    setCart(updatedCart);

  };

  // =====================================================
  // 🔥 QUANTITY -
  // =====================================================
  const decreaseQty = (id) => {

    const updatedCart =
      cart.map((item) =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1
            }

          : item

      );

    setCart(updatedCart);

  };

  // =====================================================
  // 🔥 TOTAL
  // =====================================================
  const subtotal =
    cart.reduce(

      (acc, item) =>

        acc +
        item.price *
        item.quantity,

      0

    );

  const shipping = 99;

  const total =
    subtotal + shipping;

  // =====================================================
  // 🔥 HANDLE PAYMENT
  // =====================================================
  const handlePayment =
    async () => {

      try {

        // VALIDATION
        if (

          !form.name ||
          !form.phone ||
          !form.state ||
          !form.district ||
          !form.village ||
          !form.pincode ||
          !form.address

        ) {

          alert(
            "Please Fill Delivery Details"
          );

          return;

        }

        // CREATE ORDER
        const res =
          await axios.post(

            "http://localhost:5000/api/payment/create-order",

            {
              amount: total
            }

          );

        // RAZORPAY
        const options = {

          key:
            "rzp_test_SsfWvZhtYI6dCX",

          amount:
            res.data.amount,

          currency:
            "INR",

          name:
            "ShopEase",

          description:
            "Order Payment",

          order_id:
            res.data.id,

          handler:
            function (response) {

              // SAVE ORDER
              const oldOrders =
                JSON.parse(

                  localStorage.getItem(
                    "orders"
                  )

                ) || [];

              oldOrders.push({

                items: cart,

                total,

                paymentId:
                  response.razorpay_payment_id,

                delivery:
                  form

              });

              localStorage.setItem(

                "orders",

                JSON.stringify(
                  oldOrders
                )

              );

              // CLEAR CART
              setCart([]);

              // SUCCESS
              alert(
                "Payment Successful ✅"
              );

              navigate("/success");

            },

          theme: {
            color: "#6c63ff"
          }

        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.log(error);

        alert(
          "Payment Failed ❌"
        );

      }

    };

  return (

    <div style={styles.container}>

      {/* LEFT */}
      <div style={styles.left}>

        <h1 style={styles.heading}>
          Shopping Cart 🛒
        </h1>

        {/* EMPTY */}
        {cart.length === 0 ? (

          <div style={styles.empty}>

            <h2>
              Cart Is Empty 😢
            </h2>

            <button
              style={styles.shopBtn}
              onClick={() =>
                navigate("/")
              }
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          cart.map((item) => (

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
              <div style={styles.info}>

                <h2>
                  {item.name}
                </h2>

                <p style={styles.desc}>
                  Premium quality
                  ecommerce product.
                </p>

                <h3>
                  ₹ {item.price}
                </h3>

                {/* QUANTITY */}
                <div
                  style={
                    styles.qtyBox
                  }
                >

                  <button
                    style={
                      styles.qtyBtn
                    }
                    onClick={() =>
                      decreaseQty(
                        item.id
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {
                      item.quantity
                    }
                  </span>

                  <button
                    style={
                      styles.qtyBtn
                    }
                    onClick={() =>
                      increaseQty(
                        item.id
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* REMOVE */}
              <button
                style={
                  styles.removeBtn
                }
                onClick={() =>
                  removeFromCart(
                    item.id
                  )
                }
              >
                Remove
              </button>

            </div>

          ))

        )}

      </div>

      {/* RIGHT */}
      <div style={styles.right}>

        <h2>
          Delivery Details
        </h2>

        {/* FORM */}
        <input
          type="text"
          placeholder="Full Name"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              name:
                e.target.value

            })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              phone:
                e.target.value

            })
          }
        />

        <input
          type="text"
          placeholder="State"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              state:
                e.target.value

            })
          }
        />

        <input
          type="text"
          placeholder="District"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              district:
                e.target.value

            })
          }
        />

        <input
          type="text"
          placeholder="Village / City"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              village:
                e.target.value

            })
          }
        />

        <input
          type="text"
          placeholder="Pincode"
          style={styles.input}
          onChange={(e) =>
            setForm({

              ...form,
              pincode:
                e.target.value

            })
          }
        />

        <textarea
          placeholder="Full Address"
          style={styles.textarea}
          onChange={(e) =>
            setForm({

              ...form,
              address:
                e.target.value

            })
          }
        />

        {/* SUMMARY */}
        <div style={styles.summary}>

          <h2>
            Order Summary
          </h2>

          <p>
            Subtotal:
            ₹ {subtotal}
          </p>

          <p>
            Shipping:
            ₹ {shipping}
          </p>

          <h2>
            Total:
            ₹ {total}
          </h2>

        </div>

        {/* PAYMENT */}
        <button
          style={styles.payBtn}
          onClick={handlePayment}
        >
          Proceed To Payment
        </button>

      </div>

    </div>

  );

}

const styles = {

  container: {
    display: "flex",
    gap: "30px",
    padding: "30px",
    background: "#f5f5f5",
    minHeight: "100vh",
    flexWrap: "wrap"
  },

  left: {
    flex: 2
  },

  right: {
    flex: 1,
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    height: "fit-content"
  },

  heading: {
    marginBottom: "25px"
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px"
  },

  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  info: {
    flex: 1
  },

  desc: {
    color: "#666",
    margin: "10px 0"
  },

  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "15px"
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

  removeBtn: {
    padding: "10px 15px",
    background: "crimson",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  textarea: {
    width: "100%",
    height: "100px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "20px"
  },

  summary: {
    marginTop: "20px",
    lineHeight: "2"
  },

  payBtn: {
    width: "100%",
    padding: "14px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "20px",
    fontWeight: "bold"
  },

  empty: {
    background: "#fff",
    padding: "50px",
    textAlign: "center",
    borderRadius: "15px"
  },

  shopBtn: {
    padding: "12px 20px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer"
  }

};

export default Cart;