import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

export default function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Received Token:', token);
  console.log('JWT_SECRET:', JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', decoded); 
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    return res.status(400).json({ message: 'Invalid token' });
  }
};