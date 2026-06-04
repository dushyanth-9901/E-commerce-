// 📁 src/pages/ProductDetails.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

function ProductDetails({ cart, setCart }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const getWishlistKey = () =>
    user ? `wishlist_${user.email}` : "wishlist_guest";
  const reviewsKey = `reviews_${id}`;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // =========================================
  // GET CART KEY (SAFE)
  // =========================================
  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_${user.email}` : "cart_guest";
  };

  // =========================================
  // FETCH PRODUCT
  // =========================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        const found = res.data.find(
          (item) => item.id === Number(id)
        );

        setProduct(found);
        setSelectedImage(found.image);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const wishlist =
      JSON.parse(
        localStorage.getItem(getWishlistKey())
      ) || [];

    setIsWishlisted(
      wishlist.some(
        (item) => item.id === Number(id)
      )
    );

    const savedReviews =
      JSON.parse(
        localStorage.getItem(reviewsKey)
      ) || [];

    setReviews(savedReviews);
  }, [id]);

  // =========================================
  // PRODUCT IMAGES
  // =========================================
  const productImages = useMemo(() => {
    if (!product) return [];

    let extra = [];
    try {
      extra = JSON.parse(product.images || "[]");
    } catch {
      extra = [];
    }

    return [product.image, ...extra.filter(Boolean)];
  }, [product]);

  // =========================================
  // ADD TO CART (FIXED FINAL VERSION)
  // =========================================
  const addToCart = () => {
    if (product?.stock <= 0) {
      alert("Cannot add out of stock product");
      return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    const cartKey = getCartKey();
    const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = oldCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existing) {
      updatedCart = oldCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        { ...product, quantity: qty }
      ];
    }

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    alert("Added To Cart ✅");
  };

  // =========================================
  // BUY NOW (UNCHANGED)
  // =========================================
  const buyNow = async () => {
    try {
      if (product?.stock <= 0) {
        alert("Cannot purchase out of stock product");
        return;
      }

      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        alert("Please Login First");
        navigate("/login");
        return;
      }

      const order = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: product.price * qty }
      );

      const options = {
        key: "rzp_test_SsfWvZhtYI6dCX",
        amount: order.data.amount,
        currency: order.data.currency,
        name: "E-Commerce Store",
        description: product.name,
        image: product.image,
        order_id: order.data.id,

        handler: function (response) {

          const singleOrder = [{
            ...product,
            quantity: qty
          }];

          localStorage.setItem(
            "checkoutItems",
            JSON.stringify(singleOrder)
          );

          const oldOrders =
            JSON.parse(localStorage.getItem("orders")) || [];

          oldOrders.push({
            productName: product.name,
            amount: product.price * qty,
            paymentId: response.razorpay_payment_id
          });

          localStorage.setItem(
            "orders",
            JSON.stringify(oldOrders)
          );

          alert("Payment Successful ✅");
          navigate("/dashboard");
        },

        prefill: {
          name: "Customer",
          email: "customer@gmail.com",
          contact: "9999999999"
        },

        theme: {
          color: "#6c63ff"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.log(err);
      alert("Payment Failed ❌");
    }
  };

  const toggleWishlist = () => {
    if (!localStorage.getItem("isLoggedIn")) {
      alert("Please login to manage your wishlist.");
      navigate("/login");
      return;
    }

    const key = getWishlistKey();
    const current =
      JSON.parse(localStorage.getItem(key)) || [];

    const exists = current.some(
      (item) => item.id === product.id
    );

    const updated = exists
      ? current.filter((item) => item.id !== product.id)
      : [...current, product];

    localStorage.setItem(key, JSON.stringify(updated));
    setIsWishlisted(!exists);
    alert(
      exists
        ? "Removed from wishlist ✅"
        : "Added to wishlist ✅"
    );
  };

  const submitReview = () => {
    if (!localStorage.getItem("isLoggedIn")) {
      alert("Please login to submit a review.");
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      alert("Please add a review comment.");
      return;
    }

    const reviewer = JSON.parse(
      localStorage.getItem("user")
    );

    const saved =
      JSON.parse(localStorage.getItem(reviewsKey)) || [];

    const newReview = {
      id: Date.now(),
      name: reviewer?.name || reviewer?.email || "Guest",
      rating,
      comment,
      date: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...saved];
    localStorage.setItem(
      reviewsKey,
      JSON.stringify(updatedReviews)
    );
    setReviews(updatedReviews);
    setRating(5);
    setComment("");
    alert("Review submitted ✅");
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return <h1 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h1>;
  }

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div style={styles.container}>

      <div style={styles.imageGallery}>
        <div style={styles.mainImageBox}>
          <img src={selectedImage} style={styles.mainImage} />
        </div>

        <div style={styles.thumbnailRow}>
          {productImages.map((img, i) => (
            <img
              key={i}
              src={img}
              style={{
                ...styles.thumbnail,
                border: selectedImage === img ? "3px solid #6c63ff" : "2px solid #ddd"
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <h1 style={styles.title}>{product.name}</h1>

        {product.category && (
          <p style={styles.category}>
            Category: {product.category}
          </p>
        )}

        <h2 style={styles.price}>₹ {product.price}</h2>

        <p style={styles.stock}>
          {product.stock > 0
            ? "✅ In Stock"
            : "❌ Out Of Stock"}
        </p>

        <p style={styles.rating}>
          ⭐ {reviews.length > 0 ? (
            (reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
          ) : (
            "No ratings yet"
          )} {reviews.length > 0 && `(${reviews.length} reviews)`}
        </p>

        <p style={styles.description}>
          {product.description}
        </p>

        <button
          onClick={toggleWishlist}
          style={styles.wishlistBtn}
        >
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>

        <div style={styles.qtyContainer}>
             <button
              style={styles.qtyBtn}
              onClick={() =>
                setQty(qty > 1 ? qty - 1 : 1)
              }
            >
              −
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

        <div style={styles.actionButtons}>
          <button
            onClick={addToCart}
            style={{
              ...styles.cartBtn,
              opacity: product.stock === 0 ? 0.6 : 1,
              cursor: product.stock === 0 ? "not-allowed" : "pointer"
            }}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>

          <button
            onClick={() => {
              if (product.stock === 0) return;
              addToCart();
              navigate("/cart");
            }}
            style={{
              ...styles.buyBtn,
              opacity: product.stock === 0 ? 0.6 : 1,
              cursor: product.stock === 0 ? "not-allowed" : "pointer"
            }}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>

        <div style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>Customer Reviews</h2>

          <div style={styles.reviewForm}>
            <label style={styles.label}>
              Rating:
              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                style={styles.select}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review..."
              style={styles.textarea}
            />

            <button
              style={styles.submitReviewBtn}
              onClick={submitReview}
            >
              Submit Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <p style={styles.emptyReview}>
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                style={styles.reviewCard}
              >
                <p style={styles.reviewMeta}>
                  <strong>{review.name}</strong> · {review.rating} ⭐
                </p>
                <p style={styles.reviewComment}>
                  {review.comment}
                </p>
                <p style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

const styles = {

  container: {
    display: "flex",
    gap: "60px",
    padding: "50px",
    background: "#f5f7fb",
    minHeight: "100vh",
    flexWrap: "wrap"
  },

  imageGallery: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  mainImageBox: {
    width: "500px",
    height: "500px",

    background: "#fff",

    borderRadius: "28px",

    padding: "25px",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)"
  },

  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "20px"
  },

  thumbnailRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  },

  thumbnail: {
    width: "85px",
    height: "85px",

    objectFit: "cover",

    borderRadius: "18px",

    cursor: "pointer",

    background: "#fff",

    padding: "6px",

    transition: "0.3s",

    boxShadow:
      "0 5px 15px rgba(0,0,0,0.05)"
  },

  right: {
    flex: 1,

    minWidth: "320px",

    background: "#fff",

    borderRadius: "30px",

    padding: "45px",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.06)",

    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1.2"
  },

  price: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#6c63ff"
  },

  stock: {
    display: "inline-block",

    background: "#dcfce7",

    color: "#166534",

    padding: "10px 18px",

    borderRadius: "999px",

    fontWeight: "700",

    width: "fit-content"
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.9",
    fontSize: "16px"
  },

  category: {
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600"
  },

  rating: {
    color: "#d97706",
    fontSize: "16px",
    fontWeight: "700"
  },

  wishlistBtn: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 22px",
    background: "#ec4899",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    width: "fit-content"
  },

  reviewSection: {
    background: "#f8fafc",
    padding: "25px",
    borderRadius: "24px",
    marginTop: "20px"
  },

  sectionTitle: {
    fontSize: "24px",
    marginBottom: "18px",
    fontWeight: "700"
  },

  reviewForm: {
    display: "grid",
    gap: "12px",
    marginBottom: "20px"
  },

  label: {
    display: "flex",
    flexDirection: "column",
    color: "#111827",
    fontWeight: "600"
  },

  select: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none"
  },

  textarea: {
    minHeight: "120px",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    outline: "none",
    resize: "vertical"
  },

  submitReviewBtn: {
    width: "fit-content",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },

  emptyReview: {
    color: "#6b7280"
  },

  reviewCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
    marginBottom: "12px"
  },

  reviewMeta: {
    marginBottom: "8px",
    color: "#111827"
  },

  reviewComment: {
    color: "#4b5563",
    lineHeight: "1.8",
    marginBottom: "10px"
  },

  reviewDate: {
    color: "#6b7280",
    fontSize: "13px"
  },

  qtyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "10px"
  },

  qtyBtn: {
    width: "48px",
    height: "48px",

    border: "none",

    borderRadius: "14px",

    background: "#111827",

    color: "#fff",

    fontSize: "22px",

    cursor: "pointer",

    fontWeight: "700"
  },

  qtyText: {
    fontSize: "24px",
    fontWeight: "700",
    minWidth: "30px",
    textAlign: "center"
  },

  actionButtons: {
    display: "flex",
    gap: "20px",
    marginTop: "25px",
    flexWrap: "wrap"
  },

  cartBtn: {
    padding: "18px 35px",

    border: "none",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#6c63ff,#4f46e5)",

    color: "#fff",

    fontWeight: "700",

    fontSize: "16px",

    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(99,102,241,0.3)"
  },

  buyBtn: {
    padding: "18px 35px",

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
  }

};

export default ProductDetails;