/* eslint-disable */

// import dotenv, { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import config from '../config/constants.js'

// dotenv.config()

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_KEY)

    console.log(decoded)

    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export default verifyToken
