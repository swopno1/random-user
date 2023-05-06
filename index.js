const express = require("express");
const fs = require("fs");
const app = express();

require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/user.route.js");

const port = process.env.PORT || 3000;

// Use middleware
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

// Base api url
app.get("/", (req, res) => {
  res.json({ message: "Welcome to random user api!" });
});

// // GET a RANDOM user
// app.get("/user/random", (req, res) => {
//   fs.readFile("users.json", (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Internal server error");
//     } else {
//       const users = JSON.parse(data);
//       const randomIndex = Math.floor(Math.random() * users.length);
//       const randomUser = users[randomIndex];
//       res.status(201).json(randomUser);
//     }
//   });
// });

// // GET endpoint to fetch all users
// app.get("/user/all", (req, res) => {
//   const users = JSON.parse(fs.readFileSync("users.json"));
//   const limit = req.query.limit || users.length;
//   const filteredUsers = users.slice(0, limit);
//   res.status(201).json(filteredUsers);
// });

// // POST endpoint to add a new user
// app.post("/user/save", (req, res) => {
//   const newUser = req.body;

//   // validate new User data
//   if (!newUser.name || !newUser.contact || !newUser.gender) {
//     return res.status(400).send("Name, contact, and gender is required");
//   }

//   fs.readFile("users.json", (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Internal server error");
//     }
//     const users = JSON.parse(data);
//     newUser.id = users.length + 1;
//     users.push(newUser);
//     fs.writeFile("users.json", JSON.stringify(users), (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Internal server error");
//       }
//       return res.status(201).json(newUser);
//     });
//   });
// });

// // PUT endpoint to update a user

// app.put("/user/update", (req, res) => {
//   const updatedUser = req.body;
//   const users = JSON.parse(fs.readFile("users.json"));

//   const userIndex = users.findIndex((user) => user.id === updatedUser.id);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   users[userIndex] = { ...users[userIndex], ...updatedUser };
//   fs.writeFile("users.json", JSON.stringify(users));
//   res.json(users[userIndex]);
// });

// // Bulk Update users
// // Update multiple users' information in the .json file
// // Take an array of user ids and assign it to the body.
// // BONUS: validate the body.
// app.put("/user/bulk-update", (req, res) => {});

// // DELETE endpoint to delete a user
// app.delete("/user/delete", (req, res) => {
//   const targetUser = req.body;
//   const users = JSON.parse(fs.readFile("users.json"));
//   const userIndex = users.findIndex((user) => user.id === targetUser.id);
//   if (userIndex === -1) {
//     return res.status(404).json({ error: "User not found" });
//   }
//   const deletedUser = users.splice(userIndex, 1)[0];
//   fs.writeFile("users.json", JSON.stringify(users));
//   res.json(deletedUser);
// });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
