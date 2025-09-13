const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/task.controller");

router.get("/:projectId", controller.getTasksByProject);

router.post("/create/:projectId", controller.createTask);

router.patch("/edit/:taskId", controller.editTask);

router.delete("/delete/:taskId", controller.deleteTask);

router.patch("/change-status/:taskId/status", controller.changeStatus);

router.delete("/delete-many", controller.deleteMany);

module.exports = router;