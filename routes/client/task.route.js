import express from 'express';
import {
  getTasksByProject,
  createTask,
  editTask,
  deleteTask,
  changeStatus,
  deleteMany,
  addUserToTask,
  removeUserFromTask
} from '../../controllers/client/task.controller.js';

const router = express.Router();

router.get('/:projectId', getTasksByProject);
router.post('/create/:projectId', createTask);
router.patch('/edit/:taskId', editTask);
router.delete('/delete/:taskId', deleteTask);
router.patch('/change-status/:taskId/status', changeStatus);
router.delete('/delete-many', deleteMany);
router.post('/add-user/:taskId', addUserToTask);
router.delete('/delete-user/:taskId', removeUserFromTask);

export default router;
