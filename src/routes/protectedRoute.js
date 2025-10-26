import express from 'express'
const router = express.Router()
import verifyToken from '../middleware/authValidator'

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' })
})

export default router
