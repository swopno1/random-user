const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// const filepath = "users.json";
// path.join(process.env.VERCEL_SERVERLESS_FUNCTIONS_FS_PATH, "users.json")
const filePath = path.join(__dirname, "users.json");
const fileContents = fs.readFileSync(filePath, "utf8");

// GET a RANDOM user
router.get("/random", (req, res) => {
  try {
    const users = JSON.parse(fileContents);
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];
    res.status(200).json(randomUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// GET endpoint to fetch all users
router.get("/all", (req, res) => {
  try {
    const users = JSON.parse(fileContents);
    const limit = req.query.limit || users.length;
    const filteredUsers = users.slice(0, limit);
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// POST endpoint to add a new user
router.post("/save", (req, res) => {
  try {
    const newUser = req.body;
    const users = JSON.parse(fileContents);

    // validate new User data
    if (!newUser.name || !newUser.contact || !newUser.gender) {
      return res.status(400).send("Name, contact, and gender is required");
    }

    newUser.id = users.length + 1;
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users));

    return res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// PUT endpoint to update a user
router.put("/update", (req, res) => {
  try {
    const updatedUser = req.body;
    const users = JSON.parse(fileContents);

    const userIndex = users.findIndex((user) => user.id === updatedUser.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    fs.writeFileSync(filepath, JSON.stringify(users));
    res.status(200).json(users[userIndex]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// Bulk Update users
// Update multiple users' information in the .json file
// Take an array of user ids and assign it to the body.
// BONUS: validate the body.
router.put("/bulk-update", (req, res) => {
  try {
    const bulkUsers = req.body;
    const users = JSON.parse(fileContents);

    const updatedUsers = [];

    bulkUsers.map((updatedUser) => {
      const userIndex = users.findIndex((user) => user.id === updatedUser.id);
      if (userIndex === -1) {
        updatedUsers.push({ status: `User ${updatedUser.name} not found!` });
      }
      users[userIndex] = { ...users[userIndex], ...updatedUser };

      updatedUsers.push(users[userIndex]);
    });

    fs.writeFileSync(filepath, JSON.stringify(users));
    res.status(200).json(updatedUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/delete", (req, res) => {
  try {
    const targetUser = req.body;
    //   console.log(targetUser);
    const users = JSON.parse(fileContents);
    const userIndex = users.findIndex((user) => user.id == targetUser.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = users.splice(userIndex, 1)[0];
    fs.writeFileSync(filepath, JSON.stringify(users));
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
