const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const db = require("../db");

// ============================================
// 📧 EMAIL TRANSPORT
// ============================================
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

// ============================================
// 🔥 SEND OTP
// ============================================
router.post("/send-otp", async (req, res) => {

  try {

    const { email } = req.body;

    // ============================================
    // 🔍 CHECK USER
    // ============================================
    db.query(

      "SELECT * FROM users WHERE email=?",

      [email],

      async (err, result) => {

        if (err) {
          return res.status(500).json(err);
        }

        if (result.length === 0) {

          return res.status(404).json({
            message: "User not found"
          });

        }

        // ============================================
        // 🔥 GENERATE OTP
        // ============================================
        const otp =
          Math.floor(
            100000 + Math.random() * 900000
          ).toString();

        // ============================================
        // ⏰ OTP EXPIRY
        // ============================================
        const expiry =
          new Date(
            Date.now() + 5 * 60 * 1000
          );

        // ============================================
        // 💾 SAVE OTP
        // ============================================
        db.query(

          "UPDATE users SET otp=?, otp_expiry=? WHERE email=?",

          [otp, expiry, email],

          async (err2) => {

            if (err2) {
              return res.status(500).json(err2);
            }

            // ============================================
            // 📧 SEND EMAIL
            // ============================================
            await transporter.sendMail({

              from: process.env.EMAIL_USER,

              to: email,

              subject: "Password Reset OTP",

              text:
                `Your OTP is ${otp}`

            });

            res.json({
              message: "OTP Sent"
            });

          }

        );

      }

    );

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

module.exports = router;