const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,
    createdBy: String,
    createdBy: String,
    listUser: Array,
    listTask: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Project", projectSchema, "projects");

module.exports = Project;