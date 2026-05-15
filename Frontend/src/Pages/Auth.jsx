// 🔹 React hooks
import { useState, useEffect } from "react";

// 🔹 For page navigation (routing)
import { useNavigate } from "react-router-dom";

function Auth() {

  // 🔸 State to toggle between Login & Register UI
  const [isLogin, setIsLogin] = useState(false);

  // 🔸 State to store form data (email + password)
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // 🔸 Hook to navigate between pages
  const navigate = useNavigate();


  // 🔥 CHECK IF USER ALREADY REGISTERED (runs once when page loads)
  useEffect(() => {

    let storedUser = null;

    try {
      // 🔹 Get user from localStorage
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      // 🔹 If corrupted data → remove it
      localStorage.removeItem("user");
      storedUser = null;
    }

    // 🔹 If user exists → show Login page
    if (storedUser) {
      setIsLogin(true);
    } else {
      // 🔹 If no user → show Register page
      setIsLogin(false);
    }

  }, []); // [] = run only once


  // 🔥 HANDLE LOGIN & REGISTER BUTTON CLICK
  const handleSubmit = () => {

    let storedUser = null;

    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      localStorage.removeItem("user");
      storedUser = null;
    }

    // 🔐 LOGIN LOGIC
    if (isLogin) {

      // ❌ No user found
      if (!storedUser) {
        alert("No account found. Please register.");
        setIsLogin(false); // switch to register
        return;
      }

      // ✅ Check credentials match
      if (
        storedUser.email === form.email &&
        storedUser.password === form.password
      ) {
        localStorage.setItem("isLoggedIn", "true"); // session
        navigate("/dashboard"); // go to dashboard
      } else {
        alert("Invalid credentials");
      }

    } else {

      // 📝 REGISTER LOGIC

      // ❌ Empty fields check
      if (!form.email || !form.password) {
        alert("Fill all fields");
        return;
      }

      // ✅ Save user in localStorage
      localStorage.setItem("user", JSON.stringify(form));

      alert("Registered successfully!");

      // 🔄 Switch to login after register
      setIsLogin(true);
    }
  };


  // 🎨 UI PART (what you see on screen)
  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* 🔹 Title */}
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* 🔹 Email Input */}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
        />

        {/* 🔹 Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={styles.input}
        />

        {/* 🔹 Main Button (Login / Register) */}
        <button
          onClick={handleSubmit}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* 🔄 SWITCH BETWEEN LOGIN & REGISTER */}
        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

        <hr style={{ margin: "20px 0", opacity: 0.3 }} />

        {/* 👨‍💼 ADMIN LOGIN BUTTON */}
        <button
          style={styles.adminBtn}
          onClick={() => navigate("/admin")}
        >
          Login as Admin
        </button>

      </div>
    </div>
  );
}


// 🎨 STYLES (CSS inside JS)
const styles = {

  // 🔹 Full page container
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },

  // 🔹 Card box
  box: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  // 🔹 Title
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333"
  },

  // 🔹 Input fields
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px"
  },

  // 🔹 Main button
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  },

  // 🔹 Text below button
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555"
  },

  // 🔹 Clickable link
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold"
  },

  // 🔹 Admin button
  adminBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default Auth;