const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs = require("fs");

const app = express();

app.use(express.json());

const port = 8000;

//----------------------------------------------------
// app.use(cors())
//----------------------------------------------------
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   })
// );

//-----------------------or--------------------------
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//Display all users

app.get("/users", (req, res) => {
  return res.json(users);
});

//delete user detail

app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredUsers = users.filter((user) => user.id !== id);
  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err, data) => {
    return res.json(filteredUsers);
  });
});

//add new user

app.post("/users", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All field required" });
  }
  let id = Date.now();
  users.push({ id, name, age, city });
  fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "User detail added success" });
  });
});

//update user
app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All field required" });
  }

  let index = users.findIndex((user) => user.id == id);

  users.splice(index, 1, { ...req.body });

  fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "User detail updated success" });
  });
});

app.listen(port, (err) => {
  console.log(`App is running on port ${port}`);
});
