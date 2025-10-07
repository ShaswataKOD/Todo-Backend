// // import { readFile, writeFile } from 'fs/promises';
// // import path from 'path';
// // import { fileURLToPath } from 'url';
// // import { v4 as uuidv4 } from 'uuid';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const DB_PATH = path.join(__dirname, '../../database/db.json');

// // async function readAll() {
// //   try {
// //     const data = await readFile(DB_PATH, 'utf-8');
// //     const json = JSON.parse(data);
// //     return json.tasks || [];
// //   } catch (error) {
// //     console.error('Error reading database:', error);
// //     return [];
// //   }
// // }

// // async function writeTask(tasksArray) {
// //   try {
// //     await writeFile(DB_PATH, JSON.stringify({ tasks: tasksArray }, null, 2));
// //   } catch (error) {
// //     console.error('Error writing to database:', error);
// //     throw error;
// //   }
// // }

// import {readAll ,writeTask} from "../utils/utils.js"

// export const readTask = async (req, res,next) => {
//   try {
//     const tasks = await readAll();

//     const { tags, priority, title } = req.query;

//     let filteredTasks = tasks;

//     // Filter by priority if provided
//     if (priority) {
//       filteredTasks = filteredTasks.filter(
//         (task) => task.priority.toLowerCase() === priority.toLowerCase()
//       );
//     }

//     // Filter by tags if provided (all tags must match)
//     if (tags) {
//       const filterTags = tags
//         .toLowerCase()
//         .split(',')
//         .map((tag) => tag.trim())
//         .filter(Boolean);

//       filteredTasks = filteredTasks.filter((task) => {
//         const taskTags = (task.tags || []).map((t) => t.toLowerCase());
//         return filterTags.every((tag) => taskTags.includes(tag));
//       });
//     }

//     // Filter by title if provided (case-insensitive substring search)
//     if (title) {
//       const titleLower = title.toLowerCase();
//       filteredTasks = filteredTasks.filter((task) =>
//         task.title.toLowerCase().includes(titleLower)
//       );
//     }

//     res.json(filteredTasks);
//   } catch (error) {
//     // console.error('Error in readTask:', error);
//     // res.status(500).json({ error: 'The data could not be retrieved' });
//     next(error);
//   }
// };

// // export const readTask = async (req, res) => {
// //   try {
// //     const tasks = await readAll();

// //     // Read and parse ?tags= from query string
// //     const tagsQuery = req.query.tags;

// //     if (tagsQuery) {
// //       const filterTags = tagsQuery
// //         .toLowerCase()
// //         .split(',')
// //         .map(tag => tag.trim())
// //         .filter(Boolean);

// //       const filteredTasks = tasks.filter(task => {
// //         const taskTags = (task.tags || []).map(t => t.toLowerCase());
// //         return filterTags.every(tag => taskTags.includes(tag));
// //       });

// //       return res.json(filteredTasks);
// //     }

// //     res.json(tasks);
// //   } catch (error) {
// //     console.error('Error in readTask:', error);
// //     res.status(500).json({ error: 'The data could not be retrieved' });
// //   }
// // };

// // export const readTask = async (req, res) => {
// //   try {
// //     const tasks = await readAll();
// //     res.json(tasks);
// //   } catch (error) {
// //     console.error('Error in readTask:', error);
// //     res.status(500).json({ error: 'The data could not be retrieved' });
// //   }
// // };

// // export const createTasks = async (req, res) => {
// //   try {
// //     const { title, priority } = req.body;

// //     if (!title || title.trim() === '') {
// //       return res.status(400).json({ error: 'Title is required' });
// //     }

// //     const newTask = {
// //       id: uuidv4(),
// //       title: title.trim(),
// //       completed: false,
// //       priority: priority || 'Medium',
// //       timestamp: new Date().toISOString(),
// //     };

// //     const tasks = await readAll();
// //     tasks.push(newTask);
// //     await writeTask(tasks);

// //     res.status(201).json(newTask);
// //   } catch (error) {
// //     console.error('Error in createTasks:', error);
// //     res.status(500).json({ error: 'Failed to create task' });
// //   }
// // };

// export const createTasks = async (req, res,next) => {
//   try {
//     const { title, priority, tags } = req.body;

//     if (!title || title.trim() === '') {
//       // return res.status(400).json({ error: 'Title is required' });
//       const error = new Error('Invalid title (min 3 characters)')
//       error.status = 400
//       return next(error)
//     }

//     const newTask = {
//       id: uuidv4(),
//       title: title.trim(),
//       completed: false,
//       priority: priority,
//       tags: Array.isArray(tags) ? tags : [],
//       timestamp: new Date().toISOString(),
//     };

//     const tasks = await readAll();
//     tasks.push(newTask);
//     await writeTask(tasks);

//     res.status(201).json(newTask);
//   } catch (error) {
//     // console.error('Error in createTasks:', error);
//     // res.status(500).json({ error: 'Failed to create task' });
//     next(error);
//   }
// };

