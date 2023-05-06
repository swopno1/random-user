const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filepath = path.join(
  process.env.VERCEL_SERVERLESS_FUNCTIONS_FS_PATH,
  "users.json"
);

// GET a RANDOM user
router.get("/random", (req, res) => {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
    const users = JSON.parse(data);
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];
    res.status(201).json(randomUser);
  });
});

// GET endpoint to fetch all users
router.get("/all", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filepath));
  const limit = req.query.limit || users.length;
  const filteredUsers = users.slice(0, limit);
  res.status(201).json(filteredUsers);
});

// POST endpoint to add a new user
router.post("/save", (req, res) => {
  const newUser = req.body;

  // validate new User data
  if (!newUser.name || !newUser.contact || !newUser.gender) {
    return res.status(400).send("Name, contact, and gender is required");
  }

  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
    const users = JSON.parse(data);
    newUser.id = users.length + 1;
    users.push(newUser);
    fs.writeFile(filepath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }
      return res.status(201).json(newUser);
    });
  });
});

// PUT endpoint to update a user
router.put("/update", (req, res) => {
  const updatedUser = req.body;
  const users = JSON.parse(fs.readFileSync(filepath));

  const userIndex = users.findIndex((user) => user.id === updatedUser.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[userIndex] = { ...users[userIndex], ...updatedUser };
  fs.writeFileSync(filepath, JSON.stringify(users));
  res.json(users[userIndex]);
});

// Bulk Update users
// Update multiple users' information in the .json file
// Take an array of user ids and assign it to the body.
// BONUS: validate the body.
router.put("/bulk-update", (req, res) => {
  const bulkUsers = req.body;

  const users = JSON.parse(fs.readFileSync(filepath));

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
  res.json(updatedUsers);
});

router.delete("/delete", (req, res) => {
  const targetUser = req.body;
  //   console.log(targetUser);
  const users = JSON.parse(fs.readFileSync(filepath));
  const userIndex = users.findIndex((user) => user.id == targetUser.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  const deletedUser = users.splice(userIndex, 1)[0];
  fs.writeFileSync(filepath, JSON.stringify(users));
  res.json(deletedUser);
});

module.exports = router;
