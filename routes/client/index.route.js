import tasksRoute from './task.route.js';
import usersRoute from './user.route.js';
import projectRoute from './project.route.js';
import shareProject from './shareProject.route.js'

import { requireAuth } from '../../middlewares/client/user.middleware.js';

export default (app) => {
  
  app.use('/tasks', requireAuth, tasksRoute);

  app.use('/projects', requireAuth, projectRoute);
  
  app.use('/users', usersRoute);

  app.use('/share-project', shareProject);
};
