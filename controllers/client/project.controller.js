import { useGeminiAi } from '../../helpers/useGeminiAi.helper.js';
import Project from '../../models/project.model.js';
import Task from '../../models/task.model.js';
import User from '../../models/user.model.js';

export const index = async (req, res) => {
  const find = {
    $or: [
      { createdBy: req.user.id },
      { listUser: req.user.id }
    ],
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

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

  // Search
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, 'i');
    find.title = regex;
  }

  const projects = await Project
    .find(find)
    // .limit(limitItems)
    // .skip(skip)
    .sort(sort);

  res.json({
    code: 'success',
    message: 'Thành công!',
    data: projects
  });
};

export const detailProject = async (req, res) => {
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
      code: 'error',
      message: 'Id không hợp lệ!'
    });
    return;
  }

  res.json({
    code: 'success',
    message: 'Thành công!',
    data: project
  });
};

export const createProject = async (req, res) => {
  const data = req.body;
  data.createdBy = req.user.id;

  // Gán luôn userRoles với creator có quyền 'edit'
  data.userRoles = [
    {
      userId: req.user.id,
      role: 'edit',
    },
  ];

  const project = new Project(data);
  await project.save();

  res.json({
    code: 'success',
    message: 'Tạo dự án thành công!',
    data: project,
  });
};

export const editProject = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await Project.updateOne({ _id: id }, data);

  res.json({
    code: 'success',
    message: 'Cập nhật dự án thành công!'
  });
};

export const deleteProject = async (req, res) => {
  const id = req.params.id;
  await Project.updateOne({ _id: id }, { deleted: true });

  res.json({
    code: 'success',
    message: 'Xóa dự án thành công!'
  });
};

export const createProjectFromAI = async (req, res) => {
  try {
    const { userQuestion } = req.body;

    if (!userQuestion || typeof userQuestion !== 'string' || userQuestion.trim() === '') {
      return res.status(400).json({
        code: 'error',
        message: 'Câu hỏi không được để trống.'
      });
    }

    const prompt = `"Phân tích câu hỏi sau đây: \"${userQuestion}\". Nếu câu hỏi liên quan đến việc tạo lịch trình, thời khóa biểu, hay danh sách công việc cho một hoặc nhiều ngày trong tuần (tối đa 7 ngày), các câu hỏi có thể không liên quan lắm đến thời khóa biểu nhưng vẫn có thể linh động được tạo cho họ 1 lịch trình liên quan đến câu hỏi của họ(ví dụ câu hỏi là tạo cho tao cách tán gái thì lên 1 lịch giúp họ tán gái thành công) hãy trả về một đối tượng JSON. Đối tượng này phải có hai key: **'projectName'** (tên của project) và **'tasks'** (một mảng JSON). Mảng **'tasks'** chứa các task với các key: **'title'**, **'status'** (chỉ dùng 'todo', 'inprogress', 'done'), **'content'**, **'priority'** (chỉ dùng 'low', 'medium', 'high'), **'weekDay'** (chỉ dùng 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'). Số lượng đối tượng trong mảng phải tương ứng với số ngày hoặc task được yêu cầu.
    Nếu câu hỏi không liên quan, hãy trả về một string JSON duy nhất: **'{\"status\": \"irrelevant\"}'**.
    Đừng thêm bất kỳ văn bản, giải thích, hay ký tự nào khác ngoài chuỗi JSON." `;


    const response = await useGeminiAi(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();

    let data;
    try {
      data = JSON.parse(cleanedResponse);
    } catch (e) {
      return res.status(400).json({
        data: data,
        code: 'error',
        message: 'Dữ liệu không hợp lệ từ AI. Vui lòng thử lại với một câu hỏi rõ ràng hơn.'
      });
    }

    if (data.status === 'irrelevant') {
      return res.status(200).json({
        code: 'not-relevant',
        message: 'Tôi chỉ có thể tạo project và task. Vui lòng nhập câu hỏi liên quan đến việc tạo lịch trình hoặc danh sách công việc.'
      });
    }

    if (data.projectName && Array.isArray(data.tasks) && data.tasks.length > 0) {
      // 1. Tạo project mới với tên do AI đề xuất
      const newProject = new Project({
        title: data.projectName,
        createdBy: req.user.id,
        listUser: [req.user.id],
      });

      const savedProject = await newProject.save();

      // 2. Thêm thông tin người tạo vào mỗi task
      const newTasks = data.tasks.map(task => ({
        ...task,
        createdBy: req.user.id
      }));

      // 3. Lưu các task vào database
      const savedTasks = await Task.insertMany(newTasks);

      // 4. Lấy id của các task vừa tạo
      const newTasksIds = savedTasks.map(task => task._id);

      // 5. Cập nhật mảng listTask của project vừa tạo
      await Project.updateOne(
        { _id: savedProject._id },
        { $set: { listTask: newTasksIds } }
      );

      savedProject.listTask = newTasksIds;

      return res.status(201).json({
        code: 'success',
        message: 'Đã tạo project và task thành công từ AI.',
        data: {
          project: savedProject,
          tasks: savedTasks
        }
      });
    }

    return res.status(400).json({
      code: 'error',
      message: 'Không thể tạo task từ câu hỏi của bạn. Vui lòng thử lại.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 'server-error',
      message: 'Lỗi server.'
    });
  }
};

export const addUsersToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const users = req.body;  // Lấy req.body trực tiếp làm mảng

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        code: 'error',
        message: 'Dữ liệu users phải là mảng không rỗng.',
      });
    }

    // Validate role của từng user
    for (const user of users) {
      if (!user.userId || !user.role || !['view', 'edit'].includes(user.role)) {
        return res.status(400).json({
          code: 'error',
          message: 'Mỗi user phải có userId và role hợp lệ (view hoặc edit).',
        });
      }
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        code: 'error',
        message: 'Project không tồn tại.',
      });
    }

    // Lọc bỏ những user đã tồn tại trong project.userRoles
    const newUsers = users.filter(
      (newUser) =>
        !project.userRoles.some(
          (ur) => ur.userId.toString() === newUser.userId
        )
    );

    if (newUsers.length === 0) {
      return res.status(400).json({
        code: 'error',
        message: 'Tất cả người dùng đã tồn tại trong dự án.',
      });
    }

    // Thêm newUsers vào userRoles
    project.userRoles.push(...newUsers);

    await project.save();

    res.json({
      code: 'success',
      message: 'Thêm người dùng vào dự án thành công.',
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 'server-error',
      message: 'Lỗi server.',
    });
  }
};

export const addUserToProjectByEmail = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    console.log(req.body);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Bạn phải gửi email",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy project",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy người dùng với email: ${email}`,
      });
    }

    // Khởi tạo nếu undefined
    if (!project.userRoles) {
      project.userRoles = [];
    }
    if (!project.listUser) {
      project.listUser = [];
    }

    // Thêm hoặc cập nhật userRoles
    const existUserRole = project.userRoles.find(
      (u) => u.userId.toString() === user._id.toString()
    );
    if (!existUserRole) {
      project.userRoles.push({
        userId: user._id,
        role: role || "view",
      });
    } else {
      existUserRole.role = role || existUserRole.role;
    }

    // Thêm userId vào listUser nếu chưa có (giả sử listUser là mảng ObjectId)
    const userIdStr = user._id.toString();
    const listUserStrs = project.listUser.map((id) => id.toString());
    if (!listUserStrs.includes(userIdStr)) {
      project.listUser.push(user._id);
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Thêm user vào project thành công",
      data: project,
    });
  } catch (error) {
    console.error("Lỗi khi thêm user vào project:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm user vào project",
    });
  }
};
