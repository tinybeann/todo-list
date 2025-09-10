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

app.listen(port, () => {
  console.log(`app listening on port ${3000}`);
})