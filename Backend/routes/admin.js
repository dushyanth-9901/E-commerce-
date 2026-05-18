const express = require("express");

const router = express.Router();

const db = require("../db");



// ✅ ADMIN LOGIN
router.post("/login", (req, res) => {

  const { email, password } = req.body;



  const sql =
    "SELECT * FROM admins WHERE email=? AND password=?";



  db.query(
    sql,
    [email, password],
    (err, result) => {

      if (err) {

        res.status(500).json(err);

      } else {

        if (result.length > 0) {

          res.json({
            success: true,
            admin: result[0]
          });

        } else {

          res.json({
            success: false,
            message: "Invalid Admin Credentials"
          });

        }

      }

    }
  );

});

module.exports = router;