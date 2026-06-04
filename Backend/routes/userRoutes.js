const express = require("express");
const router = express.Router();
const db = require("../config/db");




// =====================================================
// GET USER ADDRESS
// =====================================================
router.get("/address/:email", (req, res) => {

  const { email } = req.params;

  const sql = `
    SELECT
      full_name,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      address_line
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(result[0]);

  });

});

// GET USERS
router.get("/", (req, res) => {

  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

module.exports = router;