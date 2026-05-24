// 📁 src/pages/ProductDetails.jsx

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

  // =====================================================
  // 🔥 GET PRODUCT ID
  // =====================================================
  const { id } = useParams();

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();

  // =====================================================
  // 🔥 STATES
  // =====================================================
  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [qty, setQty] =
    useState(1);

  const [selectedImage, setSelectedImage] =
    useState("");



  // =====================================================
  // 🔥 FETCH PRODUCT
  // =====================================================
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/products"
        );

        const foundProduct =
          res.data.find(
            (item) =>
              item.id === Number(id)
          );

        setProduct(foundProduct);

        setSelectedImage(
          foundProduct.image
        );

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);



  // =====================================================
  // 🔥 ALL PRODUCT IMAGES
  // =====================================================
  const productImages = useMemo(() => {

    if (!product) return [];

    let extraImages = [];

    try {

      extraImages = JSON.parse(
        product.images || "[]"
      );

    } catch {

      extraImages = [];

    }

    return [

      product.image,

      ...extraImages.filter(Boolean)

    ];

  }, [product]);



  // =====================================================
  // 🔥 LOADING
  // =====================================================
  if (loading) {

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

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {

      alert("Please Login First");

      navigate("/login");

      return;

    }

    // =====================================================
    // 🔥 OLD CART
    // =====================================================
    const oldCart =

      JSON.parse(
        localStorage.getItem("cart")
      ) || [];



    // =====================================================
    // 🔥 CHECK EXISTING
    // =====================================================
    const existingProduct =
      oldCart.find(
        (item) =>
          item.id === product.id
      );

    let updatedCart = [];



    // =====================================================
    // 🔥 UPDATE QUANTITY
    // =====================================================
    if (existingProduct) {

      updatedCart = oldCart.map((item) =>

        item.id === product.id

          ? {

              ...item,

              quantity:
                item.quantity + qty

            }

          : item

      );

    }



    // =====================================================
    // 🔥 NEW PRODUCT
    // =====================================================
    else {

      updatedCart = [

        ...oldCart,

        {

          ...product,

          quantity: qty

        }

      ];

    }



    // =====================================================
    // 🔥 UPDATE STATE
    // =====================================================
    setCart(updatedCart);



    // =====================================================
    // 🔥 SAVE LOCAL STORAGE
    // =====================================================
    localStorage.setItem(

      "cart",

      JSON.stringify(updatedCart)

    );



    alert("Added To Cart ✅");

  };



  // =====================================================
  // ⚡ BUY NOW
  // =====================================================
  const buyNow = async () => {

    try {

      // =====================================================
      // 🔥 LOGIN CHECK
      // =====================================================
      const isLoggedIn =
        localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {

        alert("Please Login First");

        navigate("/login");

        return;

      }



      // =====================================================
      // 🔥 CREATE PAYMENT ORDER
      // =====================================================
      const order = await axios.post(

        "http://localhost:5000/api/payment/create-order",

        {
          amount:
            product.price * qty
        }

      );



      // =====================================================
      // 🔥 RAZORPAY OPTIONS
      // =====================================================
      const options = {

        key: "rzp_test_SsfWvZhtYI6dCX",

        amount: order.data.amount,

        currency: order.data.currency,

        name: "E-Commerce Store",

        description: product.name,

        image: product.image,

        order_id: order.data.id,



        // =====================================================
        // ✅ PAYMENT SUCCESS
        // =====================================================
        handler: function (response) {

          // =====================================================
          // 🔥 BUY ONLY THIS PRODUCT
          // =====================================================
          const singleOrder = [

            {

              ...product,

              quantity: qty

            }

          ];



          // =====================================================
          // 🔥 SAVE CHECKOUT PRODUCT
          // =====================================================
          localStorage.setItem(

            "checkoutItems",

            JSON.stringify(singleOrder)

          );



          // =====================================================
          // 🔥 SAVE ORDER HISTORY
          // =====================================================
          const oldOrders =

            JSON.parse(
              localStorage.getItem("orders")
            ) || [];



          oldOrders.push({

            productName:
              product.name,

            amount:
              product.price * qty,

            paymentId:
              response.razorpay_payment_id

          });



          localStorage.setItem(

            "orders",

            JSON.stringify(oldOrders)

          );



          // =====================================================
          // ✅ SUCCESS MESSAGE
          // =====================================================
          alert("Payment Successful ✅");



          // =====================================================
          // 🔥 GO SUCCESS PAGE
          // =====================================================
          navigate("/success");

        },



        // =====================================================
        // 🔥 USER DETAILS
        // =====================================================
        prefill: {

          name: "Customer",

          email: "customer@gmail.com",

          contact: "9999999999"

        },



        // =====================================================
        // 🔥 THEME
        // =====================================================
        theme: {
          color: "#6c63ff"
        }

      };



      // =====================================================
      // 🔥 OPEN PAYMENT
      // =====================================================
      const razor =
        new window.Razorpay(options);

      razor.open();

    } catch (error) {

      console.log(error);

      alert("Payment Failed ❌");

    }

  };



  return (

    <div style={styles.container}>


      {/* =====================================================
          🔥 LEFT SIDE
      ===================================================== */}
      <div style={styles.imageGallery}>


        {/* MAIN IMAGE */}
        <div style={styles.mainImageBox}>

          <img
            src={selectedImage}
            alt={product.name}
            style={styles.mainImage}
          />

        </div>



        {/* SMALL IMAGES */}
        <div style={styles.thumbnailRow}>

          {productImages.map((img, index) => (

            <img
              key={index}
              src={img}
              alt=""

              style={{
                ...styles.thumbnail,

                border:
                  selectedImage === img
                    ? "3px solid #6c63ff"
                    : "2px solid #ddd"
              }}

              onClick={() =>
                setSelectedImage(img)
              }
            />

          ))}

        </div>

      </div>



      {/* =====================================================
          🔥 RIGHT SIDE
      ===================================================== */}
      <div style={styles.right}>


        {/* PRODUCT NAME */}
        <h1 style={styles.title}>
          {product.name}
        </h1>



        {/* RATING */}
        <div style={styles.rating}>
          ⭐⭐⭐⭐☆ (4.5)
        </div>



        {/* PRICE */}
        <h2 style={styles.price}>
          ₹ {product.price}
        </h2>



        {/* STOCK */}
        <p style={styles.stock}>

          {product.stock > 0

            ? "✅ In Stock"

            : "❌ Out Of Stock"}

        </p>



        {/* DELIVERY */}
        <p style={styles.delivery}>
          🚚 Free Delivery By Tomorrow
        </p>



        {/* DESCRIPTION */}
        <div style={styles.section}>

          <h3>Description</h3>

          <p style={styles.description}>

            {product.description ||

              "Premium quality product with modern design and excellent performance."}

          </p>

        </div>



        {/* FEATURES */}
        <div style={styles.section}>

          <h3>Features</h3>

          <ul style={styles.features}>

            <li>Premium Build Quality</li>

            <li>Long Lasting Performance</li>

            <li>Stylish Design</li>

            <li>Best Seller Product</li>

          </ul>

        </div>



        {/* QUANTITY */}
        <div style={styles.qtyContainer}>


          <button
            style={styles.qtyBtn}
            onClick={() =>
              setQty(
                qty > 1
                  ? qty - 1
                  : 1
              )
            }
          >
            −
          </button>



          <span style={styles.qtyText}>
            {qty}
          </span>



          <button
            style={styles.qtyBtn}
            onClick={() =>
              setQty(qty + 1)
            }
          >
            +
          </button>

        </div>



        {/* BUTTONS */}
        <div style={styles.buttons}>


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



// =====================================================
// 🎨 STYLES
// =====================================================
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

  title: {
    fontSize: "35px",
    marginBottom: "10px"
  },

  rating: {
    color: "#f59e0b",
    fontSize: "18px",
    marginBottom: "20px"
  },

  price: {
    color: "#6c63ff",
    marginBottom: "15px"
  },

  stock: {
    color: "green",
    fontWeight: "bold"
  },

  delivery: {
    marginTop: "10px",
    color: "#444"
  },

  section: {
    marginTop: "30px"
  },

  description: {
    color: "#555",
    lineHeight: "1.8"
  },

  features: {
    lineHeight: "2"
  },

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

  qtyText: {
    fontSize: "22px",
    fontWeight: "bold"
  },

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