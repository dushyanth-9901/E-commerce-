// 🔥 DATABASE
const db = require("../config/db");

// 🔥 BCRYPT
const bcrypt = require("bcryptjs");

// 🔥 JWT
const jwt = require("jsonwebtoken");



// =====================================================
// 🔐 ADMIN LOGIN
// =====================================================
const adminLogin = (req, res) => {

  try {

    // 🔥 GET DATA
    const { email, password } = req.body;



    // ❌ EMPTY FIELDS
    if (!email || !password) {

      return res.status(400).json({
        message: "Fill all fields"
      });

    }



    // =====================================================
    // 🔥 CHECK ADMIN
    // =====================================================
    const query =
      "SELECT * FROM admins WHERE email = ?";



    db.query(
      query,
      [email],

      async (err, result) => {

        if (err) {

          return res.status(500).json(err);

        }



        // ❌ ADMIN NOT FOUND
        if (result.length === 0) {

          return res.status(404).json({
            message: "Admin not found"
          });

        }



        // 🔥 ADMIN DATA
        const admin = result[0];



        // =====================================================
        // 🔥 CHECK PASSWORD
        // =====================================================
        const isMatch =
          password === admin.password;



        // ❌ WRONG PASSWORD
        if (!isMatch) {

          return res.status(400).json({
            message: "Invalid Password"
          });

        }



        // =====================================================
        // 🔥 CREATE JWT TOKEN
        // =====================================================
        const token = jwt.sign(

          {
            id: admin.id,
            role: "admin"
          },

          "mysecretkey",

          {
            expiresIn: "7d"
          }

        );



        // ✅ SUCCESS
        res.status(200).json({

          message:
            "Admin Login Successful",

          token,

          admin: {

            id: admin.id,
            email: admin.email

          }

        });

      }

    );

  } catch (error) {

    res.status(500).json(error);

  }

};



// 🔥 EXPORT
module.exports = {
  adminLogin
};