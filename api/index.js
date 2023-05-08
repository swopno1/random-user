const express = require("express");

const app = express();
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("../routes/user.route.js");

const port = process.env.PORT || 3000;

// Use middleware
app.use(cors());
app.use(express.json());

// Base api url
app.get("/", (req, res) => {
  res.json({ message: "Welcome to random user api!" });
});

// USER route
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
