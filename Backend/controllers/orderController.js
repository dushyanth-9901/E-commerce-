const db = require("../config/db");

const getOrders = async (req, res) => {

  try {

    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed"
    });

  }

};

module.exports = {
  getOrders
};