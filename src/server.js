import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import taskRouter from './routes/routers.js'
import { errorHandler } from './errorHandler/errorHandling.js'
import connectDB from './db/mongoClient.js'
import authRoutes from './routes/authRoutes.js'


// import otpRoutes from './routes/otpRoutes.js'

console.log('URI:', process.env.URI)
console.log('PORT:', process.env.PORT)

connectDB()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/tasks', taskRouter)
app.use('/api/auth', authRoutes)

// app.use('/api/otp', otpRoutes)

// Error handler should come after routes
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
