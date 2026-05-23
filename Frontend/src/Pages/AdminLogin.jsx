// 📁 src/pages/AdminLogin.jsx

// =====================================================
// 🔥 IMPORT REACT
// =====================================================
import { useState } from "react";



// =====================================================
// 🔥 IMPORT NAVIGATION
// =====================================================
import { useNavigate } from "react-router-dom";



// =====================================================
// 🔥 IMPORT AXIOS
// =====================================================
import axios from "axios";





function AdminLogin() {

  // =====================================================
  // 🔥 FORM STATES
  // =====================================================
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");



  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();





  // =====================================================
  // 🔐 HANDLE ADMIN LOGIN
  // =====================================================
  const handleLogin = async () => {

    try {

      // =====================================================
      // ❌ EMPTY VALIDATION
      // =====================================================
      if (!email || !password) {

        alert("Please fill all fields");

        return;

      }



      // =====================================================
      // 🔥 LOGIN API
      // =====================================================
      const res = await axios.post(

        "http://localhost:5000/api/admin/login",

        {
          email,
          password
        }

      );



      // =====================================================
      // 🔥 SAVE TOKEN
      // =====================================================
      localStorage.setItem(
        "adminToken",
        res.data.token
      );



      // =====================================================
      // 🔥 SAVE ADMIN DATA
      // =====================================================
      localStorage.setItem(

        "admin",

        JSON.stringify(res.data.admin)

      );



      // =====================================================
      // 🔥 ADMIN LOGIN STATUS
      // =====================================================
      localStorage.setItem(
        "isAdmin",
        "true"
      );



      // =====================================================
      // ✅ SUCCESS MESSAGE
      // =====================================================
      alert("Admin Login Successful ✅");



      // =====================================================
      // 🔥 REDIRECT
      // =====================================================
      navigate("/admin-dashboard");

    } catch (error) {

      console.log(error);



      // =====================================================
      // ❌ ERROR MESSAGE
      // =====================================================
      alert(

        error.response?.data?.message
        || "Login Failed"

      );

    }

  };






  // =====================================================
  // 🎨 UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* =====================================================
          🔥 LOGIN BOX
      ===================================================== */}
      <div style={styles.box}>

        {/* 🔥 TITLE */}
        <h2 style={styles.title}>
          Admin Login 👨‍💼
        </h2>



        {/* =====================================================
            🔥 EMAIL INPUT
        ===================================================== */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />



        {/* =====================================================
            🔥 PASSWORD INPUT
        ===================================================== */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />



        {/* =====================================================
            🔥 LOGIN BUTTON
        ===================================================== */}
        <button
          onClick={handleLogin}
          style={styles.button}
        >
          Login
        </button>

      </div>

    </div>

  );

}





// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // 🔥 MAIN CONTAINER
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f4f4"
  },



  // 🔥 LOGIN BOX
  box: {
    background: "#fff",
    padding: "35px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)"
  },



  // 🔥 TITLE
  title: {
    marginBottom: "20px",
    color: "#222"
  },



  // 🔥 INPUT
  input: {
    width: "92%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },



  // 🔥 BUTTON
  button: {
    width: "100%",
    padding: "12px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }

};



// =====================================================
// 🔥 EXPORT
// =====================================================
export default AdminLogin;