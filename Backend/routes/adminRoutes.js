// 🔥 EXPRESS
const express = require("express");

const router = express.Router();



// 🔥 CONTROLLER
const {
  adminLogin
} = require("../controllers/adminController");



// 🔥 LOGIN ROUTE
router.post(
  "/login",
  adminLogin
);



// 🔥 EXPORT
module.exports = router;