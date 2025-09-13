import Task from '../../models/task.model.js';
import Project from '../../models/project.model.js';

// Lấy danh sách task trong 1 project
export const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ code: 'error', message: 'Project không tồn tại' });
    }

    const tasks = await Task.find({ 
      _id: { $in: project.listTask },
      deleted: false
    });

    res.json({
      code: 'success',
      message: 'Danh sách task của project',
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thêm 1 task vào project
export const createTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const data = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ code: 'error', message: 'Project không tồn tại' });
    }

    // Gán createdBy từ user đã đăng nhập (giả sử middleware đã set req.user)
    data.createdBy = req.user?.id || null;

    const task = new Task(data);
    await task.save();

    project.listTask.push(task._id);
    await project.save();

    res.json({
      code: 'success',
      message: 'Thêm task thành công',
      data: task,
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};


// Sửa 1 task
export const editTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const data = req.body;

    await Task.updateOne({ _id: taskId }, data);

    res.json({
      code: 'success',
      message: 'Cập nhật task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Xóa 1 task (soft delete)
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    await Task.updateOne(
      { _id: taskId },
      { deleted: true, deletedAt: new Date() }
    );

    res.json({
      code: 'success',
      message: 'Xóa task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thay đổi trạng thái 1 task
export const changeStatus = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;

    await Task.updateOne({ _id: taskId }, { status });

    res.json({
      code: 'success',
      message: 'Cập nhật trạng thái task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thay đổi tiêu đề 1 task
export const changeTitle = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title } = req.body;

    await Task.updateOne({ _id: taskId }, { title });

    res.json({
      code: 'success',
      message: 'Cập nhật tiêu đề task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thay đổi tg bắt đầu 1 task
export const changeTimeStart = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { timeStart } = req.body;

    await Task.updateOne({ _id: taskId }, { timeStart });

    res.json({
      code: 'success',
      message: 'Cập nhật thời gian bắt đầu task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thay đổi tg kết thúc 1 task
export const changeTimeFinish = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { timeFinish } = req.body;

    await Task.updateOne({ _id: taskId }, { timeFinish });

    res.json({
      code: 'success',
      message: 'Cập nhật thời gian kết thúc task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thay đổi nội dung 1 task
export const changeContent = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { content } = req.body;

    await Task.updateOne({ _id: taskId }, { content });

    res.json({
      code: 'success',
      message: 'Cập nhật nội dung task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Xóa nhiều task (soft delete)
export const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ code: 'error', message: 'Dữ liệu không hợp lệ' });
    }

    await Task.updateMany(
      { _id: { $in: ids } },
      { deleted: true, deletedAt: new Date() }
    );

    res.json({
      code: 'success',
      message: 'Xóa nhiều task thành công',
    });
  } catch (error) {
    res.status(500).json({ code: 'error', message: error.message });
  }
};

// Thêm 1 user vào task
export const addUserToTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ code: "error", message: "Thiếu userId" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ code: "error", message: "Task không tồn tại" });
    }

    // kiểm tra nếu user đã có trong listUser thì không thêm lại
    if (task.listUser.includes(userId)) {
      return res.status(400).json({ code: "error", message: "User đã tồn tại trong task" });
    }

    task.listUser.push(userId);
    await task.save();

    res.json({
      code: "success",
      message: "Thêm user vào task thành công",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

// Xóa 1 user khỏi 1 task
export const removeUserFromTask = async (req, res) => {
  try {
    const { taskId } = req.params; 
    const { userId } = req.body;        

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        code: "error",
        message: "Task không tồn tại",
      });
    }

    // Xóa userId khỏi listUser
    task.listUser = task.listUser.filter(
      (user) => user.toString() !== userId.toString()
    );

    await task.save();

    res.json({
      code: "success",
      message: "Xóa user khỏi task thành công",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      code: "error",
      message: error.message,
    });
  }
};