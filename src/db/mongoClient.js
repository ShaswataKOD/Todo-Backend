import mongoose from 'mongoose'
import dotenv from 'dotenv/config'

dotenv.config()

const URI = process.env.URI
const connectDB = async () => {
  try {
    await mongoose.connect(URI)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}
export default connectDB
