const Project = require("../../models/project.model");

module.exports.index = async (req, res) => {
  const find = {
    $or: [
      { createdBy: req.user.id },
      { listUser: req.user.id }
    ],
    deleted: false
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  // Pagination
  let limitItems = 4;
  let page = 1;

  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }

  const skip = (page - 1) * limitItems;
  // End Pagination


  // Search
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // End Search

  const projects = await Project
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort(sort);

  res.json({
    code: "success",
    message: "Thành công!",
    data: projects
  });
}

module.exports.detailProject = async (req, res) => {
  const id = req.params.id;

  const project = await Project.findOne({
    _id: id,
    $or: [
      { createdBy: req.user.id },
      { listUser: req.user.id }
    ],
    deleted: false
  });

  if (!project) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
    return;
  }

  res.json({
    code: "success",
    message: "Thành công!",
    data: project
  });
}

module.exports.createProject = async (req, res) => {
  const data = req.body;

  data.createdBy = req.user.id;

  const project = new Project(data);
  await project.save();

  res.json({
    code: "success",
    message: "Tạo dự án thành công!",
    data: project
  });
}

module.exports.editProject = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await Project.updateOne({
    _id: id
  }, data);

  res.json({
    code: "success",
    message: "Cập nhật dự án thành công!"
  });
}

module.exports.deleteProject = async (req, res) => {
  const id = req.params.id;
  await Project.updateOne({ _id: id }, { deleted: true });

  res.json({
    code: "success",
    message: "Xóa dự án thành công!"
  });
};