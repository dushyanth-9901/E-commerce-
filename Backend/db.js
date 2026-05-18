const mysql = require("mysql2");

const db = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "Dushu@2006",
  database: "ecommerce"

});

db.connect((err) => {

  if (err) {

    console.log("❌ Database Connection Failed");

  } else {

    console.log("✅ MySQL Connected");

  }

});

module.exports = db;