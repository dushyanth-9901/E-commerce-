import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ============================================
  // 🔥 RESET PASSWORD
  // ============================================
  const handleReset = async () => {

    // ❌ PASSWORD CHECK
    if (

      newPassword !== confirmPassword

    ) {

      alert("Passwords Not Match ❌");

      return;

    }

    try {

      await axios.post(

        "http://localhost:5000/api/auth/reset-password",

        {
          email,
          newPassword
        }

      );

      alert("Password Updated ✅");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Reset Failed ❌");

    }

  };

  return (

    <div style={styles.container}>

      <div style={styles.box}>

        <h1 style={styles.title}>
          Reset Password
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          style={styles.input}
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          style={styles.button}
          onClick={handleReset}
        >
          Update Password
        </button>

      </div>

    </div>

  );

}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background:
      "radial-gradient(circle at top, #1e1b4b, #0f172a, #020617)",

    padding: "20px"
  },

  box: {
    width: "380px",

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,0.12)",

    padding: "40px",
    borderRadius: "20px",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.35)",

    color: "#fff"
  },

  title: {
    textAlign: "center",
    marginBottom: "28px",

    fontSize: "24px",
    fontWeight: "800",

    background:
      "linear-gradient(90deg,#fff,#a5b4fc,#f9a8d4)",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  input: {
    width: "100%",

    padding: "14px 16px",
    marginBottom: "14px",

    borderRadius: "14px",

    border: "1px solid rgba(255,255,255,0.12)",

    background: "rgba(2,6,23,0.6)",
    color: "#fff",

    outline: "none",
    fontSize: "14px",

    boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)",

    transition: "0.2s ease"
  },

  button: {
    width: "100%",
    padding: "14px",

    borderRadius: "14px",
    border: "none",

    marginTop: "10px",

    background:
      "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)",

    color: "#fff",
    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 10px 30px rgba(168,85,247,0.35)",

    transition: "0.25s ease"
  }
};
export default ResetPassword;