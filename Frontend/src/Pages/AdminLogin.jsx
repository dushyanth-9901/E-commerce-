import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    // hardcoded admin
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
        navigate("/admin-dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Admin Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#eee"
  },
  box: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white"
  }
};

export default AdminLogin;