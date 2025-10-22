// import { readAll, writeTask } from '../utils/utils.js'
// import { v4 as uuidv4 } from 'uuid'

// export const readTask = async (req, res, next) => {
//   try {
//     const tasks = await readAll()
//     const { tags, priority, title } = req.query

//     let filteredTasks = tasks

//     if (priority) {
//       filteredTasks = filteredTasks.filter(
//         (task) => task.priority.toLowerCase() === priority.toLowerCase()
//       )
//     }

//     //not working currently

//     // if (tags) {
//     //   const filterTags = tags
//     //     .toLowerCase()
//     //     .split(',')
//     //     .map((tag) => tag.trim())
//     //     .filter(Boolean)

//     //   filteredTasks = filteredTasks.filter((task) => {
//     //     const taskTags = (task.tags || []).map((t) => t.toLowerCase())
//     //     return taskTags.some((t) => t.includes(tag))
//     //   })
//     // }

//     if (title) {
//       const titleLower = title.toLowerCase()
//       filteredTasks = filteredTasks.filter((task) =>
//         task.title.toLowerCase().includes(titleLower)
//       )
//     }
//     // sorting based on timestamp of create

//     filteredTasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

//     res.json(filteredTasks)
//   } catch (error) {
//     next(error)
//   }
// }

// // create version

// export const createTasks = async (req, res, next) => {
//   try {
//     const validatedData = req.validatedData; // comes from middleware

//     const newTask = {
//       id: uuidv4(),
//       title: validatedData.title.trim(),
//       completed: false,
//       priority: validatedData.priority,
//       tags: validatedData.tags,
//       timestamp: new Date().toLocaleString('en-IN', {
//         timeZone: 'Asia/Kolkata',
//       }),
//     };

//     const tasks = await readAll();
//     tasks.push(newTask);
//     await writeTask(tasks);

//     res.status(201).json(newTask);
//   } catch (error) {
//     next(error);
//   }
// };

// // export const updateTask = async (req, res, next) => {
// //   try {
// //     const { id } = req.params
// //     const { title, priority, completed, tags } = req.body

// //     const tasks = await readAll()
// //     const taskIndex = tasks.findIndex((t) => t.id === id)

// //     if (taskIndex === -1) {
// //       const error = new Error('Task not found')
// //       error.status = 404
// //       return next(error)
// //     }

// //     if (title !== undefined) {
// //       if (title.trim().length < 3) {
// //         const error = new Error('Title must be at least 3 characters')
// //         error.status = 400
// //         return next(error)
// //       }
// //       tasks[taskIndex].title = title.trim()
// //     }

// //     if (priority !== undefined) tasks[taskIndex].priority = priority
// //     if (completed !== undefined) tasks[taskIndex].completed = completed
// //     if (tags !== undefined)
// //       tasks[taskIndex].tags = Array.isArray(tags) ? tags : []

// //     tasks[taskIndex].timestamp = new Date().toLocaleString('en-IN', {
// //       timezone: 'Asia/Kolkata',
// //     })
// //     await writeTask(tasks)

// //     res.json(tasks[taskIndex])
// //   } catch (error) {
// //     next(error)
// //   }
// // }

// export const updateTask = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const { title, priority, completed, tags } = req.validatedData

//     const tasks = await readAll()
//     const taskIndex = tasks.findIndex((t) => t.id === id)

//     if (taskIndex === -1) {
//       const error = new Error('Task not found')
//       error.status = 404
//       return next(error)
//     }

//     if (title !== undefined) {
//       tasks[taskIndex].title = title.trim()
//     }

//     if (priority !== undefined) {
//       tasks[taskIndex].priority = priority
//     }

//     if (completed !== undefined) {
//       tasks[taskIndex].completed = completed
//     }

//     if (tags !== undefined) {
//       tasks[taskIndex].tags = Array.isArray(tags) ? tags : []
//     }

//     tasks[taskIndex].timestamp = new Date().toLocaleString('en-IN', {
//       timeZone: 'Asia/Kolkata',
//     })

//     await writeTask(tasks)

//     res.json(tasks[taskIndex])
//   } catch (error) {
//     next(error)
//   }
// }

// export const deleteTask = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const tasks = await readAll()
//     const initialLength = tasks.length

//     const updatedTasks = tasks.filter((task) => task.id !== id)

//     if (updatedTasks.length === initialLength) {
//       const error = new Error('Task not found')
//       error.status = 404
//       return next(error)
//     }

//     await writeTask(updatedTasks)
//     res.json({ message: 'Task deleted successfully' })
//   } catch (error) {
//     next(error)
//   }
// }

// use MongoDB to perform CRUD

import Task from '../models/taskModel.js'

export async function createTasks(req, res, next) {
  try {
    const { title, priority, tags, isCompleted } = req.body
    const userId = req.userId

    const newTask = new Task({
      title,
      priority,
      tags,
      isCompleted,
      userId,
    })

    const savedTask = await newTask.save()

    res.status(201).json(savedTask)
  } catch (error) {
    next(error)
    // console.error('Error creating task:', error)
    // res.status(400).json({ error: 'Failed to create task' })
  }
}

// get all tasks

export async function readTask(req, res, next) {
  try {
    const userId = req.userId

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json(tasks)
  } catch (error) {
    next(error)
  }
}

export async function searchTasks(req, res, next) {
  try {
    const { title, priority, tags } = req.query
    const userId = req.userId
    const filter = { userId }

    if (title) {
      filter.title = { $regex: title, $options: 'i' }
    }

    if (priority) {
      filter.priority = priority
    }

    if (tags) {
      const tagList = tags.split(',').map((tag) => tag.trim())
      filter.tags = { $all: tagList }
    }

    const filteredTask = await Task.find(filter).sort({ createdAt: -1 })

    res.status(200).json(filteredTask)
  } catch (error) {
    next(error)
  }
}

//edit functionality //modify the front end url with UI parameter
export async function updateTask(req, res, next) {
  try {
    const { id } = req.params
    const updatedData = req.body
    const userId = req.userId

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      updatedData,
      { new: true, runValidators: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' })
    }

    res.status(200).json(updatedTask)
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params
    const userId = req.userId

    const deleted = await Task.findOneAndDelete({ _id: id, userId })

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found or unauthorized' })
    }

    res.status(200).json({ success: true, id })
  } catch (error) {
    console.error('Error deleting task:', error)
    next(error)
  }
}
