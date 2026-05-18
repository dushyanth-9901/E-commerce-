const express = require("express");

const router = express.Router();

const db = require("../db");



// ✅ GET PRODUCTS
router.get("/", (req, res) => {

  db.query(
    "SELECT * FROM products",
    (err, result) => {

      if (err) {

        res.status(500).json(err);

      } else {

        res.json(result);

      }

    }
  );

});



// ✅ ADD PRODUCT
router.post("/", (req, res) => {

  const {
    name,
    price,
    stock,
    image,
    description
  } = req.body;



  const sql = `
    INSERT INTO products
    (name, price, stock, image, description)
    VALUES (?, ?, ?, ?, ?)
  `;



  db.query(
    sql,
    [name, price, stock, image, description],
    (err, result) => {

      if (err) {

        res.status(500).json(err);

      } else {

        res.json({
          message: "✅ Product Added"
        });

      }

    }
  );

});

module.exports = router;