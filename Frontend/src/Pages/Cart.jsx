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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [checkoutType, setCheckoutType] = useState("single");
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const calculateBaseAmount = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateFinalAmount = (amount) =>
    Math.round(amount - (amount * couponDiscount) / 100);

  const saveOrderItem = async (product, paymentInfo) => {
    try {
      if (!product.id) {
        throw new Error("Product ID is missing");
      }

      const response = await axios.post("http://localhost:5000/api/orders/save", {
        product_id: product.id,
        quantity: product.quantity,
        user_email: user.email,
        product_name: product.name,
        product_image: product.image,
        amount: paymentInfo.amount,
        base_amount: product.price * product.quantity,
        discount: couponDiscount,
        coupon_code: couponApplied ? couponCode : null,
        payment_id: paymentInfo.payment_id || null,
        payment_method: paymentInfo.payment_method,
        payment_status: paymentInfo.payment_status,
        full_name: address.fullName,
        phone: address.phone,
        state: address.state,
        district: address.district,
        taluk: address.taluk,
        village: address.village,
        pincode: address.pincode,
        address_line: address.addressLine
      });

      if (!response.data) {
        throw new Error("No response from server");
      }

      // Reduce stock after successful order save
      await axios.put(
        `http://localhost:5000/api/products/reduce-stock/${product.id}`,
        {
          quantity: product.quantity
        }
      );

      return response.data;
    } catch (error) {
      console.error("Order save error:", error.response?.data || error.message);
      throw error;
    }
  };

  const saveAllOrders = async (items, paymentInfo) => {
    const errors = [];
    for (const product of items) {
      try {
        await saveOrderItem(product, {
          ...paymentInfo,
          amount: calculateFinalAmount(product.price * product.quantity)
        });
      } catch (error) {
        errors.push(`${product.name}: ${error.message}`);
        console.error(`Failed to save order for ${product.name}:`, error);
      }
    }
    
    if (errors.length > 0) {
      const errorMsg = errors.join("; ");
      throw new Error(`Order save failed for: ${errorMsg}`);
    }
  };

  const handleCODPayment = async (items) => {
    setIsProcessing(true);

    try {
      await saveAllOrders(items, {
        payment_id: null,
        payment_method: "Cash on Delivery",
        payment_status: "Pending"
      });

      const updatedCart = cart.filter((item) => !items.some((product) => product.id === item.id));
      setCart(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      setShowSuccessPopup(true);
      setShowCouponModal(false);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (error) {
      console.error("COD Payment Error:", error);
      alert(`Order Save Failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (items) => {
    if (paymentMethod === "Cash on Delivery") {
      return handleCODPayment(items);
    }

    setIsProcessing(true);

    try {
      const amount = calculateFinalAmount(calculateBaseAmount(items));
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount
      });

      const options = {
        key: "rzp_test_SsfWvZhtYI6dCX",
        amount: res.data.amount,
        currency: "INR",
        name: "ShopEase",
        description: checkoutType === "cart" ? "Cart Checkout" : items[0]?.name,
        order_id: res.data.id,
        handler: async function (response) {
          try {
            await saveAllOrders(items, {
              payment_id: response.razorpay_payment_id,
              payment_method: "Razorpay",
              payment_status: "Paid"
            });

            const updatedCart = cart.filter((item) => !items.some((product) => product.id === item.id));
            setCart(updatedCart);
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setShowSuccessPopup(true);
            setShowCouponModal(false);

            setTimeout(() => {
              navigate("/dashboard");
            }, 2500);
          } catch (error) {
            console.error("Razorpay Handler Error:", error);
            alert(`Order Save Failed: ${error.message}`);
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
    } finally {
      setIsProcessing(false);
    }
  };

  const openCheckout = (product, type) => {
    setCheckoutType(type);
    setSelectedProduct(product || null);
    setPaymentMethod("Razorpay");
    setShowCouponModal(true);
  };

  const openSavedAddressCheckout = () => {
    setCheckoutType("cart");
    setSelectedProduct(null);
    setPaymentMethod("Razorpay");
    setShowCouponModal(true);
  };

  const currentItems = checkoutType === "cart" ? cart : selectedProduct ? [selectedProduct] : [];

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
  // 🎟️ APPLY COUPON
  // =====================================================
  const applyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }

    const validCoupons = {
      "SAVE10": 10,
      "SAVE20": 20,
      "WELCOME": 15,
      "FLAT50": 50,
      "SUMMER25": 25,
      "HOLIDAY30": 30,
      "FESTIVE40": 40,
      "NEWUSER": 18,
      "FLASH": 35
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setCouponDiscount(validCoupons[couponCode.toUpperCase()]);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponError("");
  };

  // =====================================================
  // 💳 HANDLE PAYMENT
  // =====================================================
  // =====================================================
  // 🔥 SAVE ADDRESS
  // =====================================================
  const saveAddressAndContinue = async () => {
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

    localStorage.setItem(addressKey, JSON.stringify(address));

    try {
      await axios.put("http://localhost:5000/api/auth/save-address", {
        email: user.email,
        fullName: address.fullName,
        phone: address.phone,
        state: address.state,
        district: address.district,
        taluk: address.taluk,
        village: address.village,
        pincode: address.pincode,
        addressLine: address.addressLine
      });
    } catch (error) {
      console.log(error);
      alert("Unable to save address. Please try again.");
      return;
    }

    setShowAddressForm(false);

    const itemsToBuy = checkoutType === "cart" ? cart : [selectedProduct];
    processPayment(itemsToBuy);
  };

  // =====================================================
  // UI
  // =====================================================
  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>My Cart 🛒</h1>

      {cart.length > 0 && (
        <div style={styles.cartTopBar}>
          <div>
            <p style={styles.cartSummaryText}>
              Total Items: {cart.length}
            </p>
            <p style={styles.cartSummaryText}>
              Total Amount: ₹{calculateFinalAmount(calculateBaseAmount(cart))}
            </p>
          </div>
          <button
            style={styles.checkoutBtn}
            disabled={isProcessing || cart.length === 0}
            onClick={() => {
              if (
                address.fullName &&
                address.phone &&
                address.state &&
                address.addressLine
              ) {
                openCheckout(null, "cart");
              } else {
                setCheckoutType("cart");
                setShowAddressForm(true);
              }
            }}
          >
            Checkout Cart
          </button>
        </div>
      )}

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

                    <div style={styles.savedAddressActions}>
                      <button
                        style={styles.addressActionBtn}
                        onClick={() =>
                          setShowAddressForm(true)
                        }
                      >
                        Edit Address
                      </button>
                      <button
                        style={styles.proceedAddressBtn}
                        onClick={openSavedAddressCheckout}
                      >
                        Proceed with this Address
                      </button>
                    </div>
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

              {couponApplied && (
                <p style={{ color: "#10b981", fontSize: "14px", fontWeight: "600" }}>
                  ✅ {couponDiscount}% Discount Applied
                </p>
              )}

              <p style={styles.qtyText}>
                Quantity: {product.quantity}
              </p>

              <p style={{ color: product.stock <= 5 ? "red" : "green" }}>
                Stock Left: {product.stock}
              </p>

            </div>

            <div style={styles.buttons}>

                        <button
              style={{
                ...styles.buyBtn,
                opacity: product.stock === 0 ? 0.5 : 1,
                cursor: product.stock === 0 ? "not-allowed" : "pointer"
              }}
              disabled={product.stock === 0}
              onClick={() => {
                if (product.stock === 0) return; // extra safety

                const hasAddress =
                  address.fullName &&
                  address.phone &&
                  address.state &&
                  address.addressLine;

                if (hasAddress) {
                  openCheckout(product, "single");
                } else {
                  setCheckoutType("single");
                  setSelectedProduct(product);
                  setShowAddressForm(true);
                }

              }}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
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

      {/* COUPON */}
      <div style={styles.sectionTitle}>
        Coupon Code (Optional)
      </div>

      {!couponApplied ? (
        <div style={styles.couponContainer}>
          <input
            placeholder="e.g., SAVE10, WELCOME"
            style={styles.couponInput}
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponError("");
            }}
          />
          <button
            style={styles.couponBtn}
            onClick={applyCoupon}
          >
            Apply
          </button>
        </div>
      ) : (
        <div style={styles.couponApplied}>
          <p>✅ {couponCode} applied ({couponDiscount}% off)</p>
          <button
            style={styles.removeCouponBtn}
            onClick={removeCoupon}
          >
            Remove
          </button>
        </div>
      )}

      {couponError && (
        <p style={{ color: "red", fontSize: "12px" }}>
          {couponError}
        </p>
      )}

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

      {/* ===================================================== */}
      {/* 🎟️ COUPON MODAL (BEFORE PAYMENT) */}
      {/* ===================================================== */}
      {showCouponModal && (
        <div style={styles.popupOverlay}>
          <div style={styles.couponModalBox}>
            {/* HEADER */}
            <div style={styles.topSection}>
              <div>
                <p style={styles.smallText}>
                  Step 2: Review Order & Payment
                </p>
                <h2 style={styles.popupTitle}>
                  Checkout Details
                </h2>
              </div>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowCouponModal(false);
                  setCouponCode("");
                  setCouponDiscount(0);
                  setCouponApplied(false);
                  setCouponError("");
                }}
              >
                ✕
              </button>
            </div>

            {/* ORDER SUMMARY */}
            <div style={styles.summaryBox}>
              <h3 style={{ marginBottom: "12px" }}>Order Summary</h3>
              {checkoutType === "cart" ? (
                <>
                  <p style={styles.summaryText}>
                    Items: {currentItems.length}
                  </p>
                  <p style={styles.summaryText}>
                    Subtotal: ₹{calculateBaseAmount(currentItems)}
                  </p>
                </>
              ) : (
                <>
                  <p style={styles.summaryText}>
                    Product: {selectedProduct?.name}
                  </p>
                  <p style={styles.summaryText}>
                    Price: ₹{selectedProduct?.price}
                  </p>
                  <p style={styles.summaryText}>
                    Quantity: {selectedProduct?.quantity}
                  </p>
                  <p
                    style={{
                      ...styles.summaryText,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                      marginTop: "8px"
                    }}
                  >
                    Subtotal: ₹{selectedProduct?.price * selectedProduct?.quantity}
                  </p>
                </>
              )}
            </div>

            <div style={{ marginTop: "20px" }}>
              <div style={styles.sectionTitle}>Payment Method</div>
              <label style={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                />
                Razorpay
              </label>
              <label style={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={() => setPaymentMethod("Cash on Delivery")}
                />
                Cash on Delivery
              </label>
            </div>

            {/* COUPON INPUT */}
            <div style={styles.sectionTitle}>
              Enter Coupon Code (Optional)
            </div>

            {!couponApplied ? (
              <div style={styles.couponContainer}>
                <input
                  placeholder="e.g., SAVE10, WELCOME"
                  style={styles.couponInput}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                />
                <button
                  style={styles.couponBtn}
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>
            ) : (
              <div style={styles.couponApplied}>
                <div>
                  <p style={{ margin: 0, fontWeight: "700" }}>
                    ✅ {couponCode} applied
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
                    {couponDiscount}% discount
                  </p>
                </div>
                <button
                  style={styles.removeCouponBtn}
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <p style={{ color: "red", fontSize: "12px", margin: "8px 0" }}>
                {couponError}
              </p>
            )}

            {/* DISCOUNT PREVIEW */}
            {couponApplied && (
              <div style={styles.discountPreview}>
                <p>Base: ₹{calculateBaseAmount(currentItems)}</p>
                <p>
                  Discount: -₹{Math.round(calculateBaseAmount(currentItems) * couponDiscount / 100)}
                </p>
                <p style={{ fontWeight: "700", color: "#10b981" }}>
                  Total: ₹{calculateFinalAmount(calculateBaseAmount(currentItems))}
                </p>
              </div>
            )}

            {/* BUTTONS */}
            <div style={styles.buttonGroup}>
              <button
                style={styles.skipBtn}
                disabled={isProcessing}
                onClick={() => {
                  setShowCouponModal(false);
                  removeCoupon();
                  processPayment(currentItems);
                }}
              >
                {paymentMethod === "Cash on Delivery" ? "Place Order" : "Pay Without Coupon"}
              </button>
              <button
                style={styles.proceedBtn}
                disabled={isProcessing}
                onClick={() => processPayment(currentItems)}
              >
                {paymentMethod === "Cash on Delivery"
                  ? "Confirm COD Order"
                  : couponApplied
                  ? "Proceed with Discount ✅"
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {showSuccessPopup && (

        <div style={styles.popupOverlay}>

          <div style={styles.successPopup}>

            <h2>🎉 Order Placed Successfully</h2>

            <p>
              Thank you for ordering with ShopEase.
            </p>

            <button
              onClick={() =>
                setShowSuccessPopup(false)
              }
            >
              OK
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
  savedAddressActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  addressActionBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "14px",
    background: "#6b7280",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700"
  },
  proceedAddressBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "14px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700"
  },
  cartTopBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap"
  },
  cartSummaryText: {
    fontSize: "16px",
    color: "#4b5563",
    fontWeight: "600"
  },
  checkoutBtn: {
    padding: "14px 26px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#2563eb,#4338ca)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px"
  },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    color: "#374151",
    cursor: "pointer",
    fontSize: "15px"
  },

successOverlay: {

  position: "fixed",

  top: 0,
  left: 0,

  width: "100%",
  height: "100%",

  background:
    "rgba(0,0,0,0.45)",

  backdropFilter: "blur(6px)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 9999

},

successPopup: {

  background: "#fff",

  padding: "40px",

  borderRadius: "24px",

  textAlign: "center",

  minWidth: "400px",

  boxShadow:
    "0 20px 50px rgba(0,0,0,0.2)"

},

couponContainer: {
  display: "flex",
  gap: "12px",
  marginBottom: "10px"
},

couponInput: {
  flex: 1,
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "14px",
  background: "#fff"
},

couponBtn: {
  padding: "14px 24px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px"
},

couponApplied: {
  background: "#dbeafe",
  padding: "14px 16px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
},

removeCouponBtn: {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px"
},

couponModalBox: {
  width: "520px",
  background: "#fff",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "90vh",
  overflowY: "auto"
},

summaryBox: {
  background: "#f9fafb",
  padding: "18px 16px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb"
},

summaryText: {
  margin: "6px 0",
  color: "#374151",
  fontSize: "14px"
},

discountPreview: {
  background: "#f0fdf4",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #bbf7d0",
  fontSize: "14px",
  color: "#166534"
},

buttonGroup: {
  display: "flex",
  gap: "12px",
  marginTop: "16px"
},

skipBtn: {
  flex: 1,
  padding: "14px 20px",
  background: "#e5e7eb",
  color: "#374151",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px"
},

proceedBtn: {
  flex: 1,
  padding: "14px 20px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px"
}
};

export default Cart;