import { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);

  // ======================================
  // FETCH ORDERS FROM DB
  // ======================================
  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user.email}`
      );

      setOrders(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  // ======================================
  // LOAD ORDERS
  // ======================================
  useEffect(() => {

    if (user?.email) {

      fetchOrders();

    }

  }, [user]);

  return (

    <div style={styles.container}>

      <h1 style={styles.heading}>
        My Orders 🧾
      </h1>

      {orders.length === 0 ? (

        <h2 style={styles.emptyText}>
          No Orders Found
        </h2>

      ) : (

        orders.map((order) => (

          <div
            key={order.id}
            style={styles.card}
          >
             <img
              src={order.product_image}
              alt=""
              style={styles.image}
            />

            {/* PRODUCT */}
            <h2 style={styles.productName}>
              {order.product_name}
            </h2>

            <p style={styles.amount}>
              ₹ {order.amount}
            </p>

            <p style={styles.payment}>
              💳 Payment ID:
              {" "}
              {order.payment_id}
            </p>

            <p style={styles.address}>
              📍 {order.address_line}
            </p>

            <p style={styles.date}>
              📅
              {" "}
              {new Date(order.created_at)
                .toLocaleString()}
            </p>

            {/* ====================================== */}
            {/* 🔥 STATUS TIMELINE */}
            {/* ====================================== */}

            <div style={styles.statusContainer}>

              {/* PROCESSING */}
              <div style={styles.statusStep}>

                <div
                  style={{
                    ...styles.circle,

                    background:

                      order.order_status === "Processing" ||
                      order.order_status === "Shipped" ||
                      order.order_status === "Out for Delivery" ||
                      order.order_status === "Delivered"

                        ? "#f59e0b"

                        : "#d1d5db"
                  }}
                >
                  ✓
                </div>

                <p style={styles.statusText}>
                  Processing
                </p>

              </div>

              <div style={styles.line}></div>

              {/* SHIPPED */}
              <div style={styles.statusStep}>

                <div
                  style={{
                    ...styles.circle,

                    background:

                      order.order_status === "Shipped" ||
                      order.order_status === "Out for Delivery" ||
                      order.order_status === "Delivered"

                        ? "#3b82f6"

                        : "#d1d5db"
                  }}
                >
                  ✓
                </div>

                <p style={styles.statusText}>
                  Shipped
                </p>

              </div>

              <div style={styles.line}></div>

              {/* OUT FOR DELIVERY */}
              <div style={styles.statusStep}>

                <div
                  style={{
                    ...styles.circle,

                    background:

                      order.order_status === "Out for Delivery" ||
                      order.order_status === "Delivered"

                        ? "#8b5cf6"

                        : "#d1d5db"
                  }}
                >
                  ✓
                </div>

                <p style={styles.statusText}>
                  Out for Delivery
                </p>

              </div>

              <div style={styles.line}></div>

              {/* DELIVERED */}
              <div style={styles.statusStep}>

                <div
                  style={{
                    ...styles.circle,

                    background:

                      order.order_status === "Delivered"

                        ? "#22c55e"

                        : "#d1d5db"
                  }}
                >
                  ✓
                </div>

                <p style={styles.statusText}>
                  Delivered
                </p>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  );

}

// ======================================
// STYLES
// ======================================

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

  emptyText: {
    color: "#6b7280"
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    marginBottom: "25px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)"
  },

  productName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "10px"
  },

  amount: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#6c63ff",
    marginBottom: "10px"
  },

  payment: {
    color: "#374151",
    marginBottom: "8px"
  },

  address: {
    color: "#374151",
    marginBottom: "8px"
  },

  date: {
    color: "#6b7280"
  },

  // ======================================
  // STATUS TIMELINE
  // ======================================

  statusContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "30px",
    flexWrap: "wrap"
  },

  statusStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  circle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px"
  },

  line: {
    width: "70px",
    height: "4px",
    background: "#d1d5db",
    margin: "0 10px"
  },

  statusText: {
    marginTop: "10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    textAlign: "center"
  },
  image: {

  width: "140px",
  height: "140px",

  objectFit: "cover",

  borderRadius: "18px",

  marginBottom: "20px"

},

};

export default OrderHistory;