import dotenv from 'dotenv'
dotenv.config()

import config from './config/constants.js'
import express from 'express'
import cors from 'cors'
import taskRouter from './routes/routers.js'
import { errorHandler } from './errorHandler/errorHandling.js'
import connectDB from './db/mongoClient.js'
import authRoutes from './routes/authRoutes.js'
import loggerMiddleware from './Middleware/logger.js'
import verifyToken from './middleware/authValidator.js'

console.log('URI:', config.URI)
console.log('PORT:', config.PORT || '5000')

connectDB()

const app = express()
const PORT = config.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(loggerMiddleware)

app.use('/api/tasks', verifyToken, taskRouter)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
