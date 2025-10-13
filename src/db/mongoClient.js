import dotenv from 'dotenv' // import this first to resolve any issue

dotenv.config()

import mongoose from 'mongoose'


const URI =process.env.URI || "mongodb+srv://shaswata:shaswata707@cluster0.5td3woj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
 
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
