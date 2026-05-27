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



router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);



module.exports = router;