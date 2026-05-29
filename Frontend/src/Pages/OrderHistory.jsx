import jsPDF from "jspdf";
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

  const downloadInvoice = (order) => {

  const doc = new jsPDF();

  // ======================================
  // BACKGROUND HEADER
  // ======================================

  doc.setFillColor(17, 24, 39);

  doc.rect(0, 0, 220, 40, "F");

  // ======================================
  // PROJECT NAME
  // ======================================

  doc.setFontSize(28);

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.text("ShopEase", 20, 25);

  // ======================================
  // INVOICE TITLE
  // ======================================

  doc.setFontSize(18);

  doc.text("OFFICIAL INVOICE", 140, 25);

  // ======================================
  // RESET TEXT COLOR
  // ======================================

  doc.setTextColor(0, 0, 0);

  // ======================================
  // INVOICE BOX
  // ======================================

  doc.setDrawColor(220);

  doc.roundedRect(15, 50, 180, 120, 5, 5);

  // ======================================
  // ORDER INFO
  // ======================================

  doc.setFontSize(16);

  doc.setFont("helvetica", "bold");

  doc.text("Order Details", 25, 65);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(13);

  doc.text(
    `Invoice ID: INV-${order.id}`,
    25,
    80
  );

  doc.text(
    `Product: ${order.product_name}`,
    25,
    92
  );

  doc.text(
    `Amount Paid: ₹${order.amount}`,
    25,
    104
  );

  doc.text(
    `Payment Method: ${order.payment_method}`,
    25,
    116
  );

  doc.text(
    `Payment Status: ${order.payment_status}`,
    25,
    128
  );

  doc.text(
    `Order Status: ${order.order_status}`,
    25,
    140
  );

  // ======================================
  // CUSTOMER DETAILS
  // ======================================

  doc.setFont("helvetica", "bold");

  doc.text("Customer Details", 110, 65);

  doc.setFont("helvetica", "normal");

  doc.text(
    `Name: ${order.full_name}`,
    110,
    80
  );

  doc.text(
    `Phone: ${order.phone}`,
    110,
    92
  );

  doc.text(
    `Pincode: ${order.pincode}`,
    110,
    104
  );

  // ADDRESS
  const address = `
${order.address_line},
${order.village},
${order.taluk},
${order.district},
${order.state}
`;

  doc.text(
    address,
    110,
    118
  );

  // ======================================
  // DATE
  // ======================================

  doc.setFont("helvetica", "bold");

  doc.text(
    "Order Date:",
    25,
    160
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    new Date(order.created_at)
      .toLocaleString(),
    60,
    160
  );

  // ======================================
  // SEAL
  // ======================================

  doc.setDrawColor(99, 102, 241);

  doc.setFillColor(99, 102, 241);

  doc.circle(165, 220, 18, "FD");

  doc.setFontSize(10);

  doc.setTextColor(255, 255, 255);

  doc.text(
    "PAID",
    158,
    223
  );

  // ======================================
  // FOOTER
  // ======================================

  doc.setTextColor(120);

  doc.setFontSize(11);

  doc.text(
    "Thank you for shopping with ShopEase ❤️",
    55,
    270
  );

  doc.text(
    "This is a computer generated invoice.",
    52,
    278
  );

  // ======================================
  // SAVE PDF
  // ======================================

  doc.save(`ShopEase_Invoice_${order.id}.pdf`);

};

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
            
      {order.order_status === "Delivered" ? (

          <button
              style={styles.invoiceBtn}
              onClick={() =>
                downloadInvoice(order)
              }
          >
              Download Invoice
          </button>

          ) : (

           <button
              style={{
                ...styles.invoiceBtn,
                background: "#9ca3af",
                cursor: "not-allowed"
              }}
            >
              Invoice Available After Delivery
           </button>

          )}

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
invoiceBtn: {

  marginTop: "20px",

  padding: "14px 22px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#111827,#374151)",

  color: "#fff",

  fontWeight: "700",

  cursor: "pointer"

},

};

export default OrderHistory;