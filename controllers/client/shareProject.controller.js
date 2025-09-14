import Project from "../../models/project.model.js";
import Task from "../../models/task.model.js";

export const index = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Tìm project bằng ID
    const project = await Project.findById(id);

    // Nếu không tìm thấy project, trả về lỗi 404
    if (!project) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy Project.'
      });
    }

    console.log(project.share);

    // Kiểm tra nếu share là false, chỉ cho chủ sở hữu hoặc người trong listUser truy cập
    if (project.share === false) {
      return res.status(403).json({
        code: 'error',
        message: 'Bạn không có quyền truy cập Project này.'
      });
    }

    // Nếu project có share là true hoặc người dùng có quyền, lấy danh sách task
    const tasks = await Task.find({
      _id: { $in: project.listTask },
      deleted: false
    });

    res.json({
      code: 'success',
      message: 'Thành công!',
      data: {
        project,
        tasks
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 'server-error',
      message: 'Lỗi server.'
    });
  }
};