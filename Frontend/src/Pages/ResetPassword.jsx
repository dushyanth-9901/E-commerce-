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
      "linear-gradient(135deg,#eef2ff,#f5f3ff)"
  },

  box: {
    width: "400px",
    background: "#fff",
    padding: "40px",
    borderRadius: "25px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px"
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    background: "#111827",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  }

};

export default ResetPassword;