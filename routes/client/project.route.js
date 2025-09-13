const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/project.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detailProject);

router.post("/create", controller.createProject);

router.patch("/edit/:id", controller.editProject);

router.patch("/delete", controller.deleteProject);

module.exports = router;