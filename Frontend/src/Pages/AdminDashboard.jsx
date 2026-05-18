// 📁 src/pages/AdminDashboard.jsx

// =====================================================
// 🔥 IMPORTS
// =====================================================
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();



  // =====================================================
  // 🔥 ACTIVE SIDEBAR
  // =====================================================
  const [active, setActive] =
    useState("Dashboard");



  // =====================================================
  // 🔥 PRODUCTS STATE
  // =====================================================
  const [products, setProducts] =
    useState([]);




  // =====================================================
  // 🔥 ADD PRODUCT FORM
  // =====================================================
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  });




  // =====================================================
  // 🔥 EDIT PRODUCT STATES
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



    // ❌ IF NOT ADMIN
    if (!isAdmin) {

      navigate("/admin");

    }

  }, [navigate]);




  // =====================================================
  // 🔥 LOAD PRODUCTS
  // =====================================================
  useEffect(() => {

    fetchProducts();

  }, []);




  // =====================================================
  // 🔥 FETCH PRODUCTS FROM BACKEND
  // =====================================================
  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data);

    } catch (error) {

      console.log(error);

      alert("Failed To Load Products");

    }

  };




  // =====================================================
  // 🔥 ADD PRODUCT
  // =====================================================
  const addProduct = async () => {

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



    try {

      // 🔥 SEND PRODUCT TO BACKEND
      await axios.post(

        "http://localhost:5000/api/products",

        {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image,
          description: "New Product"
        }

      );



      // 🔥 REFRESH PRODUCTS
      fetchProducts();



      // 🔥 CLEAR FORM
      setForm({
        name: "",
        price: "",
        stock: "",
        image: ""
      });



      alert("✅ Product Added");

    } catch (error) {

      console.log(error);

      alert("❌ Failed To Add Product");

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



      // 🔥 REFRESH PRODUCTS
      fetchProducts();

      alert("✅ Product Deleted");

    } catch (error) {

      console.log(error);

      alert("Delete Failed");

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



      // 🔥 REFRESH PRODUCTS
      fetchProducts();



      // 🔥 CLOSE MODAL
      setEditId(null);



      // 🔥 RESET FORM
      setEditForm({
        name: "",
        price: "",
        stock: "",
        image: ""
      });



      alert("✅ Product Updated");

    } catch (error) {

      console.log(error);

      alert("Update Failed");

    }

  };




  // =====================================================
  // 📊 DASHBOARD STATS
  // =====================================================
  const stats = [

    {
      title: "Total Products",
      value: products.length
    },

    {
      title: "Products Sold",
      value: "1,240"
    },

    {
      title: "Revenue",
      value: "₹ 4,50,000"
    },

    {
      title: "Users",
      value: "860"
    }

  ];




  // =====================================================
  // 🔥 UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* =====================================================
          🔥 SIDEBAR
      ===================================================== */}
      <div style={styles.sidebar}>

        <h2 style={styles.logo}>
          Admin Panel
        </h2>



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

          <h1>{active}</h1>



          {/* 🔥 LOGOUT */}
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




        {/* =====================================================
            📊 DASHBOARD
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

            {/* 🔥 ADD PRODUCT */}
            <div style={styles.formBox}>

              <h2>Add Product</h2>



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

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Image
                    </th>

                    <th style={styles.th}>
                      Name
                    </th>

                    <th style={styles.th}>
                      Price
                    </th>

                    <th style={styles.th}>
                      Stock
                    </th>

                    <th style={styles.th}>
                      Actions
                    </th>

                  </tr>

                </thead>



                <tbody>

                  {products.map((item) => (

                    <tr key={item.id}>

                      <td style={styles.td}>

                        <img
                          src={item.image}
                          alt={item.name}
                          width="60"
                          height="60"
                          style={{
                            objectFit: "cover",
                            borderRadius: "10px"
                          }}
                        />

                      </td>



                      <td style={styles.td}>
                        {item.name}
                      </td>



                      <td style={styles.td}>
                        ₹ {item.price}
                      </td>



                      <td style={styles.td}>
                        {item.stock}
                      </td>



                      <td style={styles.td}>

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

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}





        {/* =====================================================
            🛒 ORDERS
        ===================================================== */}
        {active === "Orders" && (

          <div style={styles.card}>

            <h2>Recent Orders</h2>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td style={styles.td}>#1001</td>
                  <td style={styles.td}>Dushyanth</td>
                  <td style={styles.td}>₹ 80,000</td>
                  <td style={styles.td}>Delivered</td>
                </tr>

                <tr>
                  <td style={styles.td}>#1002</td>
                  <td style={styles.td}>Rahul</td>
                  <td style={styles.td}>₹ 45,000</td>
                  <td style={styles.td}>Pending</td>
                </tr>

              </tbody>

            </table>

          </div>

        )}





        {/* =====================================================
            👥 USERS
        ===================================================== */}
        {active === "Users" && (

          <div style={styles.card}>

            <h2>Users List</h2>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td style={styles.td}>1</td>
                  <td style={styles.td}>Dushyanth</td>
                  <td style={styles.td}>dush@gmail.com</td>
                </tr>

                <tr>
                  <td style={styles.td}>2</td>
                  <td style={styles.td}>Rahul</td>
                  <td style={styles.td}>rahul@gmail.com</td>
                </tr>

              </tbody>

            </table>

          </div>

        )}





        {/* =====================================================
            📈 ANALYTICS
        ===================================================== */}
        {active === "Analytics" && (

          <div style={styles.card}>

            <h2>Analytics</h2>

            <p>Total Revenue Growth 🚀</p>

            <div style={styles.analyticsBox}>

              <div style={styles.analyticsBar}></div>

            </div>

          </div>

        )}

      </div>




      {/* =====================================================
          🔥 EDIT MODAL
      ===================================================== */}
      {editId && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Edit Product</h2>



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



            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              <button
                style={styles.addBtn}
                onClick={updateProduct}
              >
                Save
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




// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f4f4"
  },



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



  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },



  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  formBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "30px"
  },



  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },



  addBtn: {
    padding: "10px 20px",
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



  tableBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    overflowX: "auto"
  },



  table: {
    width: "100%",
    borderCollapse: "collapse"
  },



  th: {
    padding: "15px",
    textAlign: "left",
    background: "#f3f4f6"
  },



  td: {
    padding: "15px",
    borderBottom: "1px solid #eee"
  },



  analyticsBox: {
    width: "100%",
    height: "20px",
    background: "#ddd",
    borderRadius: "20px",
    marginTop: "20px",
    overflow: "hidden"
  },



  analyticsBar: {
    width: "75%",
    height: "100%",
    background: "#6c63ff"
  },



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



  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "400px"
  }

};

export default AdminDashboard;