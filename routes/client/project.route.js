import express from 'express';
import {
  index,
  detailProject,
  createProject,
  editProject,
  deleteProject,
  createProjectFromAI,
  addUsersToProject,
} from '../../controllers/client/project.controller.js';

const router = express.Router();

router.get('/', index);
router.get('/detail/:id', detailProject);
router.post('/create', createProject);
router.patch('/edit/:id', editProject);
router.delete('/delete/:id', deleteProject);
router.post('/create-from-ai', createProjectFromAI);
router.post('/add-user/:projectId', addUsersToProject);


export default router;
