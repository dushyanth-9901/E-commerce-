const express = require("express");
const cors = require("cors");

const app = express();



// 🔥 IMPORT ROUTES
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/authRoutes");



// 🔥 MIDDLEWARE
app.use(cors());

app.use(express.json());


  app.use(
    "/api/auth",
    authRoutes
  );

// 🔥 ROUTES
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);



// 🔥 TEST ROUTE
app.get("/", (req, res) => {

  res.send("🚀 Backend Running");

});



// 🔥 SERVER
app.listen(5000, () => {

  console.log("✅ Server Running On Port 5000");

});