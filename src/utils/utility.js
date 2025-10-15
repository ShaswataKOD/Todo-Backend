import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../../database/db.json')

export async function readAll() {
  try {
    const data = await readFile(DB_PATH, 'utf-8')
    const json = JSON.parse(data)
    return json.tasks || []
  } catch (error) {
    console.error('Error reading database:', error)
    return []
  }
}

export async function writeTask(tasksArray) {
  try {
    await writeFile(DB_PATH, JSON.stringify({ tasks: tasksArray }, null, 2))
  } catch (error) {
    console.error('Error writing to database:', error)
    throw error
  }
}
