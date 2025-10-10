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






// MongoDB version 

import express from 'express';
import {
  readTask,
  createTasks,
  searchTasks,
  updateTask,
  deleteTask
} from '../controllers/controller.js';

//validation is not currently working 

// import { validateRequest } from "../validation/validateRequest.js"
// import { createTasksSchema, updateTasksSchema } from "../validation/validationSchema.js"

// validateRequest(createTasksSchema),

const router = express.Router();

router.get('/', readTask);
router.post('/',  createTasks);
router.get('/search',searchTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
