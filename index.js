const express = require("express");
require("dotenv").config();
const database = require("./config/database");

database.connect();

const app = express();
const port = 3000;

const Task = require("./models/task.model");

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  });

  res.json(tasks);
});

app.get("/tasks/detail/:id", async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
});


app.listen(port, () => {
  console.log(`app listening on port ${3000}`);
})