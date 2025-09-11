const tasksRoute = require("./task.route");
const usersRoute = require("./user.route");

module.exports = (app) => {

  app.use("/tasks", tasksRoute);

  app.use("/users", usersRoute);

}