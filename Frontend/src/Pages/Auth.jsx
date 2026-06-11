// 📁 src/pages/Auth.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Auth() {

  const [isLogin, setIsLogin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {

    try {

      if (isLogin) {

        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: form.email,
            password: form.password
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("isLoggedIn", "true");

        alert("Login Successful ✅");
        navigate("/dashboard");

      } else {

        if (!form.name || !form.email || !form.password) {
          alert("Please fill all fields");
          return;
        }

        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name: form.name,
            email: form.email,
            password: form.password
          }
        );

        alert("Registered Successfully ✅");

        setForm({
          name: "",
          email: "",
          password: ""
        });

        setIsLogin(true);
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

 return (
  <div style={styles.page}>

    {/* LEFT SIDE BRAND */}
    <div style={styles.left}>
      <h1 style={styles.brandTitle}>ShopEase 🛍️</h1>
      <p style={styles.brandText}>
        Buy smart. Live better.
      </p>
      <div style={styles.glow}></div>
    </div>

    {/* RIGHT SIDE FORM */}
    <div style={styles.right}>

      <div style={styles.card}>

        <h2 style={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>

        <p style={styles.subtitle}>
          {isLogin
            ? "Login to continue shopping"
            : "Join us and start shopping"}
        </p>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
        />

        {/* PASSWORD */}
        <div style={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={styles.input}
          />

          <span
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <p
          style={styles.forgot}
          onClick={() => navigate("/reset-password")}
        >
          Forgot password?
        </p>

        <button
          style={styles.button}
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p style={styles.switch}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

        <button
          style={styles.admin}
          onClick={() => navigate("/admin")}
        >
          Admin Login
        </button>

      </div>

    </div>

  </div>
);
}

// 🎨 MODERN UI STYLES
const styles = {

  page: {
    height: "100vh",
    display: "flex",
    fontFamily: "sans-serif",
    background: "radial-gradient(circle at top,#0f172a,#020617)"
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px",
    color: "#fff",
    position: "relative"
  },

  brandTitle: {
    fontSize: "52px",
    fontWeight: "900",
    marginBottom: "10px"
  },

  brandText: {
    fontSize: "18px",
    opacity: 0.7
  },

  glow: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#6366f1",
    filter: "blur(120px)",
    top: "30%",
    left: "20%",
    opacity: 0.4
  },

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    color: "#fff",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)"
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
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "0.3s"
  },

  passwordBox: {
    position: "relative"
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(135deg,#6366f1,#3b82f6)",
    transition: "0.3s"
  },

  switch: {
    marginTop: "15px",
    fontSize: "14px",
    opacity: 0.8
  },

  link: {
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: "bold"
  },

  forgot: {
    fontSize: "13px",
    textAlign: "right",
    cursor: "pointer",
    color: "#93c5fd"
  },

  admin: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer"
  }
};

export default Auth;