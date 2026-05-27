import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

function Cart({ cart, setCart }) {

  const navigate = useNavigate();



  // ============================================
  // 🔥 ADDRESS STATE
  // ============================================
  const [address, setAddress] =
    useState({

      fullName: "",
      phone: "",
      state: "",
      district: "",
      taluk: "",
      village: "",
      pincode: "",
      addressLine: ""

    });
const [showAddressForm, setShowAddressForm] =
  useState(false);

const [selectedProduct, setSelectedProduct] =
  useState(null);
    useState(() => {

  const savedAddress = JSON.parse(

    localStorage.getItem("deliveryAddress")

  );

  if (savedAddress) {

    setAddress(savedAddress);

  }

});

  // ============================================
  // ❌ REMOVE PRODUCT
  // ============================================
  const removeFromCart = (id) => {

    const updatedCart =
      cart.filter(
        (item) =>
          item.id !== id
      );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };



  // ============================================
  // 💳 HANDLE PAYMENT
  // ============================================
  const handlePayment = async (
  product
) => {

  try {

    // ============================================
    // 🔥 ADDRESS VALIDATION
    // ============================================
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

      alert(
        "Please Fill Delivery Address"
      );

      return;

    }

    // ============================================
    // 🔥 CREATE ORDER
    // ============================================
    const res = await axios.post(

      "http://localhost:5000/api/payment/create-order",

      {
        amount:
          product.price *
          product.quantity
      }

    );
        // ============================================
          // 🔥 ADDRESS VALIDATION
          // ============================================
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

            alert(
              "Please Fill Delivery Address"
            );

            return;

          }

      // ============================================
      // 🔥 RAZORPAY
      // ============================================
      const options = {

        key:
          "rzp_test_SsfWvZhtYI6dCX",

        amount:
          res.data.amount,

        currency: "INR",

        name: "ShopEase",

        description:
          product.name,

        order_id:
          res.data.id,



        // ============================================
        // ✅ SUCCESS
        // ============================================
        handler: async function (
          response
        ) {

          try {

            const user =
              JSON.parse(

                localStorage.getItem(
                  "user"
                )

              );



            // ============================================
            // 🔥 SAVE ORDER
            // ============================================
            await axios.post(

              "http://localhost:5000/api/orders/save",

              {

                user_email:
                  user.email,

                product_name:
                  product.name,

                amount:
                  product.price *
                  product.quantity,

                payment_id:
                  response.razorpay_payment_id,



                full_name:
                  address.fullName,

                phone:
                  address.phone,

                state:
                  address.state,

                district:
                  address.district,

                taluk:
                  address.taluk,

                village:
                  address.village,

                pincode:
                  address.pincode,

                address_line:
                  address.addressLine

              }

            );



            // ============================================
            // 🔥 REMOVE PRODUCT
            // ============================================
            const updatedCart =

              cart.filter(
                (item) =>
                  item.id !==
                  product.id
              );



            setCart(updatedCart);



            localStorage.setItem(

              "cart",

              JSON.stringify(
                updatedCart
              )

            );



            // ============================================
            // ✅ SUCCESS
            // ============================================
            alert(
              "Payment Successful ✅"
            );



            navigate("/success");

          } catch (error) {

            console.log(error);

            alert(
              "Order Save Failed"
            );

          }

        },



        // ============================================
        // 🎨 THEME
        // ============================================
        theme: {
          color: "#111"
        }

      };



      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert("Payment Failed ❌");

    }

  };
    // ============================================
// 🔥 SAVE ADDRESS
// ============================================
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

    alert(
      "Please Fill Delivery Address"
    );

    return;

  }

  // ============================================
  // 🔥 SAVE LOCAL STORAGE
  // ============================================
  localStorage.setItem(

    "deliveryAddress",

    JSON.stringify(address)

  );

  // ============================================
  // 🔥 CLOSE FORM
  // ============================================
  setShowAddressForm(false);

  // ============================================
  // 🔥 CONTINUE PAYMENT
  // ============================================
  handlePayment(selectedProduct);

};


  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>
        My Cart 🛒
      </h1>



      {cart.length === 0 ? (

        <h2>
          No Products In Cart
        </h2>

      ) : (

        cart.map((product) => (

          <div
            key={product.id}
            style={styles.card}
          >

            {/* IMAGE */}
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
            />



            {/* DETAILS */}
            <div style={styles.details}>

              <h2>
                {product.name}
              </h2>

              <p>
                ₹ {product.price}
              </p>

              <p>
                Qty:
                {" "}
                {product.quantity}
              </p>

            </div>



            {/* BUTTONS */}
            <div style={styles.buttons}>

              <button

              onClick={() => {

  // ============================================
  // 🔥 ADDRESS EXIST
  // ============================================
                if (

                  address.fullName &&
                  address.phone &&
                  address.state

                ) {

                  handlePayment(product);

                }

                // ============================================
                // 🔥 NEW USER
                // ============================================
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

                onClick={() =>
                  removeFromCart(
                    product.id
                  )
                }

              >
                Remove
              </button>

            </div>

          </div>

        ))

      )}

      {/* ============================================
    🔥 ADDRESS POPUP
============================================ */}
{showAddressForm && (

  <div style={styles.popupOverlay}>

    <div style={styles.popupBox}>

      <div style={styles.popupHeader}>

        <h2>
          Delivery Address
        </h2>

        <button

          style={styles.closeBtn}

          onClick={() =>
            setShowAddressForm(false)
          }

        >
          ✕
        </button>

      </div>

      <input
        placeholder="Full Name"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            fullName:
              e.target.value

          })
        }
      />

      <input
        placeholder="Phone Number"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            phone:
              e.target.value

          })
        }
      />

      <input
        placeholder="State"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            state:
              e.target.value

          })
        }
      />

      <input
        placeholder="District"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            district:
              e.target.value

          })
        }
      />

      <input
        placeholder="Taluk"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            taluk:
              e.target.value

          })
        }
      />

      <input
        placeholder="Village"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            village:
              e.target.value

          })
        }
      />

      <input
        placeholder="Pincode"
        style={styles.input}
        onChange={(e) =>
          setAddress({

            ...address,

            pincode:
              e.target.value

          })
        }
      />

      <textarea
        placeholder="Full Address"
        style={styles.textarea}
        onChange={(e) =>
          setAddress({

            ...address,

            addressLine:
              e.target.value

          })
        }
      />

      <button

        style={styles.saveBtn}

        onClick={
          saveAddressAndContinue
        }

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
    padding: "30px"
  },

  heading: {
    marginBottom: "30px"
  },

  card: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  },

  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  details: {
    flex: 1
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  buyBtn: {
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  removeBtn: {
    padding: "10px",
    background: "crimson",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  form: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "120px"
  },
  popupOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
},

popupBox: {
  width: "400px",
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
},

popupHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
},

closeBtn: {
  border: "none",
  background: "none",
  fontSize: "20px",
  cursor: "pointer"
},

saveBtn: {
  padding: "12px",
  border: "none",
  background: "#111",
  color: "#fff",
  borderRadius: "8px",
  cursor: "pointer"
},

};

export default Cart;