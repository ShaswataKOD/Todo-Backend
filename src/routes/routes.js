// import express from 'express';
// import {
//   readTask,
//   createTasks,
//   updateTask,
//   deleteTask
// } from '../controllers/controller.js';

// const router = express.Router();

// router.get('/', readTask);
// router.post('/', createTasks);
// router.put('/:id', updateTask);
// router.delete('/:id', deleteTask);

// export default router;



import express from 'express';
import {
  readTask,
  createTasks,
  updateTask,
  deleteTask
} from '../controllers/controller.js';

import { validateRequest } from "../validation/validateRequest.js"
import { createTasksSchema, updateTasksSchema } from "../validation/validationSchema.js"

const router = express.Router();

router.get('/', readTask);
router.post('/', validateRequest(createTasksSchema), createTasks);
router.put('/:id', validateRequest(updateTasksSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
