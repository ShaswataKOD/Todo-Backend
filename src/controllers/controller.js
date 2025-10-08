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

    //not working currently 

    // if (tags) {
    //   const filterTags = tags
    //     .toLowerCase()
    //     .split(',')
    //     .map((tag) => tag.trim())
    //     .filter(Boolean)

    //   filteredTasks = filteredTasks.filter((task) => {
    //     const taskTags = (task.tags || []).map((t) => t.toLowerCase())
    //     return taskTags.some((t) => t.includes(tag))
    //   })
    // }

    if (title) {
      const titleLower = title.toLowerCase()
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(titleLower)
      )
    }
    // sorting based on timestamp of create
  
    filteredTasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json(filteredTasks)
  } catch (error) {
    next(error)
  }
}

// create version

export const createTasks = async (req, res, next) => {
  try {
    const validatedData = req.validatedData; // comes from middleware

    const newTask = {
      id: uuidv4(),
      title: validatedData.title.trim(),
      completed: false,
      priority: validatedData.priority,
      tags: validatedData.tags,
      timestamp: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      }),
    };

    const tasks = await readAll();
    tasks.push(newTask);
    await writeTask(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};





// export const updateTask = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const { title, priority, completed, tags } = req.body

//     const tasks = await readAll()
//     const taskIndex = tasks.findIndex((t) => t.id === id)

//     if (taskIndex === -1) {
//       const error = new Error('Task not found')
//       error.status = 404
//       return next(error)
//     }

//     if (title !== undefined) {
//       if (title.trim().length < 3) {
//         const error = new Error('Title must be at least 3 characters')
//         error.status = 400
//         return next(error)
//       }
//       tasks[taskIndex].title = title.trim()
//     }

//     if (priority !== undefined) tasks[taskIndex].priority = priority
//     if (completed !== undefined) tasks[taskIndex].completed = completed
//     if (tags !== undefined)
//       tasks[taskIndex].tags = Array.isArray(tags) ? tags : []

//     tasks[taskIndex].timestamp = new Date().toLocaleString('en-IN', {
//       timezone: 'Asia/Kolkata',
//     })
//     await writeTask(tasks)

//     res.json(tasks[taskIndex])
//   } catch (error) {
//     next(error)
//   }
// }





export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, priority, completed, tags } = req.validatedData

    const tasks = await readAll()
    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    if (title !== undefined) {
      tasks[taskIndex].title = title.trim()
    }

    if (priority !== undefined) {
      tasks[taskIndex].priority = priority
    }

    if (completed !== undefined) {
      tasks[taskIndex].completed = completed
    }

    if (tags !== undefined) {
      tasks[taskIndex].tags = Array.isArray(tags) ? tags : []
    }

    tasks[taskIndex].timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
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
