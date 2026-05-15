import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminDashboard() {

  // 🔥 NAVIGATION
  const navigate = useNavigate();

  // 🔥 ACTIVE SIDEBAR
  const [active, setActive] = useState("Dashboard");



  // 🔥 PRODUCTS STATE
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15",
      stock: 25,
      price: 80000,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
    },

    {
      id: 2,
      name: "Samsung S24",
      stock: 18,
      price: 70000,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"
    },

    {
      id: 3,
      name: "MacBook Pro",
      stock: 12,
      price: 120000,
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8"
    }
  ]);



  // 🔥 ADD PRODUCT FORM
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });



  // 🔥 EDIT MODE
  const [editId, setEditId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });



  // 🔐 ADMIN PROTECTION
  useEffect(() => {

    const isAdmin =
      localStorage.getItem("isAdmin");

    if (!isAdmin) {
      navigate("/admin");
    }

  }, [navigate]);



  // 🔥 ADD PRODUCT
  const addProduct = () => {

    // ❌ VALIDATION
    if (
      !form.name ||
      !form.price ||
      !form.stock ||
      !form.image
    ) {
      alert("Fill all fields");
      return;
    }



    // 🔥 NEW PRODUCT
    const newProduct = {
      id: products.length + 1,
      name: form.name,
      price: form.price,
      stock: form.stock,
      image: form.image
    };



    // 🔥 UPDATE PRODUCTS
    setProducts([
      ...products,
      newProduct
    ]);



    // 🔥 CLEAR FORM
    setForm({
      name: "",
      price: "",
      stock: "",
      image: ""
    });

  };



  // 🔥 DELETE PRODUCT
  const deleteProduct = (id) => {

    const filteredProducts =
      products.filter(
        (item) => item.id !== id
      );

    setProducts(filteredProducts);

  };



  // 🔥 EDIT PRODUCT
  const editProduct = (product) => {

    // 🔥 STORE EDIT ID
    setEditId(product.id);

    // 🔥 FILL FORM
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image
    });

  };



  // 🔥 UPDATE PRODUCT
  const updateProduct = () => {

    const updatedProducts =
      products.map((item) => {

        if (item.id === editId) {

          return {
            ...item,
            ...editForm
          };

        }

        return item;

      });



    // 🔥 UPDATE STATE
    setProducts(updatedProducts);



    // 🔥 RESET
    setEditId(null);

    setEditForm({
      name: "",
      price: "",
      stock: "",
      image: ""
    });

  };



  // 📊 DASHBOARD STATS
  const stats = [
    {
      title: "Total Sales",
      value: "₹ 4,50,000"
    },

    {
      title: "Products Sold",
      value: "1,240"
    },

    {
      title: "Stock Available",
      value: "320"
    },

    {
      title: "Total Users",
      value: "860"
    }
  ];



  return (

    <div style={styles.container}>

      {/* 🔥 SIDEBAR */}
      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          Admin Panel
        </h2>



        <ul style={styles.menu}>

          <li
            onClick={() => setActive("Dashboard")}
            style={
              active === "Dashboard"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Dashboard
          </li>



          <li
            onClick={() => setActive("Orders")}
            style={
              active === "Orders"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Orders
          </li>



          <li
            onClick={() => setActive("Products")}
            style={
              active === "Products"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Products
          </li>



          <li
            onClick={() => setActive("Users")}
            style={
              active === "Users"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Users
          </li>



          <li
            onClick={() => setActive("Analytics")}
            style={
              active === "Analytics"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Analytics
          </li>

        </ul>

      </div>



      {/* 🔥 MAIN CONTENT */}
      <div style={styles.main}>

        {/* 🔥 HEADER */}
        <div style={styles.header}>

          <h1>{active}</h1>

          <button
            style={styles.logoutBtn}
            onClick={() => {

              localStorage.removeItem("isAdmin");

              navigate("/admin");

            }}
          >
            Logout
          </button>

        </div>



        {/* 📊 DASHBOARD */}
        {active === "Dashboard" && (

          <>
            {/* 📊 STATS */}
            <div style={styles.statsGrid}>

              {stats.map((item, index) => (

                <div
                  key={index}
                  style={styles.card}
                >

                  <h3>{item.title}</h3>

                  <h1>{item.value}</h1>

                </div>

              ))}

            </div>



            {/* 📈 CHART */}
            <div style={styles.chartBox}>

              <h2>Sales Analytics</h2>

              <div style={styles.chartContainer}>

                <div style={{
                  ...styles.bar,
                  height: "120px"
                }}>
                  <span>Jan</span>
                </div>

                <div style={{
                  ...styles.bar,
                  height: "180px"
                }}>
                  <span>Feb</span>
                </div>

                <div style={{
                  ...styles.bar,
                  height: "150px"
                }}>
                  <span>Mar</span>
                </div>

                <div style={{
                  ...styles.bar,
                  height: "220px"
                }}>
                  <span>Apr</span>
                </div>

                <div style={{
                  ...styles.bar,
                  height: "170px"
                }}>
                  <span>May</span>
                </div>

              </div>

            </div>
          </>
        )}



        {/* 📦 PRODUCTS */}
        {active === "Products" && (

          <div>

            {/* 🔥 ADD PRODUCT FORM */}
            <div style={styles.formBox}>

              <h2>Add Product</h2>



              {/* 🔥 PRODUCT NAME */}
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



              {/* 🔥 PRICE */}
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



              {/* 🔥 STOCK */}
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



              {/* 🔥 IMAGE URL */}
              <input
                type="text"
                placeholder="Image URL"
                style={styles.input}
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value
                  })
                }
              />



              {/* 🖼 LIVE IMAGE PREVIEW */}
              {form.image && (

                <img
                  src={form.image}
                  alt="preview"
                  width="120"
                  height="120"
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px"
                  }}
                />

              )}



              {/* 🔥 ADD BUTTON */}
              <button
                style={styles.addBtn}
                onClick={addProduct}
              >
                Add Product
              </button>

            </div>



            {/* 🔥 PRODUCT TABLE */}
            <div style={styles.tableBox}>

              <h2>Manage Products</h2>

              <table style={styles.table}>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {products.map((item) => (

                    <tr key={item.id}>

                      <td>{item.id}</td>



                      {/* 🖼 PRODUCT IMAGE */}
                      <td>

                        <img
                          src={item.image}
                          alt={item.name}
                          width="60"
                          height="60"
                          style={{
                            borderRadius: "10px",
                            objectFit: "cover"
                          }}
                        />

                      </td>



                      <td>{item.name}</td>

                      <td>₹ {item.price}</td>

                      <td>{item.stock}</td>



                      {/* 🔥 ACTION BUTTONS */}
                      <td>

                        {/* 🔥 EDIT */}
                        <button
                          style={styles.editBtn}
                          onClick={() =>
                            editProduct(item)
                          }
                        >
                          Edit
                        </button>



                        {/* 🔥 DELETE */}
                        <button
                          style={styles.deleteBtn}
                          onClick={() =>
                            deleteProduct(item.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}



        {/* 🛒 ORDERS */}
        {active === "Orders" && (

          <div style={styles.tableBox}>

            <h2>Recent Orders</h2>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>#1001</td>
                  <td>Dushyanth</td>
                  <td>Delivered</td>
                  <td>₹ 80,000</td>
                </tr>

                <tr>
                  <td>#1002</td>
                  <td>Rahul</td>
                  <td>Pending</td>
                  <td>₹ 25,000</td>
                </tr>

              </tbody>

            </table>

          </div>
        )}



        {/* 👥 USERS */}
        {active === "Users" && (

          <div style={styles.tableBox}>

            <h2>Users List</h2>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>1</td>
                  <td>Dushyanth</td>
                  <td>dush@gmail.com</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Arun</td>
                  <td>arun@gmail.com</td>
                </tr>

              </tbody>

            </table>

          </div>
        )}



        {/* 📈 ANALYTICS */}
        {active === "Analytics" && (

          <div style={styles.chartBox}>

            <h2>Revenue Analytics</h2>

            <div style={styles.chartContainer}>

              <div style={{
                ...styles.bar,
                height: "100px"
              }}>
                <span>Mon</span>
              </div>

              <div style={{
                ...styles.bar,
                height: "200px"
              }}>
                <span>Tue</span>
              </div>

              <div style={{
                ...styles.bar,
                height: "150px"
              }}>
                <span>Wed</span>
              </div>

              <div style={{
                ...styles.bar,
                height: "240px"
              }}>
                <span>Thu</span>
              </div>

              <div style={{
                ...styles.bar,
                height: "180px"
              }}>
                <span>Fri</span>
              </div>

            </div>

          </div>
        )}

      </div>



      {/* 🔥 EDIT MODAL */}
      {editId && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Edit Product</h2>



            {/* 🔥 NAME */}
            <input
              type="text"
              placeholder="Product Name"
              style={styles.input}
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value
                })
              }
            />



            {/* 🔥 PRICE */}
            <input
              type="number"
              placeholder="Price"
              style={styles.input}
              value={editForm.price}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  price: e.target.value
                })
              }
            />



            {/* 🔥 STOCK */}
            <input
              type="number"
              placeholder="Stock"
              style={styles.input}
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  stock: e.target.value
                })
              }
            />



            {/* 🔥 IMAGE */}
            <input
              type="text"
              placeholder="Image URL"
              style={styles.input}
              value={editForm.image}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  image: e.target.value
                })
              }
            />



            {/* 🖼 IMAGE PREVIEW */}
            {editForm.image && (

              <img
                src={editForm.image}
                alt="preview"
                width="120"
                height="120"
                style={{
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px"
                }}
              />

            )}



            {/* 🔥 BUTTONS */}
            <div style={{
              display: "flex",
              gap: "10px"
            }}>

              <button
                style={styles.addBtn}
                onClick={updateProduct}
              >
                Save Changes
              </button>



              <button
                style={styles.deleteBtn}
                onClick={() =>
                  setEditId(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}



// 🎨 STYLES
const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f4f4"
  },



  // SIDEBAR
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "30px 20px"
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
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px"
  },



  activeMenu: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    background: "#6c63ff"
  },



  // MAIN
  main: {
    flex: 1,
    padding: "30px"
  },



  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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



  // STATS
  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },



  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  // CHART
  chartBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  chartContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "20px",
    height: "250px",
    marginTop: "20px"
  },



  bar: {
    width: "60px",
    background: "#6c63ff",
    borderRadius: "10px 10px 0 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    color: "#fff",
    paddingBottom: "10px"
  },



  // TABLE
  tableBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse"
  },



  // FORM
  formBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "30px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },



  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box"
  },



  addBtn: {
    padding: "12px 20px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },



  editBtn: {
    padding: "8px 14px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px"
  },



  deleteBtn: {
    padding: "8px 14px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },



  // MODAL
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
    width: "400px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
  }

};

export default AdminDashboard;