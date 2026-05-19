// 📁 src/pages/ProductDetails.jsx

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import axios from "axios";

function ProductDetails({
  cart,
  setCart
}) {

  // =====================================================
  // 🔥 GET PRODUCT ID
  // =====================================================
  const { id } = useParams();



  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();



  // =====================================================
  // 🔥 PRODUCT STATE
  // =====================================================
  const [product, setProduct] =
    useState(null);



  // =====================================================
  // 🔥 QUANTITY STATE
  // =====================================================
  const [qty, setQty] =
    useState(1);




  // =====================================================
  // 🔥 FETCH PRODUCT FROM BACKEND
  // =====================================================
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        // 🔥 GET PRODUCTS FROM BACKEND
        const res = await axios.get(
          "http://localhost:5000/api/products"
        );



        // 🔥 FIND PRODUCT
        const foundProduct =
          res.data.find(
            (item) =>
              item.id === Number(id)
          );



        // 🔥 SAVE PRODUCT
        setProduct(foundProduct);

      } catch (error) {

        console.log(error);

        alert("Failed To Load Product");

      }

    };



    fetchProduct();

  }, [id]);




  // =====================================================
  // 🔥 LOADING SCREEN
  // =====================================================
  if (!product) {

    return (

      <h1 style={styles.loading}>
        Loading Product...
      </h1>

    );

  }




  // =====================================================
  // 🛒 ADD TO CART
  // =====================================================
  const addToCart = () => {

    // 🔥 CHECK LOGIN FIRST
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");



    // ❌ IF NOT LOGGED IN
    if (!isLoggedIn) {

      alert("Please Login First");

      // 🔥 REDIRECT LOGIN PAGE
      navigate("/login");

      return;

    }



    // 🔥 CHECK EXISTING PRODUCT
    const existing = cart.find(
      (item) =>
        item.id === product.id
    );



    // ✅ PRODUCT ALREADY EXISTS
    if (existing) {

      const updatedCart =
        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + qty
              }

            : item

        );



      // 🔥 UPDATE CART
      setCart(updatedCart);

    } else {

      // ✅ NEW PRODUCT
      setCart([

        ...cart,

        {
          ...product,
          quantity: qty
        }

      ]);

    }



    alert("✅ Added To Cart");

  };




  // =====================================================
  // ⚡ BUY NOW
  // =====================================================
  const buyNow = () => {

    // 🔥 CHECK LOGIN
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");



    // ❌ NOT LOGGED IN
    if (!isLoggedIn) {

      alert("Please Login First");

      navigate("/login");

      return;

    }



    // 🔥 ADD PRODUCT
    addToCart();



    // 🔥 GO TO CART PAGE
    navigate("/cart");

  };




  // =====================================================
  // 🔥 UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* =====================================================
          🔥 LEFT IMAGE
      ===================================================== */}
      <div style={styles.imageBox}>

        <img
          src={product.image}
          alt={product.name}
          style={styles.image}
        />

      </div>




      {/* =====================================================
          🔥 RIGHT DETAILS
      ===================================================== */}
      <div style={styles.details}>

        {/* 🔥 PRODUCT NAME */}
        <h1>
          {product.name}
        </h1>



        {/* 🔥 DESCRIPTION */}
        <p style={styles.description}>

          {
            product.description
              || "No Description"
          }

        </p>



        {/* 🔥 PRICE */}
        <h2 style={styles.price}>

          ₹ {product.price}

        </h2>




        {/* =====================================================
            🔥 QUANTITY SECTION
        ===================================================== */}
        <div style={styles.qtyContainer}>

          {/* 🔥 MINUS BUTTON */}
          <button
            type="button"
            style={styles.qtyBtn}
            onClick={() =>
              setQty(
                qty > 1
                  ? qty - 1
                  : 1
              )
            }
          >
            -
          </button>



          {/* 🔥 QUANTITY */}
          <span style={styles.qtyText}>
            {qty}
          </span>



          {/* 🔥 PLUS BUTTON */}
          <button
            type="button"
            style={styles.qtyBtn}
            onClick={() =>
              setQty(qty + 1)
            }
          >
            +
          </button>

        </div>




        {/* =====================================================
            🔥 ACTION BUTTONS
        ===================================================== */}
        <div style={styles.buttonContainer}>

          {/* 🛒 ADD TO CART */}
          <button
            type="button"
            style={styles.cartBtn}
            onClick={addToCart}
          >
            Add To Cart
          </button>



          {/* ⚡ BUY NOW */}
          <button
            type="button"
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




// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // 🔥 MAIN CONTAINER
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



  // 🔥 IMAGE BOX
  imageBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  // 🔥 PRODUCT IMAGE
  image: {
    width: "350px",
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px"
  },



  // 🔥 DETAILS BOX
  details: {
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  // 🔥 DESCRIPTION
  description: {
    color: "#555",
    lineHeight: "1.6"
  },



  // 🔥 PRICE
  price: {
    color: "#6c63ff",
    margin: "20px 0"
  },



  // 🔥 QUANTITY CONTAINER
  qtyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px"
  },



  // 🔥 QUANTITY BUTTON
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



  // 🔥 QUANTITY TEXT
  qtyText: {
    fontSize: "20px",
    fontWeight: "bold"
  },



  // 🔥 BUTTON CONTAINER
  buttonContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },



  // 🛒 ADD TO CART BUTTON
  cartBtn: {
    padding: "12px 25px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // ⚡ BUY NOW BUTTON
  buyBtn: {
    padding: "12px 25px",
    border: "none",
    background: "#111",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // 🔥 LOADING TEXT
  loading: {
    textAlign: "center",
    marginTop: "100px"
  }

};

export default ProductDetails;