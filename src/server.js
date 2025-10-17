import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import taskRouter from './routes/routers.js'
import { errorHandler } from './errorHandler/errorHandling.js'
import connectDB from './db/mongoClient.js'
import authRoutes from './routes/authRoutes.js'
import loggerMiddleware from './Middleware/logger.js'
import verifyToken from './Middleware/authValidator.js'

console.log('URI:', process.env.URI)
console.log('PORT:', process.env.PORT)

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(loggerMiddleware)

app.use('/api/tasks', verifyToken, taskRouter)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
