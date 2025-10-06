import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../database/db.json');

async function readAll() {
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    const json = JSON.parse(data);
    return json.tasks || [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

async function writeTask(tasksArray) {
  try {
    await writeFile(DB_PATH, JSON.stringify({ tasks: tasksArray }, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
}

export const readTask = async (req, res) => {
  try {
    const tasks = await readAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error in readTask:', error);
    res.status(500).json({ error: 'The data could not be retrieved' });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { title, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      priority: priority || 'Medium',
      timestamp: new Date().toISOString(),
    };

    const tasks = await readAll();
    tasks.push(newTask);
    await writeTask(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in createTasks:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, priority, completed } = req.body;

    console.log('Update request - ID:', id, 'Body:', req.body);

    const tasks = await readAll();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      console.log('Task not found with ID:', id);
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update only provided fields
    if (title !== undefined) tasks[taskIndex].title = title.trim();
    if (priority !== undefined) tasks[taskIndex].priority = priority;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    tasks[taskIndex].timestamp = new Date().toISOString();

    await writeTask(tasks);
    
    console.log('Task updated successfully:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; 
    
    console.log('Delete request - ID:', id);

    const tasks = await readAll();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((t) => t.id !== id);

    if (filteredTasks.length === initialLength) {
      console.log('Task not found with ID:', id);
      return res.status(404).json({ error: 'Task not found' });
    }

    await writeTask(filteredTasks);
    
    console.log('Task deleted successfully');
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};