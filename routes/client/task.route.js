import express from 'express';
import {
  getTasksByProject,
  createTask,
  editTask,
  deleteTask,
  changeStatus,
  deleteMany,
  addUserToTask,
  removeUserFromTask,
  changeTitle,
  changeContent,
  changeTimeStart,
  changeTimeFinish
} from '../../controllers/client/task.controller.js';

const router = express.Router();

router.get('/:projectId', getTasksByProject);
router.post('/create/:projectId', createTask);
router.patch('/edit/:taskId', editTask);
router.delete('/delete/:taskId', deleteTask);
router.patch('/change-status/:taskId', changeStatus);
router.patch('/change-title/:taskId', changeTitle);
router.patch('/change-content/:taskId', changeContent);
router.patch('/change-time-start/:taskId', changeTimeStart);
router.patch('/change-time-finish/:taskId', changeTimeFinish);
router.delete('/delete-many', deleteMany);
router.post('/add-user/:taskId', addUserToTask);
router.delete('/delete-user/:taskId', removeUserFromTask);

export default router;
