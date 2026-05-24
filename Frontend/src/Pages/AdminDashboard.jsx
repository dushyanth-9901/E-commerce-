// 📁 src/pages/AdminDashboard.jsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "axios";

function AdminDashboard() {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();

  // =====================================================
  // 🔥 STATES
  // =====================================================
  const [active, setActive] =
    useState("Dashboard");

  const [products, setProducts] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showProducts, setShowProducts] =
  useState(false);
  // =====================================================
  // 🔥 PRODUCT FORM
  // =====================================================
 const [form, setForm] = useState({
  name: "",
  price: "",
  stock: "",
  image: "",
  images: [""]
});

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
      image: ""
    });

  // =====================================================
  // 🔐 ADMIN PROTECTION
  // =====================================================
  useEffect(() => {

    const isAdmin =
      localStorage.getItem("isAdmin");

    if (!isAdmin) {
      navigate("/admin");
    }

    fetchData();

  }, []);

  // =====================================================
  // 🔥 FETCH DATA
  // =====================================================
  const fetchData = async () => {

    try {

      setLoading(true);

      // PRODUCTS
      const productsRes =
        await axios.get(
          "http://localhost:5000/api/products"
        );

      // USERS
      const usersRes =
        await axios.get(
          "http://localhost:5000/api/users"
        );

      // ORDERS
      const ordersRes =
        await axios.get(
          "http://localhost:5000/api/orders"
        );

      setProducts(productsRes.data);

      setUsers(usersRes.data);

      setOrders(ordersRes.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

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
          image: form.image,
          images: JSON.stringify(form.images),
          description: "New Product"
        }
          );

      fetchData();

      setForm({
        name: "",
        price: "",
        stock: "",
        image: ""
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

    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image
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
          image: editForm.image
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
  // 🔥 DASHBOARD STATS
  // =====================================================

  const totalProducts =
    products.length;

  const totalUsers =
    users.length;

  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (acc, item) =>
        acc + Number(item.amount || 0),
      0
    );

  const lowStock =
    products.filter(
      (item) => Number(item.stock) < 5
    ).length;

  // =====================================================
  // 🔥 TODAY USERS
  // =====================================================
  const todayUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const today =
        new Date().toDateString();

      return (
        new Date(user.created_at)
          .toDateString() === today
      );

    }).length;

  // =====================================================
  // 🔥 YESTERDAY USERS
  // =====================================================
  const yesterdayUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const yesterday =
        new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return (
        new Date(user.created_at)
          .toDateString() ===
        yesterday.toDateString()
      );

    }).length;

  // =====================================================
  // 🔥 WEEK USERS
  // =====================================================
  const weekUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const now =
        new Date();

      const userDate =
        new Date(user.created_at);

      const diff =
        now - userDate;

      const days =
        diff / (1000 * 60 * 60 * 24);

      return days <= 7;

    }).length;

  // =====================================================
  // 🔥 ORDER ANALYTICS
  // =====================================================
  const deliveredOrders =
    orders.filter(
      (item) =>
        item.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  // =====================================================
  // 🔥 OUT OF STOCK
  // =====================================================
  const outOfStock =
    products.filter(
      (item) =>
        Number(item.stock) === 0
    ).length;

  // =====================================================
  // 🔥 SEARCH FILTER
  // =====================================================
  const filteredProducts =
    products.filter((item) =>
      item.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // =====================================================
  // 🔥 CHART DATA
  // =====================================================
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
    { month: "May", sales: 9000 }
  ];

  const stockData = [
    {
      name: "In Stock",
      value: products.filter(
        (item) => item.stock > 5
      ).length
    },
    {
      name: "Low Stock",
      value: products.filter(
        (item) => item.stock <= 5
      ).length
    }
  ];

  const COLORS = [
    "#6c63ff",
    "#ff4d4d"
  ];

  // =====================================================
  // 🔥 LOADING
  // =====================================================
  if (loading) {
    return (
      <h1 style={{
        textAlign: "center",
        marginTop: "100px"
      }}>
        Loading Dashboard...
      </h1>
    );
  }

  return (

    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          Admin Panel
        </h2>

        <ul style={styles.menu}>

          {[
            "Dashboard",
            "Products",
            "Orders",
            "Users"
          ].map((item) => (

            <li
              key={item}
              onClick={() =>
                setActive(item)
              }
              style={
                active === item
                  ? styles.activeMenu
                  : styles.menuItem
              }
            >
              {item}
            </li>

          ))}

        </ul>

      </div>

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

          <>

            {/* STATS */}
            <div style={styles.statsGrid}>

              <div style={styles.card}>
                <h2>{totalProducts}</h2>
                <p>Total Products</p>
              </div>

              <div style={styles.card}>
                <h2>{totalUsers}</h2>
                <p>Total Users</p>
              </div>

              <div style={styles.card}>
                <h2>{totalOrders}</h2>
                <p>Total Orders</p>
              </div>

              <div style={styles.card}>
                <h2>
                  ₹ {totalRevenue}
                </h2>
                <p>Total Revenue</p>
              </div>

            </div>

            {/* CHARTS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(350px,1fr))",
                gap: "20px",
                marginTop: "30px"
              }}
            >

              {/* SALES */}
              <div style={styles.card}>

                <h2>Monthly Sales</h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart data={salesData}>

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="sales"
                      fill="#6c63ff"
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* REVENUE */}
              <div style={styles.card}>

                <h2>Revenue Growth</h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart data={salesData}>

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#00b894"
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

              {/* STOCK */}
              <div style={styles.card}>

                <h2>Stock Overview</h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={stockData}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >

                      {stockData.map(
                        (entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[index]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

              {/* QUICK INSIGHTS */}
              <div style={styles.card}>

                <h2>Quick Insights</h2>

                <p>
                  ✅ Products:
                  {totalProducts}
                </p>

                <p>
                  👥 Users:
                  {totalUsers}
                </p>

                <p>
                  🛒 Orders:
                  {totalOrders}
                </p>

                <p>
                  ⚠ Low Stock:
                  {lowStock}
                </p>

                <p>
                  🆕 Users Today:
                  {todayUsers}
                </p>

                <p>
                  📅 Yesterday Users:
                  {yesterdayUsers}
                </p>

                <p>
                  📈 New Users This Week:
                  {weekUsers}
                </p>

                <p>
                  ✅ Delivered Orders:
                  {deliveredOrders}
                </p>

                <p>
                  ⏳ Pending Orders:
                  {pendingOrders}
                </p>

                <p>
                  ❌ Out Of Stock:
                  {outOfStock}
                </p>

              </div>

            </div>

          </>

        )}

       {/* PRODUCTS */}
{active === "Products" && (

  <>

    {/* ===================================================== */}
    {/* 🔥 TOP HEADER */}
    {/* ===================================================== */}
    <div style={styles.productsTop}>

      <h2>
        Product Management 📦
      </h2>

      <button
        style={styles.showBtn}
        onClick={() =>
          setShowProducts(!showProducts)
        }
      >
        {showProducts
          ? "Hide Products"
          : "Show Products"}
      </button>

    </div>





    {/* ===================================================== */}
    {/* 🔥 ADD PRODUCT FORM */}
    {/* ===================================================== */}
    <div style={styles.formBox}>

      <h2>Add New Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        style={styles.input}
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value
          })
        }
      />

      <input
        type="number"
        placeholder="Price"
        style={styles.input}
        value={form.price}
        onChange={(e) =>
          setForm({
            ...form,
            price: e.target.value
          })
        }
      />

      <input
        type="number"
        placeholder="Stock"
        style={styles.input}
        value={form.stock}
        onChange={(e) =>
          setForm({
            ...form,
            stock: e.target.value
          })
        }
      />

      <textarea
        placeholder="Product Description"
        style={styles.textarea}
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value
          })
        }
      />



      {/* ===================================================== */}
      {/* 🔥 IMAGE 1 */}
      {/* ===================================================== */}
      <input
        type="text"
        placeholder="Image URL 1"
        style={styles.input}
        value={form.image}
        onChange={(e) =>
          setForm({
            ...form,
            image: e.target.value
          })
        }
      />



      {/* ===================================================== */}
      {/* 🔥 IMAGE 2 */}
      {/* ===================================================== */}
      <input
        type="text"
        placeholder="Image URL 2"
        style={styles.input}
        value={form.image2 || ""}
        onChange={(e) =>
          setForm({
            ...form,
            image2: e.target.value
          })
        }
      />



      {/* ===================================================== */}
      {/* 🔥 IMAGE 3 */}
      {/* ===================================================== */}
      <input
        type="text"
        placeholder="Image URL 3"
        style={styles.input}
        value={form.image3 || ""}
        onChange={(e) =>
          setForm({
            ...form,
            image3: e.target.value
          })
        }
      />



      <button
        style={styles.addBtn}
        onClick={addProduct}
      >
        Add Product
      </button>

    </div>






    {/* ===================================================== */}
    {/* 🔍 SEARCH */}
    {/* ===================================================== */}
    <input
      type="text"
      placeholder="Search Products..."
      style={styles.search}
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />






    {/* ===================================================== */}
    {/* 🔥 PRODUCTS LIST */}
    {/* ===================================================== */}
    {showProducts && (

      <div style={styles.productsGrid}>

        {filteredProducts.map((item) => (

          <div
            key={item.id}
            style={styles.productCard}
          >

            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              style={styles.productImage}
            />



            {/* NAME */}
            <h3>
              {item.name}
            </h3>



            {/* PRICE */}
            <p style={styles.productPrice}>
              ₹ {item.price}
            </p>



            {/* STOCK */}
            <p>
              Stock:
              {" "}
              {item.stock}
            </p>



            {/* DESCRIPTION */}
            <p style={styles.productDesc}>
              {
                item.description
                  || "No Description"
              }
            </p>





            {/* ===================================================== */}
            {/* 🔥 ACTION BUTTONS */}
            {/* ===================================================== */}
            <div style={styles.actionBtns}>

              <button
                style={styles.editBtn}
                onClick={() =>
                  editProduct(item)
                }
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() =>
                  deleteProduct(item.id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </>

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

const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb"
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "30px"
  },

  logo: {
    marginBottom: "40px"
  },

  menu: {
    listStyle: "none",
    padding: 0
  },

  menuItem: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer"
  },

  activeMenu: {
    padding: "12px",
    marginBottom: "10px",
    background: "#6c63ff",
    borderRadius: "8px",
    cursor: "pointer"
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px"
  },

  formBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px"
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

  tableBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    padding: "15px",
    background: "#f3f4f6"
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #eee"
  },

  editBtn: {
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "8px 12px",
    background: "crimson",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
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

  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  productsTop: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
},

showBtn: {
  padding: "10px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer"
},

productsGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: "25px",
  marginTop: "20px"
},

productCard: {
  background: "#fff",
  borderRadius: "18px",
  padding: "20px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.08)"
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
  fontSize: "20px",
  fontWeight: "bold"
},

productDesc: {
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.5"
},

actionBtns: {
  display: "flex",
  gap: "10px",
  marginTop: "15px"
},

textarea: {
  width: "100%",
  minHeight: "120px",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd"
},

};

export default AdminDashboard;