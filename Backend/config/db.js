const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Nayana@2004",
  database: process.env.DB_NAME || "ecommerce",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database Connection Failed", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;