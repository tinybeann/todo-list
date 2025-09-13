const tasksRoute = require("./task.route");
const usersRoute = require("./user.route");
const projectRoute = require("./project.route");

const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {

  app.use("/tasks", userMiddleware.requireAuth, tasksRoute);
  // app.use("/tasks", tasksRoute);

  app.use("/projects", userMiddleware.requireAuth, projectRoute);

  app.use("/users", usersRoute);

}