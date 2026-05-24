const db = require("../config/db");

const getUsers = async (req, res) => {

  try {

    const [users] = await db.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    res.json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed"
    });

  }

};

module.exports = {
  getUsers
};