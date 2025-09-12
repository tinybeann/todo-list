const tasksRoute = require("./task.route");
const usersRoute = require("./user.route");

const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {

  // app.use("/tasks", userMiddleware.requireAuth, tasksRoute);
  app.use("/tasks", tasksRoute);

  app.use("/users", usersRoute);

}