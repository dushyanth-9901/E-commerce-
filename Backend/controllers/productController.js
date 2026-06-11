const db = require("../config/db");

// =====================================================
// GET PRODUCTS
// =====================================================
const getProducts = (req, res) => {

  const sql =
    "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      res.status(500).json({
        error: "Failed To Fetch Products"
      });

    } else {

      res.json(result);

    }

  });

};

// =====================================================
// ADD PRODUCT
// =====================================================
const addProduct = (req, res) => {

  const db =
    require("../config/db");

  const {
    name,
    price,
    stock,
    category,
    image,
    images,
    description
  } = req.body;

  const sql = `
    INSERT INTO products
    (name, price, stock, category, image, images, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(

    sql,

    [
      name,
      price,
      stock,
      category,
      image,
      images,
      description
    ],

    (err, result) => {

      if (err) {

        console.log(err);

        res.status(500).json({
          error: "Add Failed"
        });

      } else {

        res.json({
          message:
            "✅ Product Added"
        });

      }

    }

  );

};

// =====================================================
// UPDATE PRODUCT
// =====================================================
const updateProduct = (req, res) => {

  const id = req.params.id;

  const {
    name,
    price,
    stock,
    category,
    image,
    images,
    description
  } = req.body;

  const sql =
    "UPDATE products SET name=?, price=?, stock=?, category=?, image=?, images=?, description=? WHERE id=?";

  db.query(
    sql,
    [
      name,
      price,
      stock,
      category,
      image,
      images,
      description,
      id
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        res.status(500).json({
          error: "Update Failed"
        });

      } else {

        res.json({
          message:
            "✅ Product Updated"
        });

      }

    }
  );

};

// =====================================================
// DELETE PRODUCT
// =====================================================
const deleteProduct = (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM products WHERE id=?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {

        console.log(err);

        res.status(500).json({
          error: "Delete Failed"
        });

      } else {

        res.json({
          message:
            "✅ Product Deleted"
        });

      }

    }
  );

};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};