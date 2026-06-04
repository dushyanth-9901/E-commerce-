const db = require("../config/db");
const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const upload =
  require("../middleware/upload");



router.get("/", getProducts);



router.post(

  "/upload",

  upload.single("image"),

  (req, res) => {

    try {

      res.json({

        imageUrl:
          req.file.path

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Upload Failed"
      });

    }

  }

);

router.put("/reduce-stock/:id", (req, res) => {

  const { quantity } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
  `;

  db.query(sql, [quantity, id, quantity], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Stock Update Failed"
      });
    }

    // ❌ IMPORTANT CHECK
    if (result.affectedRows === 0) {
      return res.status(400).json({
        error: "Not enough stock"
      });
    }

    res.json({
      success: true,
      message: "Stock reduced successfully"
    });

  });

});


router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);



module.exports = router;