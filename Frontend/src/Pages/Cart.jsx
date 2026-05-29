import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Cart({ cart, setCart }) {

  const navigate = useNavigate();

  // =====================================================
  // 🔥 GLOBAL USER + CART KEY (ONLY ONCE)
  // =====================================================
const user = JSON.parse(localStorage.getItem("user")) || null;
const cartKey = user?.email ? `cart_${user.email}` : "cart_guest";
const addressKey = user?.email
  ? `address_${user.email}`
  : "address_guest";
  // =====================================================
  // 🔥 LOAD CART ON PAGE LOAD
  // =====================================================
  useEffect(() => {
  if (!user?.email) return;

  const savedCart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  setCart(savedCart);

}, [cartKey]);

  // =====================================================
  // 🔥 ADDRESS STATE
  // =====================================================
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    state: "",
    district: "",
    taluk: "",
    village: "",
    pincode: "",
    addressLine: ""
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =====================================================
  // 🔥 LOAD SAVED ADDRESS (FIXED)
  // =====================================================
  useEffect(() => {

  const fetchAddress = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/users/address/${user.email}`
      );

      if (res.data) {

        setAddress({

          fullName: res.data.full_name || "",
          phone: res.data.phone || "",
          state: res.data.state || "",
          district: res.data.district || "",
          taluk: res.data.taluk || "",
          village: res.data.village || "",
          pincode: res.data.pincode || "",
          addressLine: res.data.address_line || ""

        });

      }

    } catch (error) {

      console.log(error);

    }

  };

  if (user?.email) {

    fetchAddress();

  }

}, []);

  // =====================================================
  // ❌ REMOVE PRODUCT
  // =====================================================
  const removeFromCart = (id) => {

    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );
  };

  // =====================================================
  // 💳 HANDLE PAYMENT
  // =====================================================
  const handlePayment = async (product) => {

    try {

      if (
        !address.fullName ||
        !address.phone ||
        !address.state ||
        !address.district ||
        !address.taluk ||
        !address.village ||
        !address.pincode ||
        !address.addressLine
      ) {
        alert("Please Fill Delivery Address");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: product.price * product.quantity
        }
      );

      const options = {
        key: "rzp_test_SsfWvZhtYI6dCX",
        amount: res.data.amount,
        currency: "INR",
        name: "ShopEase",
        description: product.name,
        order_id: res.data.id,

        handler: async function (response) {

          try {

            const user = JSON.parse(localStorage.getItem("user"));

           await axios.post(
            "http://localhost:5000/api/orders/save",
            {
              user_email: user.email,
              product_name: product.name,
              product_image: product.image,
              amount: product.price * product.quantity,

              payment_id: response.razorpay_payment_id,

              payment_method: "Razorpay",
              payment_status: "Paid",

              full_name: address.fullName,
              phone: address.phone,
              state: address.state,
              district: address.district,
              taluk: address.taluk,
              village: address.village,
              pincode: address.pincode,
              address_line: address.addressLine
            }
          );

            const updatedCart = cart.filter(
              (item) => item.id !== product.id
            );

            setCart(updatedCart);

            localStorage.setItem(
              cartKey,
              JSON.stringify(updatedCart)
            );

            alert("Payment Successful ✅");
            navigate("/success");

          } catch (error) {
            console.log(error);
            alert("Order Save Failed");
          }
        },

        theme: {
          color: "#111"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.log(error);
      alert("Payment Failed ❌");
    }
  };

  // =====================================================
  // 🔥 SAVE ADDRESS
  // =====================================================
  const saveAddressAndContinue = () => {

    if (
      !address.fullName ||
      !address.phone ||
      !address.state ||
      !address.district ||
      !address.taluk ||
      !address.village ||
      !address.pincode ||
      !address.addressLine
    ) {
      alert("Please Fill Delivery Address");
      return;
    }

    localStorage.setItem(
    addressKey,
    JSON.stringify(address)
     );

     axios.put(

  "http://localhost:5000/api/auth/save-address",

  {

    email: user.email,

    fullName: address.fullName,
    phone: address.phone,
    state: address.state,
    district: address.district,
    taluk: address.taluk,
    village: address.village,
    pincode: address.pincode,
    addressLine: address.addressLine

  }

);
    setShowAddressForm(false);
    handlePayment(selectedProduct);
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>My Cart 🛒</h1>
        {address.fullName && (

                  <div style={styles.savedAddressBox}>

                    <div>

                      <h3 style={styles.savedAddressTitle}>
                        Delivery Address
                      </h3>

                      <p style={styles.savedAddressText}>
                        {address.fullName},
                        {address.phone}
                      </p>

                      <p style={styles.savedAddressText}>
                        {address.addressLine},
                        {address.village},
                        {address.taluk},
                        {address.district},
                        {address.state}
                      </p>

                      <p style={styles.savedAddressText}>
                        Pincode: {address.pincode}
                      </p>

                    </div>

                    <button
                      style={styles.editAddressBtn}
                      onClick={() =>
                        setShowAddressForm(true)
                      }
                    >
                      Edit Address
                    </button>

                  </div>

                )}
      {cart.length === 0 ? (
        <h2>No Products In Cart</h2>
      ) : (
        cart.map((product) => (
          <div key={product.id} style={styles.card}>

            <img src={product.image} style={styles.image} />

            <div style={styles.details}>
              <h2 style={styles.productName}>
                {product.name}
              </h2>

              <p style={styles.productPrice}>
                ₹ {product.price}
              </p>

              <p style={styles.qtyText}>
                Quantity: {product.quantity}
              </p>
            </div>

            <div style={styles.buttons}>

              <button
                style={styles.buyBtn}
               onClick={() => {

                  // ✅ ADDRESS EXISTS
                  if (
                    address.fullName &&
                    address.phone &&
                    address.state &&
                    address.addressLine
                  ) {

                    handlePayment(product);

                  }

                  // ✅ NEW USER
                  else {

                    setSelectedProduct(product);

                    setShowAddressForm(true);

                  }

                }}
              >
                Buy Now
              </button>

              <button
                style={styles.removeBtn}
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>

            </div>

          </div>
        ))
      )}

  {/* ===================================================== */}
{/* 🔥 ADVANCED ADDRESS DRAWER */}
{/* ===================================================== */}

{showAddressForm && (

  <div style={styles.popupOverlay}>

    <div style={styles.popupBox}>

      {/* HEADER */}
      <div style={styles.topSection}>

        <div>

          <p style={styles.smallText}>
            Secure Checkout
          </p>

          <h2 style={styles.popupTitle}>
            Delivery Address
          </h2>

        </div>

        <button
          style={styles.closeBtn}
          onClick={() =>
            setShowAddressForm(false)
          }
        >
          ✕
        </button>

      </div>

      {/* CONTACT DETAILS */}
      <div style={styles.sectionTitle}>
        Contact Details
      </div>

      <input
        placeholder="Full Name"
        style={styles.input}
        value={address.fullName}
        onChange={(e) =>
          setAddress({
            ...address,
            fullName: e.target.value
          })
        }
      />

      <input
        placeholder="Phone Number"
        style={styles.input}
        value={address.phone}
        onChange={(e) =>
          setAddress({
            ...address,
            phone: e.target.value
          })
        }
      />

      {/* LOCATION DETAILS */}
      <div style={styles.sectionTitle}>
        Location Details
      </div>

      <input
        placeholder="State"
        style={styles.input}
        value={address.state}
        onChange={(e) =>
          setAddress({
            ...address,
            state: e.target.value
          })
        }
      />

      <input
        placeholder="District"
        style={styles.input}
        value={address.district}
        onChange={(e) =>
          setAddress({
            ...address,
            district: e.target.value
          })
        }
      />

      <input
        placeholder="Taluk"
        style={styles.input}
        value={address.taluk}
        onChange={(e) =>
          setAddress({
            ...address,
            taluk: e.target.value
          })
        }
      />

      <input
        placeholder="Village"
        style={styles.input}
        value={address.village}
        onChange={(e) =>
          setAddress({
            ...address,
            village: e.target.value
          })
        }
      />

      <input
        placeholder="Pincode"
        style={styles.input}
        value={address.pincode}
        onChange={(e) =>
          setAddress({
            ...address,
            pincode: e.target.value
          })
        }
      />

      {/* ADDRESS */}
      <div style={styles.sectionTitle}>
        Full Address
      </div>

      <textarea
        placeholder="House No, Street, Landmark..."
        style={styles.textarea}
        value={address.addressLine}
        onChange={(e) =>
          setAddress({
            ...address,
            addressLine: e.target.value
          })
        }
      />

      {/* BUTTON */}
      <button
        style={styles.saveBtn}
        onClick={saveAddressAndContinue}
      >
        Save & Continue
      </button>

    </div>

  </div>

)}

    </div>
  );
}

const styles = {
 container: {
  padding: "40px",
  background: "#f5f7fb",
  minHeight: "100vh"
},

heading: {
  fontSize: "38px",
  fontWeight: "800",
  marginBottom: "35px",
  color: "#111827"
},

card: {
  display: "flex",
  alignItems: "center",
  gap: "25px",

  background: "#fff",

  padding: "25px",

  borderRadius: "24px",

  marginBottom: "25px",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",

  transition: "0.3s",

  border: "1px solid #f1f5f9"
},

image: {
  width: "140px",
  height: "140px",
  objectFit: "cover",

  borderRadius: "18px",

  background: "#f9fafb",

  padding: "10px"
},

details: {
  flex: 1,

  display: "flex",
  flexDirection: "column",
  gap: "10px"
},

productName: {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827"
},

productPrice: {
  fontSize: "22px",
  fontWeight: "700",
  color: "#6c63ff"
},

qtyText: {
  color: "#6b7280",
  fontSize: "15px",
  fontWeight: "500"
},

buttons: {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
},

buyBtn: {
  padding: "14px 26px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#111827,#374151)",

  color: "#fff",

  fontWeight: "700",

  cursor: "pointer",

  minWidth: "140px",

  fontSize: "15px"
},

removeBtn: {
  padding: "14px 26px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#ef4444,#dc2626)",

  color: "#fff",

  fontWeight: "700",

  cursor: "pointer",

  fontSize: "15px"
},

emptyCart: {
  textAlign: "center",
  marginTop: "120px",
  fontSize: "28px",
  fontWeight: "700",
  color: "#6b7280"
},
popupOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 999
},

popupBox: {
  width: "480px",
  height: "100%",
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(20px)",
  padding: "35px",
  overflowY: "auto",
  boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "16px"
},

topSection: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
},

smallText: {
  color: "#6b7280",
  fontSize: "13px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: "5px"
},

popupTitle: {
  fontSize: "32px",
  fontWeight: "800",
  color: "#111827"
},

sectionTitle: {
  marginTop: "10px",
  marginBottom: "2px",
  fontWeight: "700",
  color: "#374151",
  fontSize: "15px"
},

closeBtn: {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "none",
  background: "#f3f4f6",
  cursor: "pointer",
  fontSize: "18px"
},

input: {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
  boxSizing: "border-box"
},

textarea: {
  width: "100%",
  minHeight: "120px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
  resize: "none",
  background: "#fff",
  boxSizing: "border-box"
},

saveBtn: {
  marginTop: "20px",
  padding: "18px",
  border: "none",
  borderRadius: "18px",
  background:
    "linear-gradient(135deg,#111827,#374151)",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(17,24,39,0.25)"
},
savedAddressBox: {
  background: "#fff",
  padding: "25px",
  borderRadius: "24px",
  marginBottom: "30px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",

  flexWrap: "wrap",
  gap: "20px"
},

savedAddressTitle: {
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "10px",
  color: "#111827"
},

savedAddressText: {
  color: "#6b7280",
  lineHeight: "1.8"
},

editAddressBtn: {
  padding: "14px 24px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#111827,#374151)",

  color: "#fff",

  cursor: "pointer",

  fontWeight: "700"
},

};

export default Cart;