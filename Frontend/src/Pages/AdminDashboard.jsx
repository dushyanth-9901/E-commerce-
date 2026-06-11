
// 📁 src/pages/AdminDashboard.jsx

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { FaTrash } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import DashboardHome from "../components/admin/DashboardHome";
import ProductsPage from "../components/admin/ProductsPage";
import OrdersPage from "../components/admin/OrdersPage";
import UsersPage from "../components/admin/UsersPage";

function AdminDashboard() {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();

  // =====================================================
  // 🔥 ACTIVE PAGE
  // =====================================================
  const [active, setActive] =
    useState("Dashboard");

  // =====================================================
  // 🔥 MAIN STATES
  // =====================================================
  const [products, setProducts] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
   
  const [userSearch, setUserSearch] =
  useState("");  

  // =====================================================
  // 🔥 PRODUCTS STATES
  // =====================================================
  const [search, setSearch] =
    useState("");

  const [showProducts, setShowProducts] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      stock: "",
      category: "",
      image: "",
      image2: "",
      image3: "",
      description: ""
    });
  const [categoryFilter, setCategoryFilter] =
      useState("All");

  const [lowStockOnly, setLowStockOnly] =
      useState(false);

  const [maxPrice, setMaxPrice] =
      useState("");

  // =====================================================
  // 🔥 EDIT STATES
  // =====================================================
  const [editId, setEditId] =
    useState(null);

 
 const [editForm, setEditForm] =
  useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    image2: "",
    image3: "",
    description: ""
  });

const [orderFilter, setOrderFilter] =
  useState("All");

const [orderSearch, setOrderSearch] =
  useState("");

const [orderDateFilter, setOrderDateFilter] =
  useState(""); 
  // =====================================================
  // 🔐 ADMIN PROTECTION
  // =====================================================
  useEffect(() => {

  const isAdmin =
    localStorage.getItem("isAdmin");

  if (!isAdmin) {

    navigate("/admin");

    return;

  }

  fetchData();

}, [navigate]);

  // =====================================================
  // 🔥 FETCH DATA
  // =====================================================
  const fetchData = async () => {

  try {

    setLoading(true);

    const productsRes =
      await axios.get(
        "http://localhost:5000/api/products"
      );

    const usersRes =
      await axios.get(
        "http://localhost:5000/api/users"
      );

    const ordersRes =
      await axios.get(
        "http://localhost:5000/api/orders"
      );

    setProducts(productsRes.data);

    setUsers(usersRes.data);

    setOrders(ordersRes.data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};

  // =====================================================
  // 🔥 ADD PRODUCT
  // =====================================================
  const addProduct = async () => {

    if (
      !form.name ||
      !form.price ||
      !form.stock ||
      !form.category ||
      !form.image
    ) {
      alert("Fill all fields");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          image: form.image,
          images: JSON.stringify([
              form.image2,
              form.image3

          ]),
          description: form.description
        }
      );

      fetchData();

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: "",
        image2: "",
        image3: "",
        description: ""
      });

      alert("✅ Product Added");

    } catch (error) {

      console.log(error);

      alert("❌ Failed");

    }

  };

  // =====================================================
  // 🔥 DELETE PRODUCT
  // =====================================================
  const deleteProduct = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      fetchData();

      alert("✅ Product Deleted");

    } catch (error) {

      console.log(error);

      alert("❌ Delete Failed");

    }

  };

  // =====================================================
  // 🔥 EDIT PRODUCT
  // =====================================================
  const editProduct = (product) => {

          setEditId(product.id);

          const extraImages = JSON.parse(
            product.images || "[]"
          );

          setEditForm({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category || "",
            image: product.image,

            image2: extraImages[0] || "",

            image3: extraImages[1] || "",

            description:
              product.description || ""
          });

};

  // =====================================================
  // 🔥 UPDATE PRODUCT
  // =====================================================
  const updateProduct = async () => {

  try {

    await axios.put(
      `http://localhost:5000/api/products/${editId}`,
      {
        name: editForm.name,

        price: Number(editForm.price),

        stock: Number(editForm.stock),

        category: editForm.category,

        image: editForm.image,

        images: JSON.stringify([
          editForm.image2,
          editForm.image3
        ]),

        description:
          editForm.description
      }
    );

    fetchData();

    setEditId(null);

    alert("✅ Product Updated");

  } catch (error) {

    console.log(error);

    alert("❌ Update Failed");

  }

};
  // =====================================================
  // 🔥 FILTER PRODUCTS
  // =====================================================
  const filteredProducts = products.filter(
          (item) => {

            // 🔍 SEARCH
            const matchesSearch =
              item.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );

            // 📂 CATEGORY
            const matchesCategory =

              categoryFilter === "All"

                ? true

                : item.category ===
                  categoryFilter;

            // ⚠️ LOW STOCK
            const matchesLowStock =

              lowStockOnly

                ? item.stock < 5

                : true;

            // 💰 PRICE FILTER
            const matchesPrice =

              maxPrice

                ? Number(item.price)
                    <= Number(maxPrice)

                : true;

            return (

              matchesSearch &&
              matchesCategory &&
              matchesLowStock &&
              matchesPrice

            );

          }
        );

  // =====================================================
  // 🔥 LOADING
  // =====================================================
  if (loading) {

    return (

      <h1
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        Loading Dashboard...
      </h1>

    );

  }
  // =====================================================
