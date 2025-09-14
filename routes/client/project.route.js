import express from 'express';
import {
  index,
  detailProject,
  createProject,
  editProject,
  deleteProject,
  createProjectFromAI,
  addUsersToProject,
  addUserToProjectByEmail,
} from '../../controllers/client/project.controller.js';

const router = express.Router();

router.get('/', index);
router.get('/detail/:id', detailProject);
router.post('/create', createProject);
router.patch('/edit/:id', editProject);
router.delete('/delete/:id', deleteProject);
router.post('/create-from-ai', createProjectFromAI);
router.post('/add-users/:projectId', addUsersToProject);
router.post('/add-user/:projectId', addUserToProjectByEmail);


export default router;
