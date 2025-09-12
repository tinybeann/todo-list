const Task = require("../../models/task.model");

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

  const tasks = await Task
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort(sort);

  res.json({
    code: "success",
    message: "Thành công!",
    data: tasks
  });
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    $or: [
      { createdBy: req.user.id },
      { listUser: req.user.id }
    ],
    deleted: false
  });

  if (!task) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
    return;
  }

  res.json({
    code: "success",
    message: "Thành công!",
    data: task
  });
}

module.exports.changeMultiPatch = async (req, res) => {
  const status = req.body.status;
  const ids = req.body.ids;

  await Task.updateMany({
    _id: { $in: ids }
  }, {
    status: status
  });

  res.json({
    code: "success",
    message: "Thành công!"
  })
}

module.exports.createPost = async (req, res) => {
  const data = req.body;

  data.createdBy = req.user.id;

  const task = new Task(data);
  await task.save();

  res.json({
    code: "success",
    message: "Tạo công việc thành công!",
    data: task
  });
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await Task.updateOne({
    _id: id
  }, data);

  res.json({
    code: "success",
    message: "Cập nhật công việc thành công!"
  });
}

module.exports.deleteMultiPatch = async (req, res) => {
  const ids = req.body.ids;

  await Task.updateMany({
    _id: { $in: ids }
  }, {
    deleted: true
  });

  res.json({
    code: "success",
    message: "Xóa thành công!"
  })
}