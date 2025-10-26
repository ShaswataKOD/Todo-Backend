import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['Admin', 'Student', 'Visitor'],
      default: 'Visitor',
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
