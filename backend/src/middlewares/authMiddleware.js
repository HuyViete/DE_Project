import jwt from 'jsonwebtoken'

export const protectedRoute = (req, res, next) => {
  try {
    
  } catch (error) {
    console.error('Fail in JWT verification in authMiddleware', error);
    return res.status(500).json({ message: 'System failed'});
  }
}