// 🔥 TOTAL REVENUE
// =====================================================

const totalRevenue =

  orders.reduce(

    (acc, item) =>

      acc + Number(item.amount || 0),

    0

  );

// =====================================================
// 🔥 TODAY SALES
// =====================================================

const todaySales =

  orders.filter((item) => {

    const today =
      new Date().toDateString();

    return (

      new Date(item.created_at)
        .toDateString() === today

    );

  }).reduce(

    (acc, item) =>

      acc + Number(item.amount || 0),

    0

  );

// =====================================================
// 🔥 WEEK SALES
// =====================================================

const weekSales =

  orders.filter((item) => {

    const now = new Date();

    const orderDate =
      new Date(item.created_at);

    const diff =
      now - orderDate;

    const days =
      diff / (1000 * 60 * 60 * 24);

    return days <= 7;

  }).reduce(

    (acc, item) =>

      acc + Number(item.amount || 0),

    0

  );

// =====================================================
// 🔥 MONTH SALES
// =====================================================

const monthSales =

  orders.filter((item) => {

    const now = new Date();

    const orderDate =
      new Date(item.created_at);

    return (

      now.getMonth() ===
      orderDate.getMonth()

    );

  }).reduce(

    (acc, item) =>

      acc + Number(item.amount || 0),

    0

  );
 const updateOrderStatus = async (

  id,
  status

) => {

  try {

    await axios.put(

      `http://localhost:5000/api/orders/${id}`,

      {
        order_status: status
      }

    );

    fetchData();

    alert(`Order ${status} ✅`);

  } catch (error) {

    console.log(error);

    alert("Update Failed ❌");

  }

};
const deleteUser = async (email) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user permanently?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `http://localhost:5000/api/users/${email}`
    );

    alert("User Deleted Successfully");

     fetchData();

  } catch (error) {

    console.log(error);

    alert("Delete Failed");

  }

};

  // =====================================================
  // 🔥 RETURN
  // =====================================================
  return (

    <div style={styles.container}>

      {/* SIDEBAR */}
      <Sidebar
        active={active}
        setActive={setActive}
      />

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <h1>{active}</h1>

          <button
            style={styles.logoutBtn}
            onClick={() => {

              localStorage.removeItem(
                "isAdmin"
              );

              navigate("/admin");

            }}
          >
            Logout
          </button>

        </div>

        {/* DASHBOARD */}
        {active === "Dashboard" && (

       <DashboardHome
        products={products}
        users={users}
        orders={orders}
        loading={loading}
      />
        )}

        {/* PRODUCTS */}
        {active === "Products" && (

          <ProductsPage

            styles={styles}

            form={form}
            setForm={setForm}

            addProduct={addProduct}

            search={search}
            setSearch={setSearch}

            filteredProducts={filteredProducts}

            showProducts={showProducts}
            setShowProducts={setShowProducts}

            editProduct={editProduct}
            deleteProduct={deleteProduct}
            
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}

            lowStockOnly={lowStockOnly}
            setLowStockOnly={setLowStockOnly}

            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}

          />

        )}

        {/* ORDERS */}
        {active === "Orders" && (

          <OrdersPage


            styles={styles}

            orders={orders}

            totalRevenue={totalRevenue}
            todaySales={todaySales}
            weekSales={weekSales}
            monthSales={monthSales}

            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}

            updateOrderStatus={updateOrderStatus}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}

            orderDateFilter={orderDateFilter}
            setOrderDateFilter={setOrderDateFilter}
          />

        )}

        {/* USERS */}
        {active === "Users" && (

         
       <UsersPage

      users={users}
      styles={styles}

      userSearch={userSearch}
      setUserSearch={setUserSearch}
      deleteUser={deleteUser}
/>

        )}

      </div>

      {/* EDIT MODAL */}
      {editId && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Edit Product</h2>

            <input
              type="text"
              style={styles.input}
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value
                })
              }
            />
            <input
              type="text"
              placeholder="Category"
              style={styles.input}
              value={editForm.category}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  category: e.target.value
                })
              }
            />
            <input
              type="text"
              placeholder="Second Image URL"
              style={styles.input}
              value={editForm.image2}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  image2: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Third Image URL"
              style={styles.input}
              value={editForm.image3}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  image3: e.target.value
                })
              }
            />

            <textarea
              placeholder="Description"
              style={styles.input}
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value
                })
              }
            />

            <input
              type="number"
              style={styles.input}
              value={editForm.price}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  price: e.target.value
                })
              }
            />

            <input
              type="number"
              style={styles.input}
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  stock: e.target.value
                })
              }
            />

            <input
              type="text"
              style={styles.input}
              value={editForm.image}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  image: e.target.value
                })
              }
            />

            <button
              style={styles.addBtn}
              onClick={updateProduct}
            >
              Save
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

