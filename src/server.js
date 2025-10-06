import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRouter from './routes/routes.js'
dotenv.config()

//set up express app

const app = express()
const PORT = process.env.PORT || 5000

//set up middleware
app.use(cors())
app.use(express.json())
app.use('/api/tasks', taskRouter)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
