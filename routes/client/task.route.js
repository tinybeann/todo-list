const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/task.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-multi", controller.changeMultiPatch);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.patch("/delete-multi", controller.deleteMultiPatch);

module.exports = router;