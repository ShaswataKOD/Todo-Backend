import createError from '../utils/createError.js'
import User from '../models/userModel.js'

export async function getProfile(req, res, next) {
  try {
    const userId = req.userId

    const user = await User.findById(userId).select(
      'username profileImage email'
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { username, profileImage } = req.body
    const userId = req.userId

    if (!username) {
      return res.status(400).json({ message: 'Username is required' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, profileImage },
      { new: true }
    ).select('username profileImage email')

    if (!updatedUser) {
      throw createError(404, 'User not found')
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