// // export const updateTask = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { title, priority, completed } = req.body;

// //     console.log('Update request - ID:', id, 'Body:', req.body);

// //     const tasks = await readAll();
// //     const taskIndex = tasks.findIndex((t) => t.id === id);

// //     if (taskIndex === -1) {
// //       console.log('Task not found with ID:', id);
// //       return res.status(404).json({ error: 'Task not found' });
// //     }

// //     // Update fields
// //     if (title !== undefined) tasks[taskIndex].title = title.trim();
// //     if (priority !== undefined) tasks[taskIndex].priority = priority;
// //     if (completed !== undefined) tasks[taskIndex].completed = completed;
// //     tasks[taskIndex].timestamp = new Date().toISOString();

// //     await writeTask(tasks);

// //     console.log('Task updated successfully:', tasks[taskIndex]);
// //     res.json(tasks[taskIndex]);
// //   } catch (error) {
// //     console.error('Error in updateTask:', error);
// //     res.status(500).json({ error: 'Failed to update task' });
// //   }
// // };

// // make sure all the checks are done for title and other parameters
// export const updateTask = async (req, res,next) => {
//   try {
//     const { id } = req.params;
//     const { title, priority, completed, tags } = req.body;

//     const tasks = await readAll();
//     const taskIndex = tasks.findIndex((t) => t.id === id);

//     if (taskIndex === -1) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     if (title !== undefined) tasks[taskIndex].title = title.trim();
//     if (priority !== undefined) tasks[taskIndex].priority = priority;
//     if (completed !== undefined) tasks[taskIndex].completed = completed;
//     if (tags !== undefined) tasks[taskIndex].tags = Array.isArray(tags) ? tags : [];
//     tasks[taskIndex].timestamp = new Date().toISOString();

//     await writeTask(tasks);
//     res.json(tasks[taskIndex]);
//   } catch (error) {
//     // console.error('Error in updateTask:', error);
//     // res.status(500).json({ error: 'Failed to update task' });
//     next(error);
//   }
// };

// // use find index and splice
// export const deleteTask = async (req, res,next) => {
//   try {
//     const { id } = req.params;

//     console.log('Delete request - ID:', id);

//     const tasks = await readAll();
//     const initialLength = tasks.length;
//     const filteredTasks = tasks.filter((t) => t.id !== id);

//     if (filteredTasks.length === initialLength) {
//       console.log('Task not found with ID:', id);
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     await writeTask(filteredTasks);

//     console.log('Task deleted successfully');
//     res.json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     // console.error('Error in deleteTask:', error);
//     // res.status(500).json({ error: 'Failed to delete task' });
//     next(error);
//   }
// };

import { readAll, writeTask } from '../utils/utils.js'
import { v4 as uuidv4 } from 'uuid'

export const readTask = async (req, res, next) => {
  try {
    const tasks = await readAll()
    const { tags, priority, title } = req.query

    let filteredTasks = tasks

    if (priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase()
      )
    }

    if (tags) {
      const filterTags = tags
        .toLowerCase()
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      filteredTasks = filteredTasks.filter((task) => {
        const taskTags = (task.tags || []).map((t) => t.toLowerCase())
        return taskTags.some((t) => t.includes(tag))
      })
    }

    if (title) {
      const titleLower = title.toLowerCase()
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(titleLower)
      )
    }
    filteredTasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json(filteredTasks)
  } catch (error) {
    next(error)
  }
}

export const createTasks = async (req, res, next) => {
  try {
    const { title, priority = 'Medium', tags = [] } = req.body

    if (!title || title.trim().length < 3) {
      const error = new Error('Invalid title (min 3 characters)')
      error.status = 400
      return next(error)
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      priority,
      tags: Array.isArray(tags) ? tags : [],
      timestamp: new Date().toLocaleString('en-IN', {
        timezone: 'Asia/Kolkata',
      }),
    }

    const tasks = await readAll()
    tasks.push(newTask)
    await writeTask(tasks)

    res.status(201).json(newTask)
  } catch (error) {
    next(error)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, priority, completed, tags } = req.body

    const tasks = await readAll()
    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    if (title !== undefined) {
      if (title.trim().length < 3) {
        const error = new Error('Title must be at least 3 characters')
        error.status = 400
        return next(error)
      }
      tasks[taskIndex].title = title.trim()
    }

    if (priority !== undefined) tasks[taskIndex].priority = priority
    if (completed !== undefined) tasks[taskIndex].completed = completed
    if (tags !== undefined)
      tasks[taskIndex].tags = Array.isArray(tags) ? tags : []

    tasks[taskIndex].timestamp = new Date().toLocaleString('en-IN', {
      timezone: 'Asia/Kolkata',
    })
    await writeTask(tasks)

    res.json(tasks[taskIndex])
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const tasks = await readAll()
    const initialLength = tasks.length

    const updatedTasks = tasks.filter((task) => task.id !== id)

    if (updatedTasks.length === initialLength) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    await writeTask(updatedTasks)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}
