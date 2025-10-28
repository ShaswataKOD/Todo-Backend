import createError from '../utils/createError.js'
import User from '../models/userModel.js'

async function updateProfile(req, res, next) {
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
    )

    if (!updatedUser) {
      throw createError(404, 'User not found')
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.username,
        profileImage: updatedUser.profileImage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export default updateProfile
