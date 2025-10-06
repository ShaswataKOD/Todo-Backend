import express from 'express';
import {
  readTask,
  createTasks,
  updateTask,
  deleteTask,
} from '../controllers/controller.js';

const router = express.Router();

// Define routes
router.get('/', readTask);
router.post('/', createTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);


export default router;