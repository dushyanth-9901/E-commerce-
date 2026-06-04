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

 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState("");


  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();





  // =====================================================
  // 🔐 HANDLE ADMIN LOGIN
  // =====================================================
  const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    // ❌ EMPTY VALIDATION
    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    // 🔥 LOGIN API
    const res = await axios.post(
      "http://localhost:5000/api/admin/login",
      {
        email,
        password
      }
    );

    // 🔥 SAVE TOKEN
    localStorage.setItem("adminToken", res.data.token);

    // 🔥 SAVE ADMIN DATA
    localStorage.setItem(
      "admin",
      JSON.stringify(res.data.admin)
    );

    // 🔥 ADMIN STATUS
    localStorage.setItem("isAdmin", "true");

    // ✅ SUCCESS
    alert("Admin Login Successful ✅");

    // 🔥 REDIRECT
    navigate("/admin-dashboard");

  } catch (error) {
    console.log(error);
    setError(
      error.response?.data?.message || "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // 🎨 UI
  // =====================================================
 return (
  <div style={styles.bg}>

    <div style={styles.card}>

      <h2 style={styles.title}>Admin Panel</h2>
      <p style={styles.subtitle}>Login to continue</p>

      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

          <div style={styles.passwordBox}>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                width: "100%",
                paddingRight: "45px",
                boxSizing: "border-box"
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#333"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

          </div>

      <button
        onClick={handleLogin}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </div>

  </div>
);
}





// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",
    fontFamily: "sans-serif"
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
    color: "#fff"
  },

  title: {
    fontSize: "28px",
    fontWeight: "800"
  },

  subtitle: {
    fontSize: "14px",
    opacity: 0.7,
    marginBottom: "20px"
  },

  input: {
    width: "92%",
    padding: "14px",
    margin: "10px 0",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px"
  },

  passwordBox: {
  position: "relative",
  width: "100%"
},

  eye: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px"
},

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#3b82f6)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },

  error: {
    color: "#ff4d4f",
    fontSize: "13px",
    marginBottom: "10px"
  }

};



// =====================================================
// 🔥 EXPORT
// =====================================================
export default AdminLogin;