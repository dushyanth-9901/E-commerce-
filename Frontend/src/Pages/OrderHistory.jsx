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

  const doc = new jsPDF(
  "p",
  "mm",
  "a4"
);

  
   const subtotal = Number(order.amount);

   const gst = (subtotal * 18) / 100;

   const total = subtotal + gst; 

   const invoiceNumber =
  `INV-${order.id}-${Date.now()}`;

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
      doc.setFontSize(26);

      doc.text("SHOPEASE", 20, 20);

      doc.setFontSize(12);

      doc.text(
        "Premium Ecommerce Store",
        20,
        28
      );
      
   doc.setFontSize(10);

    doc.text(
      "GSTIN: 29ABCDE1234F1Z5",
      20,
      34
    );
     
  // ======================================
  // RESET TEXT COLOR
  // ======================================

  doc.setTextColor(0, 0, 0);

  // ======================================
  // INVOICE BOX
  // ======================================

  doc.setDrawColor(220);
    doc.roundedRect(
        15,
        50,
        180,
        240,
        5,
        5
      );
// ======================================
// ORDER DETAILS
// ======================================

doc.setFontSize(16);
doc.setFont("helvetica", "bold");

doc.text("Order Details", 20, 65);

doc.line(20, 70, 190, 70);

doc.setFontSize(12);
doc.setFont("helvetica", "normal");

doc.text("Invoice ID", 20, 85);
doc.text(":", 55, 85);
doc.text(invoiceNumber, 65, 85);

doc.text("Product", 20, 95);
doc.text(":", 55, 95);
doc.text(order.product_name, 65, 95);

doc.text("Subtotal", 20, 105);
doc.text(":", 55, 105);
doc.text(`₹${subtotal}`, 65, 105);

doc.text("GST (18%)", 20, 115);
doc.text(":", 55, 115);
doc.text(`₹${gst.toFixed(2)}`, 65, 115);

doc.text("Total", 20, 125);
doc.text(":", 55, 125);
doc.text(`₹${total.toFixed(2)}`, 65, 125);
doc.text("Customer ID", 20, 135);
doc.text(":", 55, 135);
doc.text
  `CUST-${order.user_id || order.id}`,
  65,
  135

doc.line(20, 135, 190, 135);

// divider

doc.line(
  20,
  138,
  190,
  138
);

// ======================================
// CUSTOMER DETAILS
// ======================================

doc.setFont("helvetica", "bold");

doc.text("Customer Details", 20, 215);

doc.line(20, 220, 95, 220);

doc.setFont("helvetica", "normal");

doc.text("Name", 20, 232);
doc.text(":", 50, 232);
doc.text(order.full_name || "-", 60, 232);

doc.text("Phone", 20, 242);
doc.text(":", 50, 242);
doc.text(order.phone || "-", 60, 242);

// ======================================
// PAYMENT DETAILS
// ======================================

doc.setFont("helvetica", "bold");

doc.text("Payment Details", 20, 150);

doc.line(20, 155, 190, 155);

doc.setFont("helvetica", "normal");

doc.text("Payment Method", 20, 170);
doc.text(":", 55, 170);
doc.text(order.payment_method || "-", 65, 170);

doc.text("Payment Status", 20, 180);
doc.text(":", 55, 180);
doc.text(order.payment_status || "-", 65, 180);

doc.text("Order Status", 20, 190);
doc.text(":", 55, 190);
doc.text(order.order_status || "-", 65, 190);

doc.line(20, 200, 190, 200);


// ======================================
// FULL ADDRESS
// ======================================

doc.setFont("helvetica", "bold");

doc.text("Shipping Address", 110, 215);

doc.line(110, 220, 190, 220);

doc.setFont("helvetica", "normal");

const address = [
  order.address_line,
  order.village,
  order.taluk,
  order.district,
  order.state
].filter(Boolean).join("\n");

doc.text(
  address,
  110,
  228,
  {
    maxWidth: 70
  }
);

// ======================================
// DATE
// ======================================

doc.line(20, 270, 191, 270);

doc.setFont("helvetica", "bold");

doc.text(
  `Order Date: ${new Date(
    order.created_at
  ).toLocaleString()}`,
  20,
  270
);
// ======================================
// SEAL
// ======================================
doc.line(20, 255, 70, 255);

doc.text(
  "Authorized Signature",
  20,
  262
);

doc.circle(160, 258, 12);
doc.setFontSize(8);

doc.text("SHOPEASE", 152, 273);
doc.text("OFFICIAL", 154, 277);
 // ======================================
 // FOOTER
// ======================================

doc.line(20, 270, 190, 270);

doc.setFontSize(10);

doc.text(
  "Thank you for shopping with ShopEase",
  20,
  278
);

doc.text(
  "This is a computer generated invoice.",
  20,
  284
);

  doc.save(`${invoiceNumber}.pdf`);
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