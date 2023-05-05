const express = require("express");
const fs = require("fs");
const app = express();

require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5003;

// Use middleware
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
