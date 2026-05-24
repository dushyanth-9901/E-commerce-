const express = require("express");

const router = express.Router();

const db = require("../config/db");



// =====================================================
// ✅ SAVE ORDER
// =====================================================
router.post("/save", (req, res) => {

  const {

    user_email,
    product_name,
    amount,
    payment_id,

    full_name,
    phone,
    state,
    district,
    taluk,
    village,
    pincode,
    address_line

  } = req.body;



  const sql = `

    INSERT INTO orders (

      user_email,
      product_name,
      amount,
      payment_id,

      full_name,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      address_line,

      status

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

  `;



  db.query(

    sql,

    [

      user_email,
      product_name,
      amount,
      payment_id,

      full_name,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      address_line,

      "Pending"

    ],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: "Order Save Failed"
        });

      }

      res.json({
        message: "Order Saved ✅"
      });

    }

  );

});



// =====================================================
// ✅ GET ALL ORDERS
// =====================================================
router.get("/", (req, res) => {

  const sql =
    "SELECT * FROM orders ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {

      return res.status(500).json(err);

    }

    res.json(result);

  });

});



// =====================================================
// ✅ UPDATE ORDER STATUS
// =====================================================
router.put("/:id", (req, res) => {

  const id = req.params.id;

  const { status } = req.body;

  const sql =
    "UPDATE orders SET status=? WHERE id=?";

  db.query(

    sql,

    [status, id],

    (err, result) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json({
        message:
          "Order Updated ✅"
      });

    }

  );

});



module.exports = router;