// import dotenv from 'dotenv'
import mongoose from 'mongoose'
import config from '../config/constants.js'

// dotenv.config()

const URI = config.URI

const connectDB = async () => {
  try {
    await mongoose.connect(URI)

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)

    process.exit(1)
  }
}

export default connectDB
