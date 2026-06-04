const express = require("express");

const router = express.Router();

const db = require("../config/db");



// =====================================================
// ✅ SAVE ORDER
// =====================================================
router.post("/save", (req, res) => {

  const {
    product_id,
    quantity,
    user_email,
    product_name,
    product_image,
    amount,
    base_amount,
    discount,
    coupon_code,
    payment_id,

    payment_method,
    payment_status,

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
      product_id,
      quantity, 
      product_name,
      product_image,
      amount,
      base_amount,
      discount,
      coupon_code,
      payment_id,

      payment_method,
      payment_status,

      full_name,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      address_line,

      order_status

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

  `;



  db.query(

    sql,

    [

      user_email,
      product_id,
      quantity,
      product_name,
      product_image,
      amount,
      base_amount || amount,
      discount || 0,
      coupon_code || null,
      payment_id,

      payment_method,
      payment_status,

      full_name,
      phone,
      state,
      district,
      taluk,
      village,
      pincode,
      address_line,

      "Processing"

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
// ✅ GET USER ORDERS
// =====================================================
router.get("/user/:email", (req, res) => {

  const { email } = req.params;

  const sql = `

    SELECT * FROM orders
    WHERE user_email = ?
    ORDER BY id DESC

  `;

  db.query(

    sql,

    [email],

    (err, result) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json(result);

    }

  );

});



// =====================================================
// 🔥 UPDATE ORDER STATUS
// =====================================================
router.put("/:id", (req, res) => {

  const { order_status } = req.body;

  db.query(

    `
    UPDATE orders
    SET order_status = ?
    WHERE id = ?
    `,

    [order_status, req.params.id],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          error: "Update Failed"
        });

      }

      res.json({
        success: true
      });

    }

  );

});



// =====================================================
// 🔥 EXPORT ROUTER
// =====================================================
module.exports = router;