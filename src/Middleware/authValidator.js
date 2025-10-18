// import jwt from 'jsonwebtoken';

// function verifyToken(req, res, next) {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied' });

//   try {
//     const decoded = jwt.verify(token, 'your-secret-key');
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }

// export default verifyToken;
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACESS_TOKEN_KEY || '12345')
    console.log(decoded)
    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export default verifyToken
