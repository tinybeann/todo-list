import express from 'express';
import {
  index,
} from '../../controllers/client/shareProject.controller.js';

const router = express.Router();

router.get('/:id', index);

export default router;
