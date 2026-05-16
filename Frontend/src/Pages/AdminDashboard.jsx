// 📁 AdminDashboard.jsx

// 🔥 IMPORT REACT HOOKS
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminDashboard() {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();



  // =====================================================
  // 🔥 ACTIVE SIDEBAR MENU
  // =====================================================
  const [active, setActive] =
    useState("Dashboard");



  // =====================================================
  // 🔥 PRODUCTS STATE
  // =====================================================
  // 👉 Load products from localStorage
  // 👉 If empty, use default products
  // =====================================================
  const [products, setProducts] = useState(() => {

    // 🔥 GET SAVED PRODUCTS
    const savedProducts =
      localStorage.getItem("products");



    // 🔥 RETURN SAVED OR DEFAULT PRODUCTS
    return savedProducts
      ? JSON.parse(savedProducts)
      : [

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

        ];

  });



  // =====================================================
  // 🔥 SAVE PRODUCTS TO LOCAL STORAGE
  // =====================================================
  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

  }, [products]);



  // =====================================================
  // 🔥 ADD PRODUCT FORM STATE
  // =====================================================
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });



  // =====================================================
  // 🔥 EDIT PRODUCT STATE
  // =====================================================
  const [editId, setEditId] =
    useState(null);



  // =====================================================
  // 🔥 EDIT FORM STATE
  // =====================================================
  const [editForm, setEditForm] =
    useState({
      name: "",
      price: "",
      stock: "",
      image: ""
    });



  // =====================================================
  // 🔐 ADMIN PAGE PROTECTION
  // =====================================================
  useEffect(() => {

    // 🔥 CHECK ADMIN LOGIN
    const isAdmin =
      localStorage.getItem("isAdmin");



    // ❌ REDIRECT IF NOT ADMIN
    if (!isAdmin) {
      navigate("/admin");
    }

  }, [navigate]);



  // =====================================================
  // 🔥 ADD PRODUCT FUNCTION
  // =====================================================
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



    // 🔥 CREATE NEW PRODUCT
    const newProduct = {
      id: Date.now(),
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



  // =====================================================
  // 🔥 DELETE PRODUCT FUNCTION
  // =====================================================
  const deleteProduct = (id) => {

    // 🔥 FILTER PRODUCTS
    const filteredProducts =
      products.filter(
        (item) => item.id !== id
      );



    // 🔥 UPDATE STATE
    setProducts(filteredProducts);

  };



  // =====================================================
  // 🔥 EDIT PRODUCT FUNCTION
  // =====================================================
  const editProduct = (product) => {

    // 🔥 STORE PRODUCT ID
    setEditId(product.id);



    // 🔥 FILL EDIT FORM
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image
    });

  };



  // =====================================================
  // 🔥 UPDATE PRODUCT FUNCTION
  // =====================================================
  const updateProduct = () => {

    // 🔥 UPDATE MATCHING PRODUCT
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



    // 🔥 CLOSE MODAL
    setEditId(null);



    // 🔥 RESET FORM
    setEditForm({
      name: "",
      price: "",
      stock: "",
      image: ""
    });

  };



  // =====================================================
  // 📊 DASHBOARD STATS
  // =====================================================
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
      value: products.length
    },

    {
      title: "Total Users",
      value: "860"
    }

  ];



  // =====================================================
  // 🔥 RETURN UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* =====================================================
          🔥 SIDEBAR
      ===================================================== */}
      <div style={styles.sidebar}>

        {/* 🔥 LOGO */}
        <h2 style={styles.logo}>
          Admin Panel
        </h2>



        {/* 🔥 MENU */}
        <ul style={styles.menu}>

          {/* DASHBOARD */}
          <li
            onClick={() =>
              setActive("Dashboard")
            }
            style={
              active === "Dashboard"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Dashboard
          </li>



          {/* ORDERS */}
          <li
            onClick={() =>
              setActive("Orders")
            }
            style={
              active === "Orders"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Orders
          </li>



          {/* PRODUCTS */}
          <li
            onClick={() =>
              setActive("Products")
            }
            style={
              active === "Products"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Products
          </li>



          {/* USERS */}
          <li
            onClick={() =>
              setActive("Users")
            }
            style={
              active === "Users"
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            Users
          </li>



          {/* ANALYTICS */}
          <li
            onClick={() =>
              setActive("Analytics")
            }
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



      {/* =====================================================
          🔥 MAIN CONTENT
      ===================================================== */}
      <div style={styles.main}>

        {/* 🔥 HEADER */}
        <div style={styles.header}>

          {/* 🔥 ACTIVE PAGE TITLE */}
          <h1>{active}</h1>



          {/* 🔥 LOGOUT BUTTON */}
          <button
            style={styles.logoutBtn}
            onClick={() => {

              // 🔥 REMOVE ADMIN LOGIN
              localStorage.removeItem(
                "isAdmin"
              );

              // 🔥 REDIRECT
              navigate("/admin");

            }}
          >
            Logout
          </button>

        </div>



        {/* =====================================================
            📊 DASHBOARD SECTION
        ===================================================== */}
        {active === "Dashboard" && (

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

        )}



        {/* =====================================================
            📦 PRODUCTS SECTION
        ===================================================== */}
        {active === "Products" && (

          <div>

            {/* 🔥 ADD PRODUCT FORM */}
            <div style={styles.formBox}>

              <h2>Add Product</h2>



              {/* PRODUCT NAME */}
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



              {/* PRODUCT PRICE */}
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



              {/* PRODUCT STOCK */}
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



              {/* PRODUCT IMAGE */}
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



              {/* 🔥 IMAGE PREVIEW */}
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



            {/* =====================================================
                🔥 PRODUCTS TABLE
            ===================================================== */}
            <div style={styles.tableBox}>

              <h2>Manage Products</h2>

              <table style={styles.table}>

                {/* TABLE HEAD */}
                <thead>

                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Actions</th>
                  </tr>

                </thead>



                {/* TABLE BODY */}
                <tbody>

                  {products.map((item) => (

                    <tr key={item.id}>

                      <td style={styles.td}>
                        {item.id}
                      </td>



                      {/* PRODUCT IMAGE */}
                      <td style={styles.td}>

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



                      {/* PRODUCT NAME */}
                      <td style={styles.td}>
                        {item.name}
                      </td>



                      {/* PRODUCT PRICE */}
                      <td style={styles.td}>
                        ₹ {item.price}
                      </td>



                      {/* PRODUCT STOCK */}
                      <td style={styles.td}>
                        {item.stock}
                      </td>



                      {/* ACTION BUTTONS */}
                      <td style={styles.td}>

                        {/* EDIT BUTTON */}
                        <button
                          style={styles.editBtn}
                          onClick={() =>
                            editProduct(item)
                          }
                        >
                          Edit
                        </button>



                        {/* DELETE BUTTON */}
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

      </div>



      {/* =====================================================
          🔥 EDIT PRODUCT MODAL
      ===================================================== */}
      {editId && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Edit Product</h2>



            {/* EDIT NAME */}
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



            {/* EDIT PRICE */}
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



            {/* EDIT STOCK */}
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



            {/* EDIT IMAGE */}
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



            {/* 🔥 BUTTONS */}
            <div style={{
              display: "flex",
              gap: "10px"
            }}>

              {/* SAVE */}
              <button
                style={styles.addBtn}
                onClick={updateProduct}
              >
                Save Changes
              </button>



              {/* CANCEL */}
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



// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // MAIN CONTAINER
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



  // LOGO
  logo: {
    marginBottom: "40px"
  },



  // MENU
  menu: {
    listStyle: "none",
    padding: 0
  },



  // MENU ITEM
  menuItem: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px"
  },



  // ACTIVE MENU
  activeMenu: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    background: "#6c63ff"
  },



  // MAIN CONTENT
  main: {
    flex: 1,
    padding: "30px"
  },



  // HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },



  // LOGOUT BUTTON
  logoutBtn: {
    padding: "10px 20px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },



  // DASHBOARD GRID
  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },



  // CARD
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  // FORM BOX
  formBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "30px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  // INPUT
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box"
  },



  // ADD BUTTON
  addBtn: {
    padding: "12px 20px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer"
  },



  // EDIT BUTTON
  editBtn: {
    padding: "8px 14px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px"
  },



  // DELETE BUTTON
  deleteBtn: {
    padding: "8px 14px",
    border: "none",
    background: "crimson",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },



  // TABLE BOX
  tableBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
    overflowX: "auto"
  },



  // TABLE
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse"
  },



  // TABLE HEADER
  th: {
    padding: "15px",
    textAlign: "left",
    background: "#f3f4f6",
    borderBottom: "2px solid #ddd",
    fontSize: "15px"
  },



  // TABLE DATA
  td: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle"
  },



  // MODAL OVERLAY
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },



  // MODAL BOX
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "400px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.2)"
  }

};



// =====================================================
// 🔥 EXPORT COMPONENT
// =====================================================
export default AdminDashboard;