const express = require("express");
const router = express.Router();
const db = require("../config/db");


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