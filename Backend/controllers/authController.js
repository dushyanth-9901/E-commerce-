// 🔥 DATABASE CONNECTION
const db = require("../db");



// 🔥 PASSWORD HASHING
const bcrypt = require("bcryptjs");



// 🔥 JWT TOKEN
const jwt = require("jsonwebtoken");




// =====================================================
// 🔐 REGISTER USER
// =====================================================
const registerUser = async (
  req,
  res
) => {

  try {

    // 🔥 GET DATA
    const {
      name,
      email,
      password
    } = req.body;



    // ❌ EMPTY FIELDS
    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "Fill all fields"
      });

    }



    // =====================================================
    // 🔥 CHECK USER EXISTS
    // =====================================================
    const checkQuery =
      "SELECT * FROM users WHERE email = ?";



    db.query(
      checkQuery,
      [email],

      async (err, result) => {

        if (err) {

          return res.status(500).json(err);

        }



        // ❌ USER ALREADY EXISTS
        if (result.length > 0) {

          return res.status(400).json({
            message:
              "Email already exists"
          });

        }



        // =====================================================
        // 🔥 HASH PASSWORD
        // =====================================================
        const hashedPassword =
          await bcrypt.hash(
            password,
            10
          );



        // =====================================================
        // 🔥 INSERT USER
        // =====================================================
        const insertQuery = `
          INSERT INTO users
          (name, email, password)
          VALUES (?, ?, ?)
        `;



        db.query(

          insertQuery,

          [
            name,
            email,
            hashedPassword
          ],

          (err, result) => {

            if (err) {

              return res.status(500).json(err);

            }



            // ✅ SUCCESS
            res.status(201).json({

              message:
                "User Registered Successfully"

            });

          }

        );

      }

    );

  } catch (error) {

    res.status(500).json(error);

  }

};




// =====================================================
// 🔐 LOGIN USER
// =====================================================
const loginUser = (
  req,
  res
) => {

  try {

    // 🔥 GET DATA
    const {
      email,
      password
    } = req.body;



    // ❌ EMPTY FIELDS
    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "Fill all fields"
      });

    }



    // =====================================================
    // 🔥 CHECK USER
    // =====================================================
    const query =
      "SELECT * FROM users WHERE email = ?";



    db.query(
      query,
      [email],

      async (err, result) => {

        if (err) {

          return res.status(500).json(err);

        }



        // ❌ USER NOT FOUND
        if (result.length === 0) {

          return res.status(404).json({
            message: "User not found"
          });

        }



        // 🔥 USER DATA
        const user = result[0];



        // =====================================================
        // 🔥 CHECK PASSWORD
        // =====================================================
        const isMatch =
          await bcrypt.compare(
            password,
            user.password
          );



        // ❌ WRONG PASSWORD
        if (!isMatch) {

          return res.status(400).json({
            message:
              "Invalid Password"
          });

        }



        // =====================================================
        // 🔥 CREATE JWT TOKEN
        // =====================================================
        const token = jwt.sign(

          {
            id: user.id,
            role: user.role
          },

          "mysecretkey",

          {
            expiresIn: "7d"
          }

        );



        // ✅ LOGIN SUCCESS
        res.status(200).json({

          message:
            "Login Successful",

          token,

          user: {

            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role

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

  registerUser,
  loginUser

};