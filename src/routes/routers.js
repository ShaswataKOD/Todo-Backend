
// MongoDB version 

import express from 'express';
import {
  readTask,
  createTasks,
  searchTasks,
  updateTask,
  deleteTask
} from '../controllers/taksController.js'
import { todoCreateSchema,todoUpdateSchema } from '../Middleware/validateRequest.js';

const router = express.Router();

router.get('/', readTask);
router.post('/',todoCreateSchema, createTasks);
router.get('/search',searchTasks);
router.put('/:id', todoUpdateSchema,updateTask);
router.delete('/:id', deleteTask);

export default router;
