// 🔥 EXPRESS ROUTER
const express = require("express");

const router = express.Router();



// 🔥 CONTROLLERS
const {

  registerUser,
  loginUser

} = require("../controllers/authController");



// =====================================================
// 🔐 REGISTER ROUTE
// =====================================================
router.post(
  "/register",
  registerUser
);



// =====================================================
// 🔐 LOGIN ROUTE
// =====================================================
router.post(
  "/login",
  loginUser
);



// 🔥 EXPORT
module.exports = router; 