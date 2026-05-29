const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../config/db");

const {

  registerUser,
  loginUser

} = require("../controllers/authController");

// ============================================
// ✅ REGISTER
// ============================================

router.post("/register", registerUser);

// ============================================
// ✅ LOGIN
// ============================================

router.post("/login", loginUser);

// ============================================
// ✅ SAVE ADDRESS
// ============================================

router.put("/save-address", (req, res) => {

  const {

    email,
    fullName,
    phone,
    state,
    district,
    taluk,
    village,
    pincode,
    addressLine

  } = req.body;

  const sql = `

    UPDATE users

    SET

      full_name = ?,
      phone = ?,
      state = ?,
      district = ?,
      taluk = ?,
      village = ?,
      pincode = ?,
      address_line = ?

    WHERE email = ?

  `;

  db.query(

    sql,

    [

      fullName,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      addressLine,

      email

    ],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: "Address Save Failed"
        });

      }

      res.json({
        message: "Address Saved ✅"
      });

    }

  );

});

// ============================================
// ✅ GET USER ADDRESS
// ============================================

router.get("/address/:email", (req, res) => {

  const sql =
    "SELECT * FROM users WHERE email=?";

  db.query(

    sql,

    [req.params.email],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json(err);

      }

      if (result.length === 0) {

        return res.status(404).json({
          message: "User Not Found"
        });

      }

      res.json(result[0]);

    }

  );

});

// ============================================
// 🔥 RESET PASSWORD
// ============================================

router.post(

  "/reset-password",

  async (req, res) => {

    try {

      const {

        email,
        newPassword

      } = req.body;

      db.query(

        "SELECT * FROM users WHERE email=?",

        [email],

        async (err, result) => {

          if (err) {

            return res.status(500).json(err);

          }

          // ❌ USER NOT FOUND
          if (result.length === 0) {

            return res.status(404).json({
              message: "User Not Found"
            });

          }

          // 🔐 HASH PASSWORD
          const hashedPassword =

            await bcrypt.hash(
              newPassword,
              10
            );

          // 💾 UPDATE PASSWORD
          db.query(

            "UPDATE users SET password=? WHERE email=?",

            [hashedPassword, email],

            (err2) => {

              if (err2) {

                return res.status(500).json(err2);

              }

              res.json({
                message:
                  "Password Updated Successfully"
              });

            }

          );

        }

      );

    } catch (error) {

      console.log(error);

      res.status(500).json(error);

    }

  }

);

module.exports = router;