// =====================================================
// 🔥 STYLES
// =====================================================
const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb"
  },

  main: {
    flex: 1,
    padding: "30px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px"
  },

  logoutBtn: {
    padding: "10px 20px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "400px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px"
  },

  addBtn: {
    padding: "10px 20px",
    background: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  filterRow: {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap",
  alignItems: "center"
},
// ============================================
// 🔥 STATS CARDS
// ============================================
ordersStats: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "30px"
},

orderCard: {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

// ============================================
// 🔥 FILTER BUTTONS
// ============================================
filterBtn: {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#e5e7eb",
  fontWeight: "bold"
},

activeFilter: {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#6c63ff",
  color: "#fff",
  fontWeight: "bold"
},

// ============================================
// 🔥 TABLE
// ============================================
ordersTableBox: {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  overflowX: "auto",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

table: {
  width: "100%",
  borderCollapse: "collapse"
},

th: {
  textAlign: "left",
  padding: "15px",
  background: "#f3f4f6",
  fontSize: "15px"
},

td: {
  padding: "15px",
  borderBottom:
    "1px solid #eee"
},

// ============================================
// 🔥 ACTION BUTTONS
// ============================================
deliverBtn: {
  padding: "8px 15px",
  background: "green",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},

cancelBtn: {
  padding: "8px 15px",
  background: "crimson",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},

// ============================================
// 🔥 PRODUCTS PAGE
// ============================================
productsGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
  gap: "25px",
  marginTop: "20px"
},

productCard: {
  background: "#fff",
  borderRadius: "15px",
  padding: "20px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

productImage: {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "15px"
},

productPrice: {
  color: "#6c63ff",
  fontWeight: "bold",
  fontSize: "20px"
},

productDesc: {
  color: "#666",
  marginTop: "10px",
  lineHeight: "1.6"
},

actionBtns: {
  display: "flex",
  gap: "10px",
  marginTop: "15px"
},

editBtn: {
  flex: 1,
  padding: "10px",
  background: "#6c63ff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},

deleteBtn: {
  flex: 1,
  padding: "10px",
  background: "crimson",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},

// ============================================
// 🔥 SEARCH
// ============================================
search: {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  marginBottom: "20px"
},
// ============================================
// 🔥 PRODUCTS TOP
// ============================================
productsTop: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap",
  gap: "15px"
},

showBtn: {
  padding: "12px 20px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
},

// ============================================
// 🔥 FORM BOX
// ============================================
formBox: {
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  marginBottom: "30px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

textarea: {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  marginBottom: "15px",
  minHeight: "120px",
  resize: "none"
},

// ============================================
// 🔥 FILTER ROW
// ============================================
filterRow: {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap",
  alignItems: "center"
},

// ============================================
// 🔥 SEARCH INPUT
// ============================================
search: {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "20px",
  fontSize: "15px",
  outline: "none"
},

// ============================================
// 🔥 PRODUCTS GRID
// ============================================
productsGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: "25px"
},

// ============================================
// 🔥 PRODUCT CARD
// ============================================
productCard: {
  background: "#fff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
  transition: "0.3s"
},

// ============================================
// 🔥 PRODUCT IMAGE
// ============================================
productImage: {
  width: "100%",
  height: "240px",
  objectFit: "cover"
},

// ============================================
// 🔥 PRODUCT PRICE
// ============================================
productPrice: {
  color: "#6c63ff",
  fontWeight: "bold",
  fontSize: "22px",
  marginTop: "10px"
},

// ============================================
// 🔥 PRODUCT DESCRIPTION
// ============================================
productDesc: {
  color: "#666",
  lineHeight: "1.6",
  marginTop: "10px"
},

// ============================================
// 🔥 ACTION BUTTONS
// ============================================
actionBtns: {
  display: "flex",
  gap: "10px",
  marginTop: "20px"
},

editBtn: {
  flex: 1,
  padding: "12px",
  background: "#6c63ff",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
},

deleteBtn: {
  flex: 1,
  padding: "12px",
  background: "crimson",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
},
// ============================================
// 🔥 USERS STATS GRID
// ============================================
statsGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
  gap: "25px",
  marginBottom: "30px"
},

// ============================================
// 🔥 USER CARD
// ============================================
card: {
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

// ============================================
// 🔥 USERS TABLE BOX
// ============================================
usersTableBox: {
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  overflowX: "auto",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
},

// ============================================
// 🔥 TABLE
// ============================================
table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
},

// ============================================
// 🔥 TABLE HEADER
// ============================================
th: {
  textAlign: "left",
  padding: "16px",
  background: "#f3f4f6",
  color: "#111827",
  fontSize: "15px"
},

// ============================================
// 🔥 TABLE DATA
// ============================================
td: {
  padding: "16px",
  borderBottom:
    "1px solid #eee",
  color: "#444"
}

};

export default AdminDashboard;