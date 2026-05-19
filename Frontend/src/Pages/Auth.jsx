// 📁 src/pages/Auth.jsx

// =====================================================
// 🔥 IMPORT REACT HOOKS
// =====================================================
import { useState, useEffect } from "react";



// =====================================================
// 🔥 IMPORT NAVIGATION
// =====================================================
import { useNavigate } from "react-router-dom";





function Auth() {

  // =====================================================
  // 🔥 LOGIN / REGISTER TOGGLE
  // false = Register
  // true = Login
  // =====================================================
  const [isLogin, setIsLogin] =
    useState(false);




  // =====================================================
  // 🔥 FORM STATE
  // =====================================================
  const [form, setForm] = useState({
    email: "",
    password: ""
  });




  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();




  // =====================================================
  // 🔥 CHECK USER ON PAGE LOAD
  // =====================================================
  useEffect(() => {

    let storedUser = null;

    try {

      // 🔥 GET USER FROM LOCAL STORAGE
      storedUser = JSON.parse(
        localStorage.getItem("user")
      );

    } catch (error) {

      // ❌ REMOVE CORRUPTED DATA
      localStorage.removeItem("user");

      storedUser = null;

    }



    // ✅ IF USER EXISTS
    if (storedUser) {

      // 🔥 SHOW LOGIN PAGE
      setIsLogin(true);

    } else {

      // 🔥 SHOW REGISTER PAGE
      setIsLogin(false);

    }

  }, []);





  // =====================================================
  // 🔥 HANDLE LOGIN / REGISTER
  // =====================================================
  const handleSubmit = () => {

    let storedUser = null;

    try {

      storedUser = JSON.parse(
        localStorage.getItem("user")
      );

    } catch {

      localStorage.removeItem("user");

      storedUser = null;

    }



    // =====================================================
    // 🔐 LOGIN LOGIC
    // =====================================================
    if (isLogin) {

      // ❌ NO ACCOUNT FOUND
      if (!storedUser) {

        alert(
          "No account found. Please register."
        );

        setIsLogin(false);

        return;

      }



      // ✅ CHECK EMAIL & PASSWORD
      if (

        storedUser.email === form.email &&
        storedUser.password === form.password

      ) {

        // ✅ SAVE LOGIN SESSION
        localStorage.setItem(
          "isLoggedIn",
          "true"
        );



        // ✅ SUCCESS MESSAGE
        alert("Login Successful ✅");



        // ✅ GO TO DASHBOARD
        navigate("/dashboard");

      } else {

        // ❌ INVALID LOGIN
        alert("Invalid Credentials");

      }

    }



    // =====================================================
    // 📝 REGISTER LOGIC
    // =====================================================
    else {

      // ❌ EMPTY FIELD VALIDATION
      if (
        !form.email ||
        !form.password
      ) {

        alert("Fill all fields");

        return;

      }



      // ✅ SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(form)
      );



      // ✅ SUCCESS MESSAGE
      alert("Registered Successfully ✅");



      // 🔥 CLEAR FORM
      setForm({
        email: "",
        password: ""
      });



      // 🔥 SWITCH TO LOGIN PAGE
      setIsLogin(true);

    }

  };





  // =====================================================
  // 🎨 UI
  // =====================================================
  return (

    <div style={styles.container}>

      {/* 🔥 AUTH BOX */}
      <div style={styles.box}>

        {/* =====================================================
            🔥 TITLE
        ===================================================== */}
        <h2 style={styles.title}>

          {isLogin
            ? "Welcome Back 👋"
            : "Create Account 🚀"}

        </h2>




        {/* =====================================================
            🔥 EMAIL INPUT
        ===================================================== */}
        <input
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>

            setForm({
              ...form,
              email: e.target.value
            })

          }
          style={styles.input}
        />




        {/* =====================================================
            🔥 PASSWORD INPUT
        ===================================================== */}
        <input
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) =>

            setForm({
              ...form,
              password: e.target.value
            })

          }
          style={styles.input}
        />




        {/* =====================================================
            🔥 LOGIN / REGISTER BUTTON
        ===================================================== */}
        <button
          style={styles.button}
          onClick={handleSubmit}
          onMouseOver={(e) =>
            (e.target.style.opacity = "0.9")
          }
          onMouseOut={(e) =>
            (e.target.style.opacity = "1")
          }
        >

          {isLogin
            ? "Login"
            : "Register"}

        </button>





        {/* =====================================================
            🔥 SWITCH LOGIN / REGISTER
        ===================================================== */}
        <p style={styles.switchText}>

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            style={styles.link}
            onClick={() =>
              setIsLogin(!isLogin)
            }
          >

            {isLogin
              ? " Register"
              : " Login"}

          </span>

        </p>





        {/* =====================================================
            🔥 DIVIDER
        ===================================================== */}
        <hr
          style={{
            margin: "20px 0",
            opacity: 0.3
          }}
        />





        {/* =====================================================
            👨‍💼 ADMIN LOGIN BUTTON
        ===================================================== */}
        <button
          style={styles.adminBtn}
          onClick={() =>
            navigate("/admin")
          }
        >

          Login as Admin

        </button>

      </div>

    </div>

  );

}





// =====================================================
// 🎨 STYLES
// =====================================================
const styles = {

  // 🔥 PAGE CONTAINER
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)"
  },



  // 🔥 AUTH BOX
  box: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)"
  },



  // 🔥 TITLE
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333"
  },



  // 🔥 INPUT
  input: {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px"
  },



  // 🔥 MAIN BUTTON
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  },



  // 🔥 SWITCH TEXT
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555"
  },



  // 🔥 LOGIN / REGISTER LINK
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // 🔥 ADMIN BUTTON
  adminBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  }

};



// =====================================================
// 🔥 EXPORT COMPONENT
// =====================================================
export default Auth;