// 📁 src/pages/Auth.jsx

// =====================================================
// 🔥 IMPORT REACT HOOKS
// =====================================================
import { useState } from "react";



// =====================================================
// 🔥 IMPORT REACT ROUTER
// =====================================================
import { useNavigate } from "react-router-dom";



// =====================================================
// 🔥 IMPORT AXIOS
// =====================================================
import axios from "axios";





function Auth() {

  // =====================================================
  // 🔥 LOGIN / REGISTER TOGGLE
  // false = REGISTER
  // true = LOGIN
  // =====================================================
  const [isLogin, setIsLogin] =
    useState(false);




  // =====================================================
  // 🔥 FORM STATE
  // =====================================================
  const [form, setForm] = useState({

    name: "",
    email: "",
    password: ""

  });




  // =====================================================
  // 🔥 NAVIGATION
  // =====================================================
  const navigate = useNavigate();





  // =====================================================
  // 🔥 HANDLE LOGIN & REGISTER
  // =====================================================
  const handleSubmit = async () => {

    try {

      // =====================================================
      // 🔐 LOGIN LOGIC
      // =====================================================
      if (isLogin) {

        // 🔥 LOGIN API
        const res = await axios.post(

          "http://localhost:5000/api/auth/login",

          {
            email: form.email,
            password: form.password
          }

        );



        // =====================================================
        // 🔥 SAVE JWT TOKEN
        // =====================================================
        localStorage.setItem(
          "token",
          res.data.token
        );



        // =====================================================
        // 🔥 SAVE USER DATA
        // =====================================================
        localStorage.setItem(

          "user",

          JSON.stringify(res.data.user)

        );



        // =====================================================
        // 🔥 LOGIN STATUS
        // =====================================================
        localStorage.setItem(
          "isLoggedIn",
          "true"
        );



        // =====================================================
        // ✅ SUCCESS MESSAGE
        // =====================================================
        alert("Login Successful ✅");



        // =====================================================
        // 🔥 REDIRECT TO DASHBOARD
        // =====================================================
        navigate("/dashboard");

      }







      // =====================================================
      // 📝 REGISTER LOGIC
      // =====================================================
      else {

        // =====================================================
        // ❌ EMPTY FIELD VALIDATION
        // =====================================================
        if (

          !form.name ||
          !form.email ||
          !form.password

        ) {

          alert("Please fill all fields");

          return;

        }



        // =====================================================
        // 🔥 REGISTER API
        // =====================================================
        await axios.post(

          "http://localhost:5000/api/auth/register",

          {
            name: form.name,
            email: form.email,
            password: form.password
          }

        );



        // =====================================================
        // ✅ SUCCESS MESSAGE
        // =====================================================
        alert(
          "Registered Successfully ✅"
        );



        // =====================================================
        // 🔥 CLEAR FORM
        // =====================================================
        setForm({

          name: "",
          email: "",
          password: ""

        });



        // =====================================================
        // 🔥 SWITCH TO LOGIN PAGE
        // =====================================================
        setIsLogin(true);

      }

    } catch (error) {

      console.log(error);



      // =====================================================
      // ❌ ERROR MESSAGE
      // =====================================================
      alert(

        error.response?.data?.message
        || "Something went wrong"

      );

    }

  };








  // =====================================================
  // 🎨 UI
  // =====================================================
  return (

    <div style={styles.container}>


      {/* =====================================================
          🔥 AUTH BOX
      ===================================================== */}
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
            🔥 NAME INPUT
            ONLY FOR REGISTER
        ===================================================== */}
        {!isLogin && (

          <input
            type="text"
            placeholder="Enter Name"
            value={form.name}
            onChange={(e) =>

              setForm({

                ...form,
                name: e.target.value

              })

            }
            style={styles.input}
          />

        )}








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

  // =====================================================
  // 🔥 PAGE CONTAINER
  // =====================================================
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)"
  },



  // =====================================================
  // 🔥 AUTH BOX
  // =====================================================
  box: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)"
  },



  // =====================================================
  // 🔥 TITLE
  // =====================================================
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333"
  },



  // =====================================================
  // 🔥 INPUT FIELD
  // =====================================================
  input: {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px"
  },



  // =====================================================
  // 🔥 MAIN BUTTON
  // =====================================================
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
    cursor: "pointer"
  },



  // =====================================================
  // 🔥 SWITCH TEXT
  // =====================================================
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555"
  },



  // =====================================================
  // 🔥 LOGIN / REGISTER LINK
  // =====================================================
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold"
  },



  // =====================================================
  // 🔥 ADMIN BUTTON
  // =====================================================
  adminBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#4faab5",